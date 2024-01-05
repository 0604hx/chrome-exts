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

/**
 * 爬取内容
 * @param {String|Number} codeId
 * @param {Number} pageSize
 */
const fetchDo = (codeId, pageSize=5000)=>{
    const codeNames = {
        "001001002005": "水利工程",
        "001001003005": "交通工程",
        "001001004005": "铁路工程",
        "001001005005": "其他工程"
    }
    const columns = {
        xmmc:"项目名称",
        xmbh:"(项目|招标)编号",
        fbrq:"发布日期",
        zbr:"中标人",
        zbj:"中标(价|费率)|报价",
        gq:"交货期|期限|工期",
        xmjl:"项目(经理|负责)|联系人",
        jgbm:"监督部门"
    }

    let code = ``
    codeId+=""
    if(codeId.length == 1)  code = `00100100${codeId}005`
    if(codeId.length == 3)  code = `001001${codeId}005`
    if(codeId.length == 9)  code = `${codeId}005`
    if(codeId.length == 12) code = codeId

    let body = {
        "pn": 0,
        "rn": pageSize,
        "fields": "title",
        "cnum": "001",
        "sort": "{\"infodatepx\":\"0\"}",
        "ssort": "title",
        "cl": 200,
        "condition": [ { "fieldName": "categorynum", "equal": code, "notEqual": null, "equalList": null, "notEqualList": null, "isLike": true, "likeType": 2 }],
        "isBusiness": "1"
    }

    let items = [["STATUS", "项目类型","地区/城市", "名称","编号","发布日期","中标人","中标价/费率","工期","项目经理","监管部门", "信息日期", "链接"]]

    fetch(
        "http://ggzy.jgswj.gxzf.gov.cn/inteligentsearchgxes/rest/esinteligentsearch/getFullTextDataNew", {
        "body": JSON.stringify(body),
        "method": "POST"
    }).then(v=>v.json()).then(async response=>{
        let { totalcount, records } = response.result
        console.debug(`类型=${code}（${codeNames[code]}） 共有 ${totalcount} 条数据，本次获取 ${records.length} 条`)

        for(let i=0;i<records.length;i++){
            /**@type {Item} */
            const record = records[i]
            /**@type {DataLine} */
            const d = {
                xmlx: codeNames[code], dq: record.areaname, id: record.infoid, date: record.infodatepx,
                url: "http://ggzy.jgswj.gxzf.gov.cn/gxggzy"+record.linkurl
            }

            //获取内容
            let html = await fetch(d.url).then(v=>v.text())
            let doc = new DOMParser().parseFromString(html, "text/html")
            let contentDiv =  doc.querySelector(".ewb-details-info")

            if(!!contentDiv){
                d.status = "Y"

                // 水利工程的详细页数据较为标准
                if(code == '001001002005'){
                    let lines = contentDiv.textContent.split("\n")
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
                // 交通工程
                else if(code === '001001003005'){

                }
            }
            else {
                d.status = "N"
            }

            console.debug(`${i+1}/${records.length}`, d)
            //如果没有项目名称，则使用文章标题
            if(!d.xmmc)  d.xmmc = record.title
            //处理报价
            if(d.zbj){
                let jiageM = d.zbj.match(/￥?[.0-9]+(%|元)?/g)
                jiageM && (d.zbj = jiageM[0].replace(/元|￥/g, ""))
            }
            items.push([d.status, d.xmlx, d.dq, d.xmmc, d.xmbh, d.fbrq, d.zbr, d.zbj, d.gq, d.xmjl, d.jgbm, d.date, d.url])
        }

        window.items = items
        console.debug(items.map(v=>v.join("\t")).join("\n"))
    })
}
