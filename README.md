# 开发IDE使用帮助

---

下载IDE 请访问 : <http://kuaizhan.com/developer/ide>

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

![IDE界面](http://7bede40ef4e00.cdn.sohucs.com/cf7da4981e9ace41993b348eda37e911)
---

## 加载组件

当正常加载组件后，在 "加载组件" 按钮的前面会有下拉列表按插件顺序列出所有组件。

* 在下拉列表中选择组件，然后点击加载组件后，在组件区域，就会出现加载组件的图标，然后就可以将图标拖拽到手机预览窗口，并且可以打开组件的配置窗口。

* 在配置窗口中可以修改组件属性。

## 上传图片

* 点击上传图片，将打开快站插件开发平台，并跳转至资源管理功能，在资源管理界面，选择添加文件，即可将资源上传至CDN服务器，点击图片便可得到图片的完整URL.

* *目前资源仅支持png,jpg,gif 图片*

## 测试站点设置

* 设置测试站点前，首先需要在快站创建一个测试站。创建成功之后，可以得到站点ID，同时在编辑某个页面时，也可以看到页面ID.

* 使用站点ID和测试页ID，可以将插件数据对应用户的站点，页面进行关联。

* 测试站点的数据将保存在cookie中，当服务器端编程需要读取站点id时，也需要从cookie中获取，cookie名：`kz_site`

## 查看保存数据

* 当组件被拖拽到预览框之后，便会有数据需要保存页面中，这些数据用户在服务器端与组件配置中的html模板绑定后，生成用户页面。

* 点击查看保存数据，就可以调试当前页面中组件产生的数据情况，方便调试

## 测试发布

* 测试发布模拟了快站服务器端生成页面的逻辑，可以预览组件在发布后的状态，用于调试。

##  管理页面转发规则

* http://dev.kuaizhan.com/plugin/page-proxy/{plugin_name}/{entrance_page}?site_id=8500653249

说明：根据插件package.json转发管理页

例如：插件example 的package.json 如下：

```JSON

{
    "entrance": "/register.html",
    "proxy-prefixes": {
        "common": "",
        "backend-page": "http://www.example.com/kuaizhan",
        "backend-api": "",
        "page": "",
        "api": ""
    },
    "proxy-paths": {
        "common": "*"
    }
}

```
根据如上配置，访问：

http://dev.kuaizhan.com/plugin/page-proxy/example/register.html?site_id=8500653249

将请求：

http://www.example.com/kuaizhan/register.html?site_id=8500653249



## 常见问题

* 显示未登陆用户
   
   访问http://kuaizhan.com/ 登陆。

* 显示不正确的站点ID或者没有权限

   修改测试站点，将测试站点ID设置为已登陆用户的站点ID. 


*常见问题内容补充中*
