<template>
    <n-card style="width:480px" :title="name" size="small">
        <n-form :show-feedback="false">
            <n-space vertical>
                <n-alert type="info" :bordered="false" size="small" show-icon>
                    1、请选择工程类型、日期（不填则不限制），然后点下方按钮 <br>
                    2、整个过程无需人工干预，请耐心等待结果（若当前标签页不是<b>公共资源交易中心</b>的网站首页，系统将自动新开标签页） <br>
                    3、结果将以 CSV 格式导出（分隔符为 TAB 键） <br>
                    4、任务执行过程中，可按下 <n-tag :bordered="false" type="primary" size="small">F12</n-tag> 打开控制台查看进度😄
                </n-alert>

                <n-grid :cols="2" :x-gap="10" :y-gap="10">
                    <n-form-item-gi span="2" label="工程类型">
                        <n-radio-group v-model:value="bean.code">
                            <n-radio v-for="item in types" :value="item.value" :label="item.label" />
                        </n-radio-group>
                    </n-form-item-gi>
                    <n-form-item-gi>
                        <template #label>
                            <n-tooltip>
                                <template #trigger>最大抓取公示条数</template>
                                单次抓取数据量，建议根据实际情况填写（最好不超过10000）
                            </n-tooltip>
                        </template>
                        <n-input-number style="width: 100%;" v-model:value="bean.pageSize" :min="1" />
                    </n-form-item-gi>
                    <n-form-item-gi label="CSV分隔符">
                        <n-select v-model:value="bean.split" :options="splitTypes" />
                    </n-form-item-gi>
                    <n-form-item-gi label="开始日期">
                        <n-date-picker style="width: 100%;" v-model:formatted-value="bean.fromDate" placement="top-start" type="date" placeholder="不填则不限制" />
                    </n-form-item-gi>
                    <n-form-item-gi label="截至日期">
                        <n-date-picker style="width: 100%;" v-model:formatted-value="bean.endDate"  placement="top-start" type="date" placeholder="默认为今日"/>
                    </n-form-item-gi>
                </n-grid>

                <n-button type="primary" block size="large" @click="toWork">开始采集数据</n-button>
                <n-button block @click="toHome">打开公共资源交易中心首页</n-button>
            </n-space>
        </n-form>
    </n-card>
</template>

<script setup>
    import { reactive, onMounted } from 'vue'
    import { NButton, NCard, NSelect, NInput, NTooltip, NTag, NForm, NFormItem, NRadioGroup, NRadio, NSpace,NGrid, NDatePicker, NGridItem, NAlert, NInputNumber } from 'naive-ui'

    import { getCurTab, sendNotice } from 'basic'

    const name = _NAME_
    const types = [
        { label:"水利工程", value:"002" },
        { label:"交通工程", value:"003" },
        { label:"铁路工程", value:"004" },
        { label:"其他工程", value:"005" }
    ]
    const splitTypes = [{label:"英文逗号", value:","}, {label:"制表符", value:"\t"}]
    /**
     * 目前只对下方两个 url 的网页注入 fetchDo 函数
     *
     * @crxjs/vite-plugin 插件生成最终的 manifest.json 会自动注入
     *   "web_accessible_resources": [
            {
            "matches": [
                "http://ggzy.jgswj.gxzf.gov.cn/*",
                "http://ggzy.jgswj.gxzf.gov.cn/*"
            ],
            "resources": [
                "assets/index-VGHzu5sa.js",
                "assets/content.js-6WiXNOki.js"
            ],
            "use_dynamic_url": true
            }
        ]
     * 此时，如果 matches 为 http://ggzy.jgswj.gxzf.gov.cn/ 则不能被 chrome 正确识别，故增加一个后缀内容😂
     */
    const url   = `http://ggzy.jgswj.gxzf.gov.cn/index.html`
    const url2  = "http://ggzy.jgswj.gxzf.gov.cn/gxggzy/"

    let bean = reactive({code:'003', formDate:null, endDate:null, pageSize:5000, split:"\t", skipFail:true})

    const run = tab=>{
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            args: [ bean ],
            function: ps=> window.fetchDo(ps)
        })
    }
    const toHome = (autoWork=false)=> chrome.runtime.sendMessage({action: "tab", data: {url, callback: autoWork? bean : undefined}})

    const toWork = async ()=>{
        const tab = await getCurTab()
        if(tab.url == url || tab.url == url2)
            return run(tab)

        toHome(true)
    }
</script>
