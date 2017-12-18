webpackJsonp([3],{

/***/ 41:
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

/***/ }),

/***/ 58:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__View__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_inferno___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_inferno__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var About = function (_View) {
    _inherits(About, _View);

    function About(props) {
        _classCallCheck(this, About);

        return _possibleConstructorReturn(this, _View.call(this, props));
    }

    About.prototype.render = function render() {
        return Object(__WEBPACK_IMPORTED_MODULE_1_inferno__["createVNode"])(2, 'div', null, '"Hello World!"');
    };

    return About;
}(__WEBPACK_IMPORTED_MODULE_0__View__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (About);

/***/ })

});