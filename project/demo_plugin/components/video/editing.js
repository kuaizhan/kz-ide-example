/*
 组件类定义。
 */
define(['jquery', 'configurableComponent', 'lib/mustache', 'ui', 'vd'], function($, Component, mustache, ui, vd) {
    'use strict';

    var client_id = "38639cd3423bbe7b";
    var videoApi = {
        youku: {
            getVideo: function(url, cb) {
                $.ajax({
                    url: "https://openapi.youku.com/v2/videos/show_basic.json?callback=?",
                    dataType: "jsonp",
                    data: {
                        client_id: client_id, video_url: url
                    },
                    complete: cb
                })
            },
            getPlayerHtmlMobile: function(data) {
                var width = window.document.documentElement.clientWidth - 20;
                var height = Math.round(width * 498 / 510);
                return '<iframe height=' + height + ' width=100% src="http://player.youku.com/embed/' + data.id + '" frameborder=0 allowfullscreen>iframe</iframe>';
            }
        },
        tudou: {
            getVideo: function(url, cb) {
                $.ajax({
                    url: "/video/ajax-get-tudou-info",
                    dataType: "json",
                    data: {url: url},
                    success: cb
                })

            },
            getPlayerHtmlMobile: function(data) {
                var width = window.document.documentElement.clientWidth - 20;
                var height = Math.round(width * 400 / 480);
                return '<iframe src="' + data.itemInfo.outerGPlayerUrl + '" allowtransparency="true" scrolling="no" border="0" frameborder="0" style="width:100%;height:' + height + 'px;"></iframe>'
            }

        }
    };
    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        html_edit: "<div class='mod mod-video'><div class='video-play-icon edit-mod'>{{#image}}<img src='{{image}}' class='pic'>{{/image}}<div class='play-icon'><img src='http://s0.kuaizhan.com/res/skin/images/video-play.png'></div></div></div>",
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        config_edit: '<div class="form-row video-edit">\
                            <label>视频地址</label>\
                            <div class="form-cell">\
                                <input type="text" name="video_path" placeholder="http://" value="{{url}}">\
                                <input name="btn_submit" class="confirm js-confirm" type="button" value="确定">\
                                <div class="tip tip-error next-line err">该地址为无效地址，请重新输入</div>\
                                <span class="tip tip-info next-line">支持优酷、土豆视频地址</span>\
                            </div>\
                        </div>',
        renderConfigurator: function() {
            var that = this;
            Component.prototype.renderConfigurator.apply(this, [
                {column: "property"}
            ]);
            this.$propertyPanel.html(ui.render(this.config_edit, this.data));

            var
                    w = this.$configEl,
                    row = w.find(".video-edit");

            w
                    .on('click', '[name="btn_submit"]', function() {
                        var url = row.find("[name='video_path']").val();

                        if (/^http:\/\/.*?tudou\.com\//ig.test(url)) {
                            videoApi.tudou.getVideo(url, function(data) {
                                if (data.ret == 0) {
                                    var d = data.data;
                                    that.data["image"] = d['image'];
                                    that.data["title"] = d['title'];
                                    that.data["video_type"] = d['type'];
                                    that.data["video_id"] = d['id'];
                                    that.data["video_url"] = d['play_url'];
                                    that.data["url"] = url;

                                    row.removeClass("error");
                                    that.renderView();
                                } else {
                                    row.addClass("error");
                                }
                            });
                        } else if (/^http:\/\/[^\/].*?youku\.com\//ig.test(url)) {
                            videoApi.youku.getVideo(url, function(o, status) {
                                if (status === "success") {
                                    var d = o.responseJSON;
                                    that.data['image'] = d['thumbnail_v2'];
                                    that.data["title"] = d['title'];
                                    that.data["video_type"] = "youku";
                                    that.data["video_id"] = d['id'];
                                    that.data["video_url"] = "http://player.youku.com/embed/" + d['id'];
                                    that.data["url"] = url;

                                    row.removeClass("error");
                                    that.renderView();
                                } else {
                                    row.addClass("error");
                                }
                            });
                        } else {
                            row.addClass("error");
                        }
                    });
        },
        isValid: function() {
            if (!this.data["video_id"] || !this.data["video_type"]) {
                return {message: "没有可以显示的视频"};
            }
            return true;
        }
    });
});

