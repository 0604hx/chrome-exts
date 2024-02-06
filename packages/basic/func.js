/**
 * content_script 阶段可用的函数
 */

export const sendNotice = (message, title="运行时通知", icon)=> chrome.runtime.sendMessage({action:'notice', data: {message, title, icon}})

/**
 * 删除诸如制表符、换行符、空格等
 * @param {String} text
 * @returns {String}
 */
export const cleanText = text=> text.replace(/[\t\r\f\n\s]*/g, "")

/**
 * 检测元素内容是否符合特定的表达式
 * @param {Element} ele
 * @param {String} regex
 * @returns {Boolean}
 */
export const testEle = (ele, regex) => RegExp(regex).test(cleanText(ele.textContent))
