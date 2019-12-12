module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s="QfWi")}({"3br2":function(t,e,n){"use strict";(function(t){var r=n("FA6U"),o=n.n(r);e.a=function(){return t("div",{class:o.a.home},t("h1",null,"Home"),t("p",null,"This is the Home component."))}}).call(this,n("HteQ").h)},"9wh+":function(t,e,n){"use strict";(function(t){n.d(e,"a",(function(){return u}));var r=n("HteQ"),o=n("NWYn"),i=n.n(o);var u=function(e){var n,r;function o(){for(var t,n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(t=e.call.apply(e,[this].concat(r))||this).state={time:Date.now(),count:10},t.updateTime=function(){t.setState({time:Date.now()})},t.increment=function(){t.setState({count:t.state.count+1})},t}r=e,(n=o).prototype=Object.create(r.prototype),n.prototype.constructor=n,n.__proto__=r;var u=o.prototype;return u.componentDidMount=function(){this.timer=setInterval(this.updateTime,1e3)},u.componentWillUnmount=function(){clearInterval(this.timer)},u.render=function(e,n){var r=e.user,o=n.time,u=n.count;return t("div",{class:i.a.profile},t("h1",null,"Profile: ",r),t("p",null,"This is the user profile for a user named ",r,"."),t("div",null,"Current time: ",new Date(o).toLocaleString()),t("p",null,t("button",{onClick:this.increment},"Click Me")," Clicked ",u," ","times."))},o}(r.Component)}).call(this,n("HteQ").h)},FA6U:function(t,e,n){t.exports={home:"home__MseGd"}},GFNa:function(t,e,n){},HteQ:function(t,e){t.exports=require("preact")},NWYn:function(t,e,n){t.exports={profile:"profile__t2Dqz"}},QfWi:function(t,e,n){"use strict";n.r(e);n("GFNa");var r=n("HteQ"),o=n("Y3FI"),i=n("ox/y"),u=n("ySiU"),a=n.n(u),c=function(){return Object(r.h)("header",{class:a.a.header},Object(r.h)("h1",null,"Preact App"),Object(r.h)("nav",null,Object(r.h)(i.Link,{activeClassName:a.a.active,href:"/"},"Home"),Object(r.h)(i.Link,{activeClassName:a.a.active,href:"/profile"},"Me"),Object(r.h)(i.Link,{activeClassName:a.a.active,href:"/profile/john"},"John")))},p=n("3br2"),l=n("9wh+");var s=function(t){var e,n;function i(){for(var e,n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))||this).handleRoute=function(t){e.currentUrl=t.url},e}return n=t,(e=i).prototype=Object.create(n.prototype),e.prototype.constructor=e,e.__proto__=n,i.prototype.render=function(){return Object(r.h)("div",{id:"app"},Object(r.h)(c,null),Object(r.h)(o.Router,{onChange:this.handleRoute},Object(r.h)(p.a,{path:"/"}),Object(r.h)(l.a,{path:"/profile/",user:"me"}),Object(r.h)(l.a,{path:"/profile/:user"})))},i}(r.Component);e.default=s},Y3FI:function(t,e,n){"use strict";n.r(e),n.d(e,"subscribers",(function(){return h})),n.d(e,"getCurrentUrl",(function(){return v})),n.d(e,"route",(function(){return m})),n.d(e,"Router",(function(){return _})),n.d(e,"Route",(function(){return U})),n.d(e,"Link",(function(){return x})),n.d(e,"exec",(function(){return u}));var r=n("HteQ"),o={};function i(t,e){for(var n in e)t[n]=e[n];return t}function u(t,e,n){var r,i=/(?:\?([^#]*))?(#.*)?$/,u=t.match(i),a={};if(u&&u[1])for(var c=u[1].split("&"),l=0;l<c.length;l++){var s=c[l].split("=");a[decodeURIComponent(s[0])]=decodeURIComponent(s.slice(1).join("="))}t=p(t.replace(i,"")),e=p(e||"");for(var f=Math.max(t.length,e.length),h=0;h<f;h++)if(e[h]&&":"===e[h].charAt(0)){var d=e[h].replace(/(^:|[+*?]+$)/g,""),v=(e[h].match(/[+*?]+$/)||o)[0]||"",m=~v.indexOf("+"),y=~v.indexOf("*"),b=t[h]||"";if(!b&&!y&&(v.indexOf("?")<0||m)){r=!1;break}if(a[d]=decodeURIComponent(b),m||y){a[d]=t.slice(h).map(decodeURIComponent).join("/");break}}else if(e[h]!==t[h]){r=!1;break}return(!0===n.default||!1!==r)&&a}function a(t,e){return t.rank<e.rank?1:t.rank>e.rank?-1:t.index-e.index}function c(t,e){return t.index=e,t.rank=function(t){return t.props.default?0:(e=t.props.path,p(e).map(l).join(""));var e}(t),t.props}function p(t){return t.replace(/(^\/+|\/+$)/g,"").split("/")}function l(t){return":"==t.charAt(0)?1+"*+?".indexOf(t.charAt(t.length-1))||4:5}var s=null,f=[],h=[],d={};function v(){var t;return""+((t=s&&s.location?s.location:s&&s.getCurrentLocation?s.getCurrentLocation():"undefined"!=typeof location?location:d).pathname||"")+(t.search||"")}function m(t,e){return void 0===e&&(e=!1),"string"!=typeof t&&t.url&&(e=t.replace,t=t.url),function(t){for(var e=f.length;e--;)if(f[e].canRoute(t))return!0;return!1}(t)&&function(t,e){void 0===e&&(e="push"),s&&s[e]?s[e](t):"undefined"!=typeof history&&history[e+"State"]&&history[e+"State"](null,null,t)}(t,e?"replace":"push"),y(t)}function y(t){for(var e=!1,n=0;n<f.length;n++)!0===f[n].routeTo(t)&&(e=!0);for(var r=h.length;r--;)h[r](t);return e}function b(t){if(t&&t.getAttribute){var e=t.getAttribute("href"),n=t.getAttribute("target");if(e&&e.match(/^\//g)&&(!n||n.match(/^_?self$/i)))return m(e)}}function g(t){if(0==t.button)return b(t.currentTarget||t.target||this),O(t)}function O(t){return t&&(t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation(),t.preventDefault()),!1}function j(t){if(!(t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||0!==t.button)){var e=t.target;do{if("A"===String(e.nodeName).toUpperCase()&&e.getAttribute("href")){if(e.hasAttribute("native"))return;if(b(e))return O(t)}}while(e=e.parentNode)}}var C=!1;var _=function(t){function e(e){t.call(this,e),e.history&&(s=e.history),this.state={url:e.url||v()},C||("function"==typeof addEventListener&&(s||addEventListener("popstate",(function(){y(v())})),addEventListener("click",j)),C=!0)}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.shouldComponentUpdate=function(t){return!0!==t.static||(t.url!==this.props.url||t.onChange!==this.props.onChange)},e.prototype.canRoute=function(t){var e=Object(r.toChildArray)(this.props.children);return this.getMatchingChildren(e,t,!1).length>0},e.prototype.routeTo=function(t){this.setState({url:t});var e=this.canRoute(t);return this.updating||this.forceUpdate(),e},e.prototype.componentWillMount=function(){f.push(this),this.updating=!0},e.prototype.componentDidMount=function(){var t=this;s&&(this.unlisten=s.listen((function(e){t.routeTo(""+(e.pathname||"")+(e.search||""))}))),this.updating=!1},e.prototype.componentWillUnmount=function(){"function"==typeof this.unlisten&&this.unlisten(),f.splice(f.indexOf(this),1)},e.prototype.componentWillUpdate=function(){this.updating=!0},e.prototype.componentDidUpdate=function(){this.updating=!1},e.prototype.getMatchingChildren=function(t,e,n){return t.filter(c).sort(a).map((function(t){var o=u(e,t.props.path,t.props);if(o){if(!1!==n){var a={url:e,matches:o};return i(a,o),delete a.ref,delete a.key,Object(r.cloneElement)(t,a)}return t}})).filter(Boolean)},e.prototype.render=function(t,e){var n=t.children,o=t.onChange,i=e.url,u=this.getMatchingChildren(Object(r.toChildArray)(n),i,!0),a=u[0]||null,c=this.previousUrl;return i!==c&&(this.previousUrl=i,"function"==typeof o&&o({router:this,url:i,previous:c,active:u,current:a})),a},e}(r.Component),x=function(t){return Object(r.createElement)("a",i({onClick:g},t))},U=function(t){return Object(r.createElement)(t.component,t)};_.subscribers=h,_.getCurrentUrl=v,_.route=m,_.Router=_,_.Route=U,_.Link=x,e.default=_},"ox/y":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Link=e.Match=void 0;var r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},o=n("HteQ"),i=n("Y3FI");function u(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}var a=e.Match=function(t){function e(){var n,r;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=u(this,t.call.apply(t,[this].concat(i))),r.update=function(t){r.nextUrl=t,r.setState({})},u(r,n)}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype.componentDidMount=function(){i.subscribers.push(this.update)},e.prototype.componentWillUnmount=function(){i.subscribers.splice(i.subscribers.indexOf(this.update)>>>0,1)},e.prototype.render=function(t){var e=this.nextUrl||(0,i.getCurrentUrl)(),n=e.replace(/\?.+$/,"");return this.nextUrl=null,t.children({url:e,path:n,matches:!1!==(0,i.exec)(n,t.path,{})})},e}(o.Component),c=function(t){var e=t.activeClassName,n=t.path,u=function(t,e){var n={};for(var r in t)e.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n}(t,["activeClassName","path"]);return(0,o.h)(a,{path:n||u.href},(function(t){var n=t.matches;return(0,o.h)(i.Link,r({},u,{class:[u.class||u.className,n&&e].filter(Boolean).join(" ")}))}))};e.Link=c,e.default=a,a.Link=c},ySiU:function(t,e,n){t.exports={header:"header__3QGkI",active:"active__3gItZ"}}});
//# sourceMappingURL=ssr-bundle.js.map