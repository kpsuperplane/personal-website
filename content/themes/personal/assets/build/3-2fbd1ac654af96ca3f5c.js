webpackJsonp([3],{

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_superagent__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_superagent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_superagent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Footer__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_GlobalLoader__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_LazyImage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__View__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Post_scss__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Post_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__Post_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_inferno__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }









var Post = function (_View) {
    _inherits(Post, _View);

    function Post(props) {
        _classCallCheck(this, Post);

        var _this = _possibleConstructorReturn(this, _View.call(this, 'post', props));

        _this.lastPath = '';
        _this.load = function () {
            _this.lastPath = window.location.pathname;
            __WEBPACK_IMPORTED_MODULE_2__components_GlobalLoader__["a" /* default */].queue();
            Object(__WEBPACK_IMPORTED_MODULE_0_superagent__["get"])(ghost.url.api('posts', { filter: 'page:[false,true]+slug:' + _this.lastPath.replace(/\//g, '') })).end(function (err, _ref) {
                var body = _ref.body;

                __WEBPACK_IMPORTED_MODULE_2__components_GlobalLoader__["a" /* default */].dequeue(function () {
                    window.scrollTo(0, 0);
                    if (body && body.posts && body.posts.length > 0) {
                        var post = body.posts[0];
                        __WEBPACK_IMPORTED_MODULE_4__View__["a" /* default */].setDark(post.feature_image);
                        _this.setState({ content: { __html: post.html }, title: post.title, image: post.feature_image || null }, function () {
                            for (var _iterator = document.getElementsByClassName('post')[0].getElementsByTagName('iframe'), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                                var _ref2;

                                if (_isArray) {
                                    if (_i >= _iterator.length) break;
                                    _ref2 = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) break;
                                    _ref2 = _i.value;
                                }

                                var el = _ref2;

                                var wrapper = document.createElement('div');
                                wrapper.classList.add('iframe-wrapper');
                                var innerWrapper = document.createElement('div');
                                innerWrapper.classList.add('iframe-inner-wrapper');
                                wrapper.appendChild(innerWrapper);
                                el.parentNode.insertBefore(wrapper, el);
                                innerWrapper.appendChild(el);
                            }
                        });
                    } else {
                        _this.context.router.push('/', null);
                    }
                });
            });
        };
        _this.handleClick = function (e) {
            if (e.target && e.target.tagName === 'A' && e.target.attributes && e.target.attributes.href && !(e.target.attributes.target && e.target.attributes.target !== '_self')) {
                var target = e.target.attributes.href.value;
                if (target.indexOf('http') !== 0 || target.indexOf(window.location.host) !== -1) {
                    e.preventDefault();
                    _this.context.router.push(target, e.target.textContent);
                }
            }
        };
        _this.state = {
            content: null,
            image: null,
            title: ''
        };
        _this.load();
        return _this;
    }

    Post.prototype.componentDidUpdate = function componentDidUpdate() {
        if (window.location.pathname !== this.lastPath && !(window.location.pathname in ['blog', 'projects'])) {
            this.load();
        }
        _View.prototype.componentDidUpdate.call(this);
    };

    Post.prototype.render = function render() {
        var _state = this.state,
            content = _state.content,
            title = _state.title,
            image = _state.image;

        return Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'div', null, [Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'article', 'post', [Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'header', 'post-header' + (image ? ' has-feature-image' : ''), [image ? [Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_3__components_LazyImage__["a" /* default */], null, null, {
            'path': image
        }), Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(128, 'svg', 'post-header-curve', Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'path', null, null, {
            'd': 'M 0,60 L 0,50 C 100,0 300,0 400,50 L 400,60',
            'stroke-width': 0,
            'fill': 'white'
        }), {
            'viewBox': '0 0 400 60',
            'height': '2%',
            'preserveAspectRatio': 'none'
        })] : Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'div', 'navigation-mobile-spacer navigation-desktop-spacer'), Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'div', 'post-header-inner', Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'h1', null, title))]), Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'section', 'post-content', null, {
            'onClick': this.handleClick,
            'dangerouslySetInnerHTML': content
        })]), content ? Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_1__components_Footer__["a" /* default */]) : null]);
    };

    return Post;
}(__WEBPACK_IMPORTED_MODULE_4__View__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (Post);

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_GlobalLoader__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_superagent__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_superagent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_superagent__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var View = function (_Component) {
    _inherits(View, _Component);

    function View(P, props) {
        _classCallCheck(this, View);

        for (var _iterator = document.body.classList, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var bodyClass = _ref;

            if (bodyClass.indexOf('-template') != -1) {
                document.body.classList.remove(bodyClass);
            }
        }
        document.body.classList.add(P + '-template');

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        __WEBPACK_IMPORTED_MODULE_1__components_GlobalLoader__["a" /* default */].dequeue();
        return _this;
    }

    View.prototype.componentDidMount = function componentDidMount() {
        this.componentDidUpdate();
    };

    View.prototype.componentDidUpdate = function componentDidUpdate() {
        if (View._lastPath !== window.location.href) {
            __WEBPACK_IMPORTED_MODULE_1__components_GlobalLoader__["a" /* default */].queue();
            View._lastPath = window.location.href;
            Object(__WEBPACK_IMPORTED_MODULE_2_superagent__["get"])(View._lastPath).end(function (err, res) {
                __WEBPACK_IMPORTED_MODULE_1__components_GlobalLoader__["a" /* default */].dequeue();
                var html = res.text;
                document.title = html.match(/<title>(.*)<\/title>/)[1];
            });
        }
    };

    return View;
}(__WEBPACK_IMPORTED_MODULE_0_inferno_component___default.a);

/* harmony default export */ __webpack_exports__["a"] = (View);

View.setDark = function (dark) {
    document.body.classList[dark ? 'add' : 'remove']('dark-top');
};
View._lastPath = window.location.href;

/***/ }),

/***/ 50:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Contact__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__LazyImage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Footer_scss__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Footer_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__Footer_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_inferno__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }









var Footer = function (_Component) {
    _inherits(Footer, _Component);

    function Footer(props) {
        _classCallCheck(this, Footer);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.onTouchStart = function () {
            _this.setState({ hover: true });
        };
        _this.onTouchEnd = function () {
            _this.setState({ hover: false });
        };
        _this.state = {
            hover: false
        };
        return _this;
    }

    Footer.prototype.render = function render() {
        return Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'footer', 'footer', [Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_1_inferno_router__["Link"], null, null, {
            'to': '/about',
            'onMouseEnter': this.onTouchStart,
            'onMouseLeave': this.onTouchEnd,
            'onClick': this.onTouchEnd,
            'onTouchStart': this.onTouchStart,
            'onTouchEnd': this.onTouchEnd,
            'className': 'footer-about' + (this.state.hover ? ' touched' : ''),
            children: Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_3__LazyImage__["a" /* default */], null, null, {
                'path': __WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png___default.a
            })
        }), Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(2, 'p', null, 'Skiing like a madman, git committing with passion, and coding for the betterment of society.'), Object(__WEBPACK_IMPORTED_MODULE_6_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_2__Contact__["a" /* default */])]);
    };

    return Footer;
}(__WEBPACK_IMPORTED_MODULE_0_inferno_component___default.a);

/* harmony default export */ __webpack_exports__["a"] = (Footer);

/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "profile-footer.png";

/***/ }),

/***/ 52:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 65:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});