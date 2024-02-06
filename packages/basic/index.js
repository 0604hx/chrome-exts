import logger from "./logger"
import * as date from './date'

const noticeIcon    = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAytJREFUaEPtWT9oE2EU/720Vmmxg1ju0kF0EhQH6SBqh4qDiH9AJebSanunToKDFaPgHyw6qJN0EERMLlrJpUMRXQQFC1oQleLkpnUyl0xdBKXmnl7bxPR6l1xIrk30bv3e977f773fe/fdO0KDP9Tg+OETWO4M+hn4bzIQjIcPM9EZgN/pcupCrYh7LqHOhLTVYIoCLBVAM4Z0RbvmhkQwdnQPU2A7gHFd0catezwj0HnvQKvR0hYF4RKA5gUHE8b0Ae1IKQLiSN8m+pUbZODkvN24Lmu7loSAEA9LRHQZwGYHkLZgTNs1I33tLTO5QRDOAmjP7ycgmZa1Xk8JmHLJMa4QcKiMPGwJCInwfmK6uYg4Y8wgjmbl1GdPCMzL5SoIbovTloCoSq/+aL2nCOR7ZrqeUZLPnAJSdQ2IakQB+BaADjdFWUrPYiIyCuYQCFNENJzuT94p59OWgBDv20LIdQFYb3VQ3D0EVXpDwM5yh9isO9aAGJd6uGnFp0z/o6wbv4sIiPFwCESjTpt1WSvsEVWJ3RxSCYFK/S0gEIxLx5nwsJSTuiYgqtJrAN2NTMDUXclirPcMlNW0T2BOn45dqKoidtNV/Az86xkQ1EiEmDfaSilAWTLwJa0knxdd8v6aLreEZu9UK9u+l6wDy1V8wYtsuQmYwMthYNDjjJw8VpcZMEGtfXBwdXOg9ZyThPSB5N3itbrLgN9Gy0XAfw94/B5o+Mtcg1+n41IPCOaHteNT1zVgou5MhNYZ3GT22n12LOqeQB60+XFtGXEAAbA+oA3lbTz5qE9ETlPOeJs+kZos1xHN9boaqwQT0gQzdgCYAXj4B/+8Ma08mS5FpGoCs7Kbm4PWYrA1ZRnlpJn5dkZJOc6HakIgH6FqR4tBtbeLYXywRpzBH5kD0aySfGFdqymBQm1UMdw1fQix8CkK0H0L2K+6rG1YEgIFWa1qOw+GOaWufLweC3WgqfkimAfzoIs7oO112k3VV2pT7Q8OQZV2E6E7wMbLb/LoxJJlwHqQEJO2EWEvEyYzsva00kA42XtSA7UC58aPT8BNlLy08TPgZXTd+G74DPwGvrKxQBmRqicAAAAASUVORK5CYII=`
const errorIcon     = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA/JJREFUaEPtmE2IlVUYgJ93UeCiFC0dC0GcheGiWRSNhELgT1pDGmSLnJ0zBQ3VxhRUsBYq6kaShPyBQIegEEqcTHQgEjGLoATFn2wjoTY4qBujFqfv7b6fc+bMvfc7308Ng/fA3Xz3nPe8z3nPef+ECT5kgutPC2C8LdiyQMsCJU/gP7lCDmYBTwFzTb9LwEWBayX1HbO8EgAHU4AXgCXAKuDxBoreBA4CxwVOVgFTCsDBJOAd4F3gyZwKnQV2C/TnXDdqemEAB93A+8DTnsTbiSW+BX4E9LRv2H9twAzgebPSw96aY8A2gVNFQAoBOPgA2OxtOAh8BHwj8FczRRxMBV4D3gSesbl/A30C+/JC5Aaoo3yvwP68G+t8V4P4xFv7YaKQHk70yAXgag/0c0/6SwJ6BQoPB8uBrz0Brwt8ESswGiBUXqg2j3L/GuT+iIaIAjBv8733YDsEzsWeUsw8V3MGv9hclT1f4F7W2liAdcB2EzbqzjuYbQ/6sMDRrA3t7q8E3gN6BK6maxz0JO44fcjrBXZkycsEMK+hJ6J+flBgsS/UwdtJ4PrYvmWaPriKnwm8EcjTALcI+F0tLjDcDCIGYDVwyISsEDgSbPiius+Y+1vHCYwBdvAK8JXJ684KdDEAqrxC3NUUoZ6fj1Qs9GB1reVAg9wQ8CjQL7WA2XDEANxKgpQGH81fljWS1AwiBjCwqlpULTssMK0wgIPJgKYHOjYKbG0mrJ6iNt+PHTHvZAOwxdZOEbjTaN+mFnAwhxEvoR7jQJZXqAPhL8lU3rzUGkaie7vAb0UBngM0a9TRJTCQBWAKhPddP0cpb+tfZsQldwr88MACTPgrNLEfsd1HLUq0GBkQ6Pqf3OhpK36GBKYXdqMGsBNYS61QmVkvtMf4+Zg5tl878KspvUegryyA5j4nTMhbAnuDoLNUg5z3raG3iYEICqZXBb4sBWCnoql0J/BTknE+GwD45WWmq4xI5lJ554EFMhJI63JkphIG4Cd0o6xQZTqdauhqLZo/BC5kxZ0oAIPQsk/LPx2lS8ksxWL/zwOwUOuBJEd5SIVXXVLGKhzOiwYwK/Qy+hGXtoSruWg9EO0j5R65AAwi7AntSvbXdkiatUYp4Wo9IW2r6E/HEwLXoxZ7k3IDGESYrP2sENoeiWhshYqn6rQVsUIhAA9iU9Ba1KrtDPCd11p8BOhI+knzrFuddqxTxT8FNGBpOzL3KAxgEGWau9q8UsW1l1p4lAJId7XOhbrY9KclaDi0KLmc1NdXrIfqd+PGFyDc3UpRrWUfA/5UpWOaVEUoKrFAkY2rWtMCqOoki8ppWaDoyVW1rmWBqk6yqJx/AELSG0D4T79pAAAAAElFTkSuQmCC`

export { logger, date }

export const sendNotice = (message, title="通知", icon)=>{
    let id = `${Date.now()}`

    chrome.notifications.create(id, { type:'basic', iconUrl: icon||noticeIcon, title, message })
    return id
}

export const sendError = (message, title="运行时错误")=> chrome.notifications.create(null, {type:'basic', iconUrl: errorIcon, title, message})

/**
 * 获取当前标签页
 * @returns
 */
export const getCurTab = async ()=>{
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true})
    return tab
}

/**
 *
 * @param {String} text
 * @param {String} filename
 * @param {Boolean} saveAs - 是否弹出文件保存框
 */
export const saveTextToFile = (text, filename, saveAs=false)=>{
    filename??= "导出文件.txt"
    let ext = filename.split(".").pop().toLowerCase()
    let types = {
        'docx'  : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'html'  : 'text/html',
        'jpg'   : 'image/jpeg',
        'json'  : 'application/json',
        'png'   : 'image/png',
        'xlsx'  : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xml'   : 'application/xml',
        'csv'   : 'text/csv'
    }
    let type = types[ext]||'text/plain'
    let url = URL.createObjectURL(typeof(text)=='string'? new Blob([text], {type}): text)
    chrome.runtime.sendMessage({action:'download', data: {url, filename, saveAs}})
}

/**
 *
 * @param {Array<Array>} rows
 * @param {String} split
 * @param {String} filename
 * @returns {String}
 */
export const saveToCSV = (rows, split=",", filename)=> {
    let text = rows.map(v=>v.join(split)).join("\n")
    saveTextToFile(text, filename)
    return text
}

/**
 * 新开一个标签页，如果设置了 callback ，则在新标签页发送一则消息
 * @param {String|Object} url
 * @param {String} callback - 消息数据
 * @param {Number} timeout - 延迟执行
 */
export const openTab = (url, callback, timeout)=> chrome.tabs.create(typeof(url) === 'string'? { url }: url, tab=>{
    logger.debug(`打开标签页(ID=${tab.id})：${url}， 回调=${!!callback}`)
    if(!!callback){
        setTimeout(()=>{
            logger.debug(`即将发送消息给 ${tab.id}`, callback)
            chrome.tabs.sendMessage(tab.id, callback)
        }, timeout || 2000)
    }
})

export const listenerMessage = extras=>{
    const handlers = {
        'notice'    : d=> typeof(d)==='object'? sendNotice(d.message, d.title, d.icon): sendNotice(d),
        'tab'       : d=> typeof(d)==='object'? openTab(d.url, d.callback, d.timeout):openTab(d),
        'download'  : d=> {
            let opts = typeof(d)==='object'? d: {url: d}
            logger.debug(`即将下载内容`, opts)
            chrome.downloads.download(opts, did=> {
                if(opts.saveAs != true)
                    sendNotice(d.message||`文件已保存到下载目录：${opts.filename||did}`, `下载成功`)
            })
        }
    }
    if(!!extras && typeof(extras)=='object')
        Object.assign(handlers, extras)

    chrome.runtime.onMessage.addListener(req=>{
        const { action, data } = req
        logger.debug(`收到消息指令：ACTION=${action}`, data)

        const handler = handlers[action]
        if(!handler)    return sendError(`无效的 ACTION 类型：${action}`)

        handler(data)
    })
}

