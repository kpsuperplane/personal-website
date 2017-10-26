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





var Home = function (_Component) {
    _inherits(Home, _Component);

    function Home(props) {
        _classCallCheck(this, Home);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.top = 0;
        _this.touchStart = -1;
        _this.velocityLast = 0;
        _this.touchLast = -1;
        _this.touchDelta = -1;
        _this.touchLastBuffer = -1;
        _this.scrollStart = -1;
        _this.touchLastTime = -1;
        _this.opened = false;
        _this.winHeight = window.innerHeight;
        _this.content = null;
        _this.wrapper = null;
        _this.hero = null;
        _this.updatePosition = function () {
            _this.top = _this.content.getBoundingClientRect().top;
        };
        _this.updateHeight = function () {
            _this.wrapper.style.height = _this.opened ? null : _this.winHeight + 'px';
        };
        _this.dragRender = function () {
            var delta = _this.touchLast - _this.touchStart;
            var y = _this.opened ? 0 : _this.top + delta;
            var percent = y / (_this.winHeight * 0.85);
            _this.content.style.transform = 'translate3d(0, ' + y + 'px, 0)';
            _this.hero.style.transform = 'translate3d(0, ' + -(1 - percent) * _this.winHeight / 2 + 'px, 0)';
            _this.hero.style.opacity = '' + Math.max(0, percent * 1.3 - 0.3);
        };
        _this.dragStart = function (e) {
            _this.updatePosition();
            _this.touchStart = e.touches[0].clientY;
            _this.touchLastTime = new Date().getTime();
            _this.touchLast = _this.touchStart;
            _this.scrollStart = document.documentElement.scrollTop;
            _this.hero.style.transition = _this.content.style.transition = 'no';
            _this.dragRender();
        };
        _this.dragEnd = function (e) {
            _this.calculateVelocity();
            var delta = _this.touchLast - _this.touchStart;
            var y = _this.top + delta;
            _this.touchStart = -1;
            _this.touchLast = -1;
            var percent = y / (_this.winHeight * 0.85);
            if (percent > 1) {
                percent = 1 - (percent - 1);
            }
            if (percent <= 0 || percent < 0.425 && !(_this.velocityLast < -0.5) || _this.velocityLast > 0.5) {
                _this.opened = true;
                _this.top = 0;
            } else {
                _this.opened = false;
                _this.top = _this.winHeight * 0.85;
            }
            var animTime = (_this.opened ? Math.abs(percent) : 1 - Math.abs(percent)) * 200 + 100;
            _this.hero.style.transition = _this.content.style.transition = 'all ' + animTime + 'ms cubic-bezier(0.1,' + Math.abs(_this.velocityLast) * (0.1 * animTime) / Math.abs(y - _this.top) + ',0.1,1)';
            _this.updateHeight();
            _this.dragRender();
        };
        _this.dragCancel = _this.dragEnd;
        _this.dragMove = function (e) {
            _this.touchLast = e.touches[0].clientY;
            _this.touchDelta = _this.touchLastBuffer - e.touches[0].clientY;
            // we lazy-compute scrolltop since getting the actual value causes a DOM reflow
            var scrollTop = -1;
            var y = _this.top + _this.touchLast - _this.touchStart;
            if (_this.opened && y > 0) {
                if (scrollTop === -1) {
                    scrollTop = document.documentElement.scrollTop;
                }
                if (scrollTop === 0) {
                    _this.opened = false;
                    _this.touchStart = _this.touchLast - 1;
                    _this.touchDelta = 0;
                    _this.top = 0;
                    _this.updateHeight();
                }
            } else if (!_this.opened && y <= 0) {
                if (scrollTop === -1) {
                    scrollTop = document.documentElement.scrollTop;
                }
                if (scrollTop >= 0) {
                    _this.opened = true;
                    _this.touchStart = _this.touchLast + 1;
                    _this.touchDelta = 0;
                    _this.top = 0;
                    _this.updateHeight();
                }
            }
            if (!_this.opened) {
                e.preventDefault();
            }
            _this.calculateVelocity();
            requestAnimationFrame(_this.dragRender);
        };
        _this.onResize = function () {
            _this.winHeight = window.innerHeight;
            _this.top = _this.opened ? 0 : _this.winHeight * 0.85;
            _this.updateHeight();
            requestAnimationFrame(_this.dragRender);
        };
        _this.attachWrapper = function (el) {
            if (_this.wrapper == null) {
                _this.wrapper = el;
                el.addEventListener('touchstart', _this.dragStart, { passive: false });
                el.addEventListener('touchend', _this.dragEnd, { passive: false });
                el.addEventListener('touchcancel', _this.dragCancel, { passive: false });
                el.addEventListener('touchmove', _this.dragMove, { passive: false });
                window.addEventListener('resize', _this.onResize);
                _this.updateHeight();
            }
        };
        _this.attachHero = function (el) {
            _this.hero = el;
        };
        _this.attachContent = function (el) {
            if (_this.content == null) {
                _this.content = el;
            }
        };
        return _this;
    }

    Home.prototype.calculateVelocity = function calculateVelocity() {
        var now = new Date().getTime();
        if (now - this.touchLastTime > 10) {
            var velocityNew = this.touchDelta / (now - this.touchLastTime);
            this.velocityLast = velocityNew;
            this.touchLastTime = now;
            this.touchLastBuffer = this.touchLast;
        }
    };

    Home.prototype.componentWillUnmount = function componentWillUnmount() {
        var el = this.wrapper;
        el.removeEventListener('touchstart', this.dragStart);
        el.removeEventListener('touchend', this.dragEnd);
        el.removeEventListener('touchcancel', this.dragCancel);
        el.removeEventListener('touchmove', this.dragMove);
        window.removeEventListener('resize', this.onResize);
    };

    Home.prototype.componentDidMount = function componentDidMount() {
        this.onResize();
        this.dragRender();
    };

    Home.prototype.render = function render() {
        return Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'div', 'home-component', [Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'div', 'content-wrapper', [Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'img', null, null, {
            'style': { width: '100%' },
            'src': 'http://via.placeholder.com/350x150'
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