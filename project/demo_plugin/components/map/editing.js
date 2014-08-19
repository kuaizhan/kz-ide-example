/*
 组件类定义。

 依赖关系说明：

 jquery: 工具类，如果需要Jquery 库，需要在define中引用
 component: 组件基础类，所有组件必须继承自此类
 lib/mustache: mustache库，用于进行模板渲染
 utils/uiHelper: 用于将Package.json中的widgets 渲染为页面的配置窗口的工具
 baiduMapApi: 百度地图开放平台的JS资源，由于资源非AMD加载，所以加载后将在window对象下


 */
define(['jquery', 'component', 'lib/mustache','utils/uiHelper', 'baiduMapApi'], function($, Component, mustache,uiHelper) {
    'use strict';

    /*
    * 自定义baiduMap对象，实现地图查询等操作
    * @component 地图组件的实例对象
    * */
    var baiduMap = function(component) {
        this.component = component;
        this.map = new BMap.Map(component.$configEl.find("#map")[0], {"enableMapClick": false});
        this.map.enableScrollWheelZoom();
        this.myIcon = new BMap.Icon("http://7bede40ef4e00.cdn.sohucs.com/defc4f288e402d0777f28adaeac3c6f1", new BMap.Size(19, 30), {
            anchor: new BMap.Size(9, 33)
        });
        this.lng = parseFloat(this.component.data["lng"]);
        this.lat = parseFloat(this.component.data["lat"]);
        this.zoom = parseInt(this.component.data["zoom"]);
    };

    baiduMap.prototype.mapModuleShow = function() {
        var that = this;
        var lng = this.lng;
        var lat = this.lat;
        var zoom = this.zoom;
        var point = new BMap.Point(lng, lat);
        this.map.centerAndZoom(point, zoom);

        this.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));


        // var preMarker = new BMap.Marker(point);
        // map.addOverlay(preMarker);
        this.map.clearOverlays();
        var marker = new BMap.Marker(point, {icon: this.myIcon});
        setTimeout(function() {
            that.map.addOverlay(marker);
        }, 1000);
        this.map.addEventListener("click", function(e) {
            if (!e.overlay) {
                that.map.clearOverlays();
                var marker = new BMap.Marker(e.point, {icon: that.myIcon});

                that.map.addOverlay(marker);
                that.lng = e.point.lng;
                that.lat = e.point.lat;
                that.component.data = {"lng": that.lng, "lat": that.lat, "zoom": that.map.getZoom()};
                that.component.renderView();
            }
        });
        this.map.addEventListener("zoomend", function(e) {

            that.component.data = {"lng": that.lng, "lat": that.lat, "zoom": that.map.getZoom()};
            that.component.renderView();
        });
    };
    baiduMap.prototype.mapSearch = function() {
        var that = this;
        var ele = this.component.$configEl,
                val = ele.find('input[type="text"]').val(),
                btn = ele.find('input.btn-assist');

        btn.val("搜索中...");
        ele.find(".tip-error").hide();

        var myGeo = new BMap.Geocoder();
        myGeo.getPoint(val, function(point) {
            if (point) {
                ele.find(".tip-error").hide();
                ele.find(".tip-input").show();
                that.map.centerAndZoom(point, 15);
                that.map.clearOverlays();
                that.map.addOverlay(new BMap.Marker(point, {icon: that.myIcon}));
                that.lng = point.lng;
                that.lat = point.lat;
                that.zoom = that.map.getZoom();
                // ================点击marker之后把data搞过来
                that.component.data = {"lng": point.lng, "lat": point.lat, "zoom": that.map.getZoom()};
                that.component.renderView();

            } else {
                ele.find(".tip-error").css("display", "inline-block");
                ele.find(".tip-error").show();
                ele.find(".tip-input").hide();
            }
            ;

            btn.val("搜索");
        });
    };


    //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
    return Component.extend({
        "html_edit": "<div class=\"mod mod-map\" style='margin:{{margin-top}} {{margin-right}} {{margin-bottom}} {{margin-left}};' data-map=\"{'lat':'{{lat}}','lng':'{{lng}}','zoom':'{{zoom}}'}\"><img style=\"width:100%;height:auto;display:block;margin-left:auto;margin-right:auto;\" src=\"http://api.map.baidu.com/staticimage?width=320&height=240&center={{lng}},{{lat}}&zoom={{zoom}}&markers={{lng}},{{lat}}&markerStyles=-1,#plack_mark#,-1\"/></div>",
        //输出到配置窗口，事件绑定使用$el.delegate 绑定，当删除$el时同时删除对应事件
        "config_edit": '   <div class="config-map">            \
      <div class="hd">                                                    \
    <strong>搜地址：</strong><input type="text" maxlength="100" id="addr">  \
    <input type="button" class="btn btn-assist" value="搜索">             \
    </div>                                                                \
    <span class="tip-input">                                               \
    <img src="{{tip-light}}" alt="" />&nbsp;&nbsp;请输入地址, 例如: 中关村东路80号 \
    </span>                                                                                                            \
    <span class="tip-error">                                                                                           \
    <img src="{{tip-error}}" alt="" />&nbsp;&nbsp;没有找到该地址, 请重新输入       \
    </span>                                                                                                            \
    <span class="tip-word">鼠标点击下方图区, 标注目标位置</span>                                                           \
  <div id="map"></div>                                                                                                \
 </div>',
        renderView: function() {

            this.html_edit = this.html_edit.replace("#place_mark#", "http://7bede40ef4e00.cdn.sohucs.com/defc4f288e402d0777f28adaeac3c6f1");
            this.$viewEl.html(mustache.render(this.html_edit,this.getData()));
        },
        renderConfigurator: function() {
            var panels =uiHelper.createConfiguartor(this);

            panels.$propertyPanel.html(mustache.render(this.config_edit, {"tip-light": "http://7bede40ef4e00.cdn.sohucs.com/7c95a96a13b65cb950f1d9f27243e573", "tip-error": "http://7bede40ef4e00.cdn.sohucs.com/8addad44d3b0639885306624cb4357aa"}));
            panels.$propertyPanel.find(".tip-error").hide();
            var map = new baiduMap(this);
            map.mapModuleShow();
            this.$configEl.delegate(".btn-assist", "click", function() {
                map.mapSearch();
            });

        }
    });

});
