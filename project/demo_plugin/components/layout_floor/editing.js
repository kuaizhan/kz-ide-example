/*
 组件类定义。
 */
define(['jquery', 'component', 'lib/mustache', 'utils/uiHelper'], function ($, Component, mustache, uiHelper) {
    'use strict';

    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        html_edit: '<div class=\"mod sub_container mod-wedding-floor {{class}}\" style=\"height:{{height}};\">{{content}}</div>',

        //输出到编辑视图窗口，此函数需要处理编辑视图的显示以及相关事件的绑定，注：编辑视图不建议绑定事件
        renderView: function () {
            //因为renderView可以多次调用，为了防止重新渲染容器内组件丢失，需要检查，如果已有容器，清理容器内的组件。
            if (this.subComponentContainers) {
                for (var n in this.subComponentContainers) {
                    this.subComponentContainers[n].clear();
                }
            }
            //重新渲染容器外框
            this.$viewEl.html(mustache.render(this.html_edit, this.getData()));

            //setComponentContainer,可以设置一个dom为可以拖入子控件的外框，acceptRole设置子控件可以接收子控件的列表
            this.setComponentContainer(
                this.$viewEl.find('.sub_container').toArray(), "sub-container",
                {
                    //在添加子组件之前执行，用于检查是否允许此组件被添加到子模块下。如果允许，返回true,否则返回false
                    acceptRole: function () {
                        return true;
                    }
                }
            );

        },
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        renderConfigurator: function () {
            var that = this;
            //使用 uiHelper 根据 package.json 的 widgets 创建配置窗口的UI
            uiHelper.createConfiguartor(this);

            //监听class 的事件修改data的class 值
            this.listen("class", function (ev) {
                that.data["class"] = ev.target.value;
                that.renderView();
            });
            //监听height 的输入值
            this.listen("height", function (ev) {
                that.data["height"] = ev.target.value;
                that.renderView();
            });
        },
        //监听配置窗口 name 的 change 事件
        listen: function (name, fn) {

            this.$configEl.delegate('[name="' + name + '"] ', 'change', fn);
            return this;
        },
        //不需要验证.return true;
        isValid: function () {
            return true;
        }
    });


});
