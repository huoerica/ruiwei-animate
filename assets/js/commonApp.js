//设置wrapper的最小高度
winH = $(window).height();
function setWrapper() {
    var header = $('.site-navbar').length > 0 ? $('.site-navbar').outerHeight(true) : 0;
    var footer = $('footer').length > 0 ? $('footer').outerHeight(true) : 0;
    $('body>.body-wrapper').css({
        minHeight: winH - (header + footer),
        marginTop: header
    })
}
//企业概况图片高度
function equalHeight(node) {
    // var h = $(node).height();
    $(node).parent().children("div").css({height: $(node).parent().outerHeight(true) + "px"});
    // $(node).siblings().css({height: $(node).outerHeight(true) + "px"});
}
$(function () {
    setWrapper();
    equalHeight("#view-img>img");
});
$(window).resize(function () {
    winH = $(window).height();
    setWrapper();
    equalHeight("#view-img>img");
});

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

// el:元素，callback，要执行的回调，enter_distance:进入可视区域 *px后执行回调
function show_animate(el, config) {
    var evt = {};
    evt.el = el;

    config = $.extend({
        enter: function () {
        },
        out: function () {
        },
        enter_distance: 0,
        out_distance: 0
    }, config);

    evt.enter = config.enter;
    evt.out = config.out;
    evt.enter_distance = config.enter_distance;
    evt.out_distance = config.out_distance;

    if (!evt.el) {
        throw "el is undefined, show_animate(el,config)";
    }
    if ($(evt.el).length == 0) {
        console.warn("Cannot find el:" + evt.el);
        return;
    }

    var win_height = $(window).height();
    var win_scroll_top;
    var el_top = $(evt.el).offset().top;
    var el_height = $(evt.el).outerHeight();

    var animate_init = function () {
        win_scroll_top = $(window).scrollTop();

        var enter_bl = win_scroll_top + win_height >= el_top + evt.enter_distance;
        var out_bl = win_scroll_top + evt.out_distance >= el_height + el_top;
        var init_in = win_height > el_top + el_height;

        // 进入
        if (enter_bl && !out_bl && win_scroll_top > 0) {
            evt.enter(evt);
        }
        // 初始化进入
        if (init_in) {
            evt.enter(evt);
        }
        // 离开
        if (out_bl) {
            evt.out(evt);
        }
    };
    animate_init();
    $(window).on("scroll", function () {
        animate_init();
    });

    $(window).on("resize", function () {
        win_height = $(window).height();
        el_top = $(evt.el).offset().top;
        el_height = $(evt.el).outerHeight();
    });
}
// 进入视图区域执行动画
(function ($) {
    //
    $(function () {
        $.each($("[data-rw='animate']"), function (i, v) {
            show_animate(v, {
                enter: function (evt) {
                    var el = $(evt.el);
                    el.addClass(el.data("animate") + ' animated');
                    var css = {
                        'animation-duration': el.data("duration"),
                        '-webkit-animation-duration': el.data("duration"),
                        'animation-delay': el.data("delay"),
                        '-webkit-animation-delay': el.data("delay")
                    };
                    el.css(css);
                }
            });
        });
    });
})(jQuery);

// 自定义tab页面效果
(function ($) {
    $.fn.extend({
        position: function (index) {
            // 用于定位当前索引为index的tab
            index = index || 0;
            var that = this;

            var $panes = this.find(".tabs-panel .tab-panel");
            var width = this.find(".tabs-panel").outerWidth();

            // 初始化定位
            for (var i = 0, len = $panes.length; i < len; i++) {
                var css = {'position': 'absolute', 'top': '0px', 'left': '0px'};
                css.left = width * (i - index) + 'px';
                $($panes[i]).css(css);
            }

            $(window).on("scroll", function () {
                that.find(".tabs-panel").css('height', that.find(".tab-panel.active").outerHeight() + 'px');
            });
            setTimeout(function () {
                that.find(".tabs-panel").css('height', $panes.eq(index).outerHeight() + 'px');
            },0);

            // 将左右两边的tabs动画去除


            setTimeout(function () {
                var $others = $panes.eq(index).siblings(".tab-panel").find("[data-rw='animate']");
                // console.log($others)
                var $otherscss = {
                    'animation-duration': "initial",
                    '-webkit-animation-duration': "initial",
                    'animation-delay': "initial",
                    '-webkit-animation-delay': "initial"
                };
                $.each($others, function (i, v) {
                    $(v).removeClass($(v).data("animate") + ' animated');
                    $(v).css($otherscss);
                });
            },500);
        },
        tabinit: function () {
            var that = this;
            if (!that.length) {
                console.error(this.get(0).id + "is not a 'tabs-container'");
                return false;
            }
            var href = location.hash;

            // 定位上一个tab
            if (href != "") {
                var $a = that.find("a[data-href='" + href + "']");
                var $tab = that.find(".tab-panel[data-role='" + href.split('#')[1] + "']");

                if ($a.length) {
                    $a.addClass("active");
                    $a.siblings().removeClass("active");
                }
                if ($tab.length) {
                    $tab.addClass("active");
                    $tab.siblings().removeClass("active");
                }

                // 定位到已选tab
                that.position($a.index());
            }
            // 正常tab初始化
            else {
                that.position();
            }

            var slide = function (index, lastIndex) {
                var width = that.find(".tabs-panel").outerWidth();
                var $panes = that.find(".tab-panel");

                that.find(".tabs-panel").css('height', $panes.eq(index).outerHeight() + 'px');

                // 从右向左
                if (index > lastIndex) {
                    // 归位
                    $panes.eq(index).addClass("active").css({'left': width + "px"});
                    // 走
                    $panes.eq(lastIndex).animate({"left": -width + "px", 'z-index': '10'}, 500);
                }
                // 从左向右
                if (index < lastIndex) {
                    // 归位
                    $panes.eq(index).addClass("active").css({'left': -width + "px"});
                    // 走
                    $panes.eq(lastIndex).animate({"left": width + "px", 'z-index': '10'}, 500);
                }
                // 进来
                $panes.eq(index).animate({"left": "0"}, 500);

                // 同步
                // 执行动画开始
                var $target = $panes.eq(index).find("[data-rw='animate']");
                $.each($target, function (i, v) {
                    $(v).addClass($(v).data("animate") + ' animated');
                    var css = {
                        'animation-duration': $(v).data("duration"),
                        '-webkit-animation-duration': $(v).data("duration"),
                        'animation-delay': $(v).data("delay"),
                        '-webkit-animation-delay': $(v).data("delay")
                    };
                    $(v).css(css);
                });
                // 执行动画结束

                // 500ms动画结束后
                setTimeout(function () {
                    $panes.eq(index).addClass("active"); // 并非每次都执行，需要保留
                    $panes.eq(index).siblings().removeClass("active");

                    // 取消上一tab的动画
                    var $lastTarget = $panes.eq(lastIndex).find("[data-rw='animate']");
                    var css = {
                        'animation-duration': "initial",
                        '-webkit-animation-duration': "initial",
                        'animation-delay': "initial",
                        '-webkit-animation-delay': "initial"
                    };
                    $.each($lastTarget, function (i, v) {
                        $(v).removeClass($(v).data("animate") + ' animated');
                        $(v).css(css);
                    });
                }, 500);
            };

            // 事件绑定
            that.find('.nav-item').on("click", function () {
                var index = $(this).index();
                var lastIndex = $(".tab-panel.active").index();
                if (index != lastIndex) {
                    slide(index, lastIndex);
                }
                // that.position(index);

                $(this).addClass("active");
                $(this).siblings().removeClass("active");
                location.hash = $(this).data("href");
            });
            $(window).on("resize", function () {
                that.position($('.nav-item.active').index());
            });
        }
    });
})(jQuery);




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