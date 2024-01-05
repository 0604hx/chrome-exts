# 全国公共资源交易平台（广西区）数据助手
> http://ggzy.jgswj.gxzf.gov.cn/

## 点击路径

1. 选择“交易信息”
2. 发布时间：选“全部”
3. 区域选择：选“全部”
4. 业务类型：选“工程建设”
5. 行业：选“水利工程”（需要依次选择“交通工程”、“铁路工程”、“其他工程”进行查询）
6. 信息类型：选“中标结果公告”
7. 点击“搜索”

## 抓取内容

需爬取的字段信息如下：
- 项目类型（水利工程、交通工程、铁路工程、其他工程）
- 项目名称
- 项目编号
- 公告发布日期
- 中标人名称
- 中标价
- 总工期
- 项目经理
- 监督部门

## 调研

### 获取中标结果清单
> http://ggzy.jgswj.gxzf.gov.cn/inteligentsearchgxes/rest/esinteligentsearch/getFullTextDataNew

```json
{
    "result": {
        "categorys": [
            {
                "categorynum": "001",
                "count": "3009",
                "categoryname": "自治区"
            }
        ],
        "totalcount": 3009,
        "records": [
            {
                "infodatepx": "2024-01-04 09:52:08",
                "categorynum": "001001002005",
                "infoid": "ad57b363-c612-4eea-a8ed-d99e0269fb02",
                "areaname": "贵港市",
                "sysclicktimes": 0,
                "title": "贵港市覃塘区马班水库除险加固工程中标结果公示",
                "areacode": "450800",
                "content": "贵港市覃塘区马班水库除险加固工程中标结果公示&nbsp;一、项目名称：贵港市覃塘区马班水库除险加固工程二、项目编号：E4508002851003547001001三、招标方式：公开招标 四、评标日期：2023年12月27日五、公告发布日期：2024年1月4日六、中标结果：中标人：中水京林建设有限公司资质等级：水利水电工程施工总承包贰级中标价：6595615.97元质量等级：合格工期：210日历天项...",
                "score": null,
                "linkguid": "c0216355-4b7b-4e86-a983-ce44e69cf1b0",
                "customtitle": "贵港市覃塘区马班水库除险加固工程中标结果公示",
                "syscategory": "001",
                "syscollectguid": "9242ba0c-cde5-4464-b371-85edcaecf5fc",
                "linkurl": "/jyxx/001001/001001002/001001002005/20240104/ad57b363-c612-4eea-a8ed-d99e0269fb02.html",
                "id": "001001002005ad57b363-c612-4eea-a8ed-d99e0269fb02_001",
                "sysscore": 0,
                "infodate": "2024-01-04 09:56:03"
            }
        ],
        "executetime": "0.023"
    }
}
```

### 中标结果详细页

```text
详细地址：
    http://ggzy.jgswj.gxzf.gov.cn/gxggzy/projectDetails.html?infoid=ad57b363-c612-4eea-a8ed-d99e0269fb02&categorynum=001001002005
上述页面通过 `iframe` 嵌入真实的内容，地址为：
    http://ggzy.jgswj.gxzf.gov.cn/gxggzy/jyxx/001001/001001002/001001002005/20240104/ad57b363-c612-4eea-a8ed-d99e0269fb02.html（水利工程）
    http://ggzy.jgswj.gxzf.gov.cn/gxggzy/jyxx/001001/001001003/001001003006/20240104/0206f228-6aef-4cdd-b9d8-cac1f619c4a2.html（交通工程）
    http://ggzy.jgswj.gxzf.gov.cn/gxggzy/jyxx/001001/001001004/001001004005/20240103/c7dd16a6-4f10-4a7e-8a25-7223e9c880f9.html（铁路工程）
    http://ggzy.jgswj.gxzf.gov.cn/gxggzy/jyxx/001001/001001005/001001005006/20240104/19c06b93-f92d-420c-b1ae-b92e4dcebb8c.html（其他工程）

内容地址：
    http://ggzy.jgswj.gxzf.gov.cn/gxggzy/jyxx/{工程建设代号}/{水利工程代号}/{中标结果公示代号}/{日期yyyyMMdd}/{infoid}.html
```



