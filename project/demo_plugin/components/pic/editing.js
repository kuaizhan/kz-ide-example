/*
 组件类定义。
 */
define(['jquery', 'configurableComponent', 'ui', 'vd'], function($, Component, ui, vd) {
    'use strict';

    function processDefault(item) {
        if (item.image.indexOf("/res/") === 0) {
            item.image = SOHUZ.staticurl + item.image;
        }
        return item;
    }

    function filterDefault(item) {
        if (item.image.indexOf("/res/") === 0) {
            return null;
        }
        return item;
    }

    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        html_edit:
                '<div class="mod mod-pic mod-picone" style="margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};">\
                    <a href="javascript:;">\
                        <img src="{{image}}" title="{{alt}}" height="{{height}}" data-imgid="{{image_id}}" fit="{{fit}}">\
                    </a>\
                </div>',
        //输出到编辑视图窗口，此函数需要处理编辑视图的显示以及相关事件的绑定，注：编辑视图不建议绑定事件
        renderView: function() {
            var data = {}, d = this.getDefaults();
            $.extend(data, this.data);

            data = processDefault(data);
            this.$viewEl.html(ui.render(this.html_edit, data));
        },
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        renderConfigurator: function() {
            Component.prototype.renderConfigurator.apply(this);

            var
                    m = this,
                    p = m.$propertyPanel,
                    d = this.getDefaults(),
                    data = {};

            $.extend(data, this.data);
            data = filterDefault(data);

            var html = ui.picedit.create({
                name: "items",
                value: data ? [data] : [],
                edit_desc: false,
                edit_link: true,
                mode: 1
            });

            p.find(".js-field-image").replaceWith(
                    ui.createRow({
                        title: "",
                        content: html
                    }));

            //rm ui placehoders
            p.find(".ui-placeholder").remove();

            //bind events
            ui.picedit.init(p);

            this.listenMargin();
            this.listen("items", "", function(e, v) {
                var v = $.evalJSON(v), d;
                if (v.length > 0) {
                    d = v[0];
                    d.image = d.image.replace(/\d+-\d+$/, '640-0');
                    $.extend(m.data, d);
                } else {
                    m.data = m.getDefaults();
                }
                m.renderView();
            });
        }
    });
});