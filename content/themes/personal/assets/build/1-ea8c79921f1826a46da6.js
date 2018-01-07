webpackJsonp([1],{

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Project", function() { return Project; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getProjects", function() { return getProjects; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_luxon__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_luxon___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_luxon__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_superagent__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_superagent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_superagent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Footer__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_GlobalLoader__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_Icon__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_LazyImage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_Pagination__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_Title__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__img_projects_jpg__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__img_projects_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__img_projects_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__View__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__Projects_scss__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__Projects_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__Projects_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_inferno__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }















var Project = function Project(project) {
    return Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_1_inferno_router__["Link"], null, null, {
        'to': project.url,
        'className': 'project-preview',
        children: [Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_7__components_LazyImage__["a" /* default */], null, null, {
            'path': project.feature_image,
            'forceWait': project.forceWait,
            'loader': true
        }), Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'div', 'project-preview-theme', null, {
            'style': { backgroundColor: project.theme }
        }), Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'div', 'project-preview-gradient'), Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'span', 'project-preview-body', [Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'h3', null, project.title), Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'p', null, project.published_at.toFormat('MMMM kkkk'))])]
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

        return Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_8__components_Pagination__["b" /* default */], null, null, {
            children: [Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_8__components_Pagination__["a" /* PaginationLink */], null, null, {
                'to': '/projects/?page=' + (page - 1),
                'disabled': page === 1,
                children: Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_6__components_Icon__["b" /* default */], null, null, {
                    'icon': __WEBPACK_IMPORTED_MODULE_6__components_Icon__["a" /* Icons */].CHEVRON_LEFT
                })
            }), Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'span', 'expand'), Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'span', null, ['Page ', page, ' of ', pages]), Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'span', 'expand'), Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_8__components_Pagination__["a" /* PaginationLink */], null, null, {
                'to': '/projects/?page=' + (page + 1),
                'disabled': page === pages,
                children: Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_6__components_Icon__["b" /* default */], null, null, {
                    'icon': __WEBPACK_IMPORTED_MODULE_6__components_Icon__["a" /* Icons */].CHEVRON_RIGHT
                })
            })]
        });
    };

    return PaginationEl;
}(__WEBPACK_IMPORTED_MODULE_0_inferno_component___default.a);

var getProjects = function getProjects(page, callback) {
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

    __WEBPACK_IMPORTED_MODULE_5__components_GlobalLoader__["a" /* default */].queue();
    Object(__WEBPACK_IMPORTED_MODULE_3_superagent__["get"])(ghost.url.api('posts', { page: page, filter: 'page:true+tag:[project-page]', limit: limit, include: 'tags' })).end(function (err, _ref) {
        var body = _ref.body;

        __WEBPACK_IMPORTED_MODULE_5__components_GlobalLoader__["a" /* default */].dequeue(function () {
            if (body.posts.length === 0) {
                callback(null);
            } else {
                callback({
                    pagination: body.meta.pagination,
                    projects: body.posts.map(function (project) {
                        return {
                            feature_image: project.feature_image,
                            featured: project.featured,
                            published_at: __WEBPACK_IMPORTED_MODULE_2_luxon__["DateTime"].fromISO(project.published_at),
                            theme: project.tags.find(function (tag) {
                                return tag.name[0] === '#';
                            }).name,
                            title: project.title,
                            url: project.url
                        };
                    })
                });
            }
        });
    });
};

var Projects = function (_View) {
    _inherits(Projects, _View);

    function Projects(props) {
        _classCallCheck(this, Projects);

        var _this2 = _possibleConstructorReturn(this, _View.call(this, 'projects', props));

        _this2.lastPath = '';
        _this2.load = function () {
            var page = Number(_this2.props.params.page || '1');
            if (!Number.isInteger(page) || page < 1) {
                _this2.context.router.push('/projects/', null);
            }
            _this2.lastPath = window.location.href;
            getProjects(page, function (projects) {
                if (projects) {
                    __WEBPACK_IMPORTED_MODULE_11__View__["a" /* default */].setDark(false);
                    window.scrollTo(0, 0);
                    _this2.setState(projects);
                } else {
                    _this2.context.router.push('/projects/', null);
                }
            });
        };
        _this2.state = {
            pagination: null,
            projects: null
        };
        return _this2;
    }

    Projects.prototype.componentDidMount = function componentDidMount() {
        this.load();
        _View.prototype.componentDidMount.call(this);
    };

    Projects.prototype.componentDidUpdate = function componentDidUpdate() {
        if (window.location.href !== this.lastPath && window.location.href.indexOf('/projects/') !== -1) {
            this.load();
        }
        _View.prototype.componentDidUpdate.call(this);
    };

    Projects.prototype.render = function render() {
        var _state = this.state,
            projects = _state.projects,
            pagination = _state.pagination;

        return Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'div', null, [Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_9__components_Title__["b" /* default */], null, null, {
            'title': 'Projects',
            'image': __WEBPACK_IMPORTED_MODULE_10__img_projects_jpg___default.a,
            'note': 'Photo: JK Liu'
        }), projects ? Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'div', 'project-entries', projects.map(function (post) {
            return Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, Project, null, null, _extends({}, post), post.url);
        })) : null, Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, PaginationEl, null, null, _extends({}, pagination)), projects ? Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_4__components_Footer__["a" /* default */]) : null]);
    };

    return Projects;
}(__WEBPACK_IMPORTED_MODULE_11__View__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (Projects);

/***/ }),

/***/ 50:
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

/***/ 51:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Contact__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__LazyImage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Footer_scss__ = __webpack_require__(53);
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

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "profile-footer.png";

/***/ }),

/***/ 53:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Curve; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Title_scss__ = __webpack_require__(56);
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

/***/ 55:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PaginationLink; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Pagination_scss__ = __webpack_require__(57);
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

/***/ 56:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 57:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "projects.jpg";

/***/ }),

/***/ 61:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});