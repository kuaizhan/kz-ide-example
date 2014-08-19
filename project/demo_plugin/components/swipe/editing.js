/*
 组件类定义。
 */
define(['jquery', 'component', 'lib/mustache', 'utils/uiHelper'], function($, Component, mustache,uiHelper) {
    'use strict';



    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        html_edit:
            "<div class='mod-wedding-swipe'> \
                <div class='swipe-wrap'>      \
                     {{disp_items}}\
                </div>                                    \
            </div>",
        //输出到编辑视图窗口，此函数需要处理编辑视图的显示以及相关事件的绑定，注：编辑视图不建议绑定事件
        renderView: function() {
            var that =this;
            var data = $.extend(true,{},this.data);
            var col_count =this.data.class==="col3"?3:1;
            data.disp_items = function(){
                var html ="<div class='layout-"+that.data.class+"'>";
                for(var i=0;i<this.items.length;i++){
                   if(i%col_count===0&&i!==0){
                       html+="</div><div class='layout-"+that.data.class+"'>"
                   }
                   html+='<a class="pic-item"><img src="'+this.items[i].image+'"/></a>'
                }
                html+="</div>";
                return html;

            }
            console.log(data);
            this.$viewEl.html(mustache.render(this.html_edit, data));
        },
        getData:function(){
            this.data.items_txt =JSON.stringify(this.data.items);
            return Component.prototype.getData.apply(this,arguments);
        },
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        renderConfigurator: function() {
            var that =this;
            uiHelper.createConfiguartor(this);
            this.listen("items", function(e, v) {
                var v = $.evalJSON(v);

                that.data['items'] = v;
                that.data['items'].forEach(function(m){
                    m.image = m.image.replace(/\d+-\d+$/, '640-0')
                });
                that.renderView();
            });
            this.listen("class",function(e,v){
               that.data["class"] = v;
                that.renderView();
            });
        },
        listen: function (name, fn) {

            this.$configEl.delegate('[name="' + name + '"] ', 'change', fn);
            return this;
        }
    });
});