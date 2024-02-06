import { listenerMessage, logger } from "basic"

chrome.runtime.onInstalled.addListener(({ reason })=>{
    if(reason == 'install'){
        logger.info(`欢迎使用${_NAME_}，如有问题请反馈至 https://github.com/0604hx/chrome_exts_demo`)
    }
})

listenerMessage()
