/*
 组件类定义。
 */
define(['jquery', 'component','lib/mustache','utils/uiHelper'], function($, Component,mustache,uiHelper) {
    'use strict';
    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        html_edit: '<div class=\"mod mod-divider\" style="margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};"><hr style=\"width:{{width}}\"></div>',
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        renderConfigurator: function() {
            uiHelper.createConfiguartor(this);
            this.listen("width", "%");
        },
        listen: function (name, unit) {
            var that = this;
            this.$configEl.delegate('[name="' + name + '"] ', 'change',  function (ev) {
                var txt = $(ev.target).val();
                that.data[name] = txt + unit;
                that.renderView();
            });
            return this;
        },
        renderView:function(){
            this.$viewEl.html(mustache.render(this.html_edit,this.getData()));
        }
    });

});