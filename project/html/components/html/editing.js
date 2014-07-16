/*
 组件类定义。
 */
define(['jquery', 'configurableComponent', 'lib/mustache', 'ui', 'res/pageui/js/codemirror/lib/codemirror', 'res/pageui/js/codemirror/lib/beautify-html', 'res/pageui/js/codemirror/mode/htmlmixed/htmlmixed'], function ($, Component, mustache, ui, CodeMirror, beautify, htmlmixed) {
    'use strict';

    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        "html_edit": "<div class='mod mod-html'>{{{content}}}</div>",
        "config_edit": '<div class="config-html">                               \
      <div class="html-con">                                               \
    <div class="hd">HTML</div>                                             \
    <textarea name="content" placeholder="<div>我是谁</div>"  maxlength="10004" style="width:97%"></textarea> \
  </div>                                                                           \
    <p class="notice">代码长度不得超过10000字符</p>                                                  \
  </div>',
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        renderConfigurator: function () {
            Component.prototype.renderConfigurator.apply(this, [
                {column: "property"}
            ]);
            this.$propertyPanel.html(this.config_edit);
            this.$propertyPanel.find("[name='content']").val(this.data.content);
            var that = this;
            this.editor_html = CodeMirror.fromTextArea(this.$configEl.find("[name='content']")[0], {
                mode: "text/html",
                lineNumbers: true,
                vimMode: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                autoCloseTags: true,
                showCursorWhenSelecting: true
            });
            this.editor_html.on("change", function (o) {
                var html = o.getValue();
                if (/\<SCRIPT[^\>]*\>[^\<\/]*\<\/SCRIPT\>/ig.test(html)) {
                    html = html.replace(/\<SCRIPT[^\>]*\>[^\<\/]*\<\/SCRIPT\>/ig, "");
                    o.setValue(html);
                }
                that.data["content"] = html;
                that.renderView();
            });
            this.editor_html.on("blur", function (o) {
                o.setValue(beautify.html_beautify(o.getValue()));
            });
        },
        init: function () {
            var that = this;
            Component.prototype.init.apply(this, arguments);
            this.$viewEl.children(".mod-html").attr("contenteditable", "true");
            this.$viewEl.on("blur", function () {
                if (that.editor_html) {
                    that.editor_html.setValue(beautify.html_beautify(that.$viewEl.html()));
                }
            });
        },
        renderView: function () {
            var $w = $("<div></div>");
            $w.append(this.data["content"]);
            if ($w.find("script").size() > 0) {
                $w.find("script").remove();
                this.data["content"] = $w.html();
            }
            this.$viewEl.html($w.html());
        }

    });


});