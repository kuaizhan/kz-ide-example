# 开发IDE使用帮助

下载IDE 请访问 : <http://kuaizhan.com/developer/ide>

Fork us on github: <https://github.com/kuaizhan/kz-ide-example>

## 运行环境

* node.js
* chrome


## 安装说明

* 首先保证本地具有node.js环境，详细，参考 node.js 官网
* 下载工程文件解压到本地
* 配置本地Host 127.0.0.1 dev.kuaizhan.com
* 运行 npm install 安装依赖
* 运行 node server.js
* 在chrome 中打开 <http://dev.kuaizhan.com/>


## 工程文件说明

* server.js                             `IDE 程序文件`
    * __project__                       `代码文件目录`
        * __example_plugin__            `插件示例目录`
            * package.json              `插件描述文件`
            * __components__            `插件内组件目录`
                * __richtext__          `组件目录(目录名同时也是组件名)`
                     * package.json     `组件描述文件`
                     * editing.js       `编辑状态下执行代码`
                     * portal.js        `发布后执行代码`
                     * unit_test.js     `单元测试代码`
                     * style.css        `组件样式`
                     * editing.css      `编辑状态下其他样式`
                 * title
                     * package.json
                     * editing.js
                     * portal.js
                     * unit_test.js
                     * style.css
                     * editing.css
                 * video
                     * package.json
                     * editing.js
                     * portal.js
                     * unit_test.js
                     * style.css
                     * editing.css


# 基本功能

 首先需要注册快站，并建立快站的测试站点，

 如果未登录，会显示如下登录提示

![登陆](http://7bede40ef4e00.cdn.sohucs.com/0542648ee9f0ebccaa3ee05987adc0bc)

 登录完成之后，将返回开发首页

![IDE界面](http://7bede40ef4e00.cdn.sohucs.com/a19f54de73a2d46fcb8dba9d3b9279e6)


## 加载组件

点击加载组件按钮，会列出您本地project目录下的所有组件列表，选中需要加载的组件，点击加载按钮。在左侧功能区就会出现相应的组件。(如果没有出现，请检查控制台是否有报错)

![加载组件](http://7bede40ef4e00.cdn.sohucs.com/498720637298d0eb4eb550f35318733b)


## 上传图片

* 点击上传图片，将打开快站插件开发平台，并跳转至资源管理功能，在资源管理界面，选择添加文件，即可将资源上传至CDN服务器，点击图片便可得到图片的完整URL.
* *目前资源仅支持png,jpg,gif 图片*


## 前端登录

* 当组件需要对用户进行操作时，可在开发环境模拟登录，然后获取已登录用户信息进行功能开发。
* 点击 “前端登录” 按钮按步骤进行操作后，便可以通过接口获取当前登录用户数据

## 预览主题

* *现在IDE支持主题开发了。具体开发规范参考: 主题开发规则*

点击"预览主题"按钮后可以打开主题预览窗口

![主题预览](http://7bede40ef4e00.cdn.sohucs.com/2ad3f87daf8c387dbc4202166fe09b12)

点击主题的色块，就可以在当前测试站点下预览主题


## 测试站点设置

* 设置测试站点前，首先需要在快站创建一个测试站。创建成功之后，可以得到站点ID，同时在编辑某个页面时，也可以看到页面ID.
* 使用站点ID和测试页ID，可以将插件数据对应用户的站点，页面进行关联。
* 点击 “设置测试站点”按钮，这里就会列出当前您已经创建的站点，点击一个即可

![测试站点设置](http://7bede40ef4e00.cdn.sohucs.com/cd268ed8bc3cfe50c324f9003cee8799)


## 查看保存数据

* 当组件被拖拽到预览框之后，便会有数据需要保存页面中，这些数据用户在服务器端与组件配置中的html模板绑定后，生成用户页面。
* 点击查看保存数据，就可以调试当前页面中组件产生的数据情况，方便调试


## 测试发布

* 测试发布模拟了快站服务器端生成页面的逻辑，可以预览组件在发布后的状态，用于调试。


##  管理页面转发规则

说明：通过页面转发规则可以将集成的插件放置在同域内操作，前端请求将不再受跨域限制

具体转发规则如下：

* http://dev.kuaizhan.com/pp/{plugin_name}/{page}?site_id=8500653249
* http://dev.kuaizhan.com/pa/{plugin_name}/{api_path}?{queryString}
* http://dev.kuaizhan.com/pf/{plugin_name}/{file_path}

说明：根据插件package.json转发管理页

例如：插件example 的package.json 如下：

```JSON

{
    "entrance": "/register.html",
    "proxy-prefixes": {
        "common": "",
        "backend-page": "http://www.example.com/kuaizhan",
        "backend-api": "http://api.example.com/",
        "page": "http://static.example.com/",
        "api": ""
    },
    "proxy-paths": {
        "common": "*"
    }
}

```

根据如上配置，：

---

http://dev.kuaizhan.com/pp/example/register.html?site_id=8500653249

将转发对如下地址的请求：

http://www.example.com/kuaizhan/register.html?site_id=8500653249

---

http://dev.kuaizhan.com/pa/getApi?site_id=8500653249

将转发对如下地址的请求：

http://api.example.com/getApi?site_id=8500653249

---

http://dev.kuaizhan.com/pf/image/icon.png

将转发对如下地址的请求：

http://static.example.com/image/icon.png

---


## 常见问题

* 运行node server.js 显示

```
Caught Exception: Error: listen EACCESS
```

  mac 或 linux 下请运行： sudo node server.js

  windows 下暂时需要修改端口号后运行

  修改方式：在server.js 文件中找到 .listen(80, 'dev.kuaizhan.com');

  修改为空闲端口，例如：8010

  *修改后可能会造成部分数据产生跨域问题，影响暂时不打，我们会逐步寻找更多解决办法*

* 显示未登陆用户

   访问http://kuaizhan.com/ 登陆。

* 显示不正确的站点ID或者没有权限

   修改测试站点，将测试站点ID设置为已登陆用户的站点ID.

*常见问题内容补充中*
