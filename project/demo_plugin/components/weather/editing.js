/**
 * Created by Administrator on 2014/9/18.
 */
define(["jquery", "component", 'lib/mustache', 'utils/uiHelper'], function ($, Component, mustache, uiHelper) {
        'user strict';
        var search = function (that) {
						console.log(that);
            var cityUrl = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
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
                            var _tr = $(that.$viewEl).find(".weather_ul").find("li");
                            var _td = $(that.$viewEl).find(".weather_ul_today").find("li");
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
        };
        return Component.extend({
            "html_edit": '<div class="weather" style="text-align: center;height: {{height}};color:{{text_color}};background: -webkit-gradient(linear, 0 0, 0 100%, from({{color}}), to({{color2}}));">{{style}}</div > ',
            renderConfigurator: function () {
                var that = this;
                uiHelper.createConfiguartor(this);
                search(that);
                this.listen("color", function (ev) {
                    that.data["color"] = ev.target.value;
                    that.renderView();
                    search(that);
                });
                this.listen("color2", function (ev) {
                    that.data["color2"] = ev.target.value;
                    that.renderView();
                    search(that);
                });
                this.listen("text_color", function (ev) {
                    that.data["text_color"] = ev.target.value;
                    that.renderView();
                    search(that);
                });
            },
            listen: function (name, fn) {
                this.$configEl.delegate('[name="' + name + '"]', "change", fn);
                return this;
            },

            renderView: function () {
                this.$viewEl.html(mustache.render(this.html_edit, this.getData()));
            }
        });
    }
)
;
