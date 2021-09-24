# Ikan reptile

Ikan漫画爬虫（包含自动更新和网页版阅读器）.

### 安装

> 注意: 需要安装`Node.JS`运行环境

```bash
./install.sh
```

这将自动安装系统服务并开机启动

### 配置

* `port` 网页服务器监听端口
* `host` Ikan漫画网站主页
* `user-agent` 爬虫所使用的user-agent
* `output` 爬虫内容输出缓存目录
* `page` 网页资源文件目录（一般情况下`./view/dist`即可，不需要更改）
* `books[key].title` 漫画名称
* `books[key].path` 漫画的路由地址

示例配置:

```toml
port = 80
host = "https://www.ikanmh.top"

user-agent = """
Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) \
AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 \
Mobile/15E148 Safari/604.1\
"""

output = "./output"
page = "./view/dist"

[books.lodge]
title = "寄宿日記"
path = "/book/479"
```