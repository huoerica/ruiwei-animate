//设置wrapper的最小高度
winH = $(window).height();
function setWrapper() {
    var header = $('.site-navbar').length > 0 ? $('.site-navbar').outerHeight(true) : 0;
    var footer = $('footer').length > 0 ? $('footer').outerHeight(true) : 0;
    $('body>.body-wrapper').css({
        minHeight: winH - footer,
        paddingTop: header
    })
}
//企业概况图片高度
function equalHeight(node) {
    var h = $(node).height();console.log(h);
    $(node).parent().children("div").css({height: $(node).outerHeight(true) + "px"});
}
//设置cookie
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + '=' + escape(value) +
        ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
}
//获取cookie
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + '=');
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(';', c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return 'SCN';
}
//tabs切换页
var tabs_slide = function () {
    var offset = {start: null,end : 0, left: 0, result: 0};
    var tabs_nav_width = 0, win_width = $(window).width();
    var $width = $(".tabs-container .tabs-nav-inner").outerWidth(); // 前提，页面只有一个有效的tab组件

    // 如果tabs的宽度比屏幕窄
    if($width <= win_width){
        $(".tabs-container .tabs-nav-inner").css('left',(win_width - $width)/2 + 'px');
    }else{
        // 滑动
        $(".tabs-container .tabs-nav-inner").on("touchstart mousedown", function (e) {
            var that = $(this); tabs_nav_width = that.outerWidth();
            offset.left = that.offset().left;
            var evt = e || window.event;
            if(evt.type == 'touchstart' && evt.touches.length == 1){
                offset.start = evt.touches[0].clientX;
            }else{
                offset.start = evt.clientX;
            }
        });

        // end > start 则后移
        $(".tabs-container .tabs-nav-inner").on("touchmove mousemove", function (e) {
            if(offset.start == null){return false;}
            var that = $(this);
            var evt = e || window.event;
            if(evt.type == 'touchmove' && evt.touches.length == 1){
                offset.end = evt.touches[0].clientX;
            }
            if(evt.type == 'mousemove'){
                offset.end = evt.clientX;
            }
            offset.result = offset.left + offset.end - offset.start;
            offset.result = offset.result >= 0 ? 0 : (-offset.result >= tabs_nav_width - win_width ? -(tabs_nav_width - win_width) : offset.result);

            that.css("left", offset.result +"px");
        });

        $(".tabs-container .tabs-nav-inner").on("touchend mouseup", function (e) {
            offset.start = null;
        });
    }
};

$(function () {
    setWrapper();
    equalHeight("#view-img>img");

    // 滚动加阴影
    var ban_height = $(".banner-container").outerHeight() || 20;
    $(window).on("scroll", function () {
        if($(window).scrollTop() >= ban_height){
            $("nav.navbar-inverse").addClass("box-shadow");
        }else{
            $("nav.navbar-inverse").removeClass("box-shadow");
        }
    });

    //tabs切换页
    tabs_slide();
    // $(".tabs-panel").height($(".tab-panel.active").outerHeight());
    // tabs.active滑动到正中间
    var tabs_position = function (tab) {
        var this_left = tab.offset().left,
            this_width = tab.outerWidth(),
            win_width = $(window).width(),
            tas_width = tab.parent().outerWidth();

        if(this_width/2 + this_left != win_width/2 && tas_width >= win_width){
            var offset_left = tab.parent().offset().left + (win_width/2 - (this_width/2 + this_left));
            offset_left = offset_left > 0 ? 0 : offset_left < -(tas_width - win_width) ? win_width - tas_width : offset_left;
            tab.parent().animate({'left': offset_left + 'px'},300);
        }
    };

    $(".tabs-container .nav-item").on("click", function () {
        var that = $(this);
        that.addClass("active");
        that.siblings(".nav-item").removeClass("active");
        var target = that.data("href").replace("#","");
        var target_pane = $(".tab-panel[data-role="+ target +"]");

        // target_pane.show().addClass("scaleIn");
        target_pane.show().addClass("active");
        target_pane.siblings().hide();

        tabs_position(that);

        var id = location.hash || "";
        if(id != ''){
            $("[data-role='"+ id.replace('#',"") +"']").find(".av-container").each(function (i, v) {
                $(v).removeClass("av-visible animated " + $(v).attr('data-animate'));
            });
        }
        $(window).scrollTop($(window).scrollTop()+1);
        $(window).scrollTop($(window).scrollTop()-1);
        location.hash = that.data("href");
    });
    // 重置到上次点击的tab
    var target = location.hash;
    if(target != ""){
        var tar_tab = $('[data-href="'+ target +'"]');
        if(tar_tab.length && tar_tab.index() > 0){
            tar_tab.click();
        }
    }
});
$(window).resize(function () {
    winH = $(window).height();
    setWrapper();
    equalHeight("#view-img>img");
    tabs_slide();
});

var commonApp = angular.module("commonApp", [])
    .run(function ($rootScope) {
        //语言初始化
        $rootScope.initLanguage = function (code) {
            $rootScope.language = code;
            if (code == "EN") {
                $rootScope.catalog = catalog.EN;
            } else if (code == "TCN") {
                $rootScope.catalog = catalog.TCN;
            } else {
                $rootScope.catalog = catalog.SCN;
            }
            setTimeout(function () {
                setWrapper();
                $('[data-rw="animate"]').AniView();
                tabs_slide();
            },100);
        };
        $rootScope.initLanguage(getCookie("language"));


        //检测客户端是否是移动端
        $rootScope.clientType = function () {
            $rootScope.clientFlag = false;
            // console.log(navigator.userAgent.toLowerCase());
            if (navigator.userAgent.toLowerCase().match(/(iphone|ipod|rv:1.2.3.4|ucweb|android|windows mobile|windows ce)/i)) {
                $rootScope.clientFlag = true;
            }
        };
        $rootScope.clientType();
    })
    .directive('errSrc', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('error',
                    function () {
                        if (attrs.src != attrs.errSrc) {
                            attrs.$set('src', attrs.errSrc);
                        }
                    }
                );
            }
        }
    })
    .filter('startFrom', function () {
        return function (input, start) {
            if (input) {
                start = +start; //parse to int
                return input.slice(start);
            }
            return [];
        }
    });