webpackJsonp([2],{

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Post", function() { return Post; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPosts", function() { return getPosts; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ellipsize__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ellipsize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ellipsize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno_router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_luxon__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_luxon___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_luxon__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_superagent__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_superagent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_superagent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_Footer__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_GlobalLoader__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_Icon__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_LazyImage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_Pagination__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_Title__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__img_blog_jpg__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__img_blog_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__img_blog_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__View__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Blog_scss__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Blog_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__Blog_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_inferno__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
















var Post = function Post(post) {
    return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_2_inferno_router__["Link"], null, null, {
        'to': post.url,
        'className': 'post-preview' + (!post.feature_image ? ' no-image' : ''),
        children: [post.feature_image ? Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_8__components_LazyImage__["a" /* default */], null, null, {
            'path': post.feature_image,
            'asBackground': post.asBackground,
            'forceWait': post.forceWait,
            'loader': true
        }) : null, Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'span', 'post-preview-body', [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'h3', null, post.title), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'p', null, [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'strong', null, post.published_at.toLocaleString(__WEBPACK_IMPORTED_MODULE_3_luxon__["DateTime"].DATE_FULL)), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'span', null, null, {
            'dangerouslySetInnerHTML': { __html: post.excerpt }
        })])])]
    });
};

var PaginationEl = function (_Component) {
    _inherits(PaginationEl, _Component);

    function PaginationEl() {
        _classCallCheck(this, PaginationEl);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    PaginationEl.prototype.render = function render() {
        var _props = this.props,
            page = _props.page,
            pages = _props.pages;

        return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_9__components_Pagination__["b" /* default */], null, null, {
            children: [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_9__components_Pagination__["a" /* PaginationLink */], null, null, {
                'to': '/blog/?page=' + (page - 1),
                'disabled': page === 1,
                children: Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_7__components_Icon__["b" /* default */], null, null, {
                    'icon': __WEBPACK_IMPORTED_MODULE_7__components_Icon__["a" /* Icons */].CHEVRON_LEFT
                })
            }), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'span', 'expand'), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'span', null, ['Page ', page, ' of ', pages]), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'span', 'expand'), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_9__components_Pagination__["a" /* PaginationLink */], null, null, {
                'to': '/blog/?page=' + (page + 1),
                'disabled': page === pages,
                children: Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_7__components_Icon__["b" /* default */], null, null, {
                    'icon': __WEBPACK_IMPORTED_MODULE_7__components_Icon__["a" /* Icons */].CHEVRON_RIGHT
                })
            })]
        });
    };

    return PaginationEl;
}(__WEBPACK_IMPORTED_MODULE_1_inferno_component___default.a);

var getPosts = function getPosts(page, callback) {
    var withImages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

    __WEBPACK_IMPORTED_MODULE_6__components_GlobalLoader__["a" /* default */].queue();
    Object(__WEBPACK_IMPORTED_MODULE_4_superagent__["get"])(ghost.url.api('posts', { page: page, filter: withImages ? 'feature_image:-null' : '', limit: limit, fields: 'feature_image, url, published_at, title, custom_excerpt, html' })).end(function (err, _ref) {
        var body = _ref.body;

        __WEBPACK_IMPORTED_MODULE_6__components_GlobalLoader__["a" /* default */].dequeue(function () {
            if (body.posts.length === 0) {
                callback(null);
            } else {
                callback({
                    pagination: body.meta.pagination,
                    posts: body.posts.map(function (post) {
                        return {
                            excerpt: post.custom_excerpt || __WEBPACK_IMPORTED_MODULE_0_ellipsize___default()(post.html.replace(/<[^>]*>/g, ''), 128),
                            feature_image: post.feature_image,
                            featured: post.featured,
                            published_at: __WEBPACK_IMPORTED_MODULE_3_luxon__["DateTime"].fromISO(post.published_at),
                            title: post.title,
                            url: post.url
                        };
                    })
                });
            }
        });
    });
};

var Blog = function (_View) {
    _inherits(Blog, _View);

    function Blog(props) {
        _classCallCheck(this, Blog);

        var _this2 = _possibleConstructorReturn(this, _View.call(this, props));

        _this2.lastPath = '';
        _this2.load = function () {
            var page = Number(_this2.props.params.page || '1');
            if (!Number.isInteger(page) || page < 1) {
                _this2.context.router.push('/blog/', null);
            }
            _this2.lastPath = window.location.href;
            getPosts(page, function (posts) {
                if (posts) {
                    __WEBPACK_IMPORTED_MODULE_12__View__["a" /* default */].setDark(false);
                    window.scrollTo(0, 0);
                    _this2.setState(posts);
                } else {
                    _this2.context.router.push('/blog/', null);
                }
            });
        };
        _this2.state = {
            pagination: null,
            posts: null
        };
        return _this2;
    }

    Blog.prototype.componentDidMount = function componentDidMount() {
        this.load();
        _View.prototype.componentDidMount.call(this);
    };

    Blog.prototype.componentDidUpdate = function componentDidUpdate() {
        if (window.location.href !== this.lastPath && window.location.href.indexOf('/blog/') !== -1) {
            this.load();
        }
        _View.prototype.componentDidUpdate.call(this);
    };

    Blog.prototype.render = function render() {
        var _state = this.state,
            posts = _state.posts,
            pagination = _state.pagination;

        return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', null, [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_10__components_Title__["b" /* default */], null, null, {
            'title': 'My Blog',
            'image': __WEBPACK_IMPORTED_MODULE_11__img_blog_jpg___default.a
        }), posts ? Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'blog-entries', posts.map(function (post) {
            return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, Post, null, null, _extends({}, post, {
                'forceWait': true
            }), post.url);
        })) : null, Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, PaginationEl, null, null, _extends({}, pagination)), posts ? Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_5__components_Footer__["a" /* default */]) : null]);
    };

    return Blog;
}(__WEBPACK_IMPORTED_MODULE_12__View__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (Blog);

/***/ }),

/***/ 58:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_GlobalLoader__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_superagent__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_superagent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_superagent__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var View = function (_Component) {
    _inherits(View, _Component);

    function View(props) {
        _classCallCheck(this, View);

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

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Contact__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__LazyImage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Footer_scss__ = __webpack_require__(61);
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

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "profile-footer.png";

/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(62);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Footer.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Footer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".body-font, footer.footer > p {\n  font-family: \"proxima-nova\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }\n\n.head-font {\n  font-family: \"museo-slab\", 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; }\n\n.code-font {\n  font-family: \"source-code-pro\", sans-serif; }\n\n@keyframes loadingBackgroundAnimation {\n  0% {\n    background-position: bottom left; }\n  100% {\n    background-position: top right; } }\n\n.loading-background {\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  animation-name: loadingBackgroundAnimation;\n  animation-timing-function: linear;\n  background: #f6f7f8;\n  background: linear-gradient(45deg, #f6f7f8 25%, #dee1e2 50%, #f6f7f8 75%);\n  background-size: 400% 400%; }\n\nfooter.footer {\n  padding: 3rem 2rem;\n  text-align: center; }\n  footer.footer > a.footer-about {\n    display: inline-block;\n    height: 5rem;\n    width: 5rem;\n    border: 1px solid #2ac648;\n    border-radius: 100%;\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    transform: scale(1);\n    -webkit-tap-highlight-color: transparent;\n    transition: transform 250ms cubic-bezier(0.19, 1, 0.22, 1); }\n    footer.footer > a.footer-about.touched {\n      transform: scale(1.1); }\n    footer.footer > a.footer-about > img {\n      height: 5rem;\n      width: 5rem; }\n  footer.footer > p {\n    color: #777;\n    font-weight: 400;\n    line-height: 2rem;\n    font-size: 0.9rem;\n    padding: 1rem;\n    text-align: center;\n    margin: 0.5rem 0; }\n", ""]);

// exports


/***/ }),

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Curve; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Title_scss__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Title_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Title_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_inferno__);



var Curve = function Curve(props) {
    return Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(128, 'svg', 'title-curve', Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'path', null, null, {
        'd': 'M 0,80 L 0,50 C 100,0 300,0 400,50 L 400,80',
        'stroke-width': 0,
        'fill': 'white'
    }), {
        'viewBox': '0 0 400 80',
        'height': '2%',
        'preserveAspectRatio': 'none'
    });
};
/* harmony default export */ __webpack_exports__["b"] = (function (props) {
    return Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'div', 'title-wrapper', [Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'header', 'title', [Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, props.title), props.note ? Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'small', null, props.note) : null], {
        'style': { backgroundImage: 'url(' + props.image + ')' }
    }), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(16, Curve)]);
});

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PaginationLink; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Pagination_scss__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Pagination_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Pagination_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_inferno__);




var PaginationLink = function PaginationLink(props) {
  return props.disabled ? Object(__WEBPACK_IMPORTED_MODULE_3_inferno__["createVNode"])(2, 'span', null, props.children) : Object(__WEBPACK_IMPORTED_MODULE_3_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_1_inferno_router__["Link"], null, null, {
    'to': props.to,
    children: props.children
  });
};
/* harmony default export */ __webpack_exports__["b"] = (function (props) {
  return Object(__WEBPACK_IMPORTED_MODULE_3_inferno__["createVNode"])(2, 'div', 'pagination', props.children);
});

/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(66);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Title.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Title.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".body-font, .title-wrapper .title small {\n  font-family: \"proxima-nova\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }\n\n.head-font, .title-wrapper .title h1 {\n  font-family: \"museo-slab\", 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; }\n\n.code-font {\n  font-family: \"source-code-pro\", sans-serif; }\n\n@keyframes loadingBackgroundAnimation {\n  0% {\n    background-position: bottom left; }\n  100% {\n    background-position: top right; } }\n\n.loading-background {\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  animation-name: loadingBackgroundAnimation;\n  animation-timing-function: linear;\n  background: #f6f7f8;\n  background: linear-gradient(45deg, #f6f7f8 25%, #dee1e2 50%, #f6f7f8 75%);\n  background-size: 400% 400%; }\n\n.title-wrapper .title {\n  padding: 5rem 2rem 4rem 2rem;\n  background-size: cover;\n  background-position: center center;\n  text-align: center; }\n  .title-wrapper .title h1 {\n    font-size: 2rem;\n    text-align: center;\n    padding: 1rem;\n    margin: 0;\n    color: #FFF;\n    font-weight: 300; }\n  .title-wrapper .title small {\n    color: #FFF;\n    opacity: 0.25;\n    font-weight: 300; }\n\n.title-wrapper .title-curve {\n  display: none; }\n\n@media (min-width: 750px) {\n  .title-wrapper .title {\n    padding: 9rem 2rem 13rem 2rem; }\n    .title-wrapper .title h1 {\n      font-size: 3.5rem; }\n  .title-wrapper .title-curve {\n    margin-top: -80px;\n    height: 80px;\n    width: 100%;\n    display: block; } }\n", ""]);

// exports


/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(68);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Pagination.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Pagination.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".pagination {\n  display: flex;\n  background: #FAFAFA;\n  position: relative; }\n  .pagination > a, .pagination > span, .pagination > .pagination-element {\n    flex: 0;\n    font-weight: 700;\n    display: block;\n    font-size: 1rem;\n    padding: 1rem;\n    text-align: center;\n    color: #444;\n    white-space: nowrap; }\n    .pagination > a.expand, .pagination > span.expand, .pagination > .pagination-element.expand {\n      flex: 1; }\n  .pagination > span {\n    cursor: default;\n    opacity: 0.25; }\n  .pagination > select {\n    background: transparent;\n    border-style: none;\n    display: block;\n    -webkit-appearance: none; }\n  .pagination > a {\n    text-decoration: none; }\n    .pagination > a:hover {\n      text-decoration: none; }\n\n@media (min-width: 750px) {\n  .pagination {\n    background: transparent;\n    justify-content: center; }\n    .pagination > .expand {\n      flex: 0 !important; } }\n", ""]);

// exports


/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "blog.jpg";

/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(71);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Blog.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Blog.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 71:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".body-font {\n  font-family: \"proxima-nova\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }\n\n.head-font, .post-preview > .post-preview-body > h3 {\n  font-family: \"museo-slab\", 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; }\n\n.code-font {\n  font-family: \"source-code-pro\", sans-serif; }\n\n@keyframes loadingBackgroundAnimation {\n  0% {\n    background-position: bottom left; }\n  100% {\n    background-position: top right; } }\n\n.loading-background {\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  animation-name: loadingBackgroundAnimation;\n  animation-timing-function: linear;\n  background: #f6f7f8;\n  background: linear-gradient(45deg, #f6f7f8 25%, #dee1e2 50%, #f6f7f8 75%);\n  background-size: 400% 400%; }\n\n.blog-template .blog-entries {\n  border-radius: 1rem 1rem 0 0;\n  margin: -1rem 0 0 0;\n  overflow: hidden;\n  position: relative;\n  background: #FFF;\n  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1); }\n\n@media (min-width: 750px) {\n  .blog-template .blog-entries {\n    max-width: 700px;\n    margin: -8rem auto 3rem auto;\n    border-radius: 0.75rem; } }\n\n.post-preview {\n  display: block;\n  text-decoration: none; }\n  .post-preview.no-image {\n    border-top: 1px solid #EEE; }\n  .post-preview > .lazy-image-loader {\n    width: 100%;\n    overflow: hidden; }\n    .post-preview > .lazy-image-loader > img {\n      width: 100%;\n      transform: scale(1);\n      transition: all 250ms; }\n  .post-preview > .post-preview-body {\n    padding: 1.5rem 2rem;\n    display: block; }\n    .post-preview > .post-preview-body > h3 {\n      font-weight: 500;\n      color: #2ac648;\n      font-size: 1.25rem;\n      line-height: 1.5rem;\n      margin: 0;\n      padding: 0 0 0.5rem 0; }\n    .post-preview > .post-preview-body > p {\n      font-size: 1rem;\n      line-height: 1.5rem;\n      color: #444;\n      margin: 0;\n      padding: 0; }\n      .post-preview > .post-preview-body > p > strong {\n        display: block; }\n  .post-preview:hover {\n    text-decoration: none; }\n    .post-preview:hover > .lazy-image-loader > img {\n      transform: scale(1.05); }\n", ""]);

// exports


/***/ })

});