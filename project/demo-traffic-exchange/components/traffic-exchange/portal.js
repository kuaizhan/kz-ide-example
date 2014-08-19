/*
 *发布后执行JS
 */
define(['zepto'], function($) {
    return {
        //输出到发布页面，当用户正式发布后，调用此函数创建视图。
        onAfterRender: function(el) {
            site_id = SOHUZ.page.site_id;
            url = "http://traffic-exchange.kuaizhan.com/ad/display/" + site_id + "/";
            $.getJSON(url + "?callback=?",
                function(json) {
                    var e = $(el);
                    if (json.code != 0) {
                        e.hide();
                        return;
                    }
                    var link = "http://traffic-exchange.kuaizhan.com/ad/click/" + site_id + "/" + json.data.site_id + "/";

                    var a = e.find('a');
                    if (a.attr("type") == "text") {
                        a.html("<div class=\"text\">" + json.data.text + "</div>");
                    } else {
                        if (!json.data.pic) {
                            e.attr("class", "traffic-exchange");
                            a.html("<div class=\"text\">" + json.data.text + "</div>");
                        } else {
                            a.find("img").attr("src", json.data.pic);
                        }
                    }
                    a.attr("href", link);
                });
        }
    }
});
