define(['jquery', 'component', 'lib/mustache', 'ui','utils/uiHelper'], function($, Component, mustache, ui,uiHelper) {
    'use strict';
    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置


    return Component.extend({
        html_edit: '{{#t0}}<div class=\"mod mod-traffic_exchange\"  style=\"margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};\"> <div class=\"text\"><a href=\"javascript:void\" type=\"text\">推广位将会展示来自其他站点的推广信息</a></div><div></div></div>{{/t0}}\
    {{#t1}} <div style="margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};"> <a href=\"javascript:void\"><img src=\"http://traffic-exchange.kuaizhan.com/static/image/sample.png\" /> </a></div>{{/t1}}',
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        renderView:function(){
            this.$viewEl.html(mustache.render(this.html_edit,this.getData()));
        },
        renderConfigurator: function() {
            var that = this;
            var panels  = uiHelper.createConfiguartor(this);

            var t = this.data.t0 ? "t0" : this.data.t1 ? "t1" : "";
            var options = [],
                    o = [{
                            "t0": true,
                            "title": "标题文字",
                            value: "t0",
                            "content": "<div class=\"traffic-exchange\"  style=\"\"> <div class=\"text\"><a href=\"javascript:void\" type=\"text\">推广位将会展示来自其他站点的推广信息</a></div><div></div></div>"
                        }, {
                            "t1": true,
                            "title": "标题文字",
                            value: "t1",
                            "content": " <div> <a href=\"javascript:void\"><img src=\"http://traffic-exchange.kuaizhan.com/static/image/sample.png\" /> </a></div>"
                        }];
            for (var i in o) {
                options.push({
                    cur: t == o[i].value,
                    value: o[i].value,
                    content: o[i].content
                });
            }

            var typesel = ui.typeselect.create({
                name: "theme",
                options: options
            });

            panels.$stylePanel.prepend(
                    ui.createRow({
                        title: "推广位样式",
                        content: typesel
                    })
                    );
            panels.$stylePanel.append(
                    ui.createRow({
                        title: "",
                        content: "<a style=\"color: blue;\" href=\"/plugin/page-proxy/traffic-exchange/manage/?site_id=" + SOHUZ.page.site_id + "\">上传</a>本站推广信息，获得其他站点推荐！"
                    })
                    );
            ui.typeselect.init(this.$configEl);

            this.listen("theme", function(ev, v) {
                that.data["t0"] = that.data["t1"] = false;
                that.data[v] = true;
                that.renderView();
            });


        }, listen: function (name, fn) {
            this.$configEl.delegate('[name="' + name + '"] ', 'change',  fn);
            return this;
        }
    });
});
