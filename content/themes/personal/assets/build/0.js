webpackJsonp([0],{

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Home_scss__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Home_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Home_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_inferno__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var top = 0,
    touchStart = -1,
    velocityLast = 0,
    touchLast = -1,
    touchDelta = -1,
    touchLastBuffer = -1,
    scrollStart = -1,
    touchLastTime = -1,
    opened = false,
    winHeight = window.innerHeight,
    content = null,
    wrapper = null,
    hero = null;


var Home = function (_Component) {
    _inherits(Home, _Component);

    function Home(props) {
        _classCallCheck(this, Home);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.updatePosition = function () {
            top = content.getBoundingClientRect().top;
        };
        _this.updateHeight = function () {
            wrapper.style.height = opened ? null : winHeight + 'px';
        };
        _this.dragRender = function () {
            var delta = touchLast - touchStart;
            var y = opened ? 0 : top + delta;
            var percent = y / (winHeight * 0.85);
            content.style.transform = 'translate3d(0, ' + y + 'px, 0)';
            hero.style.transform = 'translate3d(0, ' + -(1 - percent) * winHeight / 2 + 'px, 0)';
            hero.style.opacity = '' + Math.max(0, percent * 1.3 - 0.3);
        };
        _this.dragStart = function (e) {
            _this.updatePosition();
            touchStart = e.touches[0].clientY;
            touchLastTime = new Date().getTime();
            touchLast = touchStart;
            scrollStart = document.documentElement.scrollTop;
            hero.style.transition = content.style.transition = "no";
            _this.dragRender();
        };
        _this.dragEnd = function (e) {
            _this.calculateVelocity();
            var delta = touchLast - touchStart;
            var y = top + delta;
            touchStart = -1;
            touchLast = -1;
            var percent = y / (winHeight * 0.85);
            if (percent > 1) percent = 1 - (percent - 1);
            if (percent <= 0 || percent < 0.425 && !(velocityLast < -1) || velocityLast > 1) {
                opened = true;
                top = 0;
            } else {
                opened = false;
                top = winHeight * 0.85;
            }
            var animTime = (opened ? Math.abs(percent) : 1 - Math.abs(percent)) * 200 + 100;
            hero.style.transition = content.style.transition = 'all ' + animTime + 'ms cubic-bezier(0.1,' + Math.abs(velocityLast) * (0.1 * animTime) / Math.abs(y - top) + ',0.1,1)';
            _this.updateHeight();
            _this.dragRender();
        };
        _this.dragCancel = _this.dragEnd;
        _this.dragMove = function (e) {
            touchLast = e.touches[0].clientY;
            touchDelta = touchLastBuffer - e.touches[0].clientY;
            // we lazy-compute scrolltop since getting the actual value causes a DOM reflow
            var scrollTop = -1;
            var y = top + touchLast - touchStart;
            if (opened && y > 0) {
                if (scrollTop == -1) scrollTop = document.documentElement.scrollTop;
                if (scrollTop == 0) {
                    opened = false;
                    touchStart = touchLast - 1;
                    touchDelta = 0;
                    top = 0;
                    _this.updateHeight();
                }
            } else if (!opened && y <= 0) {
                if (scrollTop == -1) scrollTop = document.documentElement.scrollTop;
                if (scrollTop >= 0) {
                    opened = true;
                    touchStart = touchLast + 1;
                    touchDelta = 0;
                    top = 0;
                    _this.updateHeight();
                }
            }
            if (!opened) e.preventDefault();
            _this.calculateVelocity();
            requestAnimationFrame(_this.dragRender);
        };
        _this.onResize = function () {
            winHeight = window.innerHeight;
            top = opened ? 0 : winHeight * 0.85;
            _this.updateHeight();
            requestAnimationFrame(_this.dragRender);
        };
        _this.attachWrapper = function (el) {
            if (wrapper == null) {
                wrapper = el;
                el.addEventListener("touchstart", _this.dragStart, { passive: false });
                el.addEventListener("touchend", _this.dragEnd, { passive: false });
                el.addEventListener("touchcancel", _this.dragCancel, { passive: false });
                el.addEventListener("touchmove", _this.dragMove, { passive: false });
                window.addEventListener("resize", _this.onResize);
                _this.updateHeight();
            }
        };
        _this.attachHero = function (el) {
            hero = el;
        };
        _this.attachContent = function (el) {
            if (content == null) {
                content = el;
                el.addEventListener("touchstart", _this.dragStart, { passive: false });
                el.addEventListener("touchend", _this.dragEnd, { passive: false });
                el.addEventListener("touchcancel", _this.dragCancel, { passive: false });
                el.addEventListener("touchmove", _this.dragMove, { passive: false });
                window.addEventListener("resize", _this.onResize);
            }
        };
        return _this;
    }

    Home.prototype.calculateVelocity = function calculateVelocity() {
        var now = new Date().getTime();
        if (now - touchLastTime > 10) {
            var velocityNew = touchDelta / (now - touchLastTime);
            velocityLast = velocityNew;
            touchLastTime = now;
            touchLastBuffer = touchLast;
        }
    };

    Home.prototype.componentWillUnmount = function componentWillUnmount() {
        var el = wrapper;
        el.removeEventListener("touchstart", this.dragStart);
        el.removeEventListener("touchend", this.dragEnd);
        el.removeEventListener("touchcancel", this.dragCancel);
        el.removeEventListener("touchmove", this.dragMove);
        window.removeEventListener("resize", this.onResize);
    };

    Home.prototype.componentDidMount = function componentDidMount() {
        this.dragRender();
    };

    Home.prototype.render = function render() {
        return Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'div', 'home-component', [Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'div', 'content-wrapper', [Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'img', null, null, {
            'style': { width: '100%' },
            'src': 'http://lorempixel.com/400/200/food/3/'
        }), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test1'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test2'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test3'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test4'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test5'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test6'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test6'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test7'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test8'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test9'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test10'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test11'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test12'), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, 'Test13')], null, null, this.attachContent), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'div', 'home-content', 'Hey, I\'m Kevin \uD83D\uDE04', null, null, this.attachHero)], null, null, this.attachWrapper);
    };

    return Home;
}(__WEBPACK_IMPORTED_MODULE_0_inferno_component___default.a);

/* harmony default export */ __webpack_exports__["default"] = (Home);

/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Home.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Home.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".home-component {\n  overflow-y: hidden;\n  position: relative;\n  background: #FFF;\n  background-size: cover; }\n  .home-component .home-content {\n    height: 100%;\n    background-size: cover;\n    box-sizing: border-box;\n    overflow: hidden;\n    padding: 150px 0;\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    text-align: center; }\n  .home-component .content-wrapper {\n    position: relative;\n    transform-origin: top center;\n    transform: translateY(85vh);\n    background: #FFF;\n    transition-timing-function: ease-out;\n    -webkit-transition-timing-function: ease-out; }\n\nimg {\n  background: #EEE; }\n", ""]);

// exports


/***/ })

});