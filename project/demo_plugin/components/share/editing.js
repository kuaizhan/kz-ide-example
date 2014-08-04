/*
 组件类定义。
 */
define(['jquery', 'configurableComponent', 'lib/mustache', 'ui'], function($, Component, mustache, ui) {
    'use strict';
    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        "html_edit": "<div class=\"mod mod-share\" style=\"margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};\">    <span class=\"hd\">分享</span>    {{#qzone}}<a href=\"javascript:void(0)\" class=\"qzone\" title=\"分享到QQ空间\"></a>{{/qzone}}    {{#sina}}<a href=\"javascript:void(0)\" class=\"sina\" title=\"分享到新浪微博\"></a>{{/sina}}    {{#renren}}<a href=\"javascript:void(0)\" class=\"renren\" title=\"分享到人人\"></a>{{/renren}}    {{#sohu}}<a href=\"javascript:void(0)\" class=\"sohu\" title=\"分享到搜狐微博\"></a>{{/sohu}}</div>",
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        renderConfigurator: function() {
            Component.prototype.renderConfigurator.apply(this, [{column: "style"}]);
            this.listenMargin();
        }
    });


});
