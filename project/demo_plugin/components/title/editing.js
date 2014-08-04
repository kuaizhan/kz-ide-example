/*
 组件类定义。
 */
define(['jquery', 'configurableComponent', 'lib/mustache', 'ui', 'vd'], function($, Component, mustache, ui, vd) {
    'use strict';
    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        html_edit:
                '{{#t0}}<div class=\"mod mod-title t0 {{class}}\" style=\"margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};background-color:{{background}}\"><h2 class=\"module-edit\">{{title}}</h2></div>{{/t0}}\
                {{#t1}}    <div class=\"mod mod-title t1 {{class}}\" style=\"margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};background-color:{{background}}\"><h2 class=\"module-edit\">{{title}}</h2><i class=\"font-ico\"></i></div>{{/t1}}\
                {{#t2}}    <div class=\"mod mod-title t2 {{class}}\" style=\"margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};background-color:{{background}}\"><h2 class=\"module-edit\">{{title}}</h2><i class=\"font-ico\"></i></div>{{/t2}}\
                {{#t3}}    <div class=\"mod mod-title t3 {{class}}\" style=\"margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};background-color:{{background}}\"><h2 class=\"module-edit\">{{title}}</h2><i class=\"font-ico\"></i></div>{{/t3}}\
                {{#t4}}    <div class=\"mod mod-title t4 {{class}}\" style=\"margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};background-color:{{background}}\"><h2 class=\"module-edit\">{{title}}</h2><i class=\"font-ico\"></i></div>{{/t4}}',
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        renderConfigurator: function() {
            var that = this;
            Component.prototype.renderConfigurator.apply(this);

            var t = this.data.t0 ? "t0" : this.data.t1 ? "t1" : this.data.t2 ? "t2" : this.data.t3 ? "t3" : this.data.t4 ? "t4" : "";
            var options = [], o = [
                {"t0": true, "title": "标题文字", value: "t0"},
                {"t1": true, "title": "标题文字", value: "t1"},
                {"t2": true, "title": "标题文字", value: "t2"},
                {"t3": true, "title": "标题文字", value: "t3"},
                {"t4": true, "title": "标题文字", value: "t4"}
            ];
            for (var i in o) {
                options.push({
                    cur: t == o[i].value,
                    value: o[i].value,
                    content: ui.render(that.html_edit, o[i])
                });
            }

	        this.$propertyPanel.append(
		        ui.switchrow.create({
			        title: "链接",
			        name: "show-link",
			        value: that.data.show_link,
			        content: ui.linkselect.create({
				        name: "link_data",
				        value: {
					        link: this.data.link,
					        link_res_type: this.data.link_res_type,
					        link_res_id: this.data.link_res_id,
					        link_res_name: this.data.link_res_name
				        }

			        })
		        })
	        );
	        this.listen("show-link", "", function() {
		        if(this.value == "true"){
			        that.data['show_link'] = true;
		        }else{
			        that.data['show_link'] = false;
		        }
	        });
	        this.listen("link_data", "", function() {
		        var value = JSON.parse(this.value);
		        $.extend(that.data, value);
	        });
	        ui.linkselect.init(this.$configEl);

            var typesel = ui.typeselect.create({
                name: "theme",
                options: options
            });

            this.$stylePanel.prepend(
                    ui.createRow({
                        title: "样式选择",
                        content: typesel
                    }));
            ui.typeselect.init(this.$configEl);
            this.listenMargin();

            this.listen("title", "");
            this.listen("background", "");
            this.listen("theme", "", function(ev, v) {
                that.data["t0"] = that.data["t1"] = that.data["t2"] = that.data["t3"] = that.data["t4"] = false;
                that.data[v] = true;
                that.renderView();
            });

        },
        isValid: function() {
            var r = vd.validate(this.getData(), this._meta.data_config);
            this.$configEl.find(".form-row").removeClass("error");
	        this.$configEl.find(".vd-error").removeClass("vd-error");
            this.$configEl.find(".tip-error").remove();
            this.$configEl.find(".tip-info").hide();
            if (typeof r == "object") {
                var name = r.name,
                        msg = r.msg,
                        row = ui.form.findRow(this.$configEl, name);

                if (msg != "") {
                    ui.form.showError(row, msg);
                }
                return false;
            }

	        var m = this,
		        w  = m.$propertyPanel.find(".ui-linkselect"),
		        link_res_type = this.data['link_res_type'],
		        link_res_id = this.data['link_res_id'],
		        link = this.data['link'],
		        show_link = this.data['show_link'];
	        function checkLinkContent() {
		        switch (link_res_type) {
			        case 1://URL
			        case "1":
				        return (link != "");
				        break;
			        case 2://文章
			        case "2":
			        case 3://页面
			        case "3":
			        case 5://电商
			        case "5":
			        case 6://论坛
			        case "6":
				        return (link_res_id != "");
				        break;
		        }
	        }
	        if(show_link){
		        if (!link_res_type) {
			        w.find(".link-edit").find(".col-type .select").addClass("vd-error");
			        return {
				        message: "导航类型必须指定"
			        };
		        }
		        if (!checkLinkContent()) {
			        w.find(".link-edit").find(".col-link .select, .col-link :text").addClass("vd-error");
			        return {
				        message: "导航链接不能为空"
			        };
		        }
	        }

            this.$configEl.find(".tip-info").show();
            return true;
        }
    });
});