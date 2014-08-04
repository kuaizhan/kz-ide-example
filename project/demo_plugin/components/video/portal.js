define(['zepto'], function($) {
    'use strict';
    var
            height,
            videoApi = {
                youku: {
                    getPlayerHtmlMobile: function(width, data) {
                        return '<iframe class="video" src="' + data.url + '" frameborder=0 allowfullscreen allowtransparency="true" wmode="transparent">iframe</iframe>';
                    }
                },
                tudou: {
                    getPlayerHtmlMobile: function(width, data) {
                        return '<iframe class="video" src="' + data.url + '" allowtransparency="true" scrolling="no" border="0" frameborder="0" allowtransparency="true" wmode="transparent"></iframe>'
                    }
                }
            };

    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return {
        //输出到发布页面，当用户正式发布后，调用此函数创建视图。
        onAfterRender: function(el) {
            var $e = $(el),
                w = $e.parent().width(),
                type = $e.data("type"),
                url = $e.data("url");

            var f = $e.find("iframe");
            if (f.length == 0) {
                $e.append(
                    videoApi[type].getPlayerHtmlMobile(
                        w,
                        {url: url}
                    )
                );

                var ifel = $e.find("iframe.video");
                var height = ifel.width() / 4.0 * 3.0;
                ifel.attr('data-height', height);
                ifel.height(ifel.data('height'));

                $e.find(".video-play-icon")
                    .height(ifel.height())
                    .width(ifel.width());
            }
            $e.addClass("video-play");
        }
    }
});
