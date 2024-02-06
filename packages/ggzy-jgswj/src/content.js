import { date, logger, saveToCSV } from "basic"
import { cleanText, sendNotice, testEle } from "basic/func"

/**
 * @typedef {Object} Item
 * @property {String} infodatepx - 内容时间
 * @property {String} infoid - 内容ID
 * @property {String} categorynum - 类型编号
 * @property {String} areaname - 地区
 * @property {String} title - 标题
 * @property {String} linkurl - 内容地址，示例：/jyxx/001001/001001002/001001002005/20240104/ad57b363-c612-4eea-a8ed-d99e0269fb02.html
 */

/**
 * @typedef {Object} DataLine
 * @property {String} status - 抓取状态，Y=成功
 * @property {String} id - 消息ID
 * @property {String} date - 消息日期
 * @property {String} xmlx - 项目类型
 * @property {String} dq - 地区/城市
 * @property {String} xmmc - 项目名称
 * @property {String} xmbh - 项目编号
 * @property {String} fbrq - 公告发布日期
 * @property {String} zbr - 中标人
 * @property {String} zbj - 中标价
 * @property {String} gq - 工期
 * @property {String} xmjl - 项目经理
 * @property {String} jgbm - 监管部门
 * @property {String} url - 真实内容的完整地址
 */

window.fetchDo = async ps=>{
    const started = Date.now()

    const {
        code = '003',
        fromDate,
        endDate,
        split = ',',
        pageSize = 200,
        skipFail = true,
        filename
    } = ps

    const _fail = msg=>{
        logger.error(msg)
        alert(msg)
        throw Error(msg)
    }
    const logAndTip = msg=>{
        logger.info(msg)
        sendNotice(msg)
    }

    let uuid = `${code}`
    if(uuid.length == 1)            uuid = `00100100${uuid}005`
    else if(uuid.length == 3)       uuid = `001001${uuid}005`
    else if(uuid.length == 9)       uuid = `${uuid}005`
    else if(uuid.length == 12)      {}
    else                            _fail(`工程类型格式有误（必须是长度为1、3、9、12的纯数字）`)

    const rows = [["STATUS", "项目类型","地区/城市", "名称","编号","发布日期","中标人","中标价/费率","工期","项目经理","监管部门", "信息日期", "链接"]]
    const codeNames = {
        "001001002005": "水利工程",
        "001001003005": "交通工程",
        "001001004005": "铁路工程",
        "001001005005": "其他工程"
    }
    const columns = {
        xmmc:"项目名称",
        xmbh:"(项目|招标|标段)编号",
        fbrq:"发布日期",
        zbr:"中标(人|单位)(?!公示)",
        zbj:"中标(价|费率|金额)|报价",
        gq:"交货期|期限|工期",
        xmjl:"项目(经理|总?负责)|联系人",
        jgbm:"(监督|受理)部门"
    }

    logger.info(`开始采集⌈${uuid}/${codeNames[uuid]}⌋：时间段从 ${fromDate} 至 ${endDate}，分隔符为 ${split}`)

    fetch(
        "http://ggzy.jgswj.gxzf.gov.cn/inteligentsearchgxes/rest/esinteligentsearch/getFullTextDataNew", {
        "body": JSON.stringify({
            "pn": 0,
            "rn": pageSize,
            "fields": "title",
            "cnum": "001",
            "sort": "{\"infodatepx\":\"0\"}",
            "ssort": "title",
            "cl": 200,
            "condition": [ { "fieldName": "categorynum", "equal": uuid, "notEqual": null, "equalList": null, "notEqualList": null, "isLike": true, "likeType": 2 }],
            "isBusiness": "1"
        }),
        "method": "POST"
    }).then(v=>v.json()).then(async response=>{
        let { totalcount, records } = response.result
        logger.info(`获取到 ${records.length} 条数据（共有 ${totalcount} 条）`)
        /**
         * @param {String} text
         * @returns {Array<String>}
         */
        const _split = text=> text.trim().split("\n").map(v=>v.trim())

        let recordCount = 0
        for(let i=0;i<records.length;i++){
            /**@type {Item} */
            const record = records[i]
            //判断是否日期符合
            if(fromDate || endDate){
                let _date = record.infodatepx.split(" ").shift()
                if(_date && (!fromDate || _date>=fromDate) && (!endDate || _date<=endDate)){}
                else{
                    logger.debug(`${i+1}/${records.length}`, record.title, _date, `不在指定日期范围内...`)
                    continue
                }
            }

            if(skipFail && !/中标(结果)?公[示|告]$/.test(record.title)){
                logger.debug(`${i+1}/${records.length}`, record.title, "跳过...")
                continue
            }

            /**@type {DataLine} */
            const d = {
                xmlx: codeNames[code], dq: record.areaname, id: record.infoid, date: record.infodatepx, status:"Y",
                url: "http://ggzy.jgswj.gxzf.gov.cn/gxggzy"+record.linkurl
            }
            recordCount ++

            //获取内容
            let html = await fetch(d.url).then(v=>v.text())
            let document = new DOMParser().parseFromString(html, "text/html")

            let contentDiv =  document.querySelector(".ewb-details-info")
            /**@type {Array<String>} 多个中标人情况 */
            let extraLines = []

            if(!!contentDiv){
                /**@type {Array<String>} */
                let lines = []

                /**@param {Element} ele */
                const _allText = ele => {
                    _split(ele.textContent).forEach(text=>{
                        if(text.length>3)   lines.push(text)
                    })
                }
                /**
                 * 将两个单元格的内容组合为一行
                 * @param {Element} td1
                 * @param {Element} td2
                 */
                const _addLine = (td1, td2)=>{
                    if(!td1 || !td2)    return

                    let type = cleanText(td1.textContent)
                    let line = `${type}${type.endsWith("：")?"":"："}${_split(td2.textContent).join("、")}`
                    if(line.length>3)   lines.push(line)
                }

                for(let i=0;i<contentDiv.children.length;i++){
                    const ele = contentDiv.children[i]
                    let trs = ele.querySelectorAll("tr")

                    //处理表格数据
                    if(trs.length>1){
                        let colCount = trs[0].childElementCount
                        if(colCount == 2){
                            //对于两列数据，直接按行取内容
                            trs.forEach(v=> {
                                let td2 = v.children[1]
                                if(td2){
                                    // 第二列为空，则取第一列的数据
                                    if(td2.textContent.trim().length == 0){
                                        _allText(v.children[0])
                                    }
                                    else
                                        _addLine(v.children[0], td2)
                                }
                            })
                        }
                        else if(colCount >=3 && trs.length == 2){
                            //上下结构的表格
                            for (let tdIdx = 0; tdIdx < colCount; tdIdx++) {
                                _addLine(trs[0].children[tdIdx], trs[1].children[tdIdx])
                            }
                        }
                        else {
                            //其他结构，则两列组合为一行数据
                            for (let trIdx = 0; trIdx < trs.length; trIdx++) {
                                const v = trs[trIdx]

                                let tdCount = v.childElementCount
                                if(tdCount>=2 && testEle(v.children[tdCount-2], columns.zbr) && testEle(v.children[tdCount-1], columns.zbj)){
                                    //多个中标人情况
                                    for (let y = trIdx+1; y < trs.length; y++) {
                                        const zbTr = trs[y]
                                        if(zbTr.childElementCount == tdCount){
                                            extraLines.push([cleanText(zbTr.children[tdCount-2].textContent), cleanText(zbTr.children[tdCount-1].textContent)])
                                            trIdx ++
                                        }
                                    }
                                }
                                // 还有一种情况，标序号再最左侧，后面接：中标单位、中标价等，暂不处理
                                // http://ggzy.jgswj.gxzf.gov.cn/gxggzy/jyxx/001001/001001003/001001003005/20231113/9e407a84-3c41-48b5-b451-f339172d2361.html
                                // http://ggzy.jgswj.gxzf.gov.cn/gxggzy/jyxx/001001/001001003/001001003005/20231222/470d1091-6cb7-4c19-ad2b-8e7ca4bc8caf.html
                                else if(v.childElementCount % 2 == 0){
                                    // 普通四列数据
                                    for (let tdIdx = 0; tdIdx < v.childElementCount; tdIdx+=2) {
                                        _addLine(v.children[tdIdx], v.children[tdIdx+1])
                                    }
                                }
                            }
                        }
                    }
                    else {
                        _allText(ele)
                    }
                }

                Object.keys(columns).map(key=>{
                    let regex = RegExp(`(${columns[key]})[^：]*：`)
                    for (let index = 0; index < lines.length; index++) {
                        const line = lines[index].replaceAll(' ', "").trim()
                        const m = line.match(regex)
                        if(m){
                            d[key] = line.split(m[0]).pop().replace(/\t/g, "").trim()
                            lines.splice(index, 1)
                            break
                        }
                    }
                })
            }
            else {
                d.status = "N"
            }

            logger.debug(`${i+1}/${records.length}`, d)
            //如果没有项目名称，则使用文章标题
            if(!d.xmmc)  d.xmmc = record.title
            //处理报价
            if(d.zbj){
                let jiageM = d.zbj.match(/￥?[,.0-9]+(%|元)?/g)
                jiageM && (d.zbj = jiageM[0].replace(/元|￥|,/g, ""))
            }
            //处理编号，去除 ） 后面的内容
            if(d.xmbh){
                let i = d.xmbh.indexOf("）")
                i>0 && (d.xmbh = d.xmbh.substring(0, i))
            }

            if(extraLines.length>0){
                //多段中标人
                extraLines.forEach(ex=> rows.push([d.status, d.xmlx, d.dq, d.xmmc, d.xmbh, d.fbrq, ex[0], ex[1], d.gq, d.xmjl, d.jgbm, d.date, d.url]) )
            }
            else
                rows.push([d.status, d.xmlx, d.dq, d.xmmc, d.xmbh, d.fbrq, d.zbr, d.zbj, d.gq, d.xmjl, d.jgbm, d.date, d.url])
        }

        window.rows = rows

        console.debug(saveToCSV(rows, split, `${codeNames[uuid]}(${fromDate?(fromDate+"到"):"截至"}${endDate||date.date()}).csv`))
        logAndTip(`采集完成，共处理 ${recordCount} 则[${codeNames[uuid]}]公示，获得 ${rows.length-1} 条数据，耗时 ${((Date.now() - started)/1000).toFixed(3)} 秒`)
    })
}

chrome.runtime.onMessage.addListener(req=>{
    if(typeof(req)==='object' && !!req.code)
        window.fetchDo(req)
})

logger.debug("[全国公共资源交易平台（广西）数据助手] 代码已注入 😄")
