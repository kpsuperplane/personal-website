webpackJsonp([0,1,2],Array(53).concat([
/* 53 */
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_luxon__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_luxon___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_luxon__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_superagent__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_superagent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_superagent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_Footer__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_GlobalLoader__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_Icon__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_LazyImage__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_Pagination__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_Title__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__img_blog_jpg__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__img_blog_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__img_blog_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__View__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Blog_scss__ = __webpack_require__(69);
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
            'forceWaitSize': true,
            'loader': true
        }) : null, Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'span', 'post-preview-body', [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'h3', null, post.title), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'p', null, [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'strong', null, post.published_at.toLocaleString(__WEBPACK_IMPORTED_MODULE_3_luxon__["DateTime"].DATE_FULL)), post.excerpt])])]
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

    __WEBPACK_IMPORTED_MODULE_6__components_GlobalLoader__["a" /* default */].queue(true);
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
                    __WEBPACK_IMPORTED_MODULE_12__View__["a" /* default */].setDark(true);
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
        __WEBPACK_IMPORTED_MODULE_12__View__["a" /* default */].setDark(true);
        return _this2;
    }

    Blog.prototype.componentDidMount = function componentDidMount() {
        this.load();
    };

    Blog.prototype.componentDidUpdate = function componentDidUpdate(props) {
        if (window.location.href !== this.lastPath && window.location.href.indexOf('/blog/') !== -1) {
            this.load();
        }
    };

    Blog.prototype.render = function render() {
        var _state = this.state,
            posts = _state.posts,
            pagination = _state.pagination;

        return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', null, [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_10__components_Title__["a" /* default */], null, null, {
            'title': 'My Blog',
            'image': __WEBPACK_IMPORTED_MODULE_11__img_blog_jpg___default.a
        }), posts ? Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'blog-entries', posts.map(function (post) {
            return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, Post, null, null, _extends({}, post), post.url);
        })) : null, Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, PaginationEl, null, null, _extends({}, pagination)), posts ? Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_5__components_Footer__["a" /* default */]) : null]);
    };

    return Blog;
}(__WEBPACK_IMPORTED_MODULE_12__View__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (Blog);

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Project", function() { return Project; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getProjects", function() { return getProjects; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_luxon__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_luxon___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_luxon__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_superagent__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_superagent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_superagent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Footer__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_GlobalLoader__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_Icon__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_LazyImage__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_Pagination__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_Title__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__img_projects_jpg__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__img_projects_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__img_projects_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__View__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__Projects_scss__ = __webpack_require__(72);
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
            'forceWaitSize': true,
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

    __WEBPACK_IMPORTED_MODULE_5__components_GlobalLoader__["a" /* default */].queue(true);
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

        var _this2 = _possibleConstructorReturn(this, _View.call(this, props));

        _this2.lastPath = '';
        _this2.load = function () {
            var page = Number(_this2.props.params.page || '1');
            if (!Number.isInteger(page) || page < 1) {
                _this2.context.router.push('/projects/', null);
            }
            _this2.lastPath = window.location.href;
            getProjects(page, function (projects) {
                if (projects) {
                    __WEBPACK_IMPORTED_MODULE_11__View__["a" /* default */].setDark(true);
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
    };

    Projects.prototype.componentDidUpdate = function componentDidUpdate(props) {
        if (window.location.href !== this.lastPath && window.location.href.indexOf('/projects/') !== -1) {
            this.load();
        }
    };

    Projects.prototype.render = function render() {
        var _state = this.state,
            projects = _state.projects,
            pagination = _state.pagination;

        return Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'div', null, [Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_9__components_Title__["a" /* default */], null, null, {
            'title': 'Projects',
            'image': __WEBPACK_IMPORTED_MODULE_10__img_projects_jpg___default.a
        }), projects ? Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(2, 'div', 'project-entries', projects.map(function (post) {
            return Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, Project, null, null, _extends({}, post), post.url);
        })) : null, Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, PaginationEl, null, null, _extends({}, pagination)), projects ? Object(__WEBPACK_IMPORTED_MODULE_13_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_4__components_Footer__["a" /* default */]) : null]);
    };

    return Projects;
}(__WEBPACK_IMPORTED_MODULE_11__View__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (Projects);

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__View__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno_create_element__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno_create_element___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_inferno_create_element__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_inferno_router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_superagent__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_superagent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_superagent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_Button__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_Footer__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_Icon__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_LazyImage__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_Loader__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__img_thinking_jpg__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__img_thinking_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__img_thinking_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__views_Blog__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__views_Projects__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Home_scss__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Home_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__Home_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_inferno__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
















var Story = function (_Component) {
    _inherits(Story, _Component);

    function Story() {
        _classCallCheck(this, Story);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    return Story;
}(__WEBPACK_IMPORTED_MODULE_1_inferno_component___default.a);



var LocationStory = function (_Story) {
    _inherits(LocationStory, _Story);

    function LocationStory(props) {
        _classCallCheck(this, LocationStory);

        var _this2 = _possibleConstructorReturn(this, _Story.call(this, props));

        _this2.prompt = function (message) {
            _this2.setState({ message: message[0], emoji: message[1], visible: true });
        };
        _this2.begin = function (distance) {
            var prompts = [['Woah, you\'re like ' + distance + ' km away from me', '😃'], ['That\'s like ' + Math.round(distance * 3280.84) + ' Subway footlong sandwiches', '🥪'], ['Or ' + Math.round(distance * 666.66) + ' giant pandas', '🐼'], ['It\'d take you ' + function () {
                var hours = distance / 15.5;
                if (hours > 24) {
                    return Math.round(hours / 24) + ' day(s)';
                } else if (hours >= 1) {
                    return Math.round(hours) + ' hour(s)';
                } else {
                    return Math.round(hours * 60) + ' minute(s)';
                }
            }() + ' to bike to me', '🚴'], ['Usain Bolt would piggyback you about 3 times faster', '😲']];
            _this2.setState({ message: ' ' });
            var idx = 0;
            var show = function show() {
                _this2.setState({ visible: false }, function () {
                    setTimeout(function () {
                        if (idx === prompts.length) {
                            window.clearInterval(interval);
                            _this2.props.onComplete();
                        }
                        _this2.prompt(prompts[idx]);
                        ++idx;
                    }, 500);
                });
            };
            show();
            var interval = window.setInterval(show, 4000);
        };
        _this2.state = {
            emoji: '',
            message: '',
            visible: false
        };
        navigator.geolocation.getCurrentPosition(function (pos) {
            Object(__WEBPACK_IMPORTED_MODULE_4_superagent__["get"])('https://us-central1-personal-website-173519.cloudfunctions.net/getDistance?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude).end(function (err, res) {
                _this2.begin(Number(res.text));
            });
        }, console.error);
        return _this2;
    }

    LocationStory.prototype.render = function render() {
        var _state = this.state,
            message = _state.message,
            emoji = _state.emoji,
            visible = _state.visible;

        if (message === '') {
            return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_9__components_Loader__["a" /* default */]);
        } else {
            return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'home-message' + (visible ? ' visible' : ''), [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'p', null, emoji, {
                'style': { fontSize: '4rem', margin: 0 }
            }), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'p', null, message)]);
        }
    };

    return LocationStory;
}(Story);

var HomeContent = function (_Component2) {
    _inherits(HomeContent, _Component2);

    function HomeContent(props) {
        _classCallCheck(this, HomeContent);

        var _this3 = _possibleConstructorReturn(this, _Component2.call(this, props));

        _this3.start = function () {
            _this3.setState({ visible: false }, function () {
                setTimeout(function () {
                    _this3.setState({ story: LocationStory });
                }, 500);
            });
        };
        _this3.end = function () {
            _this3.setState({ story: null, visible: false });
            setTimeout(function () {
                _this3.setState({ visible: true });
            }, 10);
        };
        _this3.state = {
            story: null,
            visible: false
        };
        setTimeout(function () {
            _this3.setState({ visible: true });
        }, 10);
        return _this3;
    }

    HomeContent.prototype.render = function render() {
        var _state2 = this.state,
            story = _state2.story,
            visible = _state2.visible;

        if (story === null) {
            return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'home-prompt home-message' + (visible ? ' visible' : ''), [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_8__components_LazyImage__["a" /* default */], null, null, {
                'path': __WEBPACK_IMPORTED_MODULE_10__img_thinking_jpg___default.a,
                'style': { width: '5rem', height: '5.1367rem' }
            }), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'br'), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_5__components_Button__["a" /* default */], null, null, {
                'onClick': this.start,
                children: 'Tell me a story'
            })]);
        } else {
            return __WEBPACK_IMPORTED_MODULE_2_inferno_create_element___default()(story, { onComplete: this.end });
        }
    };

    return HomeContent;
}(__WEBPACK_IMPORTED_MODULE_1_inferno_component___default.a);

var HorizontalScroll = function (_Component3) {
    _inherits(HorizontalScroll, _Component3);

    function HorizontalScroll(props) {
        _classCallCheck(this, HorizontalScroll);

        var _this4 = _possibleConstructorReturn(this, _Component3.call(this, props));

        _this4.container = null;
        _this4.wrapper = null;
        _this4.lastVelocity = 0;
        _this4.firstTouch = [-1, -1];
        _this4.lastTouch = 0;
        _this4.dragging = false;
        _this4.maxPos = 0;
        _this4.dragLeft = 0;
        _this4.lastTouchTime = 0;
        _this4.lastTouchBuffer = 0;
        _this4.reset = function () {
            _this4.firstTouch = [0, 0];
            _this4.lastTouch = 0;
            _this4.lastVelocity = 0;
        };
        _this4.dragRender = function () {
            var pos = Math.max(Math.min(0, _this4.dragLeft + (_this4.lastTouch - _this4.firstTouch[0])), -_this4.maxPos);
            _this4.container.style.transform = 'translate3d(' + pos + 'px, 0, 0)';
        };
        _this4.touchMove = function (e) {
            _this4.calculateVelocity();
            if (!_this4.dragging && Math.abs(e.touches[0].clientX - _this4.firstTouch[0]) >= 5 && Math.abs((e.touches[0].clientY - _this4.firstTouch[1]) / (e.touches[0].clientX - _this4.firstTouch[0])) < 0.5) {
                _this4.dragging = true;
            }
            _this4.lastTouch = e.touches[0].clientX;
            if (_this4.dragging) {
                e.preventDefault();
                e.stopPropagation();
                requestAnimationFrame(_this4.dragRender);
            }
        };
        _this4.touchEnd = function (e) {
            if (!_this4.dragging) {
                return;
            }
            e.stopPropagation();
            e.preventDefault();
            _this4.calculateVelocity();
            var containerWidth = _this4.wrapper.getBoundingClientRect().width;
            var pos = Math.min(Math.max(0, -(_this4.dragLeft + (_this4.lastTouch - _this4.firstTouch[0]))), _this4.maxPos);
            var leftCoord = Math.floor(pos / containerWidth) * containerWidth;
            var rightCoord = Math.ceil(pos / containerWidth) * containerWidth;
            var percent = (pos - leftCoord) / containerWidth;
            var newLeft = percent >= 0.5 && _this4.lastVelocity >= -0.5 || _this4.lastVelocity >= 0.5 ? rightCoord : leftCoord;
            var animTime = (newLeft === rightCoord ? Math.abs(percent) : 1 - Math.abs(percent)) * 300 + 100;
            _this4.container.style.transition = 'transform ' + animTime + 'ms cubic-bezier(0.1, ' + Math.abs(_this4.lastVelocity) * (0.1 * animTime) / Math.abs(newLeft - pos) + ', 0.1, 1)';
            _this4.reset();
            _this4.dragLeft = -newLeft;
            _this4.setState({ selected: Math.floor(newLeft / containerWidth) });
            requestAnimationFrame(_this4.dragRender);
        };
        _this4.touchStart = function (e) {
            _this4.dragging = false;
            _this4.container.style.transition = 'none';
            _this4.dragLeft = _this4.container.getBoundingClientRect().left;
            _this4.firstTouch = [e.touches[0].clientX, e.touches[0].clientY];
            _this4.lastTouchBuffer = _this4.lastTouch = _this4.firstTouch[0];
        };
        _this4.prev = function (e) {
            if (_this4.state.selected === 0) {
                return;
            }
            _this4.reset();
            _this4.container.style.transition = 'transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1)';
            _this4.dragLeft = -_this4.wrapper.getBoundingClientRect().width * (_this4.state.selected - 1);
            requestAnimationFrame(_this4.dragRender);
            _this4.setState({ selected: _this4.state.selected - 1 });
        };
        _this4.next = function (e) {
            if (_this4.state.selected === _this4.props.children.length - 1) {
                return;
            }
            _this4.reset();
            _this4.container.style.transition = 'transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1)';
            _this4.dragLeft = -_this4.wrapper.getBoundingClientRect().width * (_this4.state.selected + 1);
            requestAnimationFrame(_this4.dragRender);
            _this4.setState({ selected: _this4.state.selected + 1 });
        };
        _this4.attachContainer = function (el) {
            if (_this4.container == null) {
                _this4.container = el;
            }
        };
        _this4.attachWrapper = function (el) {
            if (_this4.wrapper == null) {
                _this4.wrapper = el;
                el.addEventListener('touchstart', _this4.touchStart);
                el.addEventListener('touchmove', _this4.touchMove);
                el.addEventListener('touchend', _this4.touchEnd);
                _this4.maxPos = _this4.container.scrollWidth - _this4.wrapper.getBoundingClientRect().width;
            }
        };
        _this4.state = {
            selected: 0
        };
        return _this4;
    }

    HorizontalScroll.prototype.calculateVelocity = function calculateVelocity() {
        var now = new Date().getTime();
        if (now - this.lastTouchTime > 10) {
            var newVelocity = (this.lastTouchBuffer - this.lastTouch) / (now - this.lastTouchTime);
            this.lastVelocity = newVelocity;
            this.lastTouchTime = now;
            this.lastTouchBuffer = this.lastTouch;
        }
    };

    HorizontalScroll.prototype.componentDidUpdate = function componentDidUpdate() {
        this.maxPos = this.container.scrollWidth - this.wrapper.getBoundingClientRect().width;
    };

    HorizontalScroll.prototype.render = function render() {
        var _this5 = this;

        return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'h-scroll' + (this.props.className ? ' ' + this.props.className : ''), [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'h-scroll-contents', this.props.children, null, null, this.attachContainer), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'h-scroll-nav left' + (this.state.selected !== 0 ? ' active' : ''), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_7__components_Icon__["b" /* default */], null, null, {
            'icon': __WEBPACK_IMPORTED_MODULE_7__components_Icon__["a" /* Icons */].CHEVRON_LEFT
        }), {
            'onClick': this.prev
        }), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'h-scroll-nav right' + (this.props.children && this.state.selected !== this.props.children.length - 1 ? ' active' : ''), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_7__components_Icon__["b" /* default */], null, null, {
            'icon': __WEBPACK_IMPORTED_MODULE_7__components_Icon__["a" /* Icons */].CHEVRON_RIGHT
        }), {
            'onClick': this.next
        }), this.props.children ? Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'h-scroll-indicator', [Array.from(new Array(this.props.children.length), function (val, index) {
            return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'h-scroll-indicator-item' + (index === _this5.state.selected ? ' active' : ''));
        }), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_3_inferno_router__["Link"], null, null, {
            'to': this.props.linkTo,
            'className': 'h-scroll-link',
            children: this.props.linkText
        })]) : null], null, null, this.attachWrapper);
    };

    return HorizontalScroll;
}(__WEBPACK_IMPORTED_MODULE_1_inferno_component___default.a);

var Home = function (_View) {
    _inherits(Home, _View);

    function Home(props) {
        _classCallCheck(this, Home);

        var _this6 = _possibleConstructorReturn(this, _View.call(this, props));

        _this6.top = 0;
        _this6.touchStart = -1;
        _this6.velocityLast = 0;
        _this6.touchLast = -1;
        _this6.touchDelta = -1;
        _this6.touchLastBuffer = -1;
        _this6.touchLastTime = -1;
        _this6.touchStartTime = -1;
        _this6.opened = false;
        _this6.startTop = false;
        _this6.openedPreviously = false;
        _this6.winHeight = window.innerHeight;
        _this6.content = null;
        _this6.wrapper = null;
        _this6.hero = null;
        _this6.updatePosition = function () {
            _this6.top = _this6.content.getBoundingClientRect().top;
        };
        _this6.updateHeight = function () {
            _this6.wrapper.style.height = _this6.opened ? null : _this6.winHeight + 'px';
            _this6.hero.style.height = _this6.winHeight + 'px';
        };
        _this6.dragRender = function () {
            var delta = _this6.touchLast - _this6.touchStart;
            var y = _this6.top + delta;
            if (_this6.opened || y < 5) {
                if (_this6.openedPreviously) {
                    return true;
                } else {
                    _this6.openedPreviously = true;
                }
            } else {
                _this6.openedPreviously = false;
            }
            _this6.content.style.transform = 'translate3d(0, ' + y + 'px, 0)';
        };
        _this6.dragStart = function (e) {
            _this6.updatePosition();
            _this6.startTop = window.scrollY <= 0;
            if (_this6.opened && window.scrollY < 1) {
                window.scrollTo(0, 1);
            }
            _this6.content.style.borderRadius = null;
            _this6.touchStart = e.touches[0].clientY;
            _this6.touchLastTime = new Date().getTime();
            _this6.touchStartTime = _this6.touchLastTime;
            _this6.touchLast = _this6.touchStart;
            _this6.content.style.transition = 'border-radius 500ms';
            _this6.dragRender();
        };
        _this6.dragEnd = function (e) {
            _this6.calculateVelocity();
            var delta = _this6.touchLast - _this6.touchStart;
            var y = _this6.top + delta;
            var percent = y / (_this6.winHeight * 0.85);
            if (percent > 1) {
                percent = 1 - (percent - 1);
            }
            if (_this6.opened === false) {
                if (delta < 1 && _this6.touchLast > _this6.top && new Date().getTime() - _this6.touchStartTime < 3000) {
                    e.preventDefault();
                    _this6.opened = true;
                    _this6.velocityLast = 0;
                    _this6.top = 0;
                } else if (percent >= 0 && (percent < 0.425 && !(_this6.velocityLast < -0.5) || _this6.velocityLast > 0.5)) {
                    _this6.opened = true;
                    _this6.top = 0;
                } else {
                    _this6.opened = false;
                    _this6.top = _this6.winHeight * 0.85;
                }
            }
            _this6.touchStart = -1;
            _this6.touchLast = -1;
            var animTime = (_this6.opened ? Math.abs(percent) : 1 - Math.abs(percent)) * 200 + 100;
            _this6.content.style.transition = 'all ' + animTime + 'ms cubic-bezier(0.1,' + Math.abs(_this6.velocityLast) * (0.1 * animTime) / Math.abs(y - _this6.top) + ',0.1,1)';
            _this6.content.style.borderRadius = _this6.opened ? '0' : null;
            _this6.updateHeight();
            _this6.dragRender();
        };
        _this6.dragCancel = _this6.dragEnd;
        _this6.dragMove = function (e) {
            _this6.touchLast = e.touches[0].clientY;
            _this6.touchDelta = _this6.touchLastBuffer - e.touches[0].clientY;
            var y = _this6.top + _this6.touchLast - _this6.touchStart;
            if (_this6.opened && window.scrollY - y < 1 && _this6.startTop) {
                _this6.opened = false;
                _this6.touchStart = _this6.touchLast - 1;
                _this6.touchDelta = 0;
                _this6.top = 0;
                _this6.updateHeight();
                e.preventDefault();
            }
            if (!_this6.opened) {
                e.preventDefault();
            }
            _this6.calculateVelocity();
            requestAnimationFrame(_this6.dragRender);
        };
        _this6.onResize = function () {
            _this6.winHeight = window.innerHeight;
            _this6.top = _this6.opened ? 0 : _this6.winHeight * 0.85;
            _this6.updateHeight();
            requestAnimationFrame(_this6.dragRender);
        };
        _this6.attachWrapper = function (el) {
            if (_this6.wrapper == null) {
                _this6.wrapper = el;
                el.addEventListener('touchstart', _this6.dragStart, { passive: false });
                el.addEventListener('touchend', _this6.dragEnd, { passive: false });
                el.addEventListener('touchcancel', _this6.dragCancel, { passive: false });
                el.addEventListener('touchmove', _this6.dragMove, { passive: false });
                window.addEventListener('resize', _this6.onResize);
                _this6.updateHeight();
            }
        };
        _this6.attachHero = function (el) {
            _this6.hero = el;
        };
        _this6.attachContent = function (el) {
            if (_this6.content == null) {
                _this6.content = el;
            }
        };
        _this6.state = {
            posts: null,
            projects: null
        };
        __WEBPACK_IMPORTED_MODULE_0__View__["a" /* default */].setDark(false);
        Object(__WEBPACK_IMPORTED_MODULE_11__views_Blog__["getPosts"])('1', function (posts) {
            _this6.setState({ posts: posts.posts });
        }, true, 5);
        Object(__WEBPACK_IMPORTED_MODULE_12__views_Projects__["getProjects"])('1', function (projects) {
            _this6.setState({ projects: projects.projects });
        }, 5);
        return _this6;
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
        var _state3 = this.state,
            posts = _state3.posts,
            projects = _state3.projects;

        return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'home-component', [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'home-content', Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'home-content-inner', Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, HomeContent)), null, null, this.attachHero), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'div', 'content-wrapper', [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, HorizontalScroll, null, null, {
            'linkText': Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'span', null, [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_7__components_Icon__["b" /* default */], null, null, {
                'icon': __WEBPACK_IMPORTED_MODULE_7__components_Icon__["a" /* Icons */].NEWSPAPER
            }), 'All Posts']),
            'linkTo': '/blog/',
            'className': 'home-blog',
            children: posts ? posts.map(function (post) {
                return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_11__views_Blog__["Post"], null, null, _extends({}, post), post.url);
            }) : null
        }), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, HorizontalScroll, null, null, {
            'linkText': Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(2, 'span', null, [Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_7__components_Icon__["b" /* default */], null, null, {
                'icon': __WEBPACK_IMPORTED_MODULE_7__components_Icon__["a" /* Icons */].NEWSPAPER
            }), 'All Projects']),
            'linkTo': '/projects/',
            'className': 'home-projects',
            children: projects ? projects.map(function (project) {
                return Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_12__views_Projects__["Project"], null, null, _extends({}, project), project.url);
            }) : null
        }), Object(__WEBPACK_IMPORTED_MODULE_14_inferno__["createVNode"])(16, __WEBPACK_IMPORTED_MODULE_6__components_Footer__["a" /* default */])], null, null, this.attachContent)], null, null, this.attachWrapper);
    };

    return Home;
}(__WEBPACK_IMPORTED_MODULE_0__View__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (Home);

/***/ }),
/* 56 */,
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_GlobalLoader__ = __webpack_require__(5);
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

    return View;
}(__WEBPACK_IMPORTED_MODULE_0_inferno_component___default.a);

/* harmony default export */ __webpack_exports__["a"] = (View);

View.setDark = function (dark) {
    document.body.classList[dark ? 'add' : 'remove']('dark-top');
};

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Contact__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__LazyImage__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__img_profile_footer_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Footer_scss__ = __webpack_require__(60);
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
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "profile-footer.png";

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
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
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".body-font, footer.footer > p {\n  font-family: \"proxima-nova\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }\n\n.head-font {\n  font-family: \"museo-slab\", 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; }\n\n.code-font {\n  font-family: \"source-code-pro\", sans-serif; }\n\n@keyframes loadingBackgroundAnimation {\n  0% {\n    background-position: bottom left; }\n  100% {\n    background-position: top right; } }\n\n.loading-background {\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  animation-name: loadingBackgroundAnimation;\n  animation-timing-function: linear;\n  background: #f6f7f8;\n  background: linear-gradient(45deg, #f6f7f8 25%, #dee1e2 50%, #f6f7f8 75%);\n  background-size: 400% 400%; }\n\nfooter.footer {\n  padding: 3rem 2rem;\n  text-align: center; }\n  footer.footer > a.footer-about {\n    display: inline-block;\n    height: 5rem;\n    width: 5rem;\n    border: 1px solid #2ac648;\n    border-radius: 100%;\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    transform: scale(1);\n    -webkit-tap-highlight-color: transparent;\n    transition: transform 250ms cubic-bezier(0.19, 1, 0.22, 1); }\n    footer.footer > a.footer-about.touched {\n      transform: scale(1.1); }\n    footer.footer > a.footer-about > img {\n      height: 5rem;\n      width: 5rem; }\n  footer.footer > p {\n    color: #777;\n    font-weight: 400;\n    line-height: 2rem;\n    font-size: 0.9rem;\n    padding: 1rem;\n    text-align: center;\n    margin: 0.5rem 0; }\n", ""]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PaginationLink; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Pagination_scss__ = __webpack_require__(64);
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
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Title_scss__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Title_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Title_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_inferno__);



/* harmony default export */ __webpack_exports__["a"] = (function (props) {
    return Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'div', 'title-wrapper', [Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'header', 'title', Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'h1', null, props.title), {
        'style': { backgroundImage: 'url(' + props.image + ')' }
    }), Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(128, 'svg', 'title-curve', Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'path', null, null, {
        'd': 'M 0,80 L 0,50 C 100,0 300,0 400,50 L 400,80',
        'stroke-width': 0,
        'fill': 'white'
    }), {
        'viewBox': '0 0 400 80',
        'height': '2%',
        'preserveAspectRatio': 'none'
    })]);
});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(65);
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
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".pagination {\n  display: flex;\n  background: #FAFAFA;\n  position: relative; }\n  .pagination > a, .pagination > span, .pagination > .pagination-element {\n    flex: 0;\n    font-weight: 700;\n    display: block;\n    font-size: 1rem;\n    padding: 1rem;\n    text-align: center;\n    color: #444;\n    white-space: nowrap; }\n    .pagination > a.expand, .pagination > span.expand, .pagination > .pagination-element.expand {\n      flex: 1; }\n  .pagination > span {\n    cursor: default;\n    opacity: 0.25; }\n  .pagination > select {\n    background: transparent;\n    border-style: none;\n    display: block;\n    -webkit-appearance: none; }\n  .pagination > a {\n    text-decoration: none; }\n    .pagination > a:hover {\n      text-decoration: none; }\n\n@media (min-width: 750px) {\n  .pagination {\n    background: transparent;\n    justify-content: center; }\n    .pagination > .expand {\n      flex: 0 !important; } }\n", ""]);

// exports


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(67);
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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".body-font {\n  font-family: \"proxima-nova\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }\n\n.head-font, .title-wrapper .title h1 {\n  font-family: \"museo-slab\", 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; }\n\n.code-font {\n  font-family: \"source-code-pro\", sans-serif; }\n\n@keyframes loadingBackgroundAnimation {\n  0% {\n    background-position: bottom left; }\n  100% {\n    background-position: top right; } }\n\n.loading-background {\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  animation-name: loadingBackgroundAnimation;\n  animation-timing-function: linear;\n  background: #f6f7f8;\n  background: linear-gradient(45deg, #f6f7f8 25%, #dee1e2 50%, #f6f7f8 75%);\n  background-size: 400% 400%; }\n\n.title-wrapper .title {\n  padding: 5rem 2rem 4rem 2rem;\n  background-size: cover;\n  background-position: center center;\n  text-align: center; }\n  .title-wrapper .title h1 {\n    font-size: 2rem;\n    text-align: center;\n    padding: 1rem;\n    margin: 0;\n    color: #FFF;\n    font-weight: 300; }\n\n.title-wrapper .title-curve {\n  display: none; }\n\n@media (min-width: 750px) {\n  .title-wrapper .title {\n    padding: 9rem 2rem 13rem 2rem; }\n    .title-wrapper .title h1 {\n      font-size: 3.5rem; }\n  .title-wrapper .title-curve {\n    margin-top: -80px;\n    height: 80px;\n    width: 100%;\n    display: block; } }\n", ""]);

// exports


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "blog.jpg";

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(70);
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
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".body-font {\n  font-family: \"proxima-nova\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }\n\n.head-font, .post-preview > .post-preview-body > h3 {\n  font-family: \"museo-slab\", 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; }\n\n.code-font {\n  font-family: \"source-code-pro\", sans-serif; }\n\n@keyframes loadingBackgroundAnimation {\n  0% {\n    background-position: bottom left; }\n  100% {\n    background-position: top right; } }\n\n.loading-background {\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  animation-name: loadingBackgroundAnimation;\n  animation-timing-function: linear;\n  background: #f6f7f8;\n  background: linear-gradient(45deg, #f6f7f8 25%, #dee1e2 50%, #f6f7f8 75%);\n  background-size: 400% 400%; }\n\n.blog-template .blog-entries {\n  border-radius: 1rem 1rem 0 0;\n  margin: -1rem 0 0 0;\n  overflow: hidden;\n  position: relative;\n  background: #FFF;\n  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1); }\n\n@media (min-width: 750px) {\n  .blog-template .blog-entries {\n    max-width: 700px;\n    margin: -8rem auto 3rem auto;\n    border-radius: 0.75rem; } }\n\n.post-preview {\n  display: block;\n  text-decoration: none; }\n  .post-preview.no-image {\n    border-top: 1px solid #EEE; }\n  .post-preview > .lazy-image-loader {\n    width: 100%;\n    overflow: hidden; }\n    .post-preview > .lazy-image-loader > img {\n      width: 100%;\n      transform: scale(1);\n      transition: all 250ms; }\n  .post-preview > .post-preview-body {\n    padding: 1.5rem 2rem;\n    display: block; }\n    .post-preview > .post-preview-body > h3 {\n      font-weight: 500;\n      color: #2ac648;\n      font-size: 1.25rem;\n      line-height: 1.5rem;\n      margin: 0;\n      padding: 0 0 0.5rem 0; }\n    .post-preview > .post-preview-body > p {\n      font-size: 1rem;\n      line-height: 1.5rem;\n      color: #444;\n      margin: 0;\n      padding: 0; }\n      .post-preview > .post-preview-body > p > strong {\n        display: block; }\n  .post-preview:hover {\n    text-decoration: none; }\n    .post-preview:hover > .lazy-image-loader > img {\n      transform: scale(1.05); }\n", ""]);

// exports


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "projects.jpg";

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(73);
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
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Projects.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Projects.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".body-font {\n  font-family: \"proxima-nova\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }\n\n.head-font, .project-preview > .project-preview-body > h3 {\n  font-family: \"museo-slab\", 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; }\n\n.code-font {\n  font-family: \"source-code-pro\", sans-serif; }\n\n@keyframes loadingBackgroundAnimation {\n  0% {\n    background-position: bottom left; }\n  100% {\n    background-position: top right; } }\n\n.loading-background {\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  animation-name: loadingBackgroundAnimation;\n  animation-timing-function: linear;\n  background: #f6f7f8;\n  background: linear-gradient(45deg, #f6f7f8 25%, #dee1e2 50%, #f6f7f8 75%);\n  background-size: 400% 400%; }\n\n.projects-template .project-entries {\n  border-radius: 1rem 1rem 0 0;\n  margin: -1rem 0 0 0;\n  overflow: hidden;\n  position: relative;\n  background: #FFF;\n  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1); }\n\n@media (min-width: 750px) {\n  .projects-template .project-entries {\n    max-width: 700px;\n    margin: -8rem auto 3rem auto;\n    border-radius: 0.75rem; } }\n\n.project-preview {\n  display: block;\n  position: relative; }\n  .project-preview > .lazy-image-loader {\n    -webkit-filter: grayscale(90%);\n    -moz-filter: grayscale(90%);\n    -ms-filter: grayscale(90%);\n    -o-filter: grayscale(90%);\n    height: 12rem;\n    overflow: hidden;\n    position: relative; }\n    .project-preview > .lazy-image-loader > img {\n      position: absolute;\n      top: 50%;\n      transform: translateY(-50%) !important;\n      width: 100%; }\n  .project-preview > .project-preview-theme, .project-preview > .project-preview-gradient {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%; }\n    .project-preview > .project-preview-theme.project-preview-theme, .project-preview > .project-preview-gradient.project-preview-theme {\n      opacity: 0.9; }\n    .project-preview > .project-preview-theme.project-preview-gradient, .project-preview > .project-preview-gradient.project-preview-gradient {\n      opacity: 0.5; }\n  .project-preview:nth-child(odd) > .project-preview-gradient {\n    background: linear-gradient(to top right, rgba(255, 255, 255, 0) 50%, white); }\n  .project-preview:nth-child(even) > .project-preview-gradient {\n    background: linear-gradient(to top left, rgba(255, 255, 255, 0) 50%, white); }\n  .project-preview > .project-preview-body {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    box-sizing: border-box;\n    padding: 2rem; }\n    .project-preview > .project-preview-body > h3 {\n      font-weight: 500;\n      color: #FFF;\n      font-size: 1.25rem;\n      line-height: 1.5rem;\n      margin: 0;\n      padding: 0 0 0.5rem 0; }\n    .project-preview > .project-preview-body > p {\n      opacity: 0.7;\n      font-size: 1rem;\n      line-height: 1.5rem;\n      color: #FFF;\n      margin: 0;\n      padding: 0; }\n", ""]);

// exports


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inferno_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_inferno_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Button_scss__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Button_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Button_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_inferno__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var Button = function (_Component) {
    _inherits(Button, _Component);

    function Button() {
        _classCallCheck(this, Button);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Button.prototype.render = function render() {
        return Object(__WEBPACK_IMPORTED_MODULE_2_inferno__["createVNode"])(2, 'button', 'button', this.props.children, _extends({}, this.props));
    };

    return Button;
}(__WEBPACK_IMPORTED_MODULE_0_inferno_component___default.a);

/* harmony default export */ __webpack_exports__["a"] = (Button);

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(76);
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
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Button.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./Button.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".body-font, .button {\n  font-family: \"proxima-nova\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }\n\n.head-font {\n  font-family: \"museo-slab\", 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; }\n\n.code-font {\n  font-family: \"source-code-pro\", sans-serif; }\n\n@keyframes loadingBackgroundAnimation {\n  0% {\n    background-position: bottom left; }\n  100% {\n    background-position: top right; } }\n\n.loading-background {\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  animation-name: loadingBackgroundAnimation;\n  animation-timing-function: linear;\n  background: #f6f7f8;\n  background: linear-gradient(45deg, #f6f7f8 25%, #dee1e2 50%, #f6f7f8 75%);\n  background-size: 400% 400%; }\n\n.button {\n  border-style: none;\n  padding: 0.5rem 1rem;\n  font-size: 1rem;\n  border-radius: 3px;\n  background: #2ac648;\n  transform: scale(1);\n  transition: all 250ms;\n  touch-action: manipulation;\n  box-shadow: none;\n  color: #FFF; }\n  .button:hover {\n    transform: scale(1.1);\n    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); }\n", ""]);

// exports


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "thinking.jpg";

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(79);
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
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".body-font, .home-component .home-content {\n  font-family: \"proxima-nova\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }\n\n.head-font {\n  font-family: \"museo-slab\", 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; }\n\n.code-font {\n  font-family: \"source-code-pro\", sans-serif; }\n\n@keyframes loadingBackgroundAnimation {\n  0% {\n    background-position: bottom left; }\n  100% {\n    background-position: top right; } }\n\n.loading-background {\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  animation-name: loadingBackgroundAnimation;\n  animation-timing-function: linear;\n  background: #f6f7f8;\n  background: linear-gradient(45deg, #f6f7f8 25%, #dee1e2 50%, #f6f7f8 75%);\n  background-size: 400% 400%; }\n\n.home-component {\n  overflow-y: hidden;\n  position: static;\n  background: #FFF;\n  background-size: cover; }\n  .home-component .home-content {\n    height: 100%;\n    background-size: cover;\n    box-sizing: border-box;\n    overflow: hidden;\n    padding: 90px 4rem;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%; }\n    .home-component .home-content .home-content-inner {\n      flex: 0;\n      text-align: center; }\n    .home-component .home-content .home-message {\n      opacity: 0;\n      transform: scale(0.9);\n      transition: all 400ms; }\n      .home-component .home-content .home-message.visible {\n        opacity: 1;\n        transform: scale(1); }\n    .home-component .home-content .home-prompt {\n      line-height: 0; }\n      .home-component .home-content .home-prompt img {\n        width: 5rem; }\n  .home-component .content-wrapper {\n    position: relative;\n    transform-origin: top center;\n    transform: translateY(85vh);\n    background: #FFF;\n    transition-timing-function: ease-out;\n    -webkit-transition-timing-function: ease-out;\n    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);\n    border-radius: 1rem 1rem 0 0;\n    overflow: hidden; }\n  .home-component .lazy-image-loader {\n    height: 12rem;\n    position: relative; }\n    .home-component .lazy-image-loader > img {\n      position: absolute;\n      top: 50%;\n      transform: translateY(-50%) !important;\n      width: 100%; }\n  .home-component .home-blog > .h-scroll-nav {\n    top: 10.85rem;\n    background: #FFF;\n    border-radius: 100%;\n    width: 1rem;\n    height: 1rem;\n    padding: 0.65rem;\n    box-sizing: content-box;\n    text-align: center;\n    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);\n    color: #2ac648; }\n  .home-component .home-blog > .h-scroll-indicator {\n    margin-top: -1rem;\n    padding-bottom: 1rem; }\n    .home-component .home-blog > .h-scroll-indicator > .h-scroll-link {\n      color: #2ac648; }\n  .home-component .home-projects > .h-scroll-contents > .project-preview > .project-preview-body {\n    padding: 2rem 5rem 2.5rem 2rem; }\n  .home-component .home-projects > .h-scroll-nav {\n    top: 4.85rem;\n    border-radius: 100%;\n    width: 1rem;\n    height: 1rem;\n    padding: 0.65rem;\n    box-sizing: content-box;\n    text-align: center;\n    color: #FFF;\n    transition: opacity 250ms;\n    opacity: 0.5;\n    display: block; }\n    .home-component .home-projects > .h-scroll-nav.active {\n      opacity: 1; }\n    .home-component .home-projects > .h-scroll-nav.left {\n      right: 3.5rem;\n      left: auto; }\n  .home-component .home-projects > .h-scroll-indicator {\n    margin-top: -2.5rem; }\n    .home-component .home-projects > .h-scroll-indicator > .h-scroll-indicator-item {\n      background: #FFF;\n      opacity: 0.5;\n      transition: opacity 250ms; }\n      .home-component .home-projects > .h-scroll-indicator > .h-scroll-indicator-item.active {\n        opacity: 1;\n        background: #FFF; }\n    .home-component .home-projects > .h-scroll-indicator > .h-scroll-link {\n      color: #FFF;\n      opacity: 0.75; }\n\n.h-scroll {\n  position: relative; }\n  .h-scroll > .h-scroll-contents {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: nowrap; }\n    .h-scroll > .h-scroll-contents > * {\n      width: 100%;\n      flex: 0 0 auto; }\n  .h-scroll > .h-scroll-nav {\n    position: absolute;\n    top: 50%;\n    padding: 0.5rem;\n    font-size: 1rem;\n    display: none; }\n    .h-scroll > .h-scroll-nav.active {\n      display: block; }\n    .h-scroll > .h-scroll-nav.right {\n      right: 1rem; }\n    .h-scroll > .h-scroll-nav.left {\n      left: 1rem; }\n  .h-scroll > .h-scroll-indicator {\n    position: relative;\n    padding: 0.5rem 2rem 0.5rem 1.75rem; }\n    .h-scroll > .h-scroll-indicator > .h-scroll-indicator-item {\n      border-radius: 100%;\n      height: 0.5rem;\n      width: 0.5rem;\n      margin: 0.25rem 0.25rem;\n      background: #DDD;\n      transition: background 250ms;\n      display: inline-block; }\n      .h-scroll > .h-scroll-indicator > .h-scroll-indicator-item.active {\n        background: #2ac648; }\n    .h-scroll > .h-scroll-indicator > .h-scroll-link {\n      position: absolute;\n      top: 0rem;\n      right: 1.75rem;\n      text-decoration: none;\n      font-size: 1rem;\n      border-radius: 0.5rem;\n      padding: 0.25rem;\n      margin: 0;\n      opacity: 1;\n      transition: opacity 250ms; }\n      .h-scroll > .h-scroll-indicator > .h-scroll-link i {\n        margin-right: 0.5rem;\n        margin-top: 0.1rem;\n        vertical-align: text-top; }\n      .h-scroll > .h-scroll-indicator > .h-scroll-link:hover {\n        opacity: 0.5; }\n", ""]);

// exports


/***/ })
]));