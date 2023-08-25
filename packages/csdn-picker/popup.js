// browser.notifications.create({
//     type: "basic",
//     iconUrl: browser.extension.getURL("csdn.png"),
//     title: "CSDN-PICKER",
//     message: `${new Date().toLocaleString()}`,
// })

document.querySelector("#run").addEventListener('click', async ()=>{
    // 通过 getCurrent() 无法获取到标签页
    // let tab = await chrome.tabs.getCurrent()
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if(!tab.url.startsWith("https://blog.csdn.net/")){
        return alert(`请在 CSDN 博客网站运行此插件`)
    }

    // 以当前标签页为上下文，执行函数
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [{ }],  // // 无法访问外面的数据，args 可传递外面的数据
        function: ps => {
            console.debug(`执行代码，参数为：`, ps)
            let items = []
            document.querySelectorAll(".blog-list-box").forEach(b=>{
                let footer = b.querySelector(".blog-list-footer-left")
                items.push({
                    url     : b.firstChild.href,
                    title   : b.querySelector(".blog-list-box-top").innerText,
                    summary : b.querySelector(".blog-list-content").innerText,
                    type    : footer.firstChild.innerText,
                    date    : footer.children[1].innerText.split(" ")[1],
                    view    : footer.querySelector(".view-num").firstChild.textContent,
                    like    : footer.querySelector(".give-like-num").firstChild.textContent,
                    comment : footer.querySelector(".comment-num").firstChild.textContent,
                    mark    : footer.lastChild.firstChild.firstChild.textContent
                })
            })
            console.debug(`获取到文章 ${items.length} 则，第一篇预览`, items[0])

            //导出到文件
            //let blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
            // let url = URL.createObjectURL(blob)
            // let downloadLink = document.createElement('a')
            // downloadLink.href = url
            // downloadLink.download = filename
            // document.body.appendChild(downloadLink)
            // downloadLink.click()
            // document.body.removeChild(downloadLink)
            // URL.revokeObjectURL(url)
        }
    })
})
