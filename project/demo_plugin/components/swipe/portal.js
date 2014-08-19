define(['zepto', 'swipe'], function ($, Swipe) {
    'use strict';
    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return {
        //输出到发布页面，当用户正式发布后，调用此函数创建视图。
        onAfterRender: function (el, window, document) {
            var items = $(el).data("items");
            var col = $(el).data("class");
            var html = "<div class='layout-"+col+"'>";
            var col_count =col==="col3"?3:1;
            for (var i = 0; i < items.length; i++) {
                if (i % col_count === 0 && i !== 0) {
                    html += "</div><div class='layout-"+col+"'>"
                }
                html += '<a class="pic-item"><img src="' + items[i].image + '"/></a>'
            }
            html += "</div>";

            $(el).find(".swipe-wrap").html(html);
            if(items.length<=col_count){
                return;
            }
            Swipe(el, {
                startSlide:0,
                speed: 400,
                auto: 3000,
                continuous: false,
                disableScroll: false,
                stopPropagation: false,
                callback: function (index, elem) {
                },
                transitionEnd: function (index, elem) {
                }
            }, window, document);
        }
    }
});
