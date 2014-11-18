define(['jquery'], function ($) {
    'use strict';
    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return {
        //输出到发布页面，当用户正式发布后，调用此函数创建视图。
        onAfterRender: function (el) {
            var cityUrl = "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js";
            var date = new Date();
            var day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日", "星期一", "星期二", "星期三", "星期四");
            $.getScript(cityUrl, function (script, textStatus, jqXHR) {
                    var citytq = remote_ip_info.city;// 获取城市
                    var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&city=" + citytq + "&dfc=3";
                    var tq = "";
                    var img1, img2;
                    var f, _f;
                    $.ajax({
                        url: url,
                        dataType: "script",
                        scriptCharset: "gbk",
                        data: {
                            "day": 3
                        },
                        success: function (data) {
                            var _w = window.SWther.w[citytq];
                            var i = 0;
                            var _tr = $(el).find(".weather_ul").find("li");
                            var _td = $(el).find(".weather_ul_today").find("li");
                            console.log("a");
                            for (var key in _w) {
                                if (key == 0) {
                                    $(_td[0]).html("&nbsp&nbsp" + citytq);
                                    if (new Date().getHours() > 17) {
                                        f = _w[key].f1 + "_1.png";
                                        img1 = "<img width='80px' height='80px' src='http://php.weather.sina.com.cn/images/yb3/180_180/" + f + "'/>";
                                        $(_td[1]).html("&nbsp&nbsp&nbsp&nbsp" + img1);
                                        $(_td[2]).html("&nbsp&nbsp&nbsp&nbsp" + day[date.getDay() + i] + "&nbsp&nbsp" + _w[key].s2);
                                        $(_td[3]).html("&nbsp&nbsp&nbsp&nbsp" + _w[key].t1 + "℃～" + _w[key].t2 + "℃");
                                    }
                                    else {
                                        f = _w[key].f1 + "_0.png";
                                        img1 = "<img width='70px' height='70px' src='http://php.weather.sina.com.cn/images/yb3/180_180/" + f + "'/>";
                                        $(_td[1]).html("&nbsp&nbsp&nbsp&nbsp" + img1);
                                        $(_td[2]).html("&nbsp&nbsp&nbsp&nbsp" + day[date.getDay() + i] + "&nbsp&nbsp");
                                        $(_td[3]).html("&nbsp&nbsp&nbsp&nbsp" + _w[key].s1 + "&nbsp&nbsp" + _w[key].t2 + "℃～" + _w[key].t1 + "℃");
                                    }
                                    $(_td[4]).html("&nbsp&nbsp&nbsp&nbsp" + _w[key].d1 + _w[key].p1 + "级");
                                }
                                else {
                                    f = _w[key].f1 + "_0.png";
                                    _f = _w[key].f2 + "_0.png";
                                    if (new Date().getHours() > 17) {
                                        f = _w[key].f1 + "_1.png";
                                        _f = _w[key].f2 + "_1.png";
                                    }
                                    img1 = "<img width='32px' height='32px' src='http://php.weather.sina.com.cn/images/yb3/78_78/" + f + "'/>";
                                    img2 = "<img width='32px' height='32px' src='http://php.weather.sina.com.cn/images/yb3/78_78/" + _f + "'/>"
                                    tq = day[date.getDay() + i] + " " + img1 + " " + _w[key].s1 + "&nbsp&nbsp" + _w[key].t1 + "℃～" + _w[key].t2 + "℃  " + "&nbsp";
                                    $(_tr[i - 1]).html(tq);
                                }
                                i++;
                            }
                        }
                    });
                }
            );
        }
    }
});
