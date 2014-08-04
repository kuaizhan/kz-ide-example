/*
 组件类定义。
 */
define(['jquery', 'configurableComponent', 'lib/mustache', 'ui'], function($, Component, mustache, ui) {
    'use strict';
    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        html_edit: '<div class=\"mod mod-divider\" style="margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};"><hr style=\"width:{{width}}\"></div>',
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        renderConfigurator: function() {
            Component.prototype.renderConfigurator.apply(this,[{column:"style"}]);
            this.listen("width", "%");
            this.listenMargin();
        }
    });

});