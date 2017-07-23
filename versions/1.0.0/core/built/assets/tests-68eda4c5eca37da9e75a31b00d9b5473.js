'use strict';

define('ghost-admin/tests/acceptance/authentication-test', ['jquery', 'ghost-admin/authenticators/oauth2', 'ghost-admin/tests/helpers/destroy-app', 'ghost-admin/utils/ghost-paths', 'ember-runloop', 'ghost-admin/tests/helpers/start-app', 'ghost-admin/utils/window-proxy', 'ember-cli-mirage', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_jquery, _oauth, _destroyApp, _ghostPaths, _emberRunloop, _startApp, _windowProxy, _emberCliMirage, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    var Ghost = (0, _ghostPaths.default)();

    (0, _mocha.describe)('Acceptance: Authentication', function () {
        var application = void 0,
            originalReplaceLocation = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.describe)('setup redirect', function () {
            (0, _mocha.beforeEach)(function () {
                server.get('authentication/setup', function () {
                    return { setup: [{ status: false }] };
                });
            });

            (0, _mocha.it)('redirects to setup when setup isn\'t complete', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return visit('settings/labs');

                            case 2:

                                (0, _chai.expect)(currentURL()).to.equal('/setup/one');

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));
        });

        (0, _mocha.describe)('token handling', function () {
            (0, _mocha.beforeEach)(function () {
                // replace the default test authenticator with our own authenticator
                application.register('authenticator:test', _oauth.default);

                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role], slug: 'test-user' });
            });

            (0, _mocha.it)('refreshes tokens on boot if last refreshed > 24hrs ago', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var _application, container, _container$lookup, session, newSession, requests, refreshRequest, requestBody;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return (0, _emberSimpleAuth.authenticateSession)(application, {
                                    access_token: 'access_token',
                                    refresh_token: 'refresh_token'
                                });

                            case 2:

                                // authenticating the session above will trigger a token refresh
                                // request so we need to clear it to ensure we aren't testing the
                                // test behaviour instead of application behaviour
                                server.pretender.handledRequests = [];

                                // fake a longer session so it appears that we last refreshed > 24hrs ago
                                _application = application, container = _application.__container__;
                                _container$lookup = container.lookup('service:session'), session = _container$lookup.session;
                                newSession = session.get('content');

                                newSession.authenticated.expires_in = 172800 * 2;
                                session.get('store').persist(newSession);
                                /* eslint-enable camelcase */

                                _context2.next = 10;
                                return visit('/');

                            case 10:
                                requests = server.pretender.handledRequests;
                                refreshRequest = requests.findBy('url', '/ghost/api/v0.1/authentication/token');


                                (0, _chai.expect)(refreshRequest, 'token refresh request').to.exist;
                                (0, _chai.expect)(refreshRequest.method, 'method').to.equal('POST');

                                requestBody = _jquery.default.deparam(refreshRequest.requestBody);

                                (0, _chai.expect)(requestBody.grant_type, 'grant_type').to.equal('refresh_token');
                                (0, _chai.expect)(requestBody.refresh_token, 'refresh_token').to.equal('MirageRefreshToken');

                            case 17:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })));

            (0, _mocha.it)('doesn\'t refresh tokens on boot if last refreshed < 24hrs ago', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var requests, refreshRequest;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return (0, _emberSimpleAuth.authenticateSession)(application, {
                                    access_token: 'access_token',
                                    refresh_token: 'refresh_token'
                                });

                            case 2:
                                /* eslint-enable camelcase */

                                // authenticating the session above will trigger a token refresh
                                // request so we need to clear it to ensure we aren't testing the
                                // test behaviour instead of application behaviour
                                server.pretender.handledRequests = [];

                                // we've only just refreshed tokens above so we should always be < 24hrs
                                _context3.next = 5;
                                return visit('/');

                            case 5:
                                requests = server.pretender.handledRequests;
                                refreshRequest = requests.findBy('url', '/ghost/api/v0.1/authentication/token');


                                (0, _chai.expect)(refreshRequest, 'refresh request').to.not.exist;

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));
        });

        (0, _mocha.describe)('general page', function () {
            var newLocation = void 0;

            (0, _mocha.beforeEach)(function () {
                originalReplaceLocation = _windowProxy.default.replaceLocation;
                _windowProxy.default.replaceLocation = function (url) {
                    url = url.replace(/^\/ghost\//, '/');
                    newLocation = url;
                };
                newLocation = undefined;

                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role], slug: 'test-user' });
            });

            (0, _mocha.afterEach)(function () {
                _windowProxy.default.replaceLocation = originalReplaceLocation;
            });

            (0, _mocha.it)('invalidates session on 401 API response', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                // return a 401 when attempting to retrieve users
                                server.get('/users/', function () {
                                    return new _emberCliMirage.Response(401, {}, {
                                        errors: [{ message: 'Access denied.', errorType: 'UnauthorizedError' }]
                                    });
                                });

                                _context4.next = 3;
                                return (0, _emberSimpleAuth.authenticateSession)(application);

                            case 3:
                                _context4.next = 5;
                                return visit('/team');

                            case 5:
                                if (!newLocation) {
                                    _context4.next = 8;
                                    break;
                                }

                                _context4.next = 8;
                                return visit(newLocation);

                            case 8:

                                (0, _chai.expect)(currentURL(), 'url after 401').to.equal('/signin');

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));

            (0, _mocha.it)('doesn\'t show navigation menu on invalid url when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                (0, _emberSimpleAuth.invalidateSession)(application);

                                _context5.next = 3;
                                return visit('/');

                            case 3:

                                (0, _chai.expect)(currentURL(), 'current url').to.equal('/signin');
                                (0, _chai.expect)(find('nav.gh-nav').length, 'nav menu presence').to.equal(0);

                                _context5.next = 7;
                                return visit('/signin/invalidurl/');

                            case 7:

                                (0, _chai.expect)(currentURL(), 'url after invalid url').to.equal('/signin/invalidurl/');
                                (0, _chai.expect)(currentPath(), 'path after invalid url').to.equal('error404');
                                (0, _chai.expect)(find('nav.gh-nav').length, 'nav menu presence').to.equal(0);

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));

            (0, _mocha.it)('shows nav menu on invalid url when authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return (0, _emberSimpleAuth.authenticateSession)(application);

                            case 2:
                                _context6.next = 4;
                                return visit('/signin/invalidurl/');

                            case 4:

                                (0, _chai.expect)(currentURL(), 'url after invalid url').to.equal('/signin/invalidurl/');
                                (0, _chai.expect)(currentPath(), 'path after invalid url').to.equal('error404');
                                (0, _chai.expect)(find('nav.gh-nav').length, 'nav menu presence').to.equal(1);

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            })));
        });

        // TODO: re-enable once modal reappears correctly
        _mocha.describe.skip('editor', function () {
            var origDebounce = _emberRunloop.default.debounce;
            var origThrottle = _emberRunloop.default.throttle;

            // we don't want the autosave interfering in this test
            (0, _mocha.beforeEach)(function () {
                _emberRunloop.default.debounce = function () {};
                _emberRunloop.default.throttle = function () {};
            });

            (0, _mocha.it)('displays re-auth modal attempting to save with invalid session', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                var role;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                role = server.create('role', { name: 'Administrator' });

                                server.create('user', { roles: [role] });

                                // simulate an invalid session when saving the edited post
                                server.put('/posts/:id/', function (_ref8, _ref9) {
                                    var posts = _ref8.posts;
                                    var params = _ref9.params;

                                    var post = posts.find(params.id);
                                    var attrs = this.normalizedRequestAttrs();

                                    if (attrs.mobiledoc.cards[0][1].markdown === 'Edited post body') {
                                        return new _emberCliMirage.Response(401, {}, {
                                            errors: [{ message: 'Access denied.', errorType: 'UnauthorizedError' }]
                                        });
                                    } else {
                                        return post.update(attrs);
                                    }
                                });

                                _context7.next = 5;
                                return (0, _emberSimpleAuth.authenticateSession)(application);

                            case 5:
                                _context7.next = 7;
                                return visit('/editor');

                            case 7:
                                _context7.next = 9;
                                return fillIn('#entry-title', 'Test Post');

                            case 9:
                                _context7.next = 11;
                                return fillIn('.__mobiledoc-editor', 'Test post body');

                            case 11:
                                _context7.next = 13;
                                return click('.js-publish-button');

                            case 13:

                                // we shouldn't have a modal at this point
                                (0, _chai.expect)(find('.modal-container #login').length, 'modal exists').to.equal(0);
                                // we also shouldn't have any alerts
                                (0, _chai.expect)(find('.gh-alert').length, 'no of alerts').to.equal(0);

                                // update the post
                                _context7.next = 17;
                                return fillIn('.__mobiledoc-editor', 'Edited post body');

                            case 17:
                                _context7.next = 19;
                                return click('.js-publish-button');

                            case 19:

                                // we should see a re-auth modal
                                (0, _chai.expect)(find('.fullscreen-modal #login').length, 'modal exists').to.equal(1);

                            case 20:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            })));

            // don't clobber debounce/throttle for future tests
            (0, _mocha.afterEach)(function () {
                _emberRunloop.default.debounce = origDebounce;
                _emberRunloop.default.throttle = origThrottle;
            });
        });

        (0, _mocha.it)('adds auth headers to jquery ajax', function () {
            var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(done) {
                var role;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                role = server.create('role', { name: 'Administrator' });

                                server.create('user', { roles: [role] });

                                server.post('/uploads', function (schema, request) {
                                    return request;
                                });

                                /* eslint-disable camelcase */
                                (0, _emberSimpleAuth.authenticateSession)(application, {
                                    access_token: 'test_token',
                                    expires_in: 3600,
                                    token_type: 'Bearer'
                                });
                                /* eslint-enable camelcase */

                                // necessary to visit a page to fully boot the app in testing
                                _context8.next = 6;
                                return visit('/');

                            case 6:
                                _context8.next = 8;
                                return _jquery.default.ajax({
                                    type: 'POST',
                                    url: Ghost.apiRoot + '/uploads/',
                                    data: { test: 'Test' }
                                }).then(function (request) {
                                    (0, _chai.expect)(request.requestHeaders.Authorization, 'Authorization header').to.exist;
                                    (0, _chai.expect)(request.requestHeaders.Authorization, 'Authotization header content').to.equal('Bearer test_token');
                                }).always(function () {
                                    done();
                                });

                            case 8:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            return function (_x) {
                return _ref10.apply(this, arguments);
            };
        }());
    });
});
define('ghost-admin/tests/acceptance/content-test', ['ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_destroyApp, _startApp, _emberTestSelectors, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Content', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/');

                        case 3:

                            (0, _chai.expect)(currentURL()).to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.describe)('as admin', function () {
            var admin = void 0,
                editor = void 0,
                publishedPost = void 0,
                scheduledPost = void 0,
                draftPost = void 0,
                publishedPage = void 0,
                authorPost = void 0;

            (0, _mocha.beforeEach)(function () {
                var adminRole = server.create('role', { name: 'Administrator' });
                admin = server.create('user', { roles: [adminRole] });
                var editorRole = server.create('role', { name: 'Editor' });
                editor = server.create('user', { roles: [editorRole] });

                publishedPost = server.create('post', { authorId: admin.id, status: 'published', title: 'Published Post' });
                scheduledPost = server.create('post', { authorId: admin.id, status: 'scheduled', title: 'Scheduled Post' });
                draftPost = server.create('post', { authorId: admin.id, status: 'draft', title: 'Draft Post' });
                publishedPage = server.create('post', { authorId: admin.id, status: 'published', page: true, title: 'Published Page' });
                authorPost = server.create('post', { authorId: editor.id, status: 'published', title: 'Editor Published Post' });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('displays and filters posts', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var _server$pretender$han, _server$pretender$han2, lastRequest, _server$pretender$han3, _server$pretender$han4, _server$pretender$han5, _server$pretender$han6, _server$pretender$han7, _server$pretender$han8, _server$pretender$han9, _server$pretender$han10, _server$pretender$han11, _server$pretender$han12;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return visit('/');

                            case 2:

                                // Not checking request here as it won't be the last request made
                                // Displays all posts + pages
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id')).length, 'all posts count').to.equal(5);

                                // show draft posts
                                _context2.next = 5;
                                return selectChoose((0, _emberTestSelectors.default)('type-select'), 'Draft posts');

                            case 5:

                                // API request is correct
                                _server$pretender$han = server.pretender.handledRequests.slice(-1), _server$pretender$han2 = _slicedToArray(_server$pretender$han, 1), lastRequest = _server$pretender$han2[0];

                                (0, _chai.expect)(lastRequest.queryParams.status, '"drafts" request status param').to.equal('draft');
                                (0, _chai.expect)(lastRequest.queryParams.staticPages, '"drafts" request staticPages param').to.equal('false');
                                // Displays draft post
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id')).length, 'drafts count').to.equal(1);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id', draftPost.id)), 'draft post').to.exist;

                                // show published posts
                                _context2.next = 12;
                                return selectChoose((0, _emberTestSelectors.default)('type-select'), 'Published posts');

                            case 12:
                                _server$pretender$han3 = server.pretender.handledRequests.slice(-1);
                                _server$pretender$han4 = _slicedToArray(_server$pretender$han3, 1);
                                lastRequest = _server$pretender$han4[0];

                                (0, _chai.expect)(lastRequest.queryParams.status, '"published" request status param').to.equal('published');
                                (0, _chai.expect)(lastRequest.queryParams.staticPages, '"published" request staticPages param').to.equal('false');
                                // Displays three published posts + pages
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id')).length, 'published count').to.equal(2);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id', publishedPost.id)), 'admin published post').to.exist;
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id', authorPost.id)), 'author published post').to.exist;

                                // show scheduled posts
                                _context2.next = 22;
                                return selectChoose((0, _emberTestSelectors.default)('type-select'), 'Scheduled posts');

                            case 22:
                                _server$pretender$han5 = server.pretender.handledRequests.slice(-1);
                                _server$pretender$han6 = _slicedToArray(_server$pretender$han5, 1);
                                lastRequest = _server$pretender$han6[0];

                                (0, _chai.expect)(lastRequest.queryParams.status, '"scheduled" request status param').to.equal('scheduled');
                                (0, _chai.expect)(lastRequest.queryParams.staticPages, '"scheduled" request staticPages param').to.equal('false');
                                // Displays scheduled post
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id')).length, 'scheduled count').to.equal(1);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id', scheduledPost.id)), 'scheduled post').to.exist;

                                // show pages
                                _context2.next = 31;
                                return selectChoose((0, _emberTestSelectors.default)('type-select'), 'Pages');

                            case 31:
                                _server$pretender$han7 = server.pretender.handledRequests.slice(-1);
                                _server$pretender$han8 = _slicedToArray(_server$pretender$han7, 1);
                                lastRequest = _server$pretender$han8[0];

                                (0, _chai.expect)(lastRequest.queryParams.status, '"pages" request status param').to.equal('all');
                                (0, _chai.expect)(lastRequest.queryParams.staticPages, '"pages" request staticPages param').to.equal('true');
                                // Displays page
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id')).length, 'pages count').to.equal(1);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id', publishedPage.id)), 'page post').to.exist;

                                // show all posts
                                _context2.next = 40;
                                return selectChoose((0, _emberTestSelectors.default)('type-select'), 'All posts');

                            case 40:
                                _server$pretender$han9 = server.pretender.handledRequests.slice(-1);
                                _server$pretender$han10 = _slicedToArray(_server$pretender$han9, 1);
                                lastRequest = _server$pretender$han10[0];

                                (0, _chai.expect)(lastRequest.queryParams.status, '"all" request status param').to.equal('all');
                                (0, _chai.expect)(lastRequest.queryParams.staticPages, '"all" request staticPages param').to.equal('all');

                                // show all posts by editor
                                _context2.next = 47;
                                return selectChoose((0, _emberTestSelectors.default)('author-select'), editor.name);

                            case 47:
                                _server$pretender$han11 = server.pretender.handledRequests.slice(-1);
                                _server$pretender$han12 = _slicedToArray(_server$pretender$han11, 1);
                                lastRequest = _server$pretender$han12[0];

                                (0, _chai.expect)(lastRequest.queryParams.status, '"all" request status param').to.equal('all');
                                (0, _chai.expect)(lastRequest.queryParams.staticPages, '"all" request staticPages param').to.equal('all');
                                (0, _chai.expect)(lastRequest.queryParams.filter, '"editor" request filter param').to.equal('author:' + editor.slug);

                                // Displays editor post
                                // TODO: implement "filter" param support and fix mirage post->author association
                                // expect(find(testSelector('post-id')).length, 'editor post count').to.equal(1);
                                // expect(find(testSelector('post-id', authorPost.id)), 'author post').to.exist;

                                // TODO: test tags dropdown

                                // Double-click on a post opens editor
                                _context2.next = 55;
                                return triggerEvent((0, _emberTestSelectors.default)('post-id', authorPost.id), 'dblclick');

                            case 55:

                                (0, _chai.expect)(currentURL(), 'url after double-click').to.equal('/editor/' + authorPost.id);

                            case 56:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })));
        });

        (0, _mocha.describe)('as author', function () {
            var author = void 0,
                authorPost = void 0;

            (0, _mocha.beforeEach)(function () {
                var authorRole = server.create('role', { name: 'Author' });
                author = server.create('user', { roles: [authorRole] });
                var adminRole = server.create('role', { name: 'Administrator' });
                var admin = server.create('user', { roles: [adminRole] });

                // create posts
                authorPost = server.create('post', { authorId: author.id, status: 'published', title: 'Author Post' });
                server.create('post', { authorId: admin.id, status: 'scheduled', title: 'Admin Post' });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('only fetches the author\'s posts', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var _server$pretender$han13, _server$pretender$han14, lastRequest;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return visit('/');

                            case 2:
                                _context3.next = 4;
                                return selectChoose((0, _emberTestSelectors.default)('type-select'), 'Published posts');

                            case 4:

                                // API request includes author filter
                                _server$pretender$han13 = server.pretender.handledRequests.slice(-1), _server$pretender$han14 = _slicedToArray(_server$pretender$han13, 1), lastRequest = _server$pretender$han14[0];

                                (0, _chai.expect)(lastRequest.queryParams.filter).to.equal('author:' + author.slug);

                                // only author's post is shown
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id')).length, 'post count').to.equal(1);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('post-id', authorPost.id)), 'author post').to.exist;

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/editor-test', ['ember-cli-mirage', 'ghost-admin/tests/helpers/destroy-app', 'moment', 'sinon', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_emberCliMirage, _destroyApp, _moment, _sinon, _startApp, _emberTestSelectors, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Editor', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            server.create('user'); // necesary for post-author association
                            server.create('post');

                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 5;
                            return visit('/editor/1');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/signin');

                        case 6:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('does not redirect to team page when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });
                            server.create('post');

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 6;
                            return visit('/editor/1');

                        case 6:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/editor/1');

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('does not redirect to team page when authenticated as editor', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var role;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role], slug: 'test-user' });
                            server.create('post');

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context3.next = 6;
                            return visit('/editor/1');

                        case 6:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/editor/1');

                        case 7:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.it)('displays 404 when post does not exist', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            var role;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context4.next = 5;
                            return visit('/editor/1');

                        case 5:

                            (0, _chai.expect)(currentPath()).to.equal('error404');
                            (0, _chai.expect)(currentURL()).to.equal('/editor/1');

                        case 7:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        })));

        (0, _mocha.describe)('when logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });
                server.loadFixtures('settings');

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('renders the editor correctly, PSM Publish Date and Save Button', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                var _server$createList, _server$createList2, post1, futureTime, validTime, newFutureTime;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _server$createList = server.createList('post', 2), _server$createList2 = _slicedToArray(_server$createList, 1), post1 = _server$createList2[0];
                                futureTime = (0, _moment.default)().tz('Etc/UTC').add(10, 'minutes');

                                // post id 1 is a draft, checking for draft behaviour now

                                _context5.next = 4;
                                return visit('/editor/1');

                            case 4:

                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/editor/1');

                                // open post settings menu
                                _context5.next = 7;
                                return click((0, _emberTestSelectors.default)('psm-trigger'));

                            case 7:
                                _context5.next = 9;
                                return fillIn((0, _emberTestSelectors.default)('date-time-picker-time-input'), 'foo');

                            case 9:
                                _context5.next = 11;
                                return triggerEvent((0, _emberTestSelectors.default)('date-time-picker-time-input'), 'blur');

                            case 11:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-error')).text().trim(), 'inline error response for invalid time').to.equal('Must be in format: "15:00"');

                                // should error, if the publish time is in the future
                                // NOTE: date must be selected first, changing the time first will save
                                // with the new time
                                _context5.next = 14;
                                return datepickerSelect((0, _emberTestSelectors.default)('date-time-picker-datepicker'), _moment.default.tz('Etc/UTC'));

                            case 14:
                                _context5.next = 16;
                                return fillIn((0, _emberTestSelectors.default)('date-time-picker-time-input'), futureTime.format('HH:mm'));

                            case 16:
                                _context5.next = 18;
                                return triggerEvent((0, _emberTestSelectors.default)('date-time-picker-time-input'), 'blur');

                            case 18:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-error')).text().trim(), 'inline error response for future time').to.equal('Must be in the past');

                                // closing the PSM will reset the invalid date/time
                                _context5.next = 21;
                                return click((0, _emberTestSelectors.default)('close-settings-menu'));

                            case 21:
                                _context5.next = 23;
                                return click((0, _emberTestSelectors.default)('psm-trigger'));

                            case 23:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-error')).text().trim(), 'date picker error after closing PSM').to.equal('');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-date-input')).val(), 'PSM date value after closing with invalid date').to.equal((0, _moment.default)(post1.publishedAt).format('MM/DD/YYYY'));

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-time-input')).val(), 'PSM time value after closing with invalid date').to.equal((0, _moment.default)(post1.publishedAt).format('HH:mm'));

                                // saves the post with the new date
                                validTime = (0, _moment.default)('2017-04-09 12:00');
                                _context5.next = 29;
                                return fillIn((0, _emberTestSelectors.default)('date-time-picker-time-input'), validTime.format('HH:mm'));

                            case 29:
                                _context5.next = 31;
                                return triggerEvent((0, _emberTestSelectors.default)('date-time-picker-time-input'), 'blur');

                            case 31:
                                _context5.next = 33;
                                return datepickerSelect((0, _emberTestSelectors.default)('date-time-picker-datepicker'), validTime);

                            case 33:
                                _context5.next = 35;
                                return click((0, _emberTestSelectors.default)('psm-trigger'));

                            case 35:

                                // checking the flow of the saving button for a draft
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-trigger')).text().trim(), 'draft publish button text').to.equal('Publish');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('editor-post-status')).text().trim(), 'draft status text').to.equal('Draft');

                                // click on publish now
                                _context5.next = 39;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 39:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-draft')), 'draft publish menu is shown').to.exist;

                                _context5.next = 42;
                                return click((0, _emberTestSelectors.default)('publishmenu-scheduled-option'));

                            case 42:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'draft post schedule button text').to.equal('Schedule');

                                _context5.next = 45;
                                return click((0, _emberTestSelectors.default)('publishmenu-published-option'));

                            case 45:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'draft post publish button text').to.equal('Publish');

                                // Publish the post
                                _context5.next = 48;
                                return click((0, _emberTestSelectors.default)('publishmenu-save'));

                            case 48:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'publish menu save button updated after draft is published').to.equal('Published');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-published')), 'publish menu is shown after draft published').to.exist;

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('editor-post-status')).text().trim(), 'post status updated after draft published').to.equal('Published');

                                _context5.next = 53;
                                return click((0, _emberTestSelectors.default)('publishmenu-cancel'));

                            case 53:
                                _context5.next = 55;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 55:
                                _context5.next = 57;
                                return click((0, _emberTestSelectors.default)('publishmenu-unpublished-option'));

                            case 57:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'published post unpublish button text').to.equal('Unpublish');

                                // post id 2 is a published post, checking for published post behaviour now
                                _context5.next = 60;
                                return visit('/editor/2');

                            case 60:

                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/editor/2');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-date-input')).val()).to.equal('12/19/2015');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-time-input')).val()).to.equal('16:25');

                                // saves the post with a new date
                                _context5.next = 65;
                                return datepickerSelect((0, _emberTestSelectors.default)('date-time-picker-datepicker'), (0, _moment.default)('2016-05-10 10:00'));

                            case 65:
                                _context5.next = 67;
                                return fillIn((0, _emberTestSelectors.default)('date-time-picker-time-input'), '10:00');

                            case 67:
                                _context5.next = 69;
                                return triggerEvent((0, _emberTestSelectors.default)('date-time-picker-time-input'), 'blur');

                            case 69:
                                _context5.next = 71;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 71:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'published button text').to.equal('Update');

                                _context5.next = 74;
                                return click((0, _emberTestSelectors.default)('publishmenu-save'));

                            case 74:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'publish menu save button updated after published post is updated').to.equal('Updated');

                                // go to settings to change the timezone
                                _context5.next = 77;
                                return visit('/settings/general');

                            case 77:
                                _context5.next = 79;
                                return click((0, _emberTestSelectors.default)('toggle-timezone'));

                            case 79:

                                (0, _chai.expect)(currentURL(), 'currentURL for settings').to.equal('/settings/general');
                                (0, _chai.expect)(find('#activeTimezone option:selected').text().trim(), 'default timezone').to.equal('(GMT) UTC');

                                // select a new timezone
                                find('#activeTimezone option[value="Pacific/Kwajalein"]').prop('selected', true);

                                _context5.next = 84;
                                return triggerEvent('#activeTimezone', 'change');

                            case 84:
                                _context5.next = 86;
                                return click('.gh-btn.gh-btn-blue');

                            case 86:

                                (0, _chai.expect)(find('#activeTimezone option:selected').text().trim(), 'new timezone after saving').to.equal('(GMT +12:00) International Date Line West');

                                // and now go back to the editor
                                _context5.next = 89;
                                return visit('/editor/2');

                            case 89:

                                (0, _chai.expect)(currentURL(), 'currentURL in editor').to.equal('/editor/2');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-date-input')).val(), 'date after timezone change').to.equal('05/10/2016');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-time-input')).val(), 'time after timezone change').to.equal('22:00');

                                // unpublish
                                _context5.next = 94;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 94:
                                _context5.next = 96;
                                return click((0, _emberTestSelectors.default)('publishmenu-unpublished-option'));

                            case 96:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'published post unpublish button text').to.equal('Unpublish');

                                _context5.next = 99;
                                return click((0, _emberTestSelectors.default)('publishmenu-save'));

                            case 99:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'publish menu save button updated after published post is unpublished').to.equal('Unpublished');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-draft')), 'draft menu is shown after unpublished').to.exist;

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('editor-post-status')).text().trim(), 'post status updated after unpublished').to.equal('Draft');

                                // schedule post
                                _context5.next = 104;
                                return click((0, _emberTestSelectors.default)('publishmenu-cancel'));

                            case 104:
                                _context5.next = 106;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 106:
                                newFutureTime = _moment.default.tz('Pacific/Kwajalein').add(10, 'minutes');
                                _context5.next = 109;
                                return click((0, _emberTestSelectors.default)('publishmenu-scheduled-option'));

                            case 109:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'draft post, schedule button text').to.equal('Schedule');

                                _context5.next = 112;
                                return datepickerSelect((0, _emberTestSelectors.default)('publishmenu-draft') + ' ' + (0, _emberTestSelectors.default)('date-time-picker-datepicker'), newFutureTime);

                            case 112:
                                _context5.next = 114;
                                return click((0, _emberTestSelectors.default)('publishmenu-save'));

                            case 114:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'publish menu save button updated after draft is scheduled').to.equal('Scheduled');

                                _context5.next = 117;
                                return click((0, _emberTestSelectors.default)('publishmenu-cancel'));

                            case 117:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-scheduled')), 'publish menu is not shown after closed').to.not.exist;

                                // expect countdown to show warning, that post will be published in x minutes
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('schedule-countdown')).text().trim(), 'notification countdown').to.contain('Post will be published in');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-trigger')).text().trim(), 'scheduled publish button text').to.equal('Scheduled');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('editor-post-status')).text().trim(), 'scheduled post status').to.equal('Scheduled');

                                // Re-schedule
                                _context5.next = 123;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 123:
                                _context5.next = 125;
                                return click((0, _emberTestSelectors.default)('publishmenu-scheduled-option'));

                            case 125:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'scheduled post button reschedule text').to.equal('Reschedule');

                                _context5.next = 128;
                                return click((0, _emberTestSelectors.default)('publishmenu-save'));

                            case 128:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'publish menu save button text for a rescheduled post').to.equal('Rescheduled');

                                _context5.next = 131;
                                return click((0, _emberTestSelectors.default)('publishmenu-cancel'));

                            case 131:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-scheduled')), 'publish menu is not shown after closed').to.not.exist;

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('editor-post-status')).text().trim(), 'scheduled status text').to.equal('Scheduled');

                                // unschedule
                                _context5.next = 135;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 135:
                                _context5.next = 137;
                                return click((0, _emberTestSelectors.default)('publishmenu-draft-option'));

                            case 137:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'publish menu save button updated after scheduled post is unscheduled').to.equal('Unschedule');

                                _context5.next = 140;
                                return click((0, _emberTestSelectors.default)('publishmenu-save'));

                            case 140:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-save')).text().trim(), 'publish menu save button updated after scheduled post is unscheduled').to.equal('Unscheduled');

                                _context5.next = 143;
                                return click((0, _emberTestSelectors.default)('publishmenu-cancel'));

                            case 143:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-trigger')).text().trim(), 'publish button text after unschedule').to.equal('Publish');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('editor-post-status')).text().trim(), 'status text after unschedule').to.equal('Draft');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('schedule-countdown')), 'scheduled countdown after unschedule').to.not.exist;

                            case 146:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));

            (0, _mocha.it)('handles validation errors when scheduling', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                var post, plusTenMin;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                server.put('/posts/:id/', function () {
                                    return new _emberCliMirage.default.Response(422, {}, {
                                        errors: [{
                                            errorType: 'ValidationError',
                                            message: 'Error test'
                                        }]
                                    });
                                });

                                post = server.create('post', 1);
                                plusTenMin = (0, _moment.default)().utc().add(10, 'minutes');
                                _context6.next = 5;
                                return visit('/editor/' + post.id);

                            case 5:
                                _context6.next = 7;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 7:
                                _context6.next = 9;
                                return click((0, _emberTestSelectors.default)('publishmenu-scheduled-option'));

                            case 9:
                                _context6.next = 11;
                                return datepickerSelect((0, _emberTestSelectors.default)('publishmenu-draft') + ' ' + (0, _emberTestSelectors.default)('date-time-picker-datepicker'), plusTenMin);

                            case 11:
                                _context6.next = 13;
                                return fillIn((0, _emberTestSelectors.default)('publishmenu-draft') + ' ' + (0, _emberTestSelectors.default)('date-time-picker-time-input'), plusTenMin.format('HH:mm'));

                            case 13:
                                _context6.next = 15;
                                return triggerEvent((0, _emberTestSelectors.default)('publishmenu-draft') + ' ' + (0, _emberTestSelectors.default)('date-time-picker-time-input'), 'blur');

                            case 15:
                                _context6.next = 17;
                                return click((0, _emberTestSelectors.default)('publishmenu-save'));

                            case 17:

                                (0, _chai.expect)(find('.gh-alert').length, 'number of alerts after failed schedule').to.equal(1);

                                (0, _chai.expect)(find('.gh-alert').text(), 'alert text after failed schedule').to.match(/Saving failed: Error test/);

                            case 19:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            })));

            (0, _mocha.it)('handles title validation errors correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                server.createList('post', 1);

                                // post id 1 is a draft, checking for draft behaviour now
                                _context7.next = 3;
                                return visit('/editor/1');

                            case 3:

                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/editor/1');

                                _context7.next = 6;
                                return fillIn((0, _emberTestSelectors.default)('editor-title-input'), Array(260).join('a'));

                            case 6:
                                _context7.next = 8;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 8:
                                _context7.next = 10;
                                return click((0, _emberTestSelectors.default)('publishmenu-save'));

                            case 10:

                                (0, _chai.expect)(find('.gh-alert').length, 'number of alerts after invalid title').to.equal(1);

                                (0, _chai.expect)(find('.gh-alert').text(), 'alert text after invalid title').to.match(/Title cannot be longer than 255 characters/);

                            case 12:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            })));

            // NOTE: these tests are specific to the mobiledoc editor
            // it('inserts a placeholder if the title is blank', async function () {
            //     server.createList('post', 1);
            //
            //     // post id 1 is a draft, checking for draft behaviour now
            //     await visit('/editor/1');
            //
            //     expect(currentURL(), 'currentURL')
            //         .to.equal('/editor/1');
            //
            //     await titleRendered();
            //
            //     let title = find('#koenig-title-input div');
            //     expect(title.data('placeholder')).to.equal('Your Post Title');
            //     expect(title.hasClass('no-content')).to.be.false;
            //
            //     await replaceTitleHTML('');
            //     expect(title.hasClass('no-content')).to.be.true;
            //
            //     await replaceTitleHTML('test');
            //     expect(title.hasClass('no-content')).to.be.false;
            // });
            //
            // it('removes HTML from the title.', async function () {
            //     server.createList('post', 1);
            //
            //     // post id 1 is a draft, checking for draft behaviour now
            //     await visit('/editor/1');
            //
            //     expect(currentURL(), 'currentURL')
            //         .to.equal('/editor/1');
            //
            //     await titleRendered();
            //
            //     let title = find('#koenig-title-input div');
            //     await replaceTitleHTML('<div>TITLE&nbsp;&#09;&nbsp;&thinsp;&ensp;&emsp;TEST</div>&nbsp;');
            //     expect(title.html()).to.equal('TITLE      TEST ');
            // });

            (0, _mocha.it)('renders first countdown notification before scheduled time', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
                var clock, compareDate, compareDateString, compareTimeString;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                clock = _sinon.default.useFakeTimers((0, _moment.default)().valueOf());
                                compareDate = (0, _moment.default)().tz('Etc/UTC').add(4, 'minutes');
                                compareDateString = compareDate.format('MM/DD/YYYY');
                                compareTimeString = compareDate.format('HH:mm');

                                server.create('post', { publishedAt: _moment.default.utc().add(4, 'minutes'), status: 'scheduled' });
                                server.create('setting', { activeTimezone: 'Europe/Dublin' });
                                clock.restore();

                                _context8.next = 9;
                                return visit('/editor/1');

                            case 9:

                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/editor/1');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-date-input')).val(), 'scheduled date').to.equal(compareDateString);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('date-time-picker-time-input')).val(), 'scheduled time').to.equal(compareTimeString);
                                // Dropdown menu should be 'Update Post' and 'Unschedule'
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('publishmenu-trigger')).text().trim(), 'text in save button for scheduled post').to.equal('Scheduled');
                                // expect countdown to show warning, that post will be published in x minutes
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('schedule-countdown')).text().trim(), 'notification countdown').to.contain('Post will be published in');

                            case 14:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            })));

            (0, _mocha.it)('shows author list and allows switching of author in PSM', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
                var role, author;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                server.create('post', { authorId: 1 });
                                role = server.create('role', { name: 'Author' });
                                author = server.create('user', { name: 'Waldo', roles: [role] });
                                _context9.next = 5;
                                return visit('/editor/1');

                            case 5:

                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/editor/1');

                                _context9.next = 8;
                                return click('button.post-settings');

                            case 8:

                                (0, _chai.expect)(find('select[name="post-setting-author"]').val()).to.equal('1');
                                (0, _chai.expect)(find('select[name="post-setting-author"] option[value="2"]')).to.be.ok;

                                _context9.next = 12;
                                return fillIn('select[name="post-setting-author"]', '2');

                            case 12:

                                (0, _chai.expect)(find('select[name="post-setting-author"]').val()).to.equal('2');
                                (0, _chai.expect)(server.db.posts[0].authorId).to.equal(author.id);

                            case 14:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            })));

            (0, _mocha.it)('autosaves when title loses focus', _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
                var role;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                role = server.create('role', { name: 'Administrator' });

                                server.create('user', { name: 'Admin', roles: [role] });

                                _context10.next = 4;
                                return visit('/editor');

                            case 4:

                                // NOTE: there were checks here for the title element having focus
                                // but they were very temperamental whilst running tests in the
                                // browser so they've been left out for now

                                (0, _chai.expect)(currentURL(), 'url on initial visit').to.equal('/editor');

                                _context10.next = 7;
                                return triggerEvent((0, _emberTestSelectors.default)('editor-title-input'), 'blur');

                            case 7:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('editor-title-input')).val(), 'title value after autosave').to.equal('(Untitled)');

                                (0, _chai.expect)(currentURL(), 'url after autosave').to.equal('/editor/1');

                            case 9:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/ghost-desktop-test', ['ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_destroyApp, _startApp, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    var originalAgent = window.navigator.userAgent;

    var setUserAgent = function setUserAgent(userAgent) {
        var userAgentProp = {
            get: function get() {
                return userAgent;
            },

            configurable: true
        };

        try {
            Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
            window.navigator = Object.create(window.navigator, {
                userAgent: userAgentProp
            });
        }
    };

    var restoreUserAgent = function restoreUserAgent() {
        setUserAgent(originalAgent);
    };

    (0, _mocha.describe)('Acceptance: Ghost Desktop', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.describe)('update alerts for broken versions', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.afterEach)(function () {
                restoreUserAgent();
            });

            (0, _mocha.it)('displays alert for broken version', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) ghost-desktop/0.4.0 Chrome/51.0.2704.84 Electron/1.2.2 Safari/537.36');

                                _context.next = 3;
                                return visit('/');

                            case 3:

                                // has an alert with matching text
                                (0, _chai.expect)(find('.gh-alert-blue').length, 'number of warning alerts').to.equal(1);
                                (0, _chai.expect)(find('.gh-alert-blue').text().trim(), 'alert text').to.match(/Your version of Ghost Desktop needs to be manually updated/);

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));

            (0, _mocha.it)('doesn\'t display alert for working version', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) ghost-desktop/0.5.1 Chrome/51.0.2704.84 Electron/1.2.2 Safari/537.36');

                                _context2.next = 3;
                                return visit('/');

                            case 3:

                                // no alerts
                                (0, _chai.expect)(find('.gh-alert').length, 'number of alerts').to.equal(0);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/password-reset-test', ['ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'mocha', 'chai'], function (_destroyApp, _startApp, _mocha, _chai) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Password Reset', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.describe)('request reset', function () {
            (0, _mocha.it)('is successful with valid data', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return visit('/signin');

                            case 2:
                                _context.next = 4;
                                return fillIn('input[name="identification"]', 'test@example.com');

                            case 4:
                                _context.next = 6;
                                return click('.forgotten-link');

                            case 6:

                                // an alert with instructions is displayed
                                (0, _chai.expect)(find('.gh-alert-blue').length, 'alert count').to.equal(1);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));

            (0, _mocha.it)('shows error messages with invalid data', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return visit('/signin');

                            case 2:
                                _context2.next = 4;
                                return click('.forgotten-link');

                            case 4:

                                // email field is invalid
                                (0, _chai.expect)(find('input[name="identification"]').closest('.form-group').hasClass('error'), 'email field has error class (no email)').to.be.true;

                                // password field is valid
                                (0, _chai.expect)(find('input[name="password"]').closest('.form-group').hasClass('error'), 'password field has error class (no email)').to.be.false;

                                // error message shown
                                (0, _chai.expect)(find('p.main-error').text().trim(), 'error message').to.equal('We need your email address to reset your password!');

                                // invalid email provided
                                _context2.next = 9;
                                return fillIn('input[name="identification"]', 'test');

                            case 9:
                                _context2.next = 11;
                                return click('.forgotten-link');

                            case 11:

                                // email field is invalid
                                (0, _chai.expect)(find('input[name="identification"]').closest('.form-group').hasClass('error'), 'email field has error class (invalid email)').to.be.true;

                                // password field is valid
                                (0, _chai.expect)(find('input[name="password"]').closest('.form-group').hasClass('error'), 'password field has error class (invalid email)').to.be.false;

                                // error message
                                (0, _chai.expect)(find('p.main-error').text().trim(), 'error message').to.equal('We need your email address to reset your password!');

                                // unknown email provided
                                _context2.next = 16;
                                return fillIn('input[name="identification"]', 'unknown@example.com');

                            case 16:
                                _context2.next = 18;
                                return click('.forgotten-link');

                            case 18:

                                // email field is invalid
                                (0, _chai.expect)(find('input[name="identification"]').closest('.form-group').hasClass('error'), 'email field has error class (unknown email)').to.be.true;

                                // password field is valid
                                (0, _chai.expect)(find('input[name="password"]').closest('.form-group').hasClass('error'), 'password field has error class (unknown email)').to.be.false;

                                // error message
                                (0, _chai.expect)(find('p.main-error').text().trim(), 'error message').to.equal('There is no user with that email address.');

                            case 21:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })));
        });

        // TODO: add tests for the change password screen
    });
});
define('ghost-admin/tests/acceptance/settings/amp-test', ['ghost-admin/utils/ctrl-or-cmd', 'ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_ctrlOrCmd, _destroyApp, _startApp, _emberTestSelectors, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Settings - Apps - AMP', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/settings/apps/amp');

                        case 3:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 5;
                            return visit('/settings/apps/amp');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-user');

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as editor', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var role;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context3.next = 5;
                            return visit('/settings/apps/amp');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team');

                        case 6:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.describe)('when logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('it enables or disables AMP properly and saves it', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var _server$pretender$han, _server$pretender$han2, lastRequest, params, _server$pretender$han3, _server$pretender$han4, newRequest;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return visit('/settings/apps/amp');

                            case 2:

                                // has correct url
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/apps/amp');

                                // AMP is enabled by default
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('amp-checkbox')).prop('checked'), 'AMP checkbox').to.be.true;

                                _context4.next = 6;
                                return click((0, _emberTestSelectors.default)('amp-checkbox'));

                            case 6:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('amp-checkbox')).prop('checked'), 'AMP checkbox').to.be.false;

                                _context4.next = 9;
                                return click((0, _emberTestSelectors.default)('save-button'));

                            case 9:
                                _server$pretender$han = server.pretender.handledRequests.slice(-1), _server$pretender$han2 = _slicedToArray(_server$pretender$han, 1), lastRequest = _server$pretender$han2[0];
                                params = JSON.parse(lastRequest.requestBody);


                                (0, _chai.expect)(params.settings.findBy('key', 'amp').value).to.equal(false);

                                // CMD-S shortcut works
                                _context4.next = 14;
                                return click((0, _emberTestSelectors.default)('amp-checkbox'));

                            case 14:
                                _context4.next = 16;
                                return triggerEvent('.gh-app', 'keydown', {
                                    keyCode: 83, // s
                                    metaKey: _ctrlOrCmd.default === 'command',
                                    ctrlKey: _ctrlOrCmd.default === 'ctrl'
                                });

                            case 16:

                                // we've already saved in this test so there's no on-screen indication
                                // that we've had another save, check the request was fired instead
                                _server$pretender$han3 = server.pretender.handledRequests.slice(-1), _server$pretender$han4 = _slicedToArray(_server$pretender$han3, 1), newRequest = _server$pretender$han4[0];

                                params = JSON.parse(newRequest.requestBody);

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('amp-checkbox')).prop('checked'), 'AMP checkbox').to.be.true;
                                (0, _chai.expect)(params.settings.findBy('key', 'amp').value).to.equal(true);

                            case 20:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/settings/apps-test', ['ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_destroyApp, _startApp, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Settings - Apps', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/settings/apps');

                        case 3:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 5;
                            return visit('/settings/apps');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-user');

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as editor', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var role;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context3.next = 5;
                            return visit('/settings/apps');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team');

                        case 6:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.describe)('when logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('it redirects to Slack when clicking on the grid', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return visit('/settings/apps');

                            case 2:

                                // has correct url
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/apps');

                                _context4.next = 5;
                                return click('#slack-link');

                            case 5:

                                // has correct url
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/apps/slack');

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));
            (0, _mocha.it)('it redirects to AMP when clicking on the grid', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return visit('/settings/apps');

                            case 2:

                                // has correct url
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/apps');

                                _context5.next = 5;
                                return click('#amp-link');

                            case 5:

                                // has correct url
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/apps/amp');

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/settings/code-injection-test', ['jquery', 'ghost-admin/utils/ctrl-or-cmd', 'ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_jquery, _ctrlOrCmd, _destroyApp, _startApp, _emberTestSelectors, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Settings - Code-Injection', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/settings/code-injection');

                        case 3:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 5;
                            return visit('/settings/code-injection');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-user');

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as editor', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var role;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context3.next = 5;
                            return visit('/settings/code-injection');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team');

                        case 6:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.describe)('when logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('it renders, loads and saves editors correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var _server$pretender$han, _server$pretender$han2, lastRequest, params, _server$pretender$han3, _server$pretender$han4, newRequest;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return visit('/settings/code-injection');

                            case 2:

                                // has correct url
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/code-injection');

                                // has correct page title
                                (0, _chai.expect)(document.title, 'page title').to.equal('Settings - Code injection - Test Blog');

                                // highlights nav menu
                                (0, _chai.expect)((0, _jquery.default)('.gh-nav-settings-code-injection').hasClass('active'), 'highlights nav menu item').to.be.true;

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('save-button')).text().trim(), 'save button text').to.equal('Save');

                                (0, _chai.expect)(find('#ghost-head .CodeMirror').length, 'ghost head codemirror element').to.equal(1);
                                (0, _chai.expect)((0, _jquery.default)('#ghost-head .CodeMirror').hasClass('cm-s-xq-light'), 'ghost head editor theme').to.be.true;

                                (0, _chai.expect)(find('#ghost-foot .CodeMirror').length, 'ghost head codemirror element').to.equal(1);
                                (0, _chai.expect)((0, _jquery.default)('#ghost-foot .CodeMirror').hasClass('cm-s-xq-light'), 'ghost head editor theme').to.be.true;

                                _context4.next = 12;
                                return click((0, _emberTestSelectors.default)('save-button'));

                            case 12:
                                _server$pretender$han = server.pretender.handledRequests.slice(-1), _server$pretender$han2 = _slicedToArray(_server$pretender$han, 1), lastRequest = _server$pretender$han2[0];
                                params = JSON.parse(lastRequest.requestBody);


                                (0, _chai.expect)(params.settings.findBy('key', 'ghost_head').value).to.equal('');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('save-button')).text().trim(), 'save button text').to.equal('Saved');

                                // CMD-S shortcut works
                                _context4.next = 18;
                                return triggerEvent('.gh-app', 'keydown', {
                                    keyCode: 83, // s
                                    metaKey: _ctrlOrCmd.default === 'command',
                                    ctrlKey: _ctrlOrCmd.default === 'ctrl'
                                });

                            case 18:
                                // we've already saved in this test so there's no on-screen indication
                                // that we've had another save, check the request was fired instead
                                _server$pretender$han3 = server.pretender.handledRequests.slice(-1), _server$pretender$han4 = _slicedToArray(_server$pretender$han3, 1), newRequest = _server$pretender$han4[0];

                                params = JSON.parse(newRequest.requestBody);

                                (0, _chai.expect)(params.settings.findBy('key', 'ghost_head').value).to.equal('');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('save-button')).text().trim(), 'save button text').to.equal('Saved');

                            case 22:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/settings/design-test', ['ember-cli-mirage', 'ghost-admin/utils/ctrl-or-cmd', 'ghost-admin/tests/helpers/destroy-app', 'ghost-admin/mirage/config/themes', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_emberCliMirage, _ctrlOrCmd, _destroyApp, _themes, _startApp, _emberTestSelectors, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Settings - Design', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/settings/design');

                        case 3:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 5;
                            return visit('/settings/design');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-user');

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.describe)('when logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('can visit /settings/design', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return visit('/settings/design');

                            case 2:

                                (0, _chai.expect)(currentPath()).to.equal('settings.design.index');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('save-button')).text().trim(), 'save button text').to.equal('Save');

                                // fixtures contain two nav items, check for three rows as we
                                // should have one extra that's blank
                                (0, _chai.expect)(find('.gh-blognav-item').length, 'navigation items count').to.equal(3);

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));

            (0, _mocha.it)('saves navigation settings', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var _server$db$settings$w, _server$db$settings$w2, navSetting;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return visit('/settings/design');

                            case 2:
                                _context4.next = 4;
                                return fillIn('.gh-blognav-label:first input', 'Test');

                            case 4:
                                _context4.next = 6;
                                return fillIn('.gh-blognav-url:first input', '/test');

                            case 6:
                                _context4.next = 8;
                                return triggerEvent('.gh-blognav-url:first input', 'blur');

                            case 8:
                                _context4.next = 10;
                                return click((0, _emberTestSelectors.default)('save-button'));

                            case 10:
                                _server$db$settings$w = server.db.settings.where({ key: 'navigation' }), _server$db$settings$w2 = _slicedToArray(_server$db$settings$w, 1), navSetting = _server$db$settings$w2[0];


                                (0, _chai.expect)(navSetting.value).to.equal('[{"label":"Test","url":"/test/"},{"label":"About","url":"/about"}]');

                                // don't test against .error directly as it will pick up failed
                                // tests "pre.error" elements
                                (0, _chai.expect)(find('span.error').length, 'error fields count').to.equal(0);
                                (0, _chai.expect)(find('.gh-alert').length, 'alerts count').to.equal(0);
                                (0, _chai.expect)(find('.response:visible').length, 'validation errors count').to.equal(0);

                            case 15:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));

            (0, _mocha.it)('validates new item correctly on save', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return visit('/settings/design');

                            case 2:
                                _context5.next = 4;
                                return click((0, _emberTestSelectors.default)('save-button'));

                            case 4:

                                (0, _chai.expect)(find('.gh-blognav-item').length, 'number of nav items after saving with blank new item').to.equal(3);

                                _context5.next = 7;
                                return fillIn('.gh-blognav-label:last input', 'Test');

                            case 7:
                                _context5.next = 9;
                                return fillIn('.gh-blognav-url:last input', 'http://invalid domain/');

                            case 9:
                                _context5.next = 11;
                                return triggerEvent('.gh-blognav-url:last input', 'blur');

                            case 11:
                                _context5.next = 13;
                                return click((0, _emberTestSelectors.default)('save-button'));

                            case 13:

                                (0, _chai.expect)(find('.gh-blognav-item').length, 'number of nav items after saving with invalid new item').to.equal(3);

                                (0, _chai.expect)(find('.gh-blognav-item:last .error').length, 'number of invalid fields in new item').to.equal(1);

                            case 15:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));

            (0, _mocha.it)('clears unsaved settings when navigating away', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return visit('/settings/design');

                            case 2:
                                _context6.next = 4;
                                return fillIn('.gh-blognav-label:first input', 'Test');

                            case 4:
                                _context6.next = 6;
                                return triggerEvent('.gh-blognav-label:first input', 'blur');

                            case 6:

                                (0, _chai.expect)(find('.gh-blognav-label:first input').val()).to.equal('Test');

                                _context6.next = 9;
                                return visit('/settings/code-injection');

                            case 9:
                                _context6.next = 11;
                                return visit('/settings/design');

                            case 11:

                                (0, _chai.expect)(find('.gh-blognav-label:first input').val()).to.equal('Home');

                            case 12:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            })));

            (0, _mocha.it)('can add and remove items', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                var _server$db$settings$w3, _server$db$settings$w4, navSetting;

                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return visit('/settings/design');

                            case 2:
                                _context7.next = 4;
                                return click('.gh-blognav-add');

                            case 4:

                                (0, _chai.expect)(find('.gh-blognav-label:last .response').is(':visible'), 'blank label has validation error').to.be.true;

                                _context7.next = 7;
                                return fillIn('.gh-blognav-label:last input', 'New');

                            case 7:
                                _context7.next = 9;
                                return triggerEvent('.gh-blognav-label:last input', 'keypress', {});

                            case 9:

                                (0, _chai.expect)(find('.gh-blognav-label:last .response').is(':visible'), 'label validation is visible after typing').to.be.false;

                                _context7.next = 12;
                                return fillIn('.gh-blognav-url:last input', '/new');

                            case 12:
                                _context7.next = 14;
                                return triggerEvent('.gh-blognav-url:last input', 'keypress', {});

                            case 14:
                                _context7.next = 16;
                                return triggerEvent('.gh-blognav-url:last input', 'blur');

                            case 16:

                                (0, _chai.expect)(find('.gh-blognav-url:last .response').is(':visible'), 'url validation is visible after typing').to.be.false;

                                (0, _chai.expect)(find('.gh-blognav-url:last input').val()).to.equal(window.location.protocol + '//' + window.location.host + '/new/');

                                _context7.next = 20;
                                return click('.gh-blognav-add');

                            case 20:

                                (0, _chai.expect)(find('.gh-blognav-item').length, 'number of nav items after successful add').to.equal(4);

                                (0, _chai.expect)(find('.gh-blognav-label:last input').val(), 'new item label value after successful add').to.be.blank;

                                (0, _chai.expect)(find('.gh-blognav-url:last input').val(), 'new item url value after successful add').to.equal(window.location.protocol + '//' + window.location.host + '/');

                                (0, _chai.expect)(find('.gh-blognav-item .response:visible').length, 'number or validation errors shown after successful add').to.equal(0);

                                _context7.next = 26;
                                return click('.gh-blognav-item:first .gh-blognav-delete');

                            case 26:

                                (0, _chai.expect)(find('.gh-blognav-item').length, 'number of nav items after successful remove').to.equal(3);

                                // CMD-S shortcut works
                                _context7.next = 29;
                                return triggerEvent('.gh-app', 'keydown', {
                                    keyCode: 83, // s
                                    metaKey: _ctrlOrCmd.default === 'command',
                                    ctrlKey: _ctrlOrCmd.default === 'ctrl'
                                });

                            case 29:
                                _server$db$settings$w3 = server.db.settings.where({ key: 'navigation' }), _server$db$settings$w4 = _slicedToArray(_server$db$settings$w3, 1), navSetting = _server$db$settings$w4[0];


                                (0, _chai.expect)(navSetting.value).to.equal('[{"label":"About","url":"/about"},{"label":"New","url":"/new/"}]');

                            case 31:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            })));

            (0, _mocha.it)('allows management of themes', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                // lists available themes + active theme is highlighted

                                // theme upload
                                // - displays modal
                                // - validates mime type
                                // - validates casper.zip
                                // - handles validation errors
                                // - handles upload and close
                                // - handles upload and activate
                                // - displays overwrite warning if theme already exists

                                // theme activation
                                // - switches theme

                                // theme deletion
                                // - displays modal
                                // - deletes theme and refreshes list

                                server.loadFixtures('themes');
                                _context8.next = 3;
                                return visit('/settings/design');

                            case 3:

                                // lists available themes (themes are specified in mirage/fixtures/settings)
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-id')).length, 'shows correct number of themes').to.equal(3);

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-active', 'true') + ' ' + (0, _emberTestSelectors.default)('theme-title')).text().trim(), 'Blog theme marked as active').to.equal('Blog (default)');

                                // theme upload displays modal
                                _context8.next = 7;
                                return click((0, _emberTestSelectors.default)('upload-theme-button'));

                            case 7:
                                (0, _chai.expect)(find('.fullscreen-modal .modal-content:contains("Upload a theme")').length, 'theme upload modal displayed after button click').to.equal(1);

                                // cancelling theme upload closes modal
                                _context8.next = 10;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('close-button'));

                            case 10:
                                (0, _chai.expect)(find('.fullscreen-modal').length === 0, 'upload theme modal is closed when cancelling').to.be.true;

                                // theme upload validates mime type
                                _context8.next = 13;
                                return click((0, _emberTestSelectors.default)('upload-theme-button'));

                            case 13:
                                _context8.next = 15;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { type: 'text/csv' });

                            case 15:
                                (0, _chai.expect)(find('.fullscreen-modal .failed').text(), 'validation error is shown for invalid mime type').to.match(/is not supported/);

                                // theme upload validates casper.zip
                                _context8.next = 18;
                                return click((0, _emberTestSelectors.default)('upload-try-again-button'));

                            case 18:
                                _context8.next = 20;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { name: 'casper.zip', type: 'application/zip' });

                            case 20:
                                (0, _chai.expect)(find('.fullscreen-modal .failed').text(), 'validation error is shown when uploading casper.zip').to.match(/default Casper theme cannot be overwritten/);

                                // theme upload handles upload errors
                                server.post('/themes/upload/', function () {
                                    return new _emberCliMirage.default.Response(422, {}, {
                                        errors: [{
                                            message: 'Invalid theme'
                                        }]
                                    });
                                });
                                _context8.next = 24;
                                return click((0, _emberTestSelectors.default)('upload-try-again-button'));

                            case 24:
                                _context8.next = 26;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { name: 'error.zip', type: 'application/zip' });

                            case 26:
                                (0, _chai.expect)(find('.fullscreen-modal .failed').text().trim(), 'validation error is passed through from server').to.equal('Invalid theme');

                                // reset to default mirage handlers
                                (0, _themes.default)(server);

                                // theme upload handles validation errors
                                server.post('/themes/upload/', function () {
                                    return new _emberCliMirage.default.Response(422, {}, {
                                        errors: [{
                                            message: 'Theme is not compatible or contains errors.',
                                            errorType: 'ThemeValidationError',
                                            errorDetails: [{
                                                level: 'error',
                                                rule: 'Assets such as CSS & JS must use the <code>{{asset}}</code> helper',
                                                details: '<p>The listed files should be included using the <code>{{asset}}</code> helper.</p>',
                                                failures: [{
                                                    ref: '/assets/javascripts/ui.js'
                                                }]
                                            }, {
                                                level: 'error',
                                                rule: 'Templates must contain valid Handlebars.',
                                                failures: [{
                                                    ref: 'index.hbs',
                                                    message: 'The partial index_meta could not be found'
                                                }, {
                                                    ref: 'tag.hbs',
                                                    message: 'The partial index_meta could not be found'
                                                }]
                                            }]
                                        }]
                                    });
                                });

                                _context8.next = 31;
                                return click((0, _emberTestSelectors.default)('upload-try-again-button'));

                            case 31:
                                _context8.next = 33;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { name: 'bad-theme.zip', type: 'application/zip' });

                            case 33:

                                (0, _chai.expect)(find('.fullscreen-modal h1').text().trim(), 'modal title after uploading invalid theme').to.equal('Invalid theme');

                                (0, _chai.expect)(find('.theme-validation-rule-text').text(), 'top-level errors are displayed').to.match(/Templates must contain valid Handlebars/);

                                _context8.next = 37;
                                return click((0, _emberTestSelectors.default)('toggle-details'));

                            case 37:

                                (0, _chai.expect)(find('.theme-validation-details').text(), 'top-level errors do not escape HTML').to.match(/The listed files should be included using the {{asset}} helper/);

                                (0, _chai.expect)(find('.theme-validation-list ul li').text(), 'individual failures are displayed').to.match(/\/assets\/javascripts\/ui\.js/);

                                // reset to default mirage handlers
                                (0, _themes.default)(server);

                                _context8.next = 42;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('try-again-button'));

                            case 42:
                                (0, _chai.expect)(find('.theme-validation-errors').length, '"Try Again" resets form after theme validation error').to.equal(0);

                                (0, _chai.expect)(find('.gh-image-uploader').length, '"Try Again" resets form after theme validation error').to.equal(1);

                                (0, _chai.expect)(find('.fullscreen-modal h1').text().trim(), '"Try Again" resets form after theme validation error').to.equal('Upload a theme');

                                // theme upload handles validation warnings
                                server.post('/themes/upload/', function (_ref9) {
                                    var themes = _ref9.themes;

                                    var theme = {
                                        name: 'blackpalm',
                                        package: {
                                            name: 'BlackPalm',
                                            version: '1.0.0'
                                        }
                                    };

                                    themes.create(theme);

                                    theme.warnings = [{
                                        level: 'warning',
                                        rule: 'Assets such as CSS & JS must use the <code>{{asset}}</code> helper',
                                        details: '<p>The listed files should be included using the <code>{{asset}}</code> helper.  For more information, please see the <a href="http://themes.ghost.org/docs/asset">asset helper documentation</a>.</p>',
                                        failures: [{
                                            ref: '/assets/dist/img/apple-touch-icon.png'
                                        }, {
                                            ref: '/assets/dist/img/favicon.ico'
                                        }, {
                                            ref: '/assets/dist/css/blackpalm.min.css'
                                        }, {
                                            ref: '/assets/dist/js/blackpalm.min.js'
                                        }],
                                        code: 'GS030-ASSET-REQ'
                                    }];

                                    return new _emberCliMirage.default.Response(200, {}, {
                                        themes: [theme]
                                    });
                                });

                                _context8.next = 48;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { name: 'warning-theme.zip', type: 'application/zip' });

                            case 48:

                                (0, _chai.expect)(find('.fullscreen-modal h1').text().trim(), 'modal title after uploading theme with warnings').to.equal('Upload successful with warnings/errors!');

                                _context8.next = 51;
                                return click((0, _emberTestSelectors.default)('toggle-details'));

                            case 51:

                                (0, _chai.expect)(find('.theme-validation-details').text(), 'top-level warnings are displayed').to.match(/The listed files should be included using the {{asset}} helper/);

                                (0, _chai.expect)(find('.theme-validation-list ul li').text(), 'individual warning failures are displayed').to.match(/\/assets\/dist\/img\/apple-touch-icon\.png/);

                                // reset to default mirage handlers
                                (0, _themes.default)(server);

                                _context8.next = 56;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('close-button'));

                            case 56:
                                _context8.next = 58;
                                return click((0, _emberTestSelectors.default)('upload-theme-button'));

                            case 58:
                                _context8.next = 60;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { name: 'theme-1.zip', type: 'application/zip' });

                            case 60:

                                (0, _chai.expect)(find('.fullscreen-modal h1').text().trim(), 'modal header after successful upload').to.equal('Upload successful!');

                                (0, _chai.expect)(find('.modal-body').text(), 'modal displays theme name after successful upload').to.match(/"Test 1 - 0\.1" uploaded successfully/);

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-id')).length, 'number of themes in list grows after upload').to.equal(5);

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-active', 'true') + ' ' + (0, _emberTestSelectors.default)('theme-title')).text().trim(), 'newly uploaded theme is not active').to.equal('Blog (default)');

                                _context8.next = 66;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('close-button'));

                            case 66:
                                _context8.next = 68;
                                return click((0, _emberTestSelectors.default)('upload-theme-button'));

                            case 68:
                                _context8.next = 70;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { name: 'theme-2.zip', type: 'application/zip' });

                            case 70:
                                _context8.next = 72;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('activate-now-button'));

                            case 72:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-id')).length, 'number of themes in list grows after upload and activate').to.equal(6);

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-active', 'true') + ' ' + (0, _emberTestSelectors.default)('theme-title')).text().trim(), 'newly uploaded+activated theme is active').to.equal('Test 2');

                                // theme activation switches active theme
                                _context8.next = 76;
                                return click((0, _emberTestSelectors.default)('theme-id', 'casper') + ' ' + (0, _emberTestSelectors.default)('theme-activate-button'));

                            case 76:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-id', 'test-2') + ' .apps-card-app').hasClass('theme-list-item--active'), 'previously active theme is not active').to.be.false;

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-id', 'casper') + ' .apps-card-app').hasClass('theme-list-item--active'), 'activated theme is active').to.be.true;

                                // theme activation shows errors
                                server.put('themes/:theme/activate', function () {
                                    return new _emberCliMirage.default.Response(422, {}, {
                                        errors: [{
                                            message: 'Theme is not compatible or contains errors.',
                                            errorType: 'ThemeValidationError',
                                            errorDetails: [{
                                                level: 'error',
                                                rule: 'Assets such as CSS & JS must use the <code>{{asset}}</code> helper',
                                                details: '<p>The listed files should be included using the <code>{{asset}}</code> helper.</p>',
                                                failures: [{
                                                    ref: '/assets/javascripts/ui.js'
                                                }]
                                            }, {
                                                level: 'error',
                                                rule: 'Templates must contain valid Handlebars.',
                                                failures: [{
                                                    ref: 'index.hbs',
                                                    message: 'The partial index_meta could not be found'
                                                }, {
                                                    ref: 'tag.hbs',
                                                    message: 'The partial index_meta could not be found'
                                                }]
                                            }]
                                        }]
                                    });
                                });

                                _context8.next = 81;
                                return click((0, _emberTestSelectors.default)('theme-id', 'test-2') + ' ' + (0, _emberTestSelectors.default)('theme-activate-button'));

                            case 81:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-warnings-modal'))).to.exist;

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-warnings-title')).text().trim(), 'modal title after activating invalid theme').to.equal('Activation failed');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-warnings')).text(), 'top-level errors are displayed in activation errors').to.match(/Templates must contain valid Handlebars/);

                                _context8.next = 86;
                                return click((0, _emberTestSelectors.default)('toggle-details'));

                            case 86:

                                (0, _chai.expect)(find('.theme-validation-details').text(), 'top-level errors do not escape HTML in activation errors').to.match(/The listed files should be included using the {{asset}} helper/);

                                (0, _chai.expect)(find('.theme-validation-list ul li').text(), 'individual failures are displayed in activation errors').to.match(/\/assets\/javascripts\/ui\.js/);

                                // restore default mirage handlers
                                (0, _themes.default)(server);

                                _context8.next = 91;
                                return click((0, _emberTestSelectors.default)('modal-close-button'));

                            case 91:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-warnings-modal'))).to.not.exist;

                                // theme activation shows warnings
                                server.put('themes/:theme/activate', function (_ref10, _ref11) {
                                    var themes = _ref10.themes;
                                    var params = _ref11.params;

                                    themes.all().update('active', false);
                                    var theme = themes.findBy({ name: params.theme }).update({ active: true });

                                    theme.update({ warnings: [{
                                            level: 'warning',
                                            rule: 'Assets such as CSS & JS must use the <code>{{asset}}</code> helper',
                                            details: '<p>The listed files should be included using the <code>{{asset}}</code> helper.  For more information, please see the <a href="http://themes.ghost.org/docs/asset">asset helper documentation</a>.</p>',
                                            failures: [{
                                                ref: '/assets/dist/img/apple-touch-icon.png'
                                            }, {
                                                ref: '/assets/dist/img/favicon.ico'
                                            }, {
                                                ref: '/assets/dist/css/blackpalm.min.css'
                                            }, {
                                                ref: '/assets/dist/js/blackpalm.min.js'
                                            }],
                                            code: 'GS030-ASSET-REQ'
                                        }] });

                                    return { themes: [theme] };
                                });

                                _context8.next = 95;
                                return click((0, _emberTestSelectors.default)('theme-id', 'test-2') + ' ' + (0, _emberTestSelectors.default)('theme-activate-button'));

                            case 95:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-warnings-modal'))).to.exist;

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-warnings-title')).text().trim(), 'modal title after activating theme with warnings').to.equal('Activated successful with warnings/errors!');

                                _context8.next = 99;
                                return click((0, _emberTestSelectors.default)('toggle-details'));

                            case 99:

                                (0, _chai.expect)(find('.theme-validation-details').text(), 'top-level warnings are displayed in activation warnings').to.match(/The listed files should be included using the {{asset}} helper/);

                                (0, _chai.expect)(find('.theme-validation-list ul li').text(), 'individual warning failures are displayed in activation warnings').to.match(/\/assets\/dist\/img\/apple-touch-icon\.png/);

                                // restore default mirage handlers
                                (0, _themes.default)(server);

                                _context8.next = 104;
                                return click((0, _emberTestSelectors.default)('modal-close-button'));

                            case 104:
                                _context8.next = 106;
                                return click((0, _emberTestSelectors.default)('theme-id', 'casper') + ' ' + (0, _emberTestSelectors.default)('theme-activate-button'));

                            case 106:
                                _context8.next = 108;
                                return click((0, _emberTestSelectors.default)('theme-id', 'test-1') + ' ' + (0, _emberTestSelectors.default)('theme-delete-button'));

                            case 108:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('delete-theme-modal')).length, 'theme deletion modal displayed after button click').to.equal(1);

                                // cancelling theme deletion closes modal
                                _context8.next = 111;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('cancel-button'));

                            case 111:
                                (0, _chai.expect)(find('.fullscreen-modal').length === 0, 'delete theme modal is closed when cancelling').to.be.true;

                                // confirming theme deletion closes modal and refreshes list
                                _context8.next = 114;
                                return click((0, _emberTestSelectors.default)('theme-id', 'test-1') + ' ' + (0, _emberTestSelectors.default)('theme-delete-button'));

                            case 114:
                                _context8.next = 116;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('delete-button'));

                            case 116:
                                (0, _chai.expect)(find('.fullscreen-modal').length === 0, 'delete theme modal closes after deletion').to.be.true;

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-id')).length, 'number of themes in list shrinks after delete').to.equal(5);

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('theme-title')).text(), 'correct theme is removed from theme list after deletion').to.not.match(/Test 1/);

                                // validation errors are handled when deleting a theme
                                server.del('/themes/:theme/', function () {
                                    return new _emberCliMirage.default.Response(422, {}, {
                                        errors: [{
                                            message: 'Can\'t delete theme'
                                        }]
                                    });
                                });

                                _context8.next = 122;
                                return click((0, _emberTestSelectors.default)('theme-id', 'test-2') + ' ' + (0, _emberTestSelectors.default)('theme-delete-button'));

                            case 122:
                                _context8.next = 124;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('delete-button'));

                            case 124:

                                (0, _chai.expect)(find('.fullscreen-modal').length === 0, 'delete theme modal closes after failed deletion').to.be.true;

                                (0, _chai.expect)(find('.gh-alert').length, 'alert is shown when deletion fails').to.equal(1);

                                (0, _chai.expect)(find('.gh-alert').text(), 'failed deletion alert has correct text').to.match(/Can't delete theme/);

                                // restore default mirage handlers
                                (0, _themes.default)(server);

                            case 128:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            })));

            (0, _mocha.it)('can delete then re-upload the same theme', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                server.loadFixtures('themes');

                                // mock theme upload to emulate uploading theme with same id
                                server.post('/themes/upload/', function (_ref13) {
                                    var themes = _ref13.themes;

                                    var theme = themes.create({
                                        name: 'foo',
                                        package: {
                                            name: 'Foo',
                                            version: '0.1'
                                        }
                                    });

                                    return { themes: [theme] };
                                });

                                _context9.next = 4;
                                return visit('/settings/design');

                            case 4:
                                _context9.next = 6;
                                return click((0, _emberTestSelectors.default)('theme-id', 'foo') + ' ' + (0, _emberTestSelectors.default)('theme-delete-button'));

                            case 6:
                                _context9.next = 8;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('delete-button'));

                            case 8:
                                _context9.next = 10;
                                return click((0, _emberTestSelectors.default)('upload-theme-button'));

                            case 10:
                                _context9.next = 12;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { name: 'foo.zip', type: 'application/zip' });

                            case 12:
                                _context9.next = 14;
                                return click('.fullscreen-modal ' + (0, _emberTestSelectors.default)('activate-now-button'));

                            case 14:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/settings/general-test', ['jquery', 'ghost-admin/utils/ctrl-or-cmd', 'ghost-admin/tests/helpers/destroy-app', 'ghost-admin/mirage/config/uploads', 'ember-runloop', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'ember-test-helpers/wait', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_jquery, _ctrlOrCmd, _destroyApp, _uploads, _emberRunloop, _startApp, _emberTestSelectors, _wait, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Settings - General', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/settings/general');

                        case 3:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 5;
                            return visit('/settings/general');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-user');

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as editor', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var role;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context3.next = 5;
                            return visit('/settings/general');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team');

                        case 6:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.describe)('when logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('it renders, handles image uploads', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var _server$pretender$han, _server$pretender$han2, lastRequest, params;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return visit('/settings/general');

                            case 2:

                                // has correct url
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/general');

                                // has correct page title
                                (0, _chai.expect)(document.title, 'page title').to.equal('Settings - General - Test Blog');

                                // highlights nav menu
                                (0, _chai.expect)((0, _jquery.default)('.gh-nav-settings-general').hasClass('active'), 'highlights nav menu item').to.be.true;

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('save-button')).text().trim(), 'save button text').to.equal('Save settings');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('dated-permalinks-checkbox')).prop('checked'), 'date permalinks checkbox').to.be.false;

                                _context4.next = 9;
                                return click((0, _emberTestSelectors.default)('toggle-pub-info'));

                            case 9:
                                _context4.next = 11;
                                return fillIn((0, _emberTestSelectors.default)('title-input'), 'New Blog Title');

                            case 11:
                                _context4.next = 13;
                                return click((0, _emberTestSelectors.default)('save-button'));

                            case 13:
                                (0, _chai.expect)(document.title, 'page title').to.equal('Settings - General - New Blog Title');

                                // blog icon upload
                                // -------------------------------------------------------------- //

                                // has fixture icon
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('icon-img')).attr('src'), 'initial icon src').to.equal('/content/images/2014/Feb/favicon.ico');

                                // delete removes icon + shows button
                                _context4.next = 17;
                                return click((0, _emberTestSelectors.default)('delete-image', 'icon'));

                            case 17:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('icon-img')), 'icon img after removal').to.not.exist;
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('image-upload-btn', 'icon')), 'icon upload button after removal').to.exist;

                                // select file
                                fileUpload((0, _emberTestSelectors.default)('file-input', 'icon'), ['test'], { name: 'pub-icon.ico', type: 'image/x-icon' });

                                // check progress bar exists during upload
                                _emberRunloop.default.later(function () {
                                    (0, _chai.expect)(find((0, _emberTestSelectors.default)('setting', 'icon') + ' ' + (0, _emberTestSelectors.default)('progress-bar')), 'icon upload progress bar').to.exist;
                                }, 50);

                                // wait for upload to finish and check image is shown
                                _context4.next = 23;
                                return (0, _wait.default)();

                            case 23:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('icon-img')).attr('src'), 'icon img after upload').to.match(/pub-icon\.ico$/);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('image-upload-btn', 'icon')), 'icon upload button after upload').to.not.exist;

                                // failed upload shows error
                                server.post('/uploads/icon/', function () {
                                    return {
                                        errors: [{
                                            errorType: 'ValidationError',
                                            message: 'Wrong icon size'
                                        }]
                                    };
                                }, 422);
                                _context4.next = 28;
                                return click((0, _emberTestSelectors.default)('delete-image', 'icon'));

                            case 28:
                                _context4.next = 30;
                                return fileUpload((0, _emberTestSelectors.default)('file-input', 'icon'), ['test'], { name: 'pub-icon.ico', type: 'image/x-icon' });

                            case 30:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('error', 'icon')).text().trim(), 'failed icon upload message').to.equal('Wrong icon size');

                                // reset upload endpoints
                                (0, _uploads.default)(server);

                                // blog logo upload
                                // -------------------------------------------------------------- //

                                // has fixture icon
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('logo-img')).attr('src'), 'initial logo src').to.equal('/content/images/2013/Nov/logo.png');

                                // delete removes logo + shows button
                                _context4.next = 35;
                                return click((0, _emberTestSelectors.default)('delete-image', 'logo'));

                            case 35:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('logo-img')), 'logo img after removal').to.not.exist;
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('image-upload-btn', 'logo')), 'logo upload button after removal').to.exist;

                                // select file
                                fileUpload((0, _emberTestSelectors.default)('file-input', 'logo'), ['test'], { name: 'pub-logo.png', type: 'image/png' });

                                // check progress bar exists during upload
                                _emberRunloop.default.later(function () {
                                    (0, _chai.expect)(find((0, _emberTestSelectors.default)('setting', 'logo') + ' ' + (0, _emberTestSelectors.default)('progress-bar')), 'logo upload progress bar').to.exist;
                                }, 50);

                                // wait for upload to finish and check image is shown
                                _context4.next = 41;
                                return (0, _wait.default)();

                            case 41:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('logo-img')).attr('src'), 'logo img after upload').to.match(/pub-logo\.png$/);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('image-upload-btn', 'logo')), 'logo upload button after upload').to.not.exist;

                                // failed upload shows error
                                server.post('/uploads/', function () {
                                    return {
                                        errors: [{
                                            errorType: 'ValidationError',
                                            message: 'Wrong logo size'
                                        }]
                                    };
                                }, 422);
                                _context4.next = 46;
                                return click((0, _emberTestSelectors.default)('delete-image', 'logo'));

                            case 46:
                                _context4.next = 48;
                                return fileUpload((0, _emberTestSelectors.default)('file-input', 'logo'), ['test'], { name: 'pub-logo.png', type: 'image/png' });

                            case 48:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('error', 'logo')).text().trim(), 'failed logo upload message').to.equal('Wrong logo size');

                                // reset upload endpoints
                                (0, _uploads.default)(server);

                                // blog cover upload
                                // -------------------------------------------------------------- //

                                // has fixture icon
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('cover-img')).attr('src'), 'initial coverImage src').to.equal('/content/images/2014/Feb/cover.jpg');

                                // delete removes coverImage + shows button
                                _context4.next = 53;
                                return click((0, _emberTestSelectors.default)('delete-image', 'coverImage'));

                            case 53:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('coverImage-img')), 'coverImage img after removal').to.not.exist;
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('image-upload-btn', 'coverImage')), 'coverImage upload button after removal').to.exist;

                                // select file
                                fileUpload((0, _emberTestSelectors.default)('file-input', 'coverImage'), ['test'], { name: 'pub-coverImage.png', type: 'image/png' });

                                // check progress bar exists during upload
                                _emberRunloop.default.later(function () {
                                    (0, _chai.expect)(find((0, _emberTestSelectors.default)('setting', 'coverImage') + ' ' + (0, _emberTestSelectors.default)('progress-bar')), 'coverImage upload progress bar').to.exist;
                                }, 50);

                                // wait for upload to finish and check image is shown
                                _context4.next = 59;
                                return (0, _wait.default)();

                            case 59:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('cover-img')).attr('src'), 'coverImage img after upload').to.match(/pub-coverImage\.png$/);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('image-upload-btn', 'coverImage')), 'coverImage upload button after upload').to.not.exist;

                                // failed upload shows error
                                server.post('/uploads/', function () {
                                    return {
                                        errors: [{
                                            errorType: 'ValidationError',
                                            message: 'Wrong coverImage size'
                                        }]
                                    };
                                }, 422);
                                _context4.next = 64;
                                return click((0, _emberTestSelectors.default)('delete-image', 'coverImage'));

                            case 64:
                                _context4.next = 66;
                                return fileUpload((0, _emberTestSelectors.default)('file-input', 'coverImage'), ['test'], { name: 'pub-coverImage.png', type: 'image/png' });

                            case 66:
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('error', 'coverImage')).text().trim(), 'failed coverImage upload message').to.equal('Wrong coverImage size');

                                // reset upload endpoints
                                (0, _uploads.default)(server);

                                // CMD-S shortcut works
                                // -------------------------------------------------------------- //
                                _context4.next = 70;
                                return fillIn((0, _emberTestSelectors.default)('title-input'), 'CMD-S Test');

                            case 70:
                                _context4.next = 72;
                                return triggerEvent('.gh-app', 'keydown', {
                                    keyCode: 83, // s
                                    metaKey: _ctrlOrCmd.default === 'command',
                                    ctrlKey: _ctrlOrCmd.default === 'ctrl'
                                });

                            case 72:
                                // we've already saved in this test so there's no on-screen indication
                                // that we've had another save, check the request was fired instead
                                _server$pretender$han = server.pretender.handledRequests.slice(-1), _server$pretender$han2 = _slicedToArray(_server$pretender$han, 1), lastRequest = _server$pretender$han2[0];
                                params = JSON.parse(lastRequest.requestBody);

                                (0, _chai.expect)(params.settings.findBy('key', 'title').value).to.equal('CMD-S Test');

                            case 75:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));

            (0, _mocha.it)('renders timezone selector correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return visit('/settings/general');

                            case 2:
                                _context5.next = 4;
                                return click((0, _emberTestSelectors.default)('toggle-timezone'));

                            case 4:

                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/general');

                                (0, _chai.expect)(find('#activeTimezone option').length, 'available timezones').to.equal(66);
                                (0, _chai.expect)(find('#activeTimezone option:selected').text().trim()).to.equal('(GMT) UTC');
                                find('#activeTimezone option[value="Africa/Cairo"]').prop('selected', true);

                                _context5.next = 10;
                                return triggerEvent('#activeTimezone', 'change');

                            case 10:
                                _context5.next = 12;
                                return click((0, _emberTestSelectors.default)('save-button'));

                            case 12:
                                (0, _chai.expect)(find('#activeTimezone option:selected').text().trim()).to.equal('(GMT +2:00) Cairo, Egypt');

                            case 13:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));

            (0, _mocha.it)('handles private blog settings correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return visit('/settings/general');

                            case 2:

                                // handles private blog settings correctly
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('private-checkbox')).prop('checked'), 'isPrivate checkbox').to.be.false;

                                _context6.next = 5;
                                return click((0, _emberTestSelectors.default)('private-checkbox'));

                            case 5:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('private-checkbox')).prop('checked'), 'isPrivate checkbox').to.be.true;
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('password-input')).length, 'password input').to.equal(1);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('password-input')).val(), 'password default value').to.not.equal('');

                                _context6.next = 10;
                                return fillIn((0, _emberTestSelectors.default)('password-input'), '');

                            case 10:
                                _context6.next = 12;
                                return triggerEvent((0, _emberTestSelectors.default)('password-input'), 'blur');

                            case 12:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('password-error')).text().trim(), 'empty password error').to.equal('Password must be supplied');

                                _context6.next = 15;
                                return fillIn((0, _emberTestSelectors.default)('password-input'), 'asdfg');

                            case 15:
                                _context6.next = 17;
                                return triggerEvent((0, _emberTestSelectors.default)('password-input'), 'blur');

                            case 17:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('password-error')).text().trim(), 'present password error').to.equal('');

                            case 18:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            })));

            (0, _mocha.it)('handles social blog settings correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return visit('/settings/general');

                            case 2:
                                _context7.next = 4;
                                return click((0, _emberTestSelectors.default)('toggle-social'));

                            case 4:

                                // validates a facebook url correctly
                                // loads fixtures and performs transform
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val(), 'initial facebook value').to.equal('https://www.facebook.com/test');

                                _context7.next = 7;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'focus');

                            case 7:
                                _context7.next = 9;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 9:

                                // regression test: we still have a value after the input is
                                // focused and then blurred without any changes
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val(), 'facebook value after blur with no change').to.equal('https://www.facebook.com/test');

                                _context7.next = 12;
                                return fillIn((0, _emberTestSelectors.default)('facebook-input'), 'facebook.com/username');

                            case 12:
                                _context7.next = 14;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 14:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val()).to.be.equal('https://www.facebook.com/username');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-error')).text().trim(), 'inline validation response').to.equal('');

                                _context7.next = 18;
                                return fillIn((0, _emberTestSelectors.default)('facebook-input'), 'facebook.com/pages/some-facebook-page/857469375913?ref=ts');

                            case 18:
                                _context7.next = 20;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 20:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val()).to.be.equal('https://www.facebook.com/pages/some-facebook-page/857469375913?ref=ts');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-error')).text().trim(), 'inline validation response').to.equal('');

                                _context7.next = 24;
                                return fillIn((0, _emberTestSelectors.default)('facebook-input'), '*(&*(%%))');

                            case 24:
                                _context7.next = 26;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 26:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-error')).text().trim(), 'inline validation response').to.equal('The URL must be in a format like https://www.facebook.com/yourPage');

                                _context7.next = 29;
                                return fillIn((0, _emberTestSelectors.default)('facebook-input'), 'http://github.com/username');

                            case 29:
                                _context7.next = 31;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 31:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val()).to.be.equal('https://www.facebook.com/username');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-error')).text().trim(), 'inline validation response').to.equal('');

                                _context7.next = 35;
                                return fillIn((0, _emberTestSelectors.default)('facebook-input'), 'http://github.com/pages/username');

                            case 35:
                                _context7.next = 37;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 37:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val()).to.be.equal('https://www.facebook.com/pages/username');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-error')).text().trim(), 'inline validation response').to.equal('');

                                _context7.next = 41;
                                return fillIn((0, _emberTestSelectors.default)('facebook-input'), 'testuser');

                            case 41:
                                _context7.next = 43;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 43:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val()).to.be.equal('https://www.facebook.com/testuser');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-error')).text().trim(), 'inline validation response').to.equal('');

                                _context7.next = 47;
                                return fillIn((0, _emberTestSelectors.default)('facebook-input'), 'ab99');

                            case 47:
                                _context7.next = 49;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 49:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val()).to.be.equal('https://www.facebook.com/ab99');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-error')).text().trim(), 'inline validation response').to.equal('');

                                _context7.next = 53;
                                return fillIn((0, _emberTestSelectors.default)('facebook-input'), 'page/ab99');

                            case 53:
                                _context7.next = 55;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 55:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val()).to.be.equal('https://www.facebook.com/page/ab99');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-error')).text().trim(), 'inline validation response').to.equal('');

                                _context7.next = 59;
                                return fillIn((0, _emberTestSelectors.default)('facebook-input'), 'page/*(&*(%%))');

                            case 59:
                                _context7.next = 61;
                                return triggerEvent((0, _emberTestSelectors.default)('facebook-input'), 'blur');

                            case 61:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-input')).val()).to.be.equal('https://www.facebook.com/page/*(&*(%%))');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('facebook-error')).text().trim(), 'inline validation response').to.equal('');

                                // validates a twitter url correctly

                                // loads fixtures and performs transform
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-input')).val(), 'initial twitter value').to.equal('https://twitter.com/test');

                                _context7.next = 66;
                                return triggerEvent((0, _emberTestSelectors.default)('twitter-input'), 'focus');

                            case 66:
                                _context7.next = 68;
                                return triggerEvent((0, _emberTestSelectors.default)('twitter-input'), 'blur');

                            case 68:

                                // regression test: we still have a value after the input is
                                // focused and then blurred without any changes
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-input')).val(), 'twitter value after blur with no change').to.equal('https://twitter.com/test');

                                _context7.next = 71;
                                return fillIn((0, _emberTestSelectors.default)('twitter-input'), 'twitter.com/username');

                            case 71:
                                _context7.next = 73;
                                return triggerEvent((0, _emberTestSelectors.default)('twitter-input'), 'blur');

                            case 73:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-input')).val()).to.be.equal('https://twitter.com/username');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-error')).text().trim(), 'inline validation response').to.equal('');

                                _context7.next = 77;
                                return fillIn((0, _emberTestSelectors.default)('twitter-input'), '*(&*(%%))');

                            case 77:
                                _context7.next = 79;
                                return triggerEvent((0, _emberTestSelectors.default)('twitter-input'), 'blur');

                            case 79:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-error')).text().trim(), 'inline validation response').to.equal('The URL must be in a format like https://twitter.com/yourUsername');

                                _context7.next = 82;
                                return fillIn((0, _emberTestSelectors.default)('twitter-input'), 'http://github.com/username');

                            case 82:
                                _context7.next = 84;
                                return triggerEvent((0, _emberTestSelectors.default)('twitter-input'), 'blur');

                            case 84:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-input')).val()).to.be.equal('https://twitter.com/username');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-error')).text().trim(), 'inline validation response').to.equal('');

                                _context7.next = 88;
                                return fillIn((0, _emberTestSelectors.default)('twitter-input'), 'thisusernamehasmorethan15characters');

                            case 88:
                                _context7.next = 90;
                                return triggerEvent((0, _emberTestSelectors.default)('twitter-input'), 'blur');

                            case 90:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-error')).text().trim(), 'inline validation response').to.equal('Your Username is not a valid Twitter Username');

                                _context7.next = 93;
                                return fillIn((0, _emberTestSelectors.default)('twitter-input'), 'testuser');

                            case 93:
                                _context7.next = 95;
                                return triggerEvent((0, _emberTestSelectors.default)('twitter-input'), 'blur');

                            case 95:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-input')).val()).to.be.equal('https://twitter.com/testuser');
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('twitter-error')).text().trim(), 'inline validation response').to.equal('');

                            case 97:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/settings/labs-test', ['jquery', 'ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_jquery, _destroyApp, _startApp, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Settings - Labs', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/settings/labs');

                        case 3:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 5;
                            return visit('/settings/labs');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-user');

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as editor', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var role;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context3.next = 5;
                            return visit('/settings/labs');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team');

                        case 6:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.describe)('when logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            _mocha.it.skip('it renders, loads modals correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return visit('/settings/labs');

                            case 2:

                                // has correct url
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/labs');

                                // has correct page title
                                (0, _chai.expect)(document.title, 'page title').to.equal('Settings - Labs - Test Blog');

                                // highlights nav menu
                                (0, _chai.expect)((0, _jquery.default)('.gh-nav-settings-labs').hasClass('active'), 'highlights nav menu item').to.be.true;

                                _context4.next = 7;
                                return click('#settings-resetdb .js-delete');

                            case 7:
                                (0, _chai.expect)(find('.fullscreen-modal .modal-content').length, 'modal element').to.equal(1);

                                _context4.next = 10;
                                return click('.fullscreen-modal .modal-footer .gh-btn');

                            case 10:
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'modal element').to.equal(0);

                            case 11:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/settings/slack-test', ['ember-cli-mirage', 'ghost-admin/utils/ctrl-or-cmd', 'ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_emberCliMirage, _ctrlOrCmd, _destroyApp, _startApp, _emberTestSelectors, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Settings - Apps - Slack', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/settings/apps/slack');

                        case 3:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 5;
                            return visit('/settings/apps/slack');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-user');

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as editor', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var role;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context3.next = 5;
                            return visit('/settings/apps/slack');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team');

                        case 6:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.describe)('when logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('it validates and saves a slack url properly', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var _server$pretender$han, _server$pretender$han2, newRequest, params, _JSON$parse, _JSON$parse2, result, _server$pretender$han3, _server$pretender$han4, lastRequest;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return visit('/settings/apps/slack');

                            case 2:

                                // has correct url
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/apps/slack');

                                _context4.next = 5;
                                return fillIn('#slack-settings input[name="slack[url]"]', 'notacorrecturl');

                            case 5:
                                _context4.next = 7;
                                return click((0, _emberTestSelectors.default)('save-button'));

                            case 7:

                                (0, _chai.expect)(find('#slack-settings .error .response').text().trim(), 'inline validation response').to.equal('The URL must be in a format like https://hooks.slack.com/services/<your personal key>');

                                // CMD-S shortcut works
                                _context4.next = 10;
                                return fillIn((0, _emberTestSelectors.default)('slack-url-input'), 'https://hooks.slack.com/services/1275958430');

                            case 10:
                                _context4.next = 12;
                                return triggerEvent('.gh-app', 'keydown', {
                                    keyCode: 83, // s
                                    metaKey: _ctrlOrCmd.default === 'command',
                                    ctrlKey: _ctrlOrCmd.default === 'ctrl'
                                });

                            case 12:
                                _server$pretender$han = server.pretender.handledRequests.slice(-1), _server$pretender$han2 = _slicedToArray(_server$pretender$han, 1), newRequest = _server$pretender$han2[0];
                                params = JSON.parse(newRequest.requestBody);
                                _JSON$parse = JSON.parse(params.settings.findBy('key', 'slack').value), _JSON$parse2 = _slicedToArray(_JSON$parse, 1), result = _JSON$parse2[0];


                                (0, _chai.expect)(result.url).to.equal('https://hooks.slack.com/services/1275958430');
                                (0, _chai.expect)(find('#slack-settings .error .response').text().trim(), 'inline validation response').to.equal('');

                                _context4.next = 19;
                                return fillIn('#slack-settings input[name="slack[url]"]', 'https://hooks.slack.com/services/1275958430');

                            case 19:
                                _context4.next = 21;
                                return click((0, _emberTestSelectors.default)('send-notification-button'));

                            case 21:

                                (0, _chai.expect)(find('.gh-alert-blue').length, 'modal element').to.equal(1);
                                (0, _chai.expect)(find('#slack-settings .error .response').text().trim(), 'inline validation response').to.equal('');

                                server.put('/settings/', function () {
                                    return new _emberCliMirage.default.Response(422, {}, {
                                        errors: [{
                                            errorType: 'ValidationError',
                                            message: 'Test error'
                                        }]
                                    });
                                });

                                _context4.next = 26;
                                return click('.gh-alert-blue .gh-alert-close');

                            case 26:
                                _context4.next = 28;
                                return click((0, _emberTestSelectors.default)('send-notification-button'));

                            case 28:

                                // we shouldn't try to send the test request if the save fails
                                _server$pretender$han3 = server.pretender.handledRequests.slice(-1), _server$pretender$han4 = _slicedToArray(_server$pretender$han3, 1), lastRequest = _server$pretender$han4[0];

                                (0, _chai.expect)(lastRequest.url).to.not.match(/\/slack\/test/);
                                (0, _chai.expect)(find('.gh-alert-blue').length, 'check slack alert after api validation error').to.equal(0);

                            case 31:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/settings/tags-test', ['jquery', 'ghost-admin/tests/helpers/destroy-app', 'ember-runloop', 'ghost-admin/tests/helpers/start-app', 'ember-test-helpers/wait', 'ember-cli-mirage', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'ghost-admin/tests/helpers/adapter-error', 'chai', 'ember-concurrency'], function (_jquery, _destroyApp, _emberRunloop, _startApp, _wait, _emberCliMirage, _mocha, _emberSimpleAuth, _adapterError, _chai, _emberConcurrency) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    // Grabbed from keymaster's testing code because Ember's `keyEvent` helper
    // is for some reason not triggering the events in a way that keymaster detects:
    // https://github.com/madrobby/keymaster/blob/master/test/keymaster.html#L31
    var modifierMap = {
        16: 'shiftKey',
        18: 'altKey',
        17: 'ctrlKey',
        91: 'metaKey'
    };
    var keydown = function keydown(code, modifiers, el) {
        var event = document.createEvent('Event');
        event.initEvent('keydown', true, true);
        event.keyCode = code;
        if (modifiers && modifiers.length > 0) {
            for (var i in modifiers) {
                event[modifierMap[modifiers[i]]] = true;
            }
        }
        (el || document).dispatchEvent(event);
    };
    var keyup = function keyup(code, el) {
        var event = document.createEvent('Event');
        event.initEvent('keyup', true, true);
        event.keyCode = code;
        (el || document).dispatchEvent(event);
    };

    (0, _mocha.describe)('Acceptance: Settings - Tags', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/settings/tags');

                        case 3:

                            (0, _chai.expect)(currentURL()).to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects to team page when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 5;
                            return visit('/settings/design');

                        case 5:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-user');

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.describe)('when logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('it renders, can be navigated, can edit, create & delete tags', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var tag1, tag2;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                tag1 = server.create('tag');
                                tag2 = server.create('tag');
                                _context3.next = 4;
                                return visit('/settings/tags');

                            case 4:
                                _context3.next = 6;
                                return (0, _wait.default)();

                            case 6:

                                // it redirects to first tag
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/settings/tags/' + tag1.slug);

                                // it has correct page title
                                (0, _chai.expect)(document.title, 'page title').to.equal('Settings - Tags - Test Blog');

                                // it highlights nav menu
                                (0, _chai.expect)((0, _jquery.default)('.gh-nav-settings-tags').hasClass('active'), 'highlights nav menu item').to.be.true;

                                // it lists all tags
                                (0, _chai.expect)(find('.settings-tags .settings-tag').length, 'tag list count').to.equal(2);
                                (0, _chai.expect)(find('.settings-tags .settings-tag:first .tag-title').text(), 'tag list item title').to.equal(tag1.name);

                                // it highlights selected tag
                                (0, _chai.expect)(find('a[href="/ghost/settings/tags/' + tag1.slug + '"]').hasClass('active'), 'highlights selected tag').to.be.true;

                                // it shows selected tag form
                                (0, _chai.expect)(find('.tag-settings-pane h4').text(), 'settings pane title').to.equal('Tag Settings');
                                (0, _chai.expect)(find('.tag-settings-pane input[name="name"]').val(), 'loads correct tag into form').to.equal(tag1.name);

                                // click the second tag in the list
                                _context3.next = 16;
                                return click('.tag-edit-button:last');

                            case 16:

                                // it navigates to selected tag
                                (0, _chai.expect)(currentURL(), 'url after clicking tag').to.equal('/settings/tags/' + tag2.slug);

                                // it highlights selected tag
                                (0, _chai.expect)(find('a[href="/ghost/settings/tags/' + tag2.slug + '"]').hasClass('active'), 'highlights selected tag').to.be.true;

                                // it shows selected tag form
                                (0, _chai.expect)(find('.tag-settings-pane input[name="name"]').val(), 'loads correct tag into form').to.equal(tag2.name);

                                // simulate up arrow press
                                (0, _emberRunloop.default)(function () {
                                    keydown(38);
                                    keyup(38);
                                });

                                _context3.next = 22;
                                return (0, _wait.default)();

                            case 22:

                                // it navigates to previous tag
                                (0, _chai.expect)(currentURL(), 'url after keyboard up arrow').to.equal('/settings/tags/' + tag1.slug);

                                // it highlights selected tag
                                (0, _chai.expect)(find('a[href="/ghost/settings/tags/' + tag1.slug + '"]').hasClass('active'), 'selects previous tag').to.be.true;

                                // simulate down arrow press
                                (0, _emberRunloop.default)(function () {
                                    keydown(40);
                                    keyup(40);
                                });

                                _context3.next = 27;
                                return (0, _wait.default)();

                            case 27:

                                // it navigates to previous tag
                                (0, _chai.expect)(currentURL(), 'url after keyboard down arrow').to.equal('/settings/tags/' + tag2.slug);

                                // it highlights selected tag
                                (0, _chai.expect)(find('a[href="/ghost/settings/tags/' + tag2.slug + '"]').hasClass('active'), 'selects next tag').to.be.true;

                                // trigger save
                                _context3.next = 31;
                                return fillIn('.tag-settings-pane input[name="name"]', 'New Name');

                            case 31:
                                _context3.next = 33;
                                return triggerEvent('.tag-settings-pane input[name="name"]', 'blur');

                            case 33:

                                // check we update with the data returned from the server
                                (0, _chai.expect)(find('.settings-tags .settings-tag:last .tag-title').text(), 'tag list updates on save').to.equal('New Name');
                                (0, _chai.expect)(find('.tag-settings-pane input[name="name"]').val(), 'settings form updates on save').to.equal('New Name');

                                // start new tag
                                _context3.next = 37;
                                return click('.view-actions .gh-btn-green');

                            case 37:

                                // it navigates to the new tag route
                                (0, _chai.expect)(currentURL(), 'new tag URL').to.equal('/settings/tags/new');

                                // it displays the new tag form
                                (0, _chai.expect)(find('.tag-settings-pane h4').text(), 'settings pane title').to.equal('New Tag');

                                // all fields start blank
                                find('.tag-settings-pane input, .tag-settings-pane textarea').each(function () {
                                    (0, _chai.expect)((0, _jquery.default)(this).val(), 'input field for ' + (0, _jquery.default)(this).attr('name')).to.be.blank;
                                });

                                // save new tag
                                _context3.next = 42;
                                return fillIn('.tag-settings-pane input[name="name"]', 'New Tag');

                            case 42:
                                _context3.next = 44;
                                return triggerEvent('.tag-settings-pane input[name="name"]', 'blur');

                            case 44:
                                _context3.next = 46;
                                return (0, _emberConcurrency.timeout)(100);

                            case 46:

                                // it redirects to the new tag's URL
                                (0, _chai.expect)(currentURL(), 'URL after tag creation').to.equal('/settings/tags/new-tag');

                                // it adds the tag to the list and selects
                                (0, _chai.expect)(find('.settings-tags .settings-tag').length, 'tag list count after creation').to.equal(3);
                                (0, _chai.expect)(find('.settings-tags .settings-tag:last .tag-title').text(), 'new tag list item title').to.equal('New Tag');
                                (0, _chai.expect)(find('a[href="/ghost/settings/tags/new-tag"]').hasClass('active'), 'highlights new tag').to.be.true;

                                // delete tag
                                _context3.next = 52;
                                return click('.settings-menu-delete-button');

                            case 52:
                                _context3.next = 54;
                                return click('.fullscreen-modal .gh-btn-red');

                            case 54:

                                // it redirects to the first tag
                                (0, _chai.expect)(currentURL(), 'URL after tag deletion').to.equal('/settings/tags/' + tag1.slug);

                                // it removes the tag from the list
                                (0, _chai.expect)(find('.settings-tags .settings-tag').length, 'tag list count after deletion').to.equal(2);

                            case 56:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));

            (0, _mocha.it)('loads tag via slug when accessed directly', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                server.createList('tag', 2);

                                _context4.next = 3;
                                return visit('/settings/tags/tag-1');

                            case 3:
                                _context4.next = 5;
                                return (0, _wait.default)();

                            case 5:

                                (0, _chai.expect)(currentURL(), 'URL after direct load').to.equal('/settings/tags/tag-1');

                                // it loads all other tags
                                (0, _chai.expect)(find('.settings-tags .settings-tag').length, 'tag list count after direct load').to.equal(2);

                                // selects tag in list
                                (0, _chai.expect)(find('a[href="/ghost/settings/tags/tag-1"]').hasClass('active'), 'highlights requested tag').to.be.true;

                                // shows requested tag in settings pane
                                (0, _chai.expect)(find('.tag-settings-pane input[name="name"]').val(), 'loads correct tag into form').to.equal('Tag 1');

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));

            (0, _mocha.it)('shows the internal tag label', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                server.create('tag', { name: '#internal-tag', slug: 'hash-internal-tag', visibility: 'internal' });

                                _context5.next = 3;
                                return visit('settings/tags/');

                            case 3:
                                _context5.next = 5;
                                return (0, _wait.default)();

                            case 5:

                                (0, _chai.expect)(currentURL()).to.equal('/settings/tags/hash-internal-tag');

                                (0, _chai.expect)(find('.settings-tags .settings-tag').length, 'tag list count').to.equal(1);

                                (0, _chai.expect)(find('.settings-tags .settings-tag:first .label.label-blue').length, 'internal tag label').to.equal(1);

                                (0, _chai.expect)(find('.settings-tags .settings-tag:first .label.label-blue').text().trim(), 'internal tag label text').to.equal('internal');

                            case 9:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));

            (0, _mocha.it)('redirects to 404 when tag does not exist', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                server.get('/tags/slug/unknown/', function () {
                                    return new _emberCliMirage.Response(404, { 'Content-Type': 'application/json' }, { errors: [{ message: 'Tag not found.', errorType: 'NotFoundError' }] });
                                });

                                (0, _adapterError.errorOverride)();

                                _context6.next = 4;
                                return visit('settings/tags/unknown');

                            case 4:

                                (0, _adapterError.errorReset)();
                                (0, _chai.expect)(currentPath()).to.equal('error404');
                                (0, _chai.expect)(currentURL()).to.equal('/settings/tags/unknown');

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/setup-test', ['ghost-admin/tests/helpers/destroy-app', 'moment', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'ember-cli-mirage', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'ghost-admin/tests/helpers/configuration', 'chai', 'ghost-admin/tests/helpers/oauth'], function (_destroyApp, _moment, _startApp, _emberTestSelectors, _emberCliMirage, _mocha, _emberSimpleAuth, _configuration, _chai, _oauth) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Setup', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects if already authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var role;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            _context.next = 4;
                            return (0, _emberSimpleAuth.authenticateSession)(application);

                        case 4:
                            _context.next = 6;
                            return visit('/setup/one');

                        case 6:
                            (0, _chai.expect)(currentURL()).to.equal('/');

                            _context.next = 9;
                            return visit('/setup/two');

                        case 9:
                            (0, _chai.expect)(currentURL()).to.equal('/');

                            _context.next = 12;
                            return visit('/setup/three');

                        case 12:
                            (0, _chai.expect)(currentURL()).to.equal('/');

                        case 13:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects to signin if already set up', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            // mimick an already setup blog
                            server.get('/authentication/setup/', function () {
                                return {
                                    setup: [{ status: true }]
                                };
                            });

                            _context2.next = 3;
                            return (0, _emberSimpleAuth.invalidateSession)(application);

                        case 3:
                            _context2.next = 5;
                            return visit('/setup');

                        case 5:
                            (0, _chai.expect)(currentURL()).to.equal('/signin');

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.describe)('with a new blog', function () {
            (0, _mocha.beforeEach)(function () {
                // mimick a new blog
                server.get('/authentication/setup/', function () {
                    return {
                        setup: [{ status: false }]
                    };
                });
            });

            (0, _mocha.it)('has a successful happy path', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                (0, _emberSimpleAuth.invalidateSession)(application);
                                server.loadFixtures('roles');

                                _context3.next = 4;
                                return visit('/setup');

                            case 4:

                                // it redirects to step one
                                (0, _chai.expect)(currentURL(), 'url after accessing /setup').to.equal('/setup/one');

                                // it highlights first step
                                (0, _chai.expect)(find('.gh-flow-nav .step:first-of-type').hasClass('active')).to.be.true;
                                (0, _chai.expect)(find('.gh-flow-nav .step:nth-of-type(2)').hasClass('active')).to.be.false;
                                (0, _chai.expect)(find('.gh-flow-nav .step:nth-of-type(3)').hasClass('active')).to.be.false;

                                // it displays download count (count increments for each ajax call
                                // and polling is disabled in testing so our count should be "1"
                                (0, _chai.expect)(find('.gh-flow-content em').text().trim()).to.equal('1');

                                _context3.next = 11;
                                return click('.gh-btn-green');

                            case 11:

                                // it transitions to step two
                                (0, _chai.expect)(currentURL(), 'url after clicking "Create your account"').to.equal('/setup/two');

                                // email field is focused by default
                                // NOTE: $('x').is(':focus') doesn't work in phantomjs CLI runner
                                // https://github.com/ariya/phantomjs/issues/10427
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('email-input')).get(0) === document.activeElement, 'email field has focus').to.be.true;

                                _context3.next = 15;
                                return click('.gh-btn-green');

                            case 15:

                                // it marks fields as invalid
                                (0, _chai.expect)(find('.form-group.error').length, 'number of invalid fields').to.equal(4);

                                // it displays error messages
                                (0, _chai.expect)(find('.error .response').length, 'number of in-line validation messages').to.equal(4);

                                // it displays main error
                                (0, _chai.expect)(find('.main-error').length, 'main error is displayed').to.equal(1);

                                // enter valid details and submit
                                _context3.next = 20;
                                return fillIn((0, _emberTestSelectors.default)('email-input'), 'test@example.com');

                            case 20:
                                _context3.next = 22;
                                return fillIn((0, _emberTestSelectors.default)('name-input'), 'Test User');

                            case 22:
                                _context3.next = 24;
                                return fillIn((0, _emberTestSelectors.default)('password-input'), 'password');

                            case 24:
                                _context3.next = 26;
                                return fillIn((0, _emberTestSelectors.default)('blog-title-input'), 'Blog Title');

                            case 26:
                                _context3.next = 28;
                                return click('.gh-btn-green');

                            case 28:

                                // it transitions to step 3
                                (0, _chai.expect)(currentURL(), 'url after submitting step two').to.equal('/setup/three');

                                // submit button is "disabled"
                                (0, _chai.expect)(find('button[type="submit"]').hasClass('gh-btn-green'), 'invite button with no emails is white').to.be.false;

                                // fill in a valid email
                                _context3.next = 32;
                                return fillIn('[name="users"]', 'new-user@example.com');

                            case 32:

                                // submit button is "enabled"
                                (0, _chai.expect)(find('button[type="submit"]').hasClass('gh-btn-green'), 'invite button is green with valid email address').to.be.true;

                                // submit the invite form
                                _context3.next = 35;
                                return click('button[type="submit"]');

                            case 35:

                                // it redirects to the home / "content" screen
                                (0, _chai.expect)(currentURL(), 'url after submitting invites').to.equal('/');

                                // it displays success alert
                                (0, _chai.expect)(find('.gh-alert-green').length, 'number of success alerts').to.equal(1);

                            case 37:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));

            (0, _mocha.it)('handles validation errors in step 2', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var postCount;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                postCount = 0;


                                (0, _emberSimpleAuth.invalidateSession)(application);
                                server.loadFixtures('roles');

                                server.post('/authentication/setup', function () {
                                    postCount++;

                                    // validation error
                                    if (postCount === 1) {
                                        return new _emberCliMirage.Response(422, {}, {
                                            errors: [{
                                                errorType: 'ValidationError',
                                                message: 'Server response message'
                                            }]
                                        });
                                    }

                                    // server error
                                    if (postCount === 2) {
                                        return new _emberCliMirage.Response(500, {}, null);
                                    }
                                });

                                _context4.next = 6;
                                return visit('/setup/two');

                            case 6:
                                _context4.next = 8;
                                return click('.gh-btn-green');

                            case 8:

                                // non-server validation
                                (0, _chai.expect)(find('.main-error').text().trim(), 'error text').to.not.be.blank;

                                _context4.next = 11;
                                return fillIn((0, _emberTestSelectors.default)('email-input'), 'test@example.com');

                            case 11:
                                _context4.next = 13;
                                return fillIn((0, _emberTestSelectors.default)('name-input'), 'Test User');

                            case 13:
                                _context4.next = 15;
                                return fillIn((0, _emberTestSelectors.default)('password-input'), 'password');

                            case 15:
                                _context4.next = 17;
                                return fillIn((0, _emberTestSelectors.default)('blog-title-input'), 'Blog Title');

                            case 17:
                                _context4.next = 19;
                                return click('.gh-btn-green');

                            case 19:

                                (0, _chai.expect)(find('.main-error').text().trim(), 'error text').to.equal('Server response message');

                                // second post - simulated server error
                                _context4.next = 22;
                                return click('.gh-btn-green');

                            case 22:

                                (0, _chai.expect)(find('.main-error').text().trim(), 'error text').to.be.blank;

                                (0, _chai.expect)(find('.gh-alert-red').length, 'number of alerts').to.equal(1);

                            case 24:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));

            (0, _mocha.it)('handles invalid origin error on step 2', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                // mimick the API response for an invalid origin
                                server.post('/authentication/token', function () {
                                    return new _emberCliMirage.Response(401, {}, {
                                        errors: [{
                                            errorType: 'UnauthorizedError',
                                            message: 'Access Denied from url: unknown.com. Please use the url configured in config.js.'
                                        }]
                                    });
                                });

                                (0, _emberSimpleAuth.invalidateSession)(application);
                                server.loadFixtures('roles');

                                _context5.next = 5;
                                return visit('/setup/two');

                            case 5:
                                _context5.next = 7;
                                return fillIn((0, _emberTestSelectors.default)('email-input'), 'test@example.com');

                            case 7:
                                _context5.next = 9;
                                return fillIn((0, _emberTestSelectors.default)('name-input'), 'Test User');

                            case 9:
                                _context5.next = 11;
                                return fillIn((0, _emberTestSelectors.default)('password-input'), 'password');

                            case 11:
                                _context5.next = 13;
                                return fillIn((0, _emberTestSelectors.default)('blog-title-input'), 'Blog Title');

                            case 13:
                                _context5.next = 15;
                                return click('.gh-btn-green');

                            case 15:

                                // button should not be spinning
                                (0, _chai.expect)(find('.gh-btn-green .spinner').length, 'button has spinner').to.equal(0);
                                // we should show an error message
                                (0, _chai.expect)(find('.main-error').text(), 'error text').to.equal('Access Denied from url: unknown.com. Please use the url configured in config.js.');

                            case 17:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));

            (0, _mocha.it)('handles validation errors in step 3', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                var input, postCount, button, formGroup;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                input = '[name="users"]';
                                postCount = 0;
                                button = void 0, formGroup = void 0;


                                (0, _emberSimpleAuth.invalidateSession)(application);
                                server.loadFixtures('roles');

                                server.post('/invites', function (_ref7, request) {
                                    var invites = _ref7.invites;

                                    var _JSON$parse$invites = _slicedToArray(JSON.parse(request.requestBody).invites, 1),
                                        params = _JSON$parse$invites[0];

                                    postCount++;

                                    // invalid
                                    if (postCount === 1) {
                                        return new _emberCliMirage.Response(422, {}, {
                                            errors: [{
                                                errorType: 'ValidationError',
                                                message: 'Dummy validation error'
                                            }]
                                        });
                                    }

                                    // TODO: duplicated from mirage/config/invites - extract method?
                                    /* eslint-disable camelcase */
                                    params.token = invites.all().models.length + '-token';
                                    params.expires = _moment.default.utc().add(1, 'day').valueOf();
                                    params.created_at = _moment.default.utc().format();
                                    params.created_by = 1;
                                    params.updated_at = _moment.default.utc().format();
                                    params.updated_by = 1;
                                    params.status = 'sent';
                                    /* eslint-enable camelcase */

                                    return invites.create(params);
                                });

                                // complete step 2 so we can access step 3
                                _context6.next = 8;
                                return visit('/setup/two');

                            case 8:
                                _context6.next = 10;
                                return fillIn((0, _emberTestSelectors.default)('email-input'), 'test@example.com');

                            case 10:
                                _context6.next = 12;
                                return fillIn((0, _emberTestSelectors.default)('name-input'), 'Test User');

                            case 12:
                                _context6.next = 14;
                                return fillIn((0, _emberTestSelectors.default)('password-input'), 'password');

                            case 14:
                                _context6.next = 16;
                                return fillIn((0, _emberTestSelectors.default)('blog-title-input'), 'Blog Title');

                            case 16:
                                _context6.next = 18;
                                return click('.gh-btn-green');

                            case 18:

                                // default field/button state
                                formGroup = find('.gh-flow-invite .form-group');
                                button = find('.gh-flow-invite button[type="submit"]');

                                (0, _chai.expect)(formGroup.hasClass('error'), 'default field has error class').to.be.false;

                                (0, _chai.expect)(button.text().trim(), 'default button text').to.equal('Invite some users');

                                (0, _chai.expect)(button.hasClass('gh-btn-minor'), 'default button is disabled').to.be.true;

                                // no users submitted state
                                _context6.next = 25;
                                return click('.gh-flow-invite button[type="submit"]');

                            case 25:

                                (0, _chai.expect)(formGroup.hasClass('error'), 'no users submitted field has error class').to.be.true;

                                (0, _chai.expect)(button.text().trim(), 'no users submitted button text').to.equal('No users to invite');

                                (0, _chai.expect)(button.hasClass('gh-btn-minor'), 'no users submitted button is disabled').to.be.true;

                                // single invalid email
                                _context6.next = 30;
                                return fillIn(input, 'invalid email');

                            case 30:
                                _context6.next = 32;
                                return triggerEvent(input, 'blur');

                            case 32:

                                (0, _chai.expect)(formGroup.hasClass('error'), 'invalid field has error class').to.be.true;

                                (0, _chai.expect)(button.text().trim(), 'single invalid button text').to.equal('1 invalid email address');

                                (0, _chai.expect)(button.hasClass('gh-btn-minor'), 'invalid email button is disabled').to.be.true;

                                // multiple invalid emails
                                _context6.next = 37;
                                return fillIn(input, 'invalid email\nanother invalid address');

                            case 37:
                                _context6.next = 39;
                                return triggerEvent(input, 'blur');

                            case 39:

                                (0, _chai.expect)(button.text().trim(), 'multiple invalid button text').to.equal('2 invalid email addresses');

                                // single valid email
                                _context6.next = 42;
                                return fillIn(input, 'invited@example.com');

                            case 42:
                                _context6.next = 44;
                                return triggerEvent(input, 'blur');

                            case 44:

                                (0, _chai.expect)(formGroup.hasClass('error'), 'valid field has error class').to.be.false;

                                (0, _chai.expect)(button.text().trim(), 'single valid button text').to.equal('Invite 1 user');

                                (0, _chai.expect)(button.hasClass('gh-btn-green'), 'valid email button is enabled').to.be.true;

                                // multiple valid emails
                                _context6.next = 49;
                                return fillIn(input, 'invited1@example.com\ninvited2@example.com');

                            case 49:
                                _context6.next = 51;
                                return triggerEvent(input, 'blur');

                            case 51:

                                (0, _chai.expect)(button.text().trim(), 'multiple valid button text').to.equal('Invite 2 users');

                                // submit invitations with simulated failure on 1 invite
                                _context6.next = 54;
                                return click('.gh-btn-green');

                            case 54:

                                // it redirects to the home / "content" screen
                                (0, _chai.expect)(currentURL(), 'url after submitting invites').to.equal('/');

                                // it displays success alert
                                (0, _chai.expect)(find('.gh-alert-green').length, 'number of success alerts').to.equal(1);

                                // it displays failure alert
                                (0, _chai.expect)(find('.gh-alert-red').length, 'number of failure alerts').to.equal(1);

                            case 57:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            })));
        });

        (0, _mocha.describe)('using Ghost OAuth', function () {
            (0, _mocha.beforeEach)(function () {
                // mimic a new install
                server.get('/authentication/setup/', function () {
                    return {
                        setup: [{ status: false }]
                    };
                });

                // ensure we have settings (to pass validation) and roles available
                (0, _configuration.enableGhostOAuth)(server);
                server.loadFixtures('settings');
                server.loadFixtures('roles');
            });

            (0, _mocha.it)('displays the connect form and validates', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                var sessionFG, titleFG;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                (0, _emberSimpleAuth.invalidateSession)(application);

                                _context7.next = 3;
                                return visit('/setup');

                            case 3:

                                // it redirects to step one
                                (0, _chai.expect)(currentURL(), 'url after accessing /setup').to.equal('/setup/one');

                                _context7.next = 6;
                                return click('.gh-btn-green');

                            case 6:

                                (0, _chai.expect)(find('button.login').text().trim(), 'login button text').to.equal('Sign in with Ghost');

                                _context7.next = 9;
                                return click('.gh-btn-green');

                            case 9:
                                sessionFG = find('button.login').closest('.form-group');
                                titleFG = find('input[name="blog-title"]').closest('.form-group');

                                // session is validated

                                (0, _chai.expect)(sessionFG.hasClass('error'), 'session form group has error class').to.be.true;

                                (0, _chai.expect)(sessionFG.find('.response').text().trim(), 'session validation text').to.match(/Please connect a Ghost\.org account/i);

                                // blog title is validated
                                (0, _chai.expect)(titleFG.hasClass('error'), 'title form group has error class').to.be.true;

                                (0, _chai.expect)(titleFG.find('.response').text().trim(), 'title validation text').to.match(/please enter a blog title/i);

                                // TODO: test that connecting clears session validation error
                                // TODO: test that typing in blog title clears validation error

                            case 15:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            })));

            (0, _mocha.it)('can connect and setup successfully', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                (0, _oauth.stubSuccessfulOAuthConnect)(application);

                                _context8.next = 3;
                                return visit('/setup/two');

                            case 3:
                                _context8.next = 5;
                                return click('button.login');

                            case 5:

                                (0, _chai.expect)(find('button.login').text().trim(), 'login button text when connected').to.equal('Connected: oauthtest@example.com');

                                _context8.next = 8;
                                return fillIn('input[name="blog-title"]', 'Ghostbusters');

                            case 8:
                                _context8.next = 10;
                                return click((0, _emberTestSelectors.default)('submit-button'));

                            case 10:

                                (0, _chai.expect)(currentURL(), 'url after submitting').to.equal('/setup/three');

                            case 11:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            })));

            (0, _mocha.it)('handles failed connect', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                (0, _oauth.stubFailedOAuthConnect)(application);

                                _context9.next = 3;
                                return visit('/setup/two');

                            case 3:
                                _context9.next = 5;
                                return click('button.login');

                            case 5:

                                (0, _chai.expect)(find('.main-error').text().trim(), 'error text after failed oauth connect').to.match(/authentication with ghost\.org denied or failed/i);

                            case 6:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/signin-test', ['jquery', 'ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'ember-cli-mirage', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'ghost-admin/tests/helpers/configuration', 'chai', 'ghost-admin/tests/helpers/oauth'], function (_jquery, _destroyApp, _startApp, _emberCliMirage, _mocha, _emberSimpleAuth, _configuration, _chai, _oauth) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Signin', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects if already authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var role;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            _context.next = 4;
                            return (0, _emberSimpleAuth.authenticateSession)(application);

                        case 4:
                            _context.next = 6;
                            return visit('/signin');

                        case 6:

                            (0, _chai.expect)(currentURL(), 'current url').to.equal('/');

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.describe)('when attempting to signin', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role], slug: 'test-user' });

                server.post('/authentication/token', function (schema, _ref2) {
                    var requestBody = _ref2.requestBody;

                    var _$$deparam = _jquery.default.deparam(requestBody),
                        grantType = _$$deparam.grant_type,
                        username = _$$deparam.username,
                        password = _$$deparam.password,
                        clientId = _$$deparam.client_id;

                    (0, _chai.expect)(grantType, 'grant type').to.equal('password');
                    (0, _chai.expect)(username, 'username').to.equal('test@example.com');
                    (0, _chai.expect)(clientId, 'client id').to.equal('ghost-admin');

                    if (password === 'testpass') {
                        return {
                            access_token: 'MirageAccessToken',
                            expires_in: 3600,
                            refresh_token: 'MirageRefreshToken',
                            token_type: 'Bearer'
                        };
                    } else {
                        return new _emberCliMirage.Response(401, {}, {
                            errors: [{
                                errorType: 'UnauthorizedError',
                                message: 'Invalid Password'
                            }]
                        });
                    }
                    /* eslint-enable camelcase */
                });
            });

            (0, _mocha.it)('errors correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return (0, _emberSimpleAuth.invalidateSession)(application);

                            case 2:
                                _context2.next = 4;
                                return visit('/signin');

                            case 4:

                                (0, _chai.expect)(currentURL(), 'signin url').to.equal('/signin');

                                (0, _chai.expect)(find('input[name="identification"]').length, 'email input field').to.equal(1);
                                (0, _chai.expect)(find('input[name="password"]').length, 'password input field').to.equal(1);

                                _context2.next = 9;
                                return click('.gh-btn-blue');

                            case 9:

                                (0, _chai.expect)(find('.form-group.error').length, 'number of invalid fields').to.equal(2);

                                (0, _chai.expect)(find('.main-error').length, 'main error is displayed').to.equal(1);

                                _context2.next = 13;
                                return fillIn('[name="identification"]', 'test@example.com');

                            case 13:
                                _context2.next = 15;
                                return fillIn('[name="password"]', 'invalid');

                            case 15:
                                _context2.next = 17;
                                return click('.gh-btn-blue');

                            case 17:

                                (0, _chai.expect)(currentURL(), 'current url').to.equal('/signin');

                                (0, _chai.expect)(find('.main-error').length, 'main error is displayed').to.equal(1);

                                (0, _chai.expect)(find('.main-error').text().trim(), 'main error text').to.equal('Invalid Password');

                            case 20:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })));

            (0, _mocha.it)('submits successfully', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                (0, _emberSimpleAuth.invalidateSession)(application);

                                _context3.next = 3;
                                return visit('/signin');

                            case 3:
                                (0, _chai.expect)(currentURL(), 'current url').to.equal('/signin');

                                _context3.next = 6;
                                return fillIn('[name="identification"]', 'test@example.com');

                            case 6:
                                _context3.next = 8;
                                return fillIn('[name="password"]', 'testpass');

                            case 8:
                                _context3.next = 10;
                                return click('.gh-btn-blue');

                            case 10:
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/');

                            case 11:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));
        });

        (0, _mocha.describe)('using Ghost OAuth', function () {
            (0, _mocha.beforeEach)(function () {
                (0, _configuration.enableGhostOAuth)(server);
            });

            (0, _mocha.it)('can sign in successfully', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                server.loadFixtures('roles');
                                (0, _oauth.stubSuccessfulOAuthConnect)(application);

                                _context4.next = 4;
                                return visit('/signin');

                            case 4:

                                (0, _chai.expect)(currentURL(), 'current url').to.equal('/signin');

                                (0, _chai.expect)(find('button.login').text().trim(), 'login button text').to.equal('Sign in with Ghost');

                                _context4.next = 8;
                                return click('button.login');

                            case 8:

                                (0, _chai.expect)(currentURL(), 'url after connect').to.equal('/');

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));

            (0, _mocha.it)('handles a failed connect', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                (0, _oauth.stubFailedOAuthConnect)(application);

                                _context5.next = 3;
                                return visit('/signin');

                            case 3:
                                _context5.next = 5;
                                return click('button.login');

                            case 5:

                                (0, _chai.expect)(currentURL(), 'current url').to.equal('/signin');

                                (0, _chai.expect)(find('.main-error').text().trim(), 'sign-in error').to.match(/Authentication with Ghost\.org denied or failed/i);

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/signup-test', ['ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'mocha', 'ghost-admin/tests/helpers/configuration', 'chai', 'ghost-admin/tests/helpers/oauth'], function (_destroyApp, _startApp, _mocha, _configuration, _chai, _oauth) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Signup', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('can signup successfully', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            server.get('/authentication/invitation', function () {
                                return {
                                    invitation: [{ valid: true }]
                                };
                            });

                            server.post('/authentication/invitation/', function (_ref2, _ref3) {
                                var users = _ref2.users;
                                var requestBody = _ref3.requestBody;

                                var params = JSON.parse(requestBody);
                                (0, _chai.expect)(params.invitation[0].name).to.equal('Test User');
                                (0, _chai.expect)(params.invitation[0].email).to.equal('kevin+test2@ghost.org');
                                (0, _chai.expect)(params.invitation[0].password).to.equal('ValidPassword');
                                (0, _chai.expect)(params.invitation[0].token).to.equal('MTQ3MDM0NjAxNzkyOXxrZXZpbit0ZXN0MkBnaG9zdC5vcmd8MmNEblFjM2c3ZlFUajluTks0aUdQU0dmdm9ta0xkWGY2OEZ1V2dTNjZVZz0');

                                // ensure that `/users/me/` request returns a user
                                var role = server.create('role', { name: 'Author' });
                                users.create({ email: 'kevin@test2@ghost.org', roles: [role] });

                                return {
                                    invitation: [{
                                        message: 'Invitation accepted.'
                                    }]
                                };
                            });

                            // token details:
                            // "1470346017929|kevin+test2@ghost.org|2cDnQc3g7fQTj9nNK4iGPSGfvomkLdXf68FuWgS66Ug="
                            _context.next = 4;
                            return visit('/signup/MTQ3MDM0NjAxNzkyOXxrZXZpbit0ZXN0MkBnaG9zdC5vcmd8MmNEblFjM2c3ZlFUajluTks0aUdQU0dmdm9ta0xkWGY2OEZ1V2dTNjZVZz0');

                        case 4:

                            (0, _chai.expect)(currentPath()).to.equal('signup');

                            // email address should be pre-filled and disabled
                            (0, _chai.expect)(find('input[name="email"]').val(), 'email field value').to.equal('kevin+test2@ghost.org');

                            (0, _chai.expect)(find('input[name="email"]').is(':disabled'), 'email field is disabled').to.be.true;

                            // focus out in Name field triggers inline error
                            _context.next = 9;
                            return triggerEvent('input[name="name"]', 'blur');

                        case 9:

                            (0, _chai.expect)(find('input[name="name"]').closest('.form-group').hasClass('error'), 'name field group has error class when empty').to.be.true;

                            (0, _chai.expect)(find('input[name="name"]').closest('.form-group').find('.response').text().trim(), 'name inline-error text').to.match(/Please enter a name/);

                            // entering text in Name field clears error
                            _context.next = 13;
                            return fillIn('input[name="name"]', 'Test User');

                        case 13:
                            _context.next = 15;
                            return triggerEvent('input[name="name"]', 'blur');

                        case 15:

                            (0, _chai.expect)(find('input[name="name"]').closest('.form-group').hasClass('error'), 'name field loses error class after text input').to.be.false;

                            (0, _chai.expect)(find('input[name="name"]').closest('.form-group').find('.response').text().trim(), 'name field error is removed after text input').to.equal('');

                            // focus out in Name field triggers inline error
                            _context.next = 19;
                            return triggerEvent('input[name="password"]', 'blur');

                        case 19:

                            (0, _chai.expect)(find('input[name="password"]').closest('.form-group').hasClass('error'), 'password field group has error class when empty').to.be.true;

                            (0, _chai.expect)(find('input[name="password"]').closest('.form-group').find('.response').text().trim(), 'password field error text').to.match(/must be at least 8 characters/);

                            // entering valid text in Password field clears error
                            _context.next = 23;
                            return fillIn('input[name="password"]', 'ValidPassword');

                        case 23:
                            _context.next = 25;
                            return triggerEvent('input[name="password"]', 'blur');

                        case 25:

                            (0, _chai.expect)(find('input[name="password"]').closest('.form-group').hasClass('error'), 'password field loses error class after text input').to.be.false;

                            (0, _chai.expect)(find('input[name="password"]').closest('.form-group').find('.response').text().trim(), 'password field error is removed after text input').to.equal('');

                            // submitting sends correct details and redirects to content screen
                            _context.next = 29;
                            return click('.gh-btn-green');

                        case 29:

                            (0, _chai.expect)(currentPath()).to.equal('posts.index');

                        case 30:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects if already logged in');
        (0, _mocha.it)('redirects with alert on invalid token');
        (0, _mocha.it)('redirects with alert on non-existant or expired token');

        (0, _mocha.describe)('using Ghost OAuth', function () {
            (0, _mocha.beforeEach)(function () {
                (0, _configuration.enableGhostOAuth)(server);

                var _server$schema = server.schema,
                    invites = _server$schema.invites,
                    users = _server$schema.users;


                var user = users.create({ name: 'Test Invite Creator' });

                invites.create({
                    email: 'kevin+test2@ghost.org',
                    createdBy: user.id
                });
            });

            (0, _mocha.it)('can sign up sucessfully', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                (0, _oauth.stubSuccessfulOAuthConnect)(application);

                                // token details:
                                // "1470346017929|kevin+test2@ghost.org|2cDnQc3g7fQTj9nNK4iGPSGfvomkLdXf68FuWgS66Ug="
                                _context2.next = 3;
                                return visit('/signup/MTQ3MDM0NjAxNzkyOXxrZXZpbit0ZXN0MkBnaG9zdC5vcmd8MmNEblFjM2c3ZlFUajluTks0aUdQU0dmdm9ta0xkWGY2OEZ1V2dTNjZVZz0');

                            case 3:

                                (0, _chai.expect)(currentPath()).to.equal('signup');

                                (0, _chai.expect)(find('.gh-flow-content header p').text().trim(), 'form header text').to.equal('Accept your invite from Test Invite Creator');

                                _context2.next = 7;
                                return click('button.login');

                            case 7:

                                (0, _chai.expect)(currentPath()).to.equal('posts.index');

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })));

            (0, _mocha.it)('handles failed connect', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                (0, _oauth.stubFailedOAuthConnect)(application);

                                // token details:
                                // "1470346017929|kevin+test2@ghost.org|2cDnQc3g7fQTj9nNK4iGPSGfvomkLdXf68FuWgS66Ug="
                                _context3.next = 3;
                                return visit('/signup/MTQ3MDM0NjAxNzkyOXxrZXZpbit0ZXN0MkBnaG9zdC5vcmd8MmNEblFjM2c3ZlFUajluTks0aUdQU0dmdm9ta0xkWGY2OEZ1V2dTNjZVZz0');

                            case 3:
                                _context3.next = 5;
                                return click('button.login');

                            case 5:

                                (0, _chai.expect)(currentPath()).to.equal('signup');

                                (0, _chai.expect)(find('.main-error').text().trim(), 'flow error text').to.match(/authentication with ghost\.org denied or failed/i);

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/subscribers-test', ['ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai'], function (_destroyApp, _startApp, _emberTestSelectors, _mocha, _emberSimpleAuth, _chai) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Subscribers', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/subscribers');

                        case 3:

                            (0, _chai.expect)(currentURL()).to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects editors to posts', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role] });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 5;
                            return visit('/subscribers');

                        case 5:

                            (0, _chai.expect)(currentURL()).to.equal('/');
                            (0, _chai.expect)(find('.gh-nav-main a:contains("Subscribers")').length, 'sidebar link is visible').to.equal(0);

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('redirects authors to posts', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var role;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role] });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context3.next = 5;
                            return visit('/subscribers');

                        case 5:

                            (0, _chai.expect)(currentURL()).to.equal('/');
                            (0, _chai.expect)(find('.gh-nav-main a:contains("Subscribers")').length, 'sidebar link is visible').to.equal(0);

                        case 7:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.describe)('an admin', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('can manage subscribers', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var _server$pretender$han, _server$pretender$han2, lastRequest, createdAtHeader, _server$pretender$han3, _server$pretender$han4, _server$pretender$han5, _server$pretender$han6;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                server.createList('subscriber', 40);

                                (0, _emberSimpleAuth.authenticateSession)(application);
                                _context4.next = 4;
                                return visit('/');

                            case 4:
                                _context4.next = 6;
                                return click('.gh-nav-main a:contains("Subscribers")');

                            case 6:

                                // it navigates to the correct page
                                (0, _chai.expect)(currentPath()).to.equal('subscribers.index');

                                // it has correct page title
                                (0, _chai.expect)(document.title, 'page title').to.equal('Subscribers - Test Blog');

                                // it loads the first page
                                (0, _chai.expect)(find('.subscribers-table .lt-body .lt-row').length, 'number of subscriber rows').to.equal(30);

                                // it shows the total number of subscribers
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('total-subscribers')).text().trim(), 'displayed subscribers total').to.equal('(40)');

                                // it defaults to sorting by created_at desc
                                _server$pretender$han = server.pretender.handledRequests.slice(-1), _server$pretender$han2 = _slicedToArray(_server$pretender$han, 1), lastRequest = _server$pretender$han2[0];

                                (0, _chai.expect)(lastRequest.queryParams.order).to.equal('created_at desc');

                                createdAtHeader = find('.subscribers-table th:contains("Subscription Date")');

                                (0, _chai.expect)(createdAtHeader.hasClass('is-sorted'), 'createdAt column is sorted').to.be.true;
                                (0, _chai.expect)(createdAtHeader.find('.gh-icon-descending').length, 'createdAt column has descending icon').to.equal(1);

                                // click the column to re-order
                                _context4.next = 17;
                                return click('th:contains("Subscription Date")');

                            case 17:
                                _server$pretender$han3 = server.pretender.handledRequests.slice(-1);
                                _server$pretender$han4 = _slicedToArray(_server$pretender$han3, 1);
                                lastRequest = _server$pretender$han4[0];

                                (0, _chai.expect)(lastRequest.queryParams.order).to.equal('created_at asc');

                                createdAtHeader = find('.subscribers-table th:contains("Subscription Date")');
                                (0, _chai.expect)(createdAtHeader.find('.gh-icon-ascending').length, 'createdAt column has ascending icon').to.equal(1);

                                // TODO: scroll test disabled as ember-light-table doesn't calculate
                                // the scroll trigger element's positioning against the scroll
                                // container - https://github.com/offirgolan/ember-light-table/issues/201
                                //
                                // // scroll to the bottom of the table to simulate infinite scroll
                                // await find('.subscribers-table').scrollTop(find('.subscribers-table .ember-light-table').height() - 50);
                                //
                                // // trigger infinite scroll
                                // await triggerEvent('.subscribers-table tbody', 'scroll');
                                //
                                // // it loads the next page
                                // expect(find('.subscribers-table .lt-body .lt-row').length, 'number of subscriber rows after infinite-scroll')
                                //     .to.equal(40);

                                // click the add subscriber button
                                _context4.next = 25;
                                return click('.gh-btn:contains("Add Subscriber")');

                            case 25:

                                // it displays the add subscriber modal
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'add subscriber modal displayed').to.equal(1);

                                // cancel the modal
                                _context4.next = 28;
                                return click('.fullscreen-modal .gh-btn:contains("Cancel")');

                            case 28:

                                // it closes the add subscriber modal
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'add subscriber modal displayed after cancel').to.equal(0);

                                // save a new subscriber
                                _context4.next = 31;
                                return click('.gh-btn:contains("Add Subscriber")');

                            case 31:
                                _context4.next = 33;
                                return fillIn('.fullscreen-modal input[name="email"]', 'test@example.com');

                            case 33:
                                _context4.next = 35;
                                return click('.fullscreen-modal .gh-btn:contains("Add")');

                            case 35:

                                // the add subscriber modal is closed
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'add subscriber modal displayed after save').to.equal(0);

                                // the subscriber is added to the table
                                (0, _chai.expect)(find('.subscribers-table .lt-body .lt-row:first-of-type .lt-cell:first-of-type').text().trim(), 'first email in list after addition').to.equal('test@example.com');

                                // the table is scrolled to the top
                                // TODO: implement scroll to new record after addition
                                // expect(find('.subscribers-table').scrollTop(), 'scroll position after addition')
                                //     .to.equal(0);

                                // the subscriber total is updated
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('total-subscribers')).text().trim(), 'subscribers total after addition').to.equal('(41)');

                                // saving a duplicate subscriber
                                _context4.next = 40;
                                return click('.gh-btn:contains("Add Subscriber")');

                            case 40:
                                _context4.next = 42;
                                return fillIn('.fullscreen-modal input[name="email"]', 'test@example.com');

                            case 42:
                                _context4.next = 44;
                                return click('.fullscreen-modal .gh-btn:contains("Add")');

                            case 44:

                                // the validation error is displayed
                                (0, _chai.expect)(find('.fullscreen-modal .error .response').text().trim(), 'duplicate email validation').to.equal('Email already exists.');

                                // the subscriber is not added to the table
                                (0, _chai.expect)(find('.lt-cell:contains(test@example.com)').length, 'number of "test@example.com rows"').to.equal(1);

                                // the subscriber total is unchanged
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('total-subscribers')).text().trim(), 'subscribers total after failed add').to.equal('(41)');

                                // deleting a subscriber
                                _context4.next = 49;
                                return click('.fullscreen-modal .gh-btn:contains("Cancel")');

                            case 49:
                                _context4.next = 51;
                                return click('.subscribers-table tbody tr:first-of-type button:last-of-type');

                            case 51:

                                // it displays the delete subscriber modal
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'delete subscriber modal displayed').to.equal(1);

                                // cancel the modal
                                _context4.next = 54;
                                return click('.fullscreen-modal .gh-btn:contains("Cancel")');

                            case 54:

                                // it closes the add subscriber modal
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'delete subscriber modal displayed after cancel').to.equal(0);

                                _context4.next = 57;
                                return click('.subscribers-table tbody tr:first-of-type button:last-of-type');

                            case 57:
                                _context4.next = 59;
                                return click('.fullscreen-modal .gh-btn:contains("Delete")');

                            case 59:

                                // the add subscriber modal is closed
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'delete subscriber modal displayed after confirm').to.equal(0);

                                // the subscriber is removed from the table
                                (0, _chai.expect)(find('.subscribers-table .lt-body .lt-row:first-of-type .lt-cell:first-of-type').text().trim(), 'first email in list after addition').to.not.equal('test@example.com');

                                // the subscriber total is updated
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('total-subscribers')).text().trim(), 'subscribers total after addition').to.equal('(40)');

                                // click the import subscribers button
                                _context4.next = 64;
                                return click('.gh-btn:contains("Import CSV")');

                            case 64:

                                // it displays the import subscribers modal
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'import subscribers modal displayed').to.equal(1);
                                (0, _chai.expect)(find('.fullscreen-modal input[type="file"]').length, 'import modal contains file input').to.equal(1);

                                // cancel the modal
                                _context4.next = 68;
                                return click('.fullscreen-modal .gh-btn:contains("Cancel")');

                            case 68:

                                // it closes the import subscribers modal
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'import subscribers modal displayed after cancel').to.equal(0);

                                _context4.next = 71;
                                return click('.gh-btn:contains("Import CSV")');

                            case 71:
                                _context4.next = 73;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { name: 'test.csv' });

                            case 73:

                                // modal title changes
                                (0, _chai.expect)(find('.fullscreen-modal h1').text().trim(), 'import modal title after import').to.equal('Import Successful');

                                // modal button changes
                                (0, _chai.expect)(find('.fullscreen-modal .modal-footer button').text().trim(), 'import modal button text after import').to.equal('Close');

                                // subscriber total is updated
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('total-subscribers')).text().trim(), 'subscribers total after import').to.equal('(90)');

                                // table is reset
                                _server$pretender$han5 = server.pretender.handledRequests.slice(-1);
                                _server$pretender$han6 = _slicedToArray(_server$pretender$han5, 1);
                                lastRequest = _server$pretender$han6[0];

                                (0, _chai.expect)(lastRequest.url, 'endpoint requested after import').to.match(/\/subscribers\/\?/);
                                (0, _chai.expect)(lastRequest.queryParams.page, 'page requested after import').to.equal('1');

                                (0, _chai.expect)(find('.subscribers-table .lt-body .lt-row').length, 'number of rows in table after import').to.equal(30);

                                // close modal

                            case 82:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/team-test', ['ghost-admin/utils/ctrl-or-cmd', 'ghost-admin/tests/helpers/destroy-app', 'moment', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'ember-cli-mirage', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'ghost-admin/tests/helpers/configuration', 'ghost-admin/tests/helpers/adapter-error', 'chai'], function (_ctrlOrCmd, _destroyApp, _moment, _startApp, _emberTestSelectors, _emberCliMirage, _mocha, _emberSimpleAuth, _configuration, _adapterError, _chai) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Team', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.it)('redirects to signin when not authenticated', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _emberSimpleAuth.invalidateSession)(application);
                            _context.next = 3;
                            return visit('/team');

                        case 3:

                            (0, _chai.expect)(currentURL()).to.equal('/signin');

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('redirects correctly when authenticated as author', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var role;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            role = server.create('role', { name: 'Author' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            server.create('user', { slug: 'no-access' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context2.next = 6;
                            return visit('/team/no-access');

                        case 6:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-user');

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('redirects correctly when authenticated as editor', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var role;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            role = server.create('role', { name: 'Editor' });

                            server.create('user', { roles: [role], slug: 'test-user' });

                            server.create('user', { slug: 'no-access' });

                            (0, _emberSimpleAuth.authenticateSession)(application);
                            _context3.next = 6;
                            return visit('/team/no-access');

                        case 6:

                            (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team');

                        case 7:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.describe)('when logged in as admin', function () {
            var admin = void 0,
                adminRole = void 0,
                suspendedUser = void 0;

            (0, _mocha.beforeEach)(function () {
                server.loadFixtures('roles');
                adminRole = server.schema.roles.find(1);

                admin = server.create('user', { email: 'admin@example.com', roles: [adminRole] });

                // add an expired invite
                server.create('invite', { expires: _moment.default.utc().subtract(1, 'day').valueOf() });

                // add a suspended user
                suspendedUser = server.create('user', { email: 'suspended@example.com', roles: [adminRole], status: 'inactive' });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('it renders and navigates correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var user1, user2;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                user1 = server.create('user');
                                user2 = server.create('user');
                                _context4.next = 4;
                                return visit('/team');

                            case 4:

                                // doesn't do any redirecting
                                (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team');

                                // it has correct page title
                                (0, _chai.expect)(document.title, 'page title').to.equal('Team - Test Blog');

                                // it shows active users in active section
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('active-users') + ' ' + (0, _emberTestSelectors.default)('user-id')).length, 'number of active users').to.equal(3);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('active-users') + ' ' + (0, _emberTestSelectors.default)('user-id', user1.id))).to.exist;
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('active-users') + ' ' + (0, _emberTestSelectors.default)('user-id', user2.id))).to.exist;
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('active-users') + ' ' + (0, _emberTestSelectors.default)('user-id', admin.id))).to.exist;

                                // it shows suspended users in suspended section
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('suspended-users') + ' ' + (0, _emberTestSelectors.default)('user-id')).length, 'number of suspended users').to.equal(1);
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('suspended-users') + ' ' + (0, _emberTestSelectors.default)('user-id', suspendedUser.id))).to.exist;

                                _context4.next = 14;
                                return click((0, _emberTestSelectors.default)('user-id', user2.id));

                            case 14:

                                // url is correct
                                (0, _chai.expect)(currentURL(), 'url after clicking user').to.equal('/team/' + user2.slug);

                                // title is correct
                                (0, _chai.expect)(document.title, 'title after clicking user').to.equal('Team - User - Test Blog');

                                // view title should exist and be linkable and active
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('screen-title') + ' a[href="/ghost/team"]').hasClass('active'), 'has linkable url back to team main page').to.be.true;

                                _context4.next = 19;
                                return click((0, _emberTestSelectors.default)('screen-title') + ' a');

                            case 19:

                                // url should be /team again
                                (0, _chai.expect)(currentURL(), 'url after clicking back').to.equal('/team');

                            case 20:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));

            (0, _mocha.it)('can manage invites', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                var roleOptions, checkOwnerExists, checkSelectedIsAuthor;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                checkSelectedIsAuthor = function checkSelectedIsAuthor() {
                                    for (var i in roleOptions) {
                                        if (roleOptions[i].selected) {
                                            return roleOptions[i].text === 'Author';
                                        }
                                    }
                                    return false;
                                };

                                checkOwnerExists = function checkOwnerExists() {
                                    for (var i in roleOptions) {
                                        if (roleOptions[i].tagName === 'option' && roleOptions[i].text === 'Owner') {
                                            return true;
                                        }
                                    }
                                    return false;
                                };

                                _context5.next = 4;
                                return visit('/team');

                            case 4:

                                // invite user button exists
                                (0, _chai.expect)(find('.view-actions .gh-btn-green').text().trim(), 'invite people button text').to.equal('Invite People');

                                // existing users are listed
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('user-id')).length, 'initial number of active users').to.equal(2);

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('user-id', '1')).find((0, _emberTestSelectors.default)('role-name')).text().trim(), 'active user\'s role label').to.equal('Administrator');

                                // existing invites are shown
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id')).length, 'initial number of invited users').to.equal(1);

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id', '1')).find((0, _emberTestSelectors.default)('invite-description')).text(), 'expired invite description').to.match(/expired/);

                                // remove expired invite
                                _context5.next = 11;
                                return click((0, _emberTestSelectors.default)('invite-id', '1') + ' ' + (0, _emberTestSelectors.default)('revoke-button'));

                            case 11:

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id')).length, 'initial number of invited users').to.equal(0);

                                // click the invite people button
                                _context5.next = 14;
                                return click('.view-actions .gh-btn-green');

                            case 14:
                                roleOptions = find('.fullscreen-modal select[name="role"] option');


                                // modal is displayed
                                (0, _chai.expect)(find('.fullscreen-modal h1').text().trim(), 'correct modal is displayed').to.equal('Invite a New User');

                                // number of roles is correct
                                (0, _chai.expect)(find('.fullscreen-modal select[name="role"] option').length, 'number of selectable roles').to.equal(3);

                                (0, _chai.expect)(checkOwnerExists(), 'owner role isn\'t available').to.be.false;
                                (0, _chai.expect)(checkSelectedIsAuthor(), 'author role is selected initially').to.be.true;

                                // submit valid invite form
                                _context5.next = 21;
                                return fillIn('.fullscreen-modal input[name="email"]', 'invite1@example.com');

                            case 21:
                                _context5.next = 23;
                                return click('.fullscreen-modal .gh-btn-green');

                            case 23:

                                // modal closes
                                (0, _chai.expect)(find('.fullscreen-modal').length, 'number of modals after sending invite').to.equal(0);

                                // invite is displayed, has correct e-mail + role
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id')).length, 'number of invites after first invite').to.equal(1);

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id', '2')).find((0, _emberTestSelectors.default)('email')).text().trim(), 'displayed email of first invite').to.equal('invite1@example.com');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id', '2')).find((0, _emberTestSelectors.default)('role-name')).text().trim(), 'displayed role of first invite').to.equal('Author');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id', '2')).find((0, _emberTestSelectors.default)('invite-description')).text(), 'new invite description').to.match(/expires/);

                                // number of users is unchanged
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('user-id')).length, 'number of active users after first invite').to.equal(2);

                                // submit new invite with different role
                                _context5.next = 31;
                                return click('.view-actions .gh-btn-green');

                            case 31:
                                _context5.next = 33;
                                return fillIn('.fullscreen-modal input[name="email"]', 'invite2@example.com');

                            case 33:
                                _context5.next = 35;
                                return fillIn('.fullscreen-modal select[name="role"]', '2');

                            case 35:
                                _context5.next = 37;
                                return click('.fullscreen-modal .gh-btn-green');

                            case 37:

                                // number of invites increases
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id')).length, 'number of invites after second invite').to.equal(2);

                                // invite has correct e-mail + role
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id', '3')).find((0, _emberTestSelectors.default)('email')).text().trim(), 'displayed email of second invite').to.equal('invite2@example.com');

                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id', '3')).find((0, _emberTestSelectors.default)('role-name')).text().trim(), 'displayed role of second invite').to.equal('Editor');

                                // submit invite form with existing user
                                _context5.next = 42;
                                return click('.view-actions .gh-btn-green');

                            case 42:
                                _context5.next = 44;
                                return fillIn('.fullscreen-modal input[name="email"]', 'admin@example.com');

                            case 44:
                                _context5.next = 46;
                                return click('.fullscreen-modal .gh-btn-green');

                            case 46:

                                // validation message is displayed
                                (0, _chai.expect)(find('.fullscreen-modal .error .response').text().trim(), 'inviting existing user error').to.equal('A user with that email address already exists.');

                                // submit invite form with existing invite
                                _context5.next = 49;
                                return fillIn('.fullscreen-modal input[name="email"]', 'invite1@example.com');

                            case 49:
                                _context5.next = 51;
                                return click('.fullscreen-modal .gh-btn-green');

                            case 51:

                                // validation message is displayed
                                (0, _chai.expect)(find('.fullscreen-modal .error .response').text().trim(), 'inviting invited user error').to.equal('A user with that email address was already invited.');

                                // submit invite form with an invalid email
                                _context5.next = 54;
                                return fillIn('.fullscreen-modal input[name="email"]', 'test');

                            case 54:
                                _context5.next = 56;
                                return click('.fullscreen-modal .gh-btn-green');

                            case 56:

                                // validation message is displayed
                                (0, _chai.expect)(find('.fullscreen-modal .error .response').text().trim(), 'inviting invalid email error').to.equal('Invalid Email.');

                                _context5.next = 59;
                                return click('.fullscreen-modal a.close');

                            case 59:
                                _context5.next = 61;
                                return click((0, _emberTestSelectors.default)('invite-id', '3') + ' ' + (0, _emberTestSelectors.default)('revoke-button'));

                            case 61:

                                // number of invites decreases
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id')).length, 'number of invites after revoke').to.equal(1);

                                // notification is displayed
                                (0, _chai.expect)(find('.gh-notification').text().trim(), 'notifications contain revoke').to.match(/Invitation revoked\. \(invite2@example\.com\)/);

                                // correct invite is removed
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id')).find((0, _emberTestSelectors.default)('email')).text().trim(), 'displayed email of remaining invite').to.equal('invite1@example.com');

                                // add another invite to test ordering on resend
                                _context5.next = 66;
                                return click('.view-actions .gh-btn-green');

                            case 66:
                                _context5.next = 68;
                                return fillIn('.fullscreen-modal input[name="email"]', 'invite3@example.com');

                            case 68:
                                _context5.next = 70;
                                return click('.fullscreen-modal .gh-btn-green');

                            case 70:

                                // new invite should be last in the list
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id') + ':last').find((0, _emberTestSelectors.default)('email')).text().trim(), 'last invite email in list').to.equal('invite3@example.com');

                                // resend first invite
                                _context5.next = 73;
                                return click((0, _emberTestSelectors.default)('invite-id', '2') + ' ' + (0, _emberTestSelectors.default)('resend-button'));

                            case 73:

                                // notification is displayed
                                (0, _chai.expect)(find('.gh-notification').text().trim(), 'notifications contain resend').to.match(/Invitation resent! \(invite1@example\.com\)/);

                                // first invite is still at the top
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id') + ':first-of-type').find((0, _emberTestSelectors.default)('email')).text().trim(), 'first invite email in list').to.equal('invite1@example.com');

                                // regression test: can revoke a resent invite
                                _context5.next = 77;
                                return click((0, _emberTestSelectors.default)('invite-id') + ':first-of-type ' + (0, _emberTestSelectors.default)('resend-button'));

                            case 77:
                                _context5.next = 79;
                                return click((0, _emberTestSelectors.default)('invite-id') + ':first-of-type ' + (0, _emberTestSelectors.default)('revoke-button'));

                            case 79:

                                // number of invites decreases
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('invite-id')).length, 'number of invites after resend/revoke').to.equal(1);

                                // notification is displayed
                                (0, _chai.expect)(find('.gh-notification').text().trim(), 'notifications contain revoke after resend/revoke').to.match(/Invitation revoked\. \(invite1@example\.com\)/);

                            case 81:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));

            (0, _mocha.it)('can manage suspended users', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return visit('/team');

                            case 2:
                                _context6.next = 4;
                                return click((0, _emberTestSelectors.default)('user-id', suspendedUser.id));

                            case 4:

                                (0, _chai.expect)((0, _emberTestSelectors.default)('suspended-badge')).to.exist;

                                _context6.next = 7;
                                return click((0, _emberTestSelectors.default)('user-actions'));

                            case 7:
                                _context6.next = 9;
                                return click((0, _emberTestSelectors.default)('unsuspend-button'));

                            case 9:
                                _context6.next = 11;
                                return click((0, _emberTestSelectors.default)('modal-confirm'));

                            case 11:
                                _context6.next = 13;
                                return click((0, _emberTestSelectors.default)('team-link'));

                            case 13:

                                // suspendedUser is now in active list
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('active-users') + ' ' + (0, _emberTestSelectors.default)('user-id', suspendedUser.id))).to.exist;

                                // no suspended users
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('suspended-users') + ' ' + (0, _emberTestSelectors.default)('user-id')).length).to.equal(0);

                                _context6.next = 17;
                                return click((0, _emberTestSelectors.default)('user-id', suspendedUser.id));

                            case 17:
                                _context6.next = 19;
                                return click((0, _emberTestSelectors.default)('user-actions'));

                            case 19:
                                _context6.next = 21;
                                return click((0, _emberTestSelectors.default)('suspend-button'));

                            case 21:
                                _context6.next = 23;
                                return click((0, _emberTestSelectors.default)('modal-confirm'));

                            case 23:

                                (0, _chai.expect)((0, _emberTestSelectors.default)('suspended-badge')).to.exist;

                            case 24:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            })));

            (0, _mocha.it)('can delete users', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                var user1, user2, post;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                user1 = server.create('user');
                                user2 = server.create('user');
                                post = server.create('post');


                                user2.posts = [post];

                                _context7.next = 6;
                                return visit('/team');

                            case 6:
                                _context7.next = 8;
                                return click((0, _emberTestSelectors.default)('user-id', user1.id));

                            case 8:
                                _context7.next = 10;
                                return click('button.delete');

                            case 10:
                                (0, _chai.expect)(find('.fullscreen-modal .modal-content:contains("delete this user")').length, 'user deletion modal displayed after button click').to.equal(1);

                                // user has no posts so no warning about post deletion
                                (0, _chai.expect)(find('.fullscreen-modal .modal-content:contains("is the author of")').length, 'deleting user with no posts has no post count').to.equal(0);

                                // cancelling user deletion closes modal
                                _context7.next = 14;
                                return click('.fullscreen-modal button:contains("Cancel")');

                            case 14:
                                (0, _chai.expect)(find('.fullscreen-modal').length === 0, 'delete user modal is closed when cancelling').to.be.true;

                                // deleting a user with posts
                                _context7.next = 17;
                                return visit('/team');

                            case 17:
                                _context7.next = 19;
                                return click((0, _emberTestSelectors.default)('user-id', user2.id));

                            case 19:
                                _context7.next = 21;
                                return click('button.delete');

                            case 21:
                                // user has  posts so should warn about post deletion
                                (0, _chai.expect)(find('.fullscreen-modal .modal-content:contains("is the author of 1 post")').length, 'deleting user with posts has post count').to.equal(1);

                                _context7.next = 24;
                                return click('.fullscreen-modal button:contains("Delete")');

                            case 24:
                                // redirected to team page
                                (0, _chai.expect)(currentURL()).to.equal('/team');

                                // deleted user is not in list
                                (0, _chai.expect)(find((0, _emberTestSelectors.default)('user-id', user2.id)).length, 'deleted user is not in user list after deletion').to.equal(0);

                            case 26:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            })));

            (0, _mocha.describe)('existing user', function () {
                var user = void 0;

                (0, _mocha.beforeEach)(function () {
                    user = server.create('user', {
                        slug: 'test-1',
                        name: 'Test User',
                        facebook: 'test',
                        twitter: '@test'
                    });
                });

                (0, _mocha.it)('input fields reset and validate correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
                    var _server$pretender$han, _server$pretender$han2, lastRequest, params, _server$pretender$han3, _server$pretender$han4, newRequest;

                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                        while (1) {
                            switch (_context8.prev = _context8.next) {
                                case 0:
                                    _context8.next = 2;
                                    return visit('/team/test-1');

                                case 2:

                                    (0, _chai.expect)(currentURL(), 'currentURL').to.equal('/team/test-1');
                                    (0, _chai.expect)(find('.user-details-bottom .first-form-group input.user-name').val(), 'current user name').to.equal('Test User');

                                    (0, _chai.expect)(find((0, _emberTestSelectors.default)('save-button')).text().trim(), 'save button text').to.equal('Save');

                                    // test empty user name
                                    _context8.next = 7;
                                    return fillIn('.user-details-bottom .first-form-group input.user-name', '');

                                case 7:
                                    _context8.next = 9;
                                    return triggerEvent('.user-details-bottom .first-form-group input.user-name', 'blur');

                                case 9:

                                    (0, _chai.expect)(find('.user-details-bottom .first-form-group').hasClass('error'), 'username input is in error state with blank input').to.be.true;

                                    // test too long user name
                                    _context8.next = 12;
                                    return fillIn('.user-details-bottom .first-form-group input.user-name', new Array(160).join('a'));

                                case 12:
                                    _context8.next = 14;
                                    return triggerEvent('.user-details-bottom .first-form-group input.user-name', 'blur');

                                case 14:

                                    (0, _chai.expect)(find('.user-details-bottom .first-form-group').hasClass('error'), 'username input is in error state with too long input').to.be.true;

                                    // reset name field
                                    _context8.next = 17;
                                    return fillIn('.user-details-bottom .first-form-group input.user-name', 'Test User');

                                case 17:

                                    (0, _chai.expect)(find('.user-details-bottom input[name="user"]').val(), 'slug value is default').to.equal('test-1');

                                    _context8.next = 20;
                                    return fillIn('.user-details-bottom input[name="user"]', '');

                                case 20:
                                    _context8.next = 22;
                                    return triggerEvent('.user-details-bottom input[name="user"]', 'blur');

                                case 22:

                                    (0, _chai.expect)(find('.user-details-bottom input[name="user"]').val(), 'slug value is reset to original upon empty string').to.equal('test-1');

                                    // Save changes
                                    _context8.next = 25;
                                    return click((0, _emberTestSelectors.default)('save-button'));

                                case 25:

                                    (0, _chai.expect)(find((0, _emberTestSelectors.default)('save-button')).text().trim(), 'save button text').to.equal('Saved');

                                    // CMD-S shortcut works
                                    _context8.next = 28;
                                    return fillIn('.user-details-bottom input[name="user"]', 'Test User');

                                case 28:
                                    _context8.next = 30;
                                    return triggerEvent('.gh-app', 'keydown', {
                                        keyCode: 83, // s
                                        metaKey: _ctrlOrCmd.default === 'command',
                                        ctrlKey: _ctrlOrCmd.default === 'ctrl'
                                    });

                                case 30:

                                    // we've already saved in this test so there's no on-screen indication
                                    // that we've had another save, check the request was fired instead
                                    _server$pretender$han = server.pretender.handledRequests.slice(-1), _server$pretender$han2 = _slicedToArray(_server$pretender$han, 1), lastRequest = _server$pretender$han2[0];
                                    params = JSON.parse(lastRequest.requestBody);


                                    (0, _chai.expect)(params.users[0].name).to.equal('Test User');

                                    _context8.next = 35;
                                    return fillIn('.user-details-bottom input[name="user"]', 'white space');

                                case 35:
                                    _context8.next = 37;
                                    return triggerEvent('.user-details-bottom input[name="user"]', 'blur');

                                case 37:

                                    (0, _chai.expect)(find('.user-details-bottom input[name="user"]').val(), 'slug value is correctly dasherized').to.equal('white-space');

                                    _context8.next = 40;
                                    return fillIn('.user-details-bottom input[name="email"]', 'thisisnotanemail');

                                case 40:
                                    _context8.next = 42;
                                    return triggerEvent('.user-details-bottom input[name="email"]', 'blur');

                                case 42:

                                    (0, _chai.expect)(find('.user-details-bottom .form-group:nth-of-type(3)').hasClass('error'), 'email input should be in error state with invalid email').to.be.true;

                                    _context8.next = 45;
                                    return fillIn('.user-details-bottom input[name="email"]', 'test@example.com');

                                case 45:
                                    _context8.next = 47;
                                    return fillIn('#user-location', new Array(160).join('a'));

                                case 47:
                                    _context8.next = 49;
                                    return triggerEvent('#user-location', 'blur');

                                case 49:

                                    (0, _chai.expect)(find('#user-location').closest('.form-group').hasClass('error'), 'location input should be in error state').to.be.true;

                                    _context8.next = 52;
                                    return fillIn('#user-location', '');

                                case 52:
                                    _context8.next = 54;
                                    return fillIn('#user-website', 'thisisntawebsite');

                                case 54:
                                    _context8.next = 56;
                                    return triggerEvent('#user-website', 'blur');

                                case 56:

                                    (0, _chai.expect)(find('#user-website').closest('.form-group').hasClass('error'), 'website input should be in error state').to.be.true;

                                    // Testing Facebook input

                                    // displays initial value
                                    (0, _chai.expect)(find('#user-facebook').val(), 'initial facebook value').to.equal('https://www.facebook.com/test');

                                    _context8.next = 60;
                                    return triggerEvent('#user-facebook', 'focus');

                                case 60:
                                    _context8.next = 62;
                                    return triggerEvent('#user-facebook', 'blur');

                                case 62:

                                    // regression test: we still have a value after the input is
                                    // focused and then blurred without any changes
                                    (0, _chai.expect)(find('#user-facebook').val(), 'facebook value after blur with no change').to.equal('https://www.facebook.com/test');

                                    _context8.next = 65;
                                    return fillIn('#user-facebook', '');

                                case 65:
                                    _context8.next = 67;
                                    return fillIn('#user-facebook', ')(*&%^%)');

                                case 67:
                                    _context8.next = 69;
                                    return triggerEvent('#user-facebook', 'blur');

                                case 69:

                                    (0, _chai.expect)(find('#user-facebook').closest('.form-group').hasClass('error'), 'facebook input should be in error state').to.be.true;

                                    _context8.next = 72;
                                    return fillIn('#user-facebook', '');

                                case 72:
                                    _context8.next = 74;
                                    return fillIn('#user-facebook', 'pages/)(*&%^%)');

                                case 74:
                                    _context8.next = 76;
                                    return triggerEvent('#user-facebook', 'blur');

                                case 76:

                                    (0, _chai.expect)(find('#user-facebook').val()).to.be.equal('https://www.facebook.com/pages/)(*&%^%)');
                                    (0, _chai.expect)(find('#user-facebook').closest('.form-group').hasClass('error'), 'facebook input should be in error state').to.be.false;

                                    _context8.next = 80;
                                    return fillIn('#user-facebook', '');

                                case 80:
                                    _context8.next = 82;
                                    return fillIn('#user-facebook', 'testing');

                                case 82:
                                    _context8.next = 84;
                                    return triggerEvent('#user-facebook', 'blur');

                                case 84:

                                    (0, _chai.expect)(find('#user-facebook').val()).to.be.equal('https://www.facebook.com/testing');
                                    (0, _chai.expect)(find('#user-facebook').closest('.form-group').hasClass('error'), 'facebook input should be in error state').to.be.false;

                                    _context8.next = 88;
                                    return fillIn('#user-facebook', '');

                                case 88:
                                    _context8.next = 90;
                                    return fillIn('#user-facebook', 'somewebsite.com/pages/some-facebook-page/857469375913?ref=ts');

                                case 90:
                                    _context8.next = 92;
                                    return triggerEvent('#user-facebook', 'blur');

                                case 92:

                                    (0, _chai.expect)(find('#user-facebook').val()).to.be.equal('https://www.facebook.com/pages/some-facebook-page/857469375913?ref=ts');
                                    (0, _chai.expect)(find('#user-facebook').closest('.form-group').hasClass('error'), 'facebook input should be in error state').to.be.false;

                                    _context8.next = 96;
                                    return fillIn('#user-facebook', '');

                                case 96:
                                    _context8.next = 98;
                                    return fillIn('#user-facebook', 'test');

                                case 98:
                                    _context8.next = 100;
                                    return triggerEvent('#user-facebook', 'blur');

                                case 100:

                                    (0, _chai.expect)(find('#user-facebook').val()).to.be.equal('https://www.facebook.com/test');
                                    (0, _chai.expect)(find('#user-facebook').closest('.form-group').hasClass('error'), 'facebook input should be in error state').to.be.false;

                                    _context8.next = 104;
                                    return fillIn('#user-facebook', '');

                                case 104:
                                    _context8.next = 106;
                                    return fillIn('#user-facebook', 'http://twitter.com/testuser');

                                case 106:
                                    _context8.next = 108;
                                    return triggerEvent('#user-facebook', 'blur');

                                case 108:

                                    (0, _chai.expect)(find('#user-facebook').val()).to.be.equal('https://www.facebook.com/testuser');
                                    (0, _chai.expect)(find('#user-facebook').closest('.form-group').hasClass('error'), 'facebook input should be in error state').to.be.false;

                                    _context8.next = 112;
                                    return fillIn('#user-facebook', '');

                                case 112:
                                    _context8.next = 114;
                                    return fillIn('#user-facebook', 'facebook.com/testing');

                                case 114:
                                    _context8.next = 116;
                                    return triggerEvent('#user-facebook', 'blur');

                                case 116:

                                    (0, _chai.expect)(find('#user-facebook').val()).to.be.equal('https://www.facebook.com/testing');
                                    (0, _chai.expect)(find('#user-facebook').closest('.form-group').hasClass('error'), 'facebook input should be in error state').to.be.false;

                                    // Testing Twitter input

                                    // loads fixtures and performs transform
                                    (0, _chai.expect)(find('#user-twitter').val(), 'initial twitter value').to.equal('https://twitter.com/test');

                                    _context8.next = 121;
                                    return triggerEvent('#user-twitter', 'focus');

                                case 121:
                                    _context8.next = 123;
                                    return triggerEvent('#user-twitter', 'blur');

                                case 123:

                                    // regression test: we still have a value after the input is
                                    // focused and then blurred without any changes
                                    (0, _chai.expect)(find('#user-twitter').val(), 'twitter value after blur with no change').to.equal('https://twitter.com/test');

                                    _context8.next = 126;
                                    return fillIn('#user-twitter', '');

                                case 126:
                                    _context8.next = 128;
                                    return fillIn('#user-twitter', ')(*&%^%)');

                                case 128:
                                    _context8.next = 130;
                                    return triggerEvent('#user-twitter', 'blur');

                                case 130:

                                    (0, _chai.expect)(find('#user-twitter').closest('.form-group').hasClass('error'), 'twitter input should be in error state').to.be.true;

                                    _context8.next = 133;
                                    return fillIn('#user-twitter', '');

                                case 133:
                                    _context8.next = 135;
                                    return fillIn('#user-twitter', 'name');

                                case 135:
                                    _context8.next = 137;
                                    return triggerEvent('#user-twitter', 'blur');

                                case 137:

                                    (0, _chai.expect)(find('#user-twitter').val()).to.be.equal('https://twitter.com/name');
                                    (0, _chai.expect)(find('#user-twitter').closest('.form-group').hasClass('error'), 'twitter input should be in error state').to.be.false;

                                    _context8.next = 141;
                                    return fillIn('#user-twitter', '');

                                case 141:
                                    _context8.next = 143;
                                    return fillIn('#user-twitter', 'http://github.com/user');

                                case 143:
                                    _context8.next = 145;
                                    return triggerEvent('#user-twitter', 'blur');

                                case 145:

                                    (0, _chai.expect)(find('#user-twitter').val()).to.be.equal('https://twitter.com/user');
                                    (0, _chai.expect)(find('#user-twitter').closest('.form-group').hasClass('error'), 'twitter input should be in error state').to.be.false;

                                    _context8.next = 149;
                                    return fillIn('#user-twitter', '');

                                case 149:
                                    _context8.next = 151;
                                    return fillIn('#user-twitter', 'twitter.com/user');

                                case 151:
                                    _context8.next = 153;
                                    return triggerEvent('#user-twitter', 'blur');

                                case 153:

                                    (0, _chai.expect)(find('#user-twitter').val()).to.be.equal('https://twitter.com/user');
                                    (0, _chai.expect)(find('#user-twitter').closest('.form-group').hasClass('error'), 'twitter input should be in error state').to.be.false;

                                    _context8.next = 157;
                                    return fillIn('#user-website', '');

                                case 157:
                                    _context8.next = 159;
                                    return fillIn('#user-bio', new Array(210).join('a'));

                                case 159:
                                    _context8.next = 161;
                                    return triggerEvent('#user-bio', 'blur');

                                case 161:

                                    (0, _chai.expect)(find('#user-bio').closest('.form-group').hasClass('error'), 'bio input should be in error state').to.be.true;

                                    // password reset ------

                                    // button triggers validation
                                    _context8.next = 164;
                                    return click('.button-change-password');

                                case 164:

                                    (0, _chai.expect)(find('#user-password-new').closest('.form-group').hasClass('error'), 'new password has error class when blank').to.be.true;

                                    (0, _chai.expect)(find('#user-password-new').siblings('.response').text(), 'new password error when blank').to.match(/can't be blank/);

                                    // typing in inputs clears validation
                                    _context8.next = 168;
                                    return fillIn('#user-password-new', 'password');

                                case 168:
                                    _context8.next = 170;
                                    return triggerEvent('#user-password-new', 'input');

                                case 170:

                                    (0, _chai.expect)(find('#user-password-new').closest('.form-group').hasClass('error'), 'password validation is visible after typing').to.be.false;

                                    // enter key triggers action
                                    _context8.next = 173;
                                    return keyEvent('#user-password-new', 'keyup', 13);

                                case 173:

                                    (0, _chai.expect)(find('#user-new-password-verification').closest('.form-group').hasClass('error'), 'confirm password has error class when it doesn\'t match').to.be.true;

                                    (0, _chai.expect)(find('#user-new-password-verification').siblings('.response').text(), 'confirm password error when it doesn\'t match').to.match(/do not match/);

                                    // submits with correct details
                                    _context8.next = 177;
                                    return fillIn('#user-new-password-verification', 'password');

                                case 177:
                                    _context8.next = 179;
                                    return click('.button-change-password');

                                case 179:

                                    // hits the endpoint
                                    _server$pretender$han3 = server.pretender.handledRequests.slice(-1), _server$pretender$han4 = _slicedToArray(_server$pretender$han3, 1), newRequest = _server$pretender$han4[0];

                                    params = JSON.parse(newRequest.requestBody);

                                    (0, _chai.expect)(newRequest.url, 'password request URL').to.match(/\/users\/password/);

                                    // eslint-disable-next-line camelcase
                                    (0, _chai.expect)(params.password[0].user_id).to.equal(user.id.toString());
                                    (0, _chai.expect)(params.password[0].newPassword).to.equal('password');
                                    (0, _chai.expect)(params.password[0].ne2Password).to.equal('password');

                                    // clears the fields
                                    (0, _chai.expect)(find('#user-password-new').val(), 'password field after submit').to.be.blank;

                                    (0, _chai.expect)(find('#user-new-password-verification').val(), 'password verification field after submit').to.be.blank;

                                    // displays a notification
                                    (0, _chai.expect)(find('.gh-notifications .gh-notification').length, 'password saved notification is displayed').to.equal(1);

                                case 188:
                                case 'end':
                                    return _context8.stop();
                            }
                        }
                    }, _callee8, this);
                })));
            });

            (0, _mocha.describe)('using Ghost OAuth', function () {
                (0, _mocha.beforeEach)(function () {
                    (0, _configuration.enableGhostOAuth)(server);
                });

                (0, _mocha.it)('doesn\'t show the password reset form', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                        while (1) {
                            switch (_context9.prev = _context9.next) {
                                case 0:
                                    _context9.next = 2;
                                    return visit('/team/' + admin.slug);

                                case 2:

                                    // ensure that the normal form is displayed so we don't get
                                    // false positives
                                    (0, _chai.expect)(find('input#user-slug').length, 'profile form is displayed').to.equal(1);

                                    // check that the password form is hidden
                                    (0, _chai.expect)(find('#password-reset').length, 'presence of password reset form').to.equal(0);

                                    (0, _chai.expect)(find('#user-password-new').length, 'presence of new password field').to.equal(0);

                                case 5:
                                case 'end':
                                    return _context9.stop();
                            }
                        }
                    }, _callee9, this);
                })));
            });

            (0, _mocha.describe)('own user', function () {
                (0, _mocha.it)('requires current password when changing password', _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                        while (1) {
                            switch (_context10.prev = _context10.next) {
                                case 0:
                                    _context10.next = 2;
                                    return visit('/team/' + admin.slug);

                                case 2:
                                    _context10.next = 4;
                                    return click('.button-change-password');

                                case 4:

                                    // old password has error
                                    (0, _chai.expect)(find('#user-password-old').closest('.form-group').hasClass('error'), 'old password has error class when blank').to.be.true;

                                    (0, _chai.expect)(find('#user-password-old').siblings('.response').text(), 'old password error when blank').to.match(/is required/);

                                    // new password has error
                                    (0, _chai.expect)(find('#user-password-new').closest('.form-group').hasClass('error'), 'new password has error class when blank').to.be.true;

                                    (0, _chai.expect)(find('#user-password-new').siblings('.response').text(), 'new password error when blank').to.match(/can't be blank/);

                                    // validation is cleared when typing
                                    _context10.next = 10;
                                    return fillIn('#user-password-old', 'password');

                                case 10:
                                    _context10.next = 12;
                                    return triggerEvent('#user-password-old', 'input');

                                case 12:

                                    (0, _chai.expect)(find('#user-password-old').closest('.form-group').hasClass('error'), 'old password validation is in error state after typing').to.be.false;

                                case 13:
                                case 'end':
                                    return _context10.stop();
                            }
                        }
                    }, _callee10, this);
                })));
            });

            (0, _mocha.it)('redirects to 404 when user does not exist', _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                server.get('/users/slug/unknown/', function () {
                                    return new _emberCliMirage.Response(404, { 'Content-Type': 'application/json' }, { errors: [{ message: 'User not found.', errorType: 'NotFoundError' }] });
                                });

                                (0, _adapterError.errorOverride)();

                                _context11.next = 4;
                                return visit('/team/unknown');

                            case 4:

                                (0, _adapterError.errorReset)();
                                (0, _chai.expect)(currentPath()).to.equal('error404');
                                (0, _chai.expect)(currentURL()).to.equal('/team/unknown');

                            case 7:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            })));
        });

        (0, _mocha.describe)('when logged in as author', function () {
            var adminRole = void 0,
                authorRole = void 0;

            (0, _mocha.beforeEach)(function () {
                adminRole = server.create('role', { name: 'Administrator' });
                authorRole = server.create('role', { name: 'Author' });
                server.create('user', { roles: [authorRole] });

                server.get('/invites/', function () {
                    return new _emberCliMirage.Response(403, {}, {
                        errors: [{
                            errorType: 'NoPermissionError',
                            message: 'You do not have permission to perform this action'
                        }]
                    });
                });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('can access the team page', _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                server.create('user', { roles: [adminRole] });
                                server.create('invite', { roles: [authorRole] });

                                (0, _adapterError.errorOverride)();

                                _context12.next = 5;
                                return visit('/team');

                            case 5:

                                (0, _adapterError.errorReset)();
                                (0, _chai.expect)(currentPath()).to.equal('team.index');
                                (0, _chai.expect)(find('.gh-alert').length).to.equal(0);

                            case 8:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            })));
        });
    });
});
define('ghost-admin/tests/acceptance/version-mismatch-test', ['ghost-admin/tests/helpers/destroy-app', 'ghost-admin/tests/helpers/start-app', 'ember-test-selectors', 'mocha', 'ghost-admin/tests/helpers/ember-simple-auth', 'chai', 'ghost-admin/mirage/utils'], function (_destroyApp, _startApp, _emberTestSelectors, _mocha, _emberSimpleAuth, _chai, _utils) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    (0, _mocha.describe)('Acceptance: Version Mismatch', function () {
        var application = void 0;

        (0, _mocha.beforeEach)(function () {
            application = (0, _startApp.default)();
        });

        (0, _mocha.afterEach)(function () {
            (0, _destroyApp.default)(application);
        });

        (0, _mocha.describe)('logged in', function () {
            (0, _mocha.beforeEach)(function () {
                var role = server.create('role', { name: 'Administrator' });
                server.create('user', { roles: [role] });

                return (0, _emberSimpleAuth.authenticateSession)(application);
            });

            (0, _mocha.it)('displays an alert and disables navigation when saving', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                server.createList('post', 3);

                                // mock the post save endpoint to return version mismatch
                                server.put('/posts/:id', _utils.versionMismatchResponse);

                                _context.next = 4;
                                return visit('/');

                            case 4:
                                _context.next = 6;
                                return click('.posts-list li:nth-of-type(2) a');

                            case 6:
                                _context.next = 8;
                                return click((0, _emberTestSelectors.default)('publishmenu-trigger'));

                            case 8:
                                _context.next = 10;
                                return click((0, _emberTestSelectors.default)('publishmenu-save'));

                            case 10:
                                // "Save post"

                                // has the refresh to update alert
                                (0, _chai.expect)(find('.gh-alert').length).to.equal(1);
                                (0, _chai.expect)(find('.gh-alert').text()).to.match(/refresh/);

                                // try navigating back to the content list
                                _context.next = 14;
                                return click('.gh-nav-main-content');

                            case 14:

                                (0, _chai.expect)(currentPath()).to.equal('editor.edit');

                            case 15:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));

            (0, _mocha.it)('displays alert and aborts the transition when navigating', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return visit('/');

                            case 2:

                                // mock the tags endpoint to return version mismatch
                                server.get('/tags/', _utils.versionMismatchResponse);

                                _context2.next = 5;
                                return click('.gh-nav-settings-tags');

                            case 5:

                                // navigation is blocked on loading screen
                                (0, _chai.expect)(currentPath()).to.equal('settings.tags_loading');

                                // has the refresh to update alert
                                (0, _chai.expect)(find('.gh-alert').length).to.equal(1);
                                (0, _chai.expect)(find('.gh-alert').text()).to.match(/refresh/);

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })));

            (0, _mocha.it)('displays alert and aborts the transition when an ember-ajax error is thrown whilst navigating', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                server.get('/configuration/timezones/', _utils.versionMismatchResponse);

                                _context3.next = 3;
                                return visit('/settings/tags');

                            case 3:
                                _context3.next = 5;
                                return click('.gh-nav-settings-general');

                            case 5:

                                // navigation is blocked
                                (0, _chai.expect)(currentPath()).to.equal('settings.general_loading');

                                // has the refresh to update alert
                                (0, _chai.expect)(find('.gh-alert').length).to.equal(1);
                                (0, _chai.expect)(find('.gh-alert').text()).to.match(/refresh/);

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));

            (0, _mocha.it)('can be triggered when passed in to a component', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                server.post('/subscribers/csv/', _utils.versionMismatchResponse);

                                _context4.next = 3;
                                return visit('/subscribers');

                            case 3:
                                _context4.next = 5;
                                return click('.gh-btn:contains("Import CSV")');

                            case 5:
                                _context4.next = 7;
                                return fileUpload('.fullscreen-modal input[type="file"]', ['test'], { name: 'test.csv' });

                            case 7:

                                // alert is shown
                                (0, _chai.expect)(find('.gh-alert').length).to.equal(1);
                                (0, _chai.expect)(find('.gh-alert').text()).to.match(/refresh/);

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));
        });

        (0, _mocha.describe)('logged out', function () {
            (0, _mocha.it)('displays alert', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                server.post('/authentication/token', _utils.versionMismatchResponse);

                                _context5.next = 3;
                                return visit('/signin');

                            case 3:
                                _context5.next = 5;
                                return fillIn('[name="identification"]', 'test@example.com');

                            case 5:
                                _context5.next = 7;
                                return fillIn('[name="password"]', 'password');

                            case 7:
                                _context5.next = 9;
                                return click('.gh-btn-blue');

                            case 9:

                                // has the refresh to update alert
                                (0, _chai.expect)(find('.gh-alert').length).to.equal(1);
                                (0, _chai.expect)(find('.gh-alert').text()).to.match(/refresh/);

                            case 11:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));
        });
    });
});
define('ghost-admin/tests/app.lint-test', [], function () {
  'use strict';

  describe('ESLint | app', function () {

    it('adapters/application.js', function () {
      // test passed
    });

    it('adapters/base.js', function () {
      // test passed
    });

    it('adapters/embedded-relation-adapter.js', function () {
      // test passed
    });

    it('adapters/setting.js', function () {
      // test passed
    });

    it('adapters/tag.js', function () {
      // test passed
    });

    it('adapters/theme.js', function () {
      // test passed
    });

    it('adapters/user.js', function () {
      // test passed
    });

    it('app.js', function () {
      // test passed
    });

    it('authenticators/oauth2-ghost-d26ed426a52330606c86d1fb6ebd0dbb.js', function () {
      // test passed
    });

    it('authenticators/oauth2.js', function () {
      // test passed
    });

    it('authorizers/oauth2.js', function () {
      // test passed
    });

    it('components/gh-activating-list-item.js', function () {
      // test passed
    });

    it('components/gh-alert.js', function () {
      // test passed
    });

    it('components/gh-alerts.js', function () {
      // test passed
    });

    it('components/gh-app.js', function () {
      // test passed
    });

    it('components/gh-basic-dropdown.js', function () {
      // test passed
    });

    it('components/gh-blog-url.js', function () {
      // test passed
    });

    it('components/gh-cm-editor.js', function () {
      // test passed
    });

    it('components/gh-content-cover.js', function () {
      // test passed
    });

    it('components/gh-date-time-picker.js', function () {
      // test passed
    });

    it('components/gh-datetime-input.js', function () {
      // test passed
    });

    it('components/gh-download-count.js', function () {
      // test passed
    });

    it('components/gh-dropdown-button.js', function () {
      // test passed
    });

    it('components/gh-dropdown.js', function () {
      // test passed
    });

    it('components/gh-editor-post-status.js', function () {
      // test passed
    });

    it('components/gh-editor.js', function () {
      // test passed
    });

    it('components/gh-error-message.js', function () {
      // test passed
    });

    it('components/gh-feature-flag.js', function () {
      // test passed
    });

    it('components/gh-file-input.js', function () {
      // test passed
    });

    it('components/gh-file-upload.js', function () {
      // test passed
    });

    it('components/gh-file-uploader.js', function () {
      // test passed
    });

    it('components/gh-form-group.js', function () {
      // test passed
    });

    it('components/gh-fullscreen-modal.js', function () {
      // test passed
    });

    it('components/gh-image-uploader-with-preview.js', function () {
      // test passed
    });

    it('components/gh-image-uploader.js', function () {
      // test passed
    });

    it('components/gh-infinite-scroll.js', function () {
      // test passed
    });

    it('components/gh-input.js', function () {
      // test passed
    });

    it('components/gh-loading-spinner.js', function () {
      // test passed
    });

    it('components/gh-main.js', function () {
      // test passed
    });

    it('components/gh-markdown-editor.js', function () {
      // test passed
    });

    it('components/gh-menu-toggle.js', function () {
      // test passed
    });

    it('components/gh-mobile-nav-bar.js', function () {
      // test passed
    });

    it('components/gh-nav-menu.js', function () {
      // test passed
    });

    it('components/gh-navigation.js', function () {
      // test passed
    });

    it('components/gh-navitem-url-input.js', function () {
      // test passed
    });

    it('components/gh-navitem.js', function () {
      // test passed
    });

    it('components/gh-notification.js', function () {
      // test passed
    });

    it('components/gh-notifications.js', function () {
      // test passed
    });

    it('components/gh-post-settings-menu.js', function () {
      // test passed
    });

    it('components/gh-posts-list-item.js', function () {
      // test passed
    });

    it('components/gh-profile-image.js', function () {
      // test passed
    });

    it('components/gh-progress-bar.js', function () {
      // test passed
    });

    it('components/gh-publishmenu-draft.js', function () {
      // test passed
    });

    it('components/gh-publishmenu-published.js', function () {
      // test passed
    });

    it('components/gh-publishmenu-scheduled.js', function () {
      // test passed
    });

    it('components/gh-publishmenu.js', function () {
      // test passed
    });

    it('components/gh-search-input.js', function () {
      // test passed
    });

    it('components/gh-search-input/trigger.js', function () {
      // test passed
    });

    it('components/gh-selectize.js', function () {
      // test passed
    });

    it('components/gh-simplemde.js', function () {
      // test passed
    });

    it('components/gh-skip-link.js', function () {
      // test passed
    });

    it('components/gh-subscribers-table.js', function () {
      // test passed
    });

    it('components/gh-tab-pane.js', function () {
      // test passed
    });

    it('components/gh-tab.js', function () {
      // test passed
    });

    it('components/gh-tabs-manager.js', function () {
      // test passed
    });

    it('components/gh-tag-settings-form.js', function () {
      // test passed
    });

    it('components/gh-tag.js', function () {
      // test passed
    });

    it('components/gh-tags-management-container.js', function () {
      // test passed
    });

    it('components/gh-task-button.js', function () {
      // test passed
    });

    it('components/gh-textarea.js', function () {
      // test passed
    });

    it('components/gh-theme-error-li.js', function () {
      // test passed
    });

    it('components/gh-theme-table.js', function () {
      // test passed
    });

    it('components/gh-timezone-select.js', function () {
      // test passed
    });

    it('components/gh-tour-item.js', function () {
      // test passed
    });

    it('components/gh-trim-focus-input.js', function () {
      // test passed
    });

    it('components/gh-upgrade-notification.js', function () {
      // test passed
    });

    it('components/gh-uploader.js', function () {
      // test passed
    });

    it('components/gh-url-preview.js', function () {
      // test passed
    });

    it('components/gh-user-active.js', function () {
      // test passed
    });

    it('components/gh-user-invited.js', function () {
      // test passed
    });

    it('components/gh-validation-status-container.js', function () {
      // test passed
    });

    it('components/gh-view-title.js', function () {
      // test passed
    });

    it('components/modals/base.js', function () {
      // test passed
    });

    it('components/modals/copy-html.js', function () {
      // test passed
    });

    it('components/modals/delete-all.js', function () {
      // test passed
    });

    it('components/modals/delete-post.js', function () {
      // test passed
    });

    it('components/modals/delete-subscriber.js', function () {
      // test passed
    });

    it('components/modals/delete-tag.js', function () {
      // test passed
    });

    it('components/modals/delete-theme.js', function () {
      // test passed
    });

    it('components/modals/delete-user.js', function () {
      // test passed
    });

    it('components/modals/import-subscribers.js', function () {
      // test passed
    });

    it('components/modals/invite-new-user.js', function () {
      // test passed
    });

    it('components/modals/leave-editor.js', function () {
      // test passed
    });

    it('components/modals/markdown-help.js', function () {
      // test passed
    });

    it('components/modals/new-subscriber.js', function () {
      // test passed
    });

    it('components/modals/re-authenticate.js', function () {
      // test passed
    });

    it('components/modals/suspend-user.js', function () {
      // test passed
    });

    it('components/modals/theme-warnings.js', function () {
      // test passed
    });

    it('components/modals/transfer-owner.js', function () {
      // test passed
    });

    it('components/modals/unsuspend-user.js', function () {
      // test passed
    });

    it('components/modals/upload-image.js', function () {
      // test passed
    });

    it('components/modals/upload-theme.js', function () {
      // test passed
    });

    it('components/power-select-vertical-collection-options.js', function () {
      // test passed
    });

    it('components/power-select/trigger.js', function () {
      // test passed
    });

    it('controllers/about.js', function () {
      // test passed
    });

    it('controllers/application.js', function () {
      // test passed
    });

    it('controllers/editor/edit.js', function () {
      // test passed
    });

    it('controllers/editor/new.js', function () {
      // test passed
    });

    it('controllers/error.js', function () {
      // test passed
    });

    it('controllers/posts-loading.js', function () {
      // test passed
    });

    it('controllers/posts.js', function () {
      // test passed
    });

    it('controllers/reset.js', function () {
      // test passed
    });

    it('controllers/settings/apps/amp.js', function () {
      // test passed
    });

    it('controllers/settings/apps/slack.js', function () {
      // test passed
    });

    it('controllers/settings/code-injection.js', function () {
      // test passed
    });

    it('controllers/settings/design.js', function () {
      // test passed
    });

    it('controllers/settings/general.js', function () {
      // test passed
    });

    it('controllers/settings/labs.js', function () {
      // test passed
    });

    it('controllers/settings/tags.js', function () {
      // test passed
    });

    it('controllers/settings/tags/tag.js', function () {
      // test passed
    });

    it('controllers/setup.js', function () {
      // test passed
    });

    it('controllers/setup/three.js', function () {
      // test passed
    });

    it('controllers/setup/two.js', function () {
      // test passed
    });

    it('controllers/signin.js', function () {
      // test passed
    });

    it('controllers/signup.js', function () {
      // test passed
    });

    it('controllers/subscribers.js', function () {
      // test passed
    });

    it('controllers/team/index.js', function () {
      // test passed
    });

    it('controllers/team/user.js', function () {
      // test passed
    });

    it('helpers/gh-count-characters.js', function () {
      // test passed
    });

    it('helpers/gh-count-down-characters.js', function () {
      // test passed
    });

    it('helpers/gh-count-words.js', function () {
      // test passed
    });

    it('helpers/gh-format-html.js', function () {
      // test passed
    });

    it('helpers/gh-format-timeago.js', function () {
      // test passed
    });

    it('helpers/gh-path.js', function () {
      // test passed
    });

    it('helpers/gh-user-can-admin.js', function () {
      // test passed
    });

    it('helpers/highlighted-text.js', function () {
      // test passed
    });

    it('helpers/is-equal.js', function () {
      // test passed
    });

    it('helpers/is-not.js', function () {
      // test passed
    });

    it('initializers/ember-simple-auth.js', function () {
      // test passed
    });

    it('initializers/event-dispatcher.js', function () {
      // test passed
    });

    it('initializers/trailing-hash.js', function () {
      // test passed
    });

    it('initializers/upgrade-status.js', function () {
      // test passed
    });

    it('instance-initializers/jquery-ajax-oauth-prefilter.js', function () {
      // test passed
    });

    it('mixins/body-event-listener.js', function () {
      // test passed
    });

    it('mixins/current-user-settings.js', function () {
      // test passed
    });

    it('mixins/dropdown-mixin.js', function () {
      // test passed
    });

    it('mixins/editor-base-controller.js', function () {
      // test passed
    });

    it('mixins/editor-base-route.js', function () {
      // test passed
    });

    it('mixins/infinite-scroll.js', function () {
      // test passed
    });

    it('mixins/pagination.js', function () {
      // test passed
    });

    it('mixins/settings-menu-component.js', function () {
      // test passed
    });

    it('mixins/shortcuts-route.js', function () {
      // test passed
    });

    it('mixins/shortcuts.js', function () {
      // test passed
    });

    it('mixins/slug-url.js', function () {
      // test passed
    });

    it('mixins/style-body.js', function () {
      // test passed
    });

    it('mixins/text-input.js', function () {
      // test passed
    });

    it('mixins/unauthenticated-route-mixin.js', function () {
      // test passed
    });

    it('mixins/validation-engine.js', function () {
      // test passed
    });

    it('mixins/validation-state.js', function () {
      // test passed
    });

    it('models/invite.js', function () {
      // test passed
    });

    it('models/navigation-item.js', function () {
      // test passed
    });

    it('models/notification.js', function () {
      // test passed
    });

    it('models/post.js', function () {
      // test passed
    });

    it('models/role.js', function () {
      // test passed
    });

    it('models/setting.js', function () {
      // test passed
    });

    it('models/slack-integration.js', function () {
      // test passed
    });

    it('models/subscriber.js', function () {
      // test passed
    });

    it('models/tag.js', function () {
      // test passed
    });

    it('models/theme.js', function () {
      // test passed
    });

    it('models/user.js', function () {
      // test passed
    });

    it('resolver.js', function () {
      // test passed
    });

    it('router.js', function () {
      // test passed
    });

    it('routes/about.js', function () {
      // test passed
    });

    it('routes/application.js', function () {
      // test passed
    });

    it('routes/authenticated.js', function () {
      // test passed
    });

    it('routes/editor/edit.js', function () {
      // test passed
    });

    it('routes/editor/index.js', function () {
      // test passed
    });

    it('routes/editor/new.js', function () {
      // test passed
    });

    it('routes/error404.js', function () {
      // test passed
    });

    it('routes/posts.js', function () {
      // test passed
    });

    it('routes/reset.js', function () {
      // test passed
    });

    it('routes/settings/apps.js', function () {
      // test passed
    });

    it('routes/settings/apps/amp.js', function () {
      // test passed
    });

    it('routes/settings/apps/slack.js', function () {
      // test passed
    });

    it('routes/settings/code-injection.js', function () {
      // test passed
    });

    it('routes/settings/design.js', function () {
      // test passed
    });

    it('routes/settings/design/uploadtheme.js', function () {
      // test passed
    });

    it('routes/settings/general.js', function () {
      // test passed
    });

    it('routes/settings/labs.js', function () {
      // test passed
    });

    it('routes/settings/tags.js', function () {
      // test passed
    });

    it('routes/settings/tags/index.js', function () {
      // test passed
    });

    it('routes/settings/tags/new.js', function () {
      // test passed
    });

    it('routes/settings/tags/tag.js', function () {
      // test passed
    });

    it('routes/setup.js', function () {
      // test passed
    });

    it('routes/setup/index.js', function () {
      // test passed
    });

    it('routes/setup/three.js', function () {
      // test passed
    });

    it('routes/signin.js', function () {
      // test passed
    });

    it('routes/signout.js', function () {
      // test passed
    });

    it('routes/signup.js', function () {
      // test passed
    });

    it('routes/subscribers.js', function () {
      // test passed
    });

    it('routes/subscribers/import.js', function () {
      // test passed
    });

    it('routes/subscribers/new.js', function () {
      // test passed
    });

    it('routes/team/index.js', function () {
      // test passed
    });

    it('routes/team/user.js', function () {
      // test passed
    });

    it('serializers/application.js', function () {
      // test passed
    });

    it('serializers/invite.js', function () {
      // test passed
    });

    it('serializers/notification.js', function () {
      // test passed
    });

    it('serializers/post.js', function () {
      // test passed
    });

    it('serializers/role.js', function () {
      // test passed
    });

    it('serializers/setting.js', function () {
      // test passed
    });

    it('serializers/subscriber.js', function () {
      // test passed
    });

    it('serializers/tag.js', function () {
      // test passed
    });

    it('serializers/theme.js', function () {
      // test passed
    });

    it('serializers/user.js', function () {
      // test passed
    });

    it('services/ajax.js', function () {
      // test passed
    });

    it('services/clock.js', function () {
      // test passed
    });

    it('services/config.js', function () {
      // test passed
    });

    it('services/dropdown.js', function () {
      // test passed
    });

    it('services/event-bus.js', function () {
      // test passed
    });

    it('services/feature.js', function () {
      // test passed
    });

    it('services/ghost-paths.js', function () {
      // test passed
    });

    it('services/lazy-loader.js', function () {
      // test passed
    });

    it('services/media-queries.js', function () {
      // test passed
    });

    it('services/notifications.js', function () {
      // test passed
    });

    it('services/session.js', function () {
      // test passed
    });

    it('services/settings.js', function () {
      // test passed
    });

    it('services/slug-generator.js', function () {
      // test passed
    });

    it('services/tour.js', function () {
      // test passed
    });

    it('services/upgrade-notification.js', function () {
      // test passed
    });

    it('services/upgrade-status.js', function () {
      // test passed
    });

    it('session-stores/application.js', function () {
      // test passed
    });

    it('torii-providers/ghost-oauth2.js', function () {
      // test passed
    });

    it('transforms/facebook-url-user.js', function () {
      // test passed
    });

    it('transforms/json-string.js', function () {
      // test passed
    });

    it('transforms/moment-date.js', function () {
      // test passed
    });

    it('transforms/moment-utc.js', function () {
      // test passed
    });

    it('transforms/navigation-settings.js', function () {
      // test passed
    });

    it('transforms/raw.js', function () {
      // test passed
    });

    it('transforms/slack-settings.js', function () {
      // test passed
    });

    it('transforms/twitter-url-user.js', function () {
      // test passed
    });

    it('transitions.js', function () {
      // test passed
    });

    it('utils/bound-one-way.js', function () {
      // test passed
    });

    it('utils/caja-sanitizers.js', function () {
      // test passed
    });

    it('utils/ctrl-or-cmd.js', function () {
      // test passed
    });

    it('utils/date-formatting.js', function () {
      // test passed
    });

    it('utils/document-title.js', function () {
      // test passed
    });

    it('utils/format-markdown.js', function () {
      // test passed
    });

    it('utils/ghost-paths.js', function () {
      // test passed
    });

    it('utils/isFinite.js', function () {
      // test passed
    });

    it('utils/isNumber.js', function () {
      // test passed
    });

    it('utils/link-component.js', function () {
      // test passed
    });

    it('utils/random-password.js', function () {
      // test passed
    });

    it('utils/route.js', function () {
      // test passed
    });

    it('utils/text-field.js', function () {
      // test passed
    });

    it('utils/titleize.js', function () {
      // test passed
    });

    it('utils/validator-extensions.js', function () {
      // test passed
    });

    it('utils/window-proxy.js', function () {
      // test passed
    });

    it('utils/word-count.js', function () {
      // test passed
    });

    it('validators/base.js', function () {
      // test passed
    });

    it('validators/invite-user.js', function () {
      // test passed
    });

    it('validators/nav-item.js', function () {
      // test passed
    });

    it('validators/new-user.js', function () {
      // test passed
    });

    it('validators/post.js', function () {
      // test passed
    });

    it('validators/reset.js', function () {
      // test passed
    });

    it('validators/setting.js', function () {
      // test passed
    });

    it('validators/setup.js', function () {
      // test passed
    });

    it('validators/signin.js', function () {
      // test passed
    });

    it('validators/signup.js', function () {
      // test passed
    });

    it('validators/slack-integration.js', function () {
      // test passed
    });

    it('validators/subscriber.js', function () {
      // test passed
    });

    it('validators/tag-settings.js', function () {
      // test passed
    });

    it('validators/user.js', function () {
      // test passed
    });
  });
});
define('ghost-admin/tests/helpers/adapter-error', ['exports', 'ember', 'ember-test'], function (exports, _ember, _emberTest) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.errorOverride = errorOverride;
    exports.errorReset = errorReset;
    var Logger = _ember.default.Logger;


    var originalException = void 0,
        originalLoggerError = void 0;

    function errorOverride() {
        originalException = _emberTest.default.adapter.exception;
        originalLoggerError = Logger.error;
        _emberTest.default.adapter.exception = function () {};
        Logger.error = function () {};
    }

    function errorReset() {
        _emberTest.default.adapter.exception = originalException;
        Logger.error = originalLoggerError;
    }
});
define('ghost-admin/tests/helpers/configuration', ['exports', 'ember-utils'], function (exports, _emberUtils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.enableGhostOAuth = enableGhostOAuth;
    function enableGhostOAuth(server) {
        if ((0, _emberUtils.isEmpty)(server.db.configurations)) {
            server.loadFixtures('configurations');
        }

        server.db.configurations.update(1, {
            ghostAuthId: '6e0704b3-c653-4c12-8da7-584232b5c629',
            ghostAuthUrl: 'http://devauth.ghost.org:8080'
        });
    }
});
define('ghost-admin/tests/helpers/destroy-app', ['exports', 'ember-runloop'], function (exports, _emberRunloop) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = destroyApp;
    function destroyApp(application) {
        // this is required to fix "second Pretender instance" warnings
        if (server) {
            server.shutdown();
        }

        (0, _emberRunloop.default)(application, 'destroy');
    }
});
define('ghost-admin/tests/helpers/editor-helpers', ['exports', 'jquery', 'ember', 'ember-runloop', 'ember-test-helpers/wait', 'mobiledoc-kit/renderers/mobiledoc', 'gh-koenig/components/gh-koenig', 'ember-native-dom-helpers'], function (exports, _jquery, _ember, _emberRunloop, _wait, _mobiledoc, _ghKoenig, _emberNativeDomHelpers) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EMPTY_DOC = undefined;
    exports.findEditor = findEditor;
    exports.focusEditor = focusEditor;
    exports.titleRendered = titleRendered;
    exports.replaceTitleHTML = replaceTitleHTML;
    exports.inputText = inputText;
    exports.testEditorInput = testEditorInput;
    exports.testEditorInputTimeout = testEditorInputTimeout;
    exports.waitForRender = waitForRender;
    var EMPTY_DOC = exports.EMPTY_DOC = {
        version: _mobiledoc.MOBILEDOC_VERSION,
        markups: [],
        atoms: [],
        cards: [],
        sections: []
    };

    // traverse up the node tree looking for an editor instance
    function findEditor(element) {
        if (!element) {
            // TODO: get the selector from the editor component
            element = (0, _emberNativeDomHelpers.findWithAssert)('.gh-koenig-container');
        }

        if (typeof element === 'string') {
            element = (0, _emberNativeDomHelpers.findWithAssert)(element);
        }

        do {
            if (element[_ghKoenig.TESTING_EXPANDO_PROPERTY]) {
                return element[_ghKoenig.TESTING_EXPANDO_PROPERTY];
            }
            element = element.parentNode;
        } while (!!element); // eslint-disable-line

        throw new Error('Unable to find gh-koenig editor from element');
    }

    function focusEditor(element) {
        var editor = findEditor(element);
        (0, _emberRunloop.default)(function () {
            return editor.element.focus();
        });
        return window.wait || _wait.default;
    }

    // polls the title until it's started.
    function titleRendered() {
        return _ember.default.Test.promise(function (resolve) {
            // eslint-disable-line
            function checkTitle() {
                var title = (0, _jquery.default)('#koenig-title-input div');
                if (title[0]) {
                    return resolve();
                } else {
                    window.requestAnimationFrame(checkTitle);
                }
            }
            checkTitle();
        });
    }

    // replaces the title text content with HTML and returns once the HTML has been placed.
    // takes into account converting to plaintext.
    function replaceTitleHTML(HTML) {
        var el = (0, _emberNativeDomHelpers.findWithAssert)('#koenig-title-input div');
        (0, _emberRunloop.default)(function () {
            return el.innerHTML = HTML;
        });
        return (window.wait || _wait.default)();
    }

    // simulates text inputs into the editor, unfortunately the Ember helper functions
    // don't work on content editable so we have to manipuate the text input event manager
    // in mobiledoc-kit directly. This is a private API.
    function inputText(editor, text) {
        (0, _emberRunloop.default)(function () {
            editor._eventManager._textInputHandler.handle(text);
        });
    }

    // inputs text and waits for the editor to modify the dom with the desired result or timesout.
    function testEditorInput(input, output, expect) {
        var editor = findEditor();
        editor.element.focus(); // for some reason the editor doesn't work until it's focused when run in ghost-admin.
        return _ember.default.Test.promise(function (resolve, reject) {
            // eslint-disable-line
            var lastRender = '';
            var isRejected = false;
            var rejectTimeout = window.setTimeout(function () {
                expect(lastRender).to.equal(output); // we know this is false but include it for the output.
                reject(lastRender);
                isRejected = true;
            }, 500);
            editor.didRender(function () {
                lastRender = editor.element.innerHTML;
                if (editor.element.innerHTML === output && !isRejected) {
                    window.clearTimeout(rejectTimeout);
                    expect(lastRender).to.equal(output); // we know this is true but include it for the output.
                    return resolve(lastRender);
                }
            });
            inputText(editor, input);
        });
    }

    function testEditorInputTimeout(input) {
        var editor = findEditor();
        editor.element.focus();
        return _ember.default.Test.promise(function (resolve, reject) {
            // eslint-disable-line
            window.setTimeout(function () {
                resolve(editor.element.innerHTML);
            }, 300);

            inputText(editor, input);
        });
    }

    function waitForRender(selector) {
        return (0, _emberNativeDomHelpers.waitUntil)(function () {
            return (0, _emberNativeDomHelpers.find)(selector);
        });
    }
});
define('ghost-admin/tests/helpers/ember-basic-dropdown', ['exports', 'ember', 'ember-runloop', 'ember-native-dom-helpers', 'ember-test-helpers/wait'], function (exports, _ember, _emberRunloop, _emberNativeDomHelpers, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.nativeClick = undefined;
  exports.nativeTap = nativeTap;
  exports.clickTrigger = clickTrigger;
  exports.tapTrigger = tapTrigger;
  exports.fireKeydown = fireKeydown;

  exports.default = function () {
    _ember.default.Test.registerAsyncHelper('clickDropdown', function (app, cssPath) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      clickTrigger(cssPath, options);
    });

    _ember.default.Test.registerAsyncHelper('tapDropdown', function (app, cssPath) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      tapTrigger(cssPath, options);
    });
  };

  var nativeClick = exports.nativeClick = _emberNativeDomHelpers.click;
  var merge = _ember.default.merge;
  function nativeTap(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var touchStartEvent = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
    Object.keys(options).forEach(function (key) {
      return touchStartEvent[key] = options[key];
    });
    (0, _emberRunloop.default)(function () {
      return document.querySelector(selector).dispatchEvent(touchStartEvent);
    });
    var touchEndEvent = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
    Object.keys(options).forEach(function (key) {
      return touchEndEvent[key] = options[key];
    });
    (0, _emberRunloop.default)(function () {
      return document.querySelector(selector).dispatchEvent(touchEndEvent);
    });
  }

  function clickTrigger(scope) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var selector = '.ember-basic-dropdown-trigger';
    if (scope) {
      var element = document.querySelector(scope);
      if (element.classList.contains('ember-basic-dropdown-trigger')) {
        selector = scope;
      } else {
        selector = scope + ' ' + selector;
      }
    }
    (0, _emberNativeDomHelpers.click)(selector, options);
    return (0, _wait.default)();
  }

  function tapTrigger(scope) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var selector = '.ember-basic-dropdown-trigger';
    if (scope) {
      selector = scope + ' ' + selector;
    }
    nativeTap(selector, options);
  }

  function fireKeydown(selector, k) {
    var oEvent = document.createEvent('Events');
    oEvent.initEvent('keydown', true, true);
    merge(oEvent, {
      view: window,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      keyCode: k,
      charCode: k
    });
    (0, _emberRunloop.default)(function () {
      return document.querySelector(selector).dispatchEvent(oEvent);
    });
  }

  // acceptance helpers
});
define('ghost-admin/tests/helpers/ember-power-calendar', ['exports', 'ember-test', 'ember-runloop', 'ember-metal/utils', 'moment'], function (exports, _emberTest, _emberRunloop, _utils, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    _emberTest.default.registerAsyncHelper('calendarCenter', function (app, selector, newCenter) {
      (0, _utils.assert)('`calendarCenter` expect a Date or MomentJS object as second argument', newCenter);
      var calendarComponent = findComponentInstance(app, selector);
      var onCenterChange = calendarComponent.get('onCenterChange');
      (0, _utils.assert)('You cannot call `calendarCenter` on a component that doesn\'t has an `onCenterChange` action', !!onCenterChange);
      var newCenterMoment = (0, _moment.default)(newCenter);
      return onCenterChange({ date: newCenterMoment._d, moment: newCenterMoment });
    });

    _emberTest.default.registerAsyncHelper('calendarSelect', function (app, selector, selected) {
      (0, _utils.assert)('`calendarSelect` expect a Date or MomentJS object as second argument', selected);
      var selectedMoment = (0, _moment.default)(selected);
      var calendarElement = findCalendarElement(selector);
      var daySelector = selector + ' [data-date=' + selectedMoment.format('YYYY-MM-DD') + ']';
      var dayElement = calendarElement.find(daySelector);
      if (dayElement.length === 0) {
        (0, _emberRunloop.default)(function () {
          return calendarCenter(selector, selected);
        });
      }
      andThen(function () {
        click(daySelector);
      });
    });
  };

  function findCalendarElement(selector) {
    var target = find(selector);
    if (target.hasClass('ember-power-calendar')) {
      return target;
    } else {
      var $insideCalendar = target.find('.ember-power-calendar');
      if ($insideCalendar.length) {
        return $insideCalendar;
      } else {
        var $calendarPiece = target.find('[data-power-calendar-id]');
        if ($calendarPiece.length) {
          return $calendarPiece;
        }
      }
    }
  }

  function findCalendarGuid(selector) {
    var $maybeCalendar = findCalendarElement(selector);
    if (!$maybeCalendar) {
      return;
    }
    if ($maybeCalendar.hasClass('ember-power-calendar')) {
      return $maybeCalendar.attr('id');
    } else {
      return $maybeCalendar.attr('data-power-calendar-id');
    }
  }

  function findComponentInstance(app, selector) {
    var calendarGuid = findCalendarGuid(selector);
    (0, _utils.assert)('Could not find a calendar using selector: "' + selector + '"', calendarGuid);
    var calendarService = app.__container__.lookup('service:power-calendar');
    return calendarService._calendars[calendarGuid];
  }
});
define('ghost-admin/tests/helpers/ember-power-datepicker', ['exports', 'ember-test', 'ember-metal/utils', 'ghost-admin/tests/helpers/ember-basic-dropdown', 'ghost-admin/tests/helpers/ember-power-calendar'], function (exports, _emberTest, _utils, _emberBasicDropdown, _emberPowerCalendar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    (0, _emberBasicDropdown.default)();
    (0, _emberPowerCalendar.default)();

    _emberTest.default.registerAsyncHelper('datepickerSelect', function (app, selector, selected) {
      (0, _utils.assert)('`datepickerSelect` expect a Date or MomentJS object as second argument', selected);
      var $selector = find(selector);
      (0, _utils.assert)('`datepickerSelect` couln\'t find any element with selector: ' + selector, $selector.length);
      var $trigger = void 0;
      if ($selector.hasClass('ember-power-datepicker-trigger')) {
        $trigger = $selector;
      } else {
        $trigger = find(selector + ' .ember-power-datepicker-trigger');
        (0, _utils.assert)('`datepickerSelect` couln\'t find any datepicker within the selector ' + selector, $trigger.length);
        selector = selector + ' .ember-power-datepicker-trigger';
      }

      clickDropdown(selector);

      andThen(function () {
        calendarSelect('.ember-power-datepicker-content', selected);
      });
    });
  };
});
define('ghost-admin/tests/helpers/ember-power-select', ['exports', 'ember', 'ember-test', 'ember-test-helpers/wait', 'ember-native-dom-helpers'], function (exports, _ember, _emberTest, _wait, _emberNativeDomHelpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.findContains = findContains;
  exports.nativeMouseDown = nativeMouseDown;
  exports.nativeMouseUp = nativeMouseUp;
  exports.triggerKeydown = triggerKeydown;
  exports.typeInSearch = typeInSearch;
  exports.clickTrigger = clickTrigger;
  exports.nativeTouch = nativeTouch;
  exports.touchTrigger = touchTrigger;

  exports.default = function () {
    _emberTest.default.registerAsyncHelper('selectChoose', function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_, cssPathOrTrigger, valueOrSelector, optionIndex) {
        var trigger, target, contentId, content, options, potentialTargets, matchEq, index, option, filteredTargets;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                trigger = void 0, target = void 0;

                if (!(cssPathOrTrigger instanceof HTMLElement)) {
                  _context.next = 5;
                  break;
                }

                if (cssPathOrTrigger.classList.contains('ember-power-select-trigger')) {
                  trigger = cssPathOrTrigger;
                } else {
                  trigger = (0, _emberNativeDomHelpers.find)('.ember-power-select-trigger', cssPathOrTrigger);
                }
                _context.next = 9;
                break;

              case 5:
                trigger = (0, _emberNativeDomHelpers.find)(cssPathOrTrigger + ' .ember-power-select-trigger');

                if (!trigger) {
                  trigger = (0, _emberNativeDomHelpers.find)(cssPathOrTrigger);
                }

                if (trigger) {
                  _context.next = 9;
                  break;
                }

                throw new Error('You called "selectChoose(\'' + cssPathOrTrigger + '\', \'' + valueOrSelector + '\')" but no select was found using selector "' + cssPathOrTrigger + '"');

              case 9:
                contentId = '' + trigger.attributes['aria-owns'].value;
                content = (0, _emberNativeDomHelpers.find)('#' + contentId);
                // If the dropdown is closed, open it

                if (!(!content || content.classList.contains('ember-basic-dropdown-content-placeholder'))) {
                  _context.next = 16;
                  break;
                }

                _context.next = 14;
                return (0, _emberNativeDomHelpers.click)(trigger);

              case 14:
                _context.next = 16;
                return (0, _wait.default)();

              case 16:

                // Select the option with the given text
                options = [].slice.apply((0, _emberNativeDomHelpers.findAll)('#' + contentId + ' .ember-power-select-option'));
                potentialTargets = options.filter(function (opt) {
                  return opt.textContent.indexOf(valueOrSelector) > -1;
                });

                if (potentialTargets.length === 0) {
                  // If treating the value as text doesn't gave use any result, let's try if it's a css selector
                  matchEq = valueOrSelector.slice(-6).match(/:eq\((\d+)\)/);

                  if (matchEq) {
                    index = parseInt(matchEq[1], 10);
                    option = (0, _emberNativeDomHelpers.findAll)('#' + contentId + ' ' + valueOrSelector.slice(0, -6))[index];

                    _ember.default.deprecate('Passing selectors with the `:eq()` pseudoselector is deprecated. If you want to select the nth option, pass a number as a third argument. E.g `selectChoose(".language-select", ".ember-power-select-option", 3)`', true, {
                      id: 'select-choose-no-eq-pseudoselector',
                      until: '1.8.0'
                    });
                    if (option) {
                      potentialTargets = [option];
                    }
                  } else {
                    potentialTargets = (0, _emberNativeDomHelpers.findAll)('#' + contentId + ' ' + valueOrSelector);
                  }
                }
                if (potentialTargets.length > 1) {
                  filteredTargets = [].slice.apply(potentialTargets).filter(function (t) {
                    return t.textContent.trim() === valueOrSelector;
                  });

                  if (optionIndex === undefined) {
                    target = filteredTargets[0] || potentialTargets[0];
                  } else {
                    target = filteredTargets[optionIndex] || potentialTargets[optionIndex];
                  }
                } else {
                  target = potentialTargets[0];
                }

                if (target) {
                  _context.next = 22;
                  break;
                }

                throw new Error('You called "selectChoose(\'' + cssPathOrTrigger + '\', \'' + valueOrSelector + '\')" but "' + valueOrSelector + '" didn\'t match any option');

              case 22:
                _context.next = 24;
                return (0, _emberNativeDomHelpers.click)(target);

              case 24:
                return _context.abrupt('return', (0, _wait.default)());

              case 25:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      };
    }());

    _emberTest.default.registerAsyncHelper('selectSearch', function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(app, cssPathOrTrigger, value) {
        var trigger, triggerPath, contentId, isMultipleSelect, content, dropdownIsClosed, isDefaultSingleSelect, inputIsInTrigger;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                trigger = void 0;

                if (!(cssPathOrTrigger instanceof HTMLElement)) {
                  _context2.next = 5;
                  break;
                }

                trigger = cssPathOrTrigger;
                _context2.next = 10;
                break;

              case 5:
                triggerPath = cssPathOrTrigger + ' .ember-power-select-trigger';

                trigger = (0, _emberNativeDomHelpers.find)(triggerPath);
                if (!trigger) {
                  triggerPath = cssPathOrTrigger;
                  trigger = (0, _emberNativeDomHelpers.find)(triggerPath);
                }

                if (trigger) {
                  _context2.next = 10;
                  break;
                }

                throw new Error('You called "selectSearch(\'' + cssPathOrTrigger + '\', \'' + value + '\')" but no select was found using selector "' + cssPathOrTrigger + '"');

              case 10:
                contentId = '' + trigger.attributes['aria-owns'].value;
                isMultipleSelect = !!(0, _emberNativeDomHelpers.find)('.ember-power-select-trigger-multiple-input', trigger);
                content = (0, _emberNativeDomHelpers.find)('#' + contentId);
                dropdownIsClosed = !content || content.classList.contains('ember-basic-dropdown-content-placeholder');

                if (!dropdownIsClosed) {
                  _context2.next = 19;
                  break;
                }

                _context2.next = 17;
                return (0, _emberNativeDomHelpers.click)(trigger);

              case 17:
                _context2.next = 19;
                return (0, _wait.default)();

              case 19:
                isDefaultSingleSelect = !!(0, _emberNativeDomHelpers.find)('.ember-power-select-search-input');

                if (!isMultipleSelect) {
                  _context2.next = 25;
                  break;
                }

                _context2.next = 23;
                return (0, _emberNativeDomHelpers.fillIn)((0, _emberNativeDomHelpers.find)('.ember-power-select-trigger-multiple-input', trigger), value);

              case 23:
                _context2.next = 38;
                break;

              case 25:
                if (!isDefaultSingleSelect) {
                  _context2.next = 30;
                  break;
                }

                _context2.next = 28;
                return (0, _emberNativeDomHelpers.fillIn)('.ember-power-select-search-input', value);

              case 28:
                _context2.next = 38;
                break;

              case 30:
                // It's probably a customized version
                inputIsInTrigger = !!(0, _emberNativeDomHelpers.find)('.ember-power-select-trigger input[type=search]', trigger);

                if (!inputIsInTrigger) {
                  _context2.next = 36;
                  break;
                }

                _context2.next = 34;
                return (0, _emberNativeDomHelpers.fillIn)((0, _emberNativeDomHelpers.find)('input[type=search]', trigger), value);

              case 34:
                _context2.next = 38;
                break;

              case 36:
                _context2.next = 38;
                return (0, _emberNativeDomHelpers.fillIn)('#' + contentId + ' .ember-power-select-search-input[type=search]', 'input');

              case 38:
                return _context2.abrupt('return', (0, _wait.default)());

              case 39:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x6, _x7, _x8) {
        return _ref2.apply(this, arguments);
      };
    }());

    _emberTest.default.registerAsyncHelper('removeMultipleOption', function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(app, cssPath, value) {
        var elem, items, item;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                elem = void 0;
                items = [].slice.apply((0, _emberNativeDomHelpers.findAll)(cssPath + ' .ember-power-select-multiple-options > li'));
                item = items.find(function (el) {
                  return el.textContent.indexOf(value) > -1;
                });

                if (item) {
                  elem = (0, _emberNativeDomHelpers.find)('.ember-power-select-multiple-remove-btn', item);
                }
                _context3.prev = 4;
                _context3.next = 7;
                return (0, _emberNativeDomHelpers.click)(elem);

              case 7:
                return _context3.abrupt('return', (0, _wait.default)());

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3['catch'](4);

                console.warn('css path to remove btn not found');
                throw _context3.t0;

              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[4, 10]]);
      }));

      return function (_x9, _x10, _x11) {
        return _ref3.apply(this, arguments);
      };
    }());

    _emberTest.default.registerAsyncHelper('clearSelected', function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(app, cssPath) {
        var elem;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                elem = (0, _emberNativeDomHelpers.find)(cssPath + ' .ember-power-select-clear-btn');
                _context4.prev = 1;
                _context4.next = 4;
                return (0, _emberNativeDomHelpers.click)(elem);

              case 4:
                return _context4.abrupt('return', (0, _wait.default)());

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4['catch'](1);

                console.warn('css path to clear btn not found');
                throw _context4.t0;

              case 11:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 7]]);
      }));

      return function (_x12, _x13) {
        return _ref4.apply(this, arguments);
      };
    }());
  };

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  /**
   * @private
   * @param {String} selector CSS3 selector of the elements to check the content
   * @param {String} text Substring that the selected element must contain
   * @returns HTMLElement The first element that maches the given selector and contains the
   *                      given text
   */
  function findContains(selector, text) {
    return [].slice.apply((0, _emberNativeDomHelpers.findAll)(selector)).filter(function (e) {
      return e.textContent.trim().indexOf(text) > -1;
    })[0];
  }

  function nativeMouseDown(selectorOrDomElement, options) {
    (0, _emberNativeDomHelpers.triggerEvent)(selectorOrDomElement, 'mousedown', options);
  }

  function nativeMouseUp(selectorOrDomElement, options) {
    (0, _emberNativeDomHelpers.triggerEvent)(selectorOrDomElement, 'mouseup', options);
  }

  function triggerKeydown(domElement, k) {
    (0, _emberNativeDomHelpers.keyEvent)(domElement, 'keydown', k);
  }

  function typeInSearch(scopeOrText, text) {
    var scope = '';

    if (typeof text === 'undefined') {
      text = scopeOrText;
    } else {
      scope = scopeOrText;
    }

    var selectors = ['.ember-power-select-search-input', '.ember-power-select-search input', '.ember-power-select-trigger-multiple-input', 'input[type="search"]'].map(function (selector) {
      return scope + ' ' + selector;
    }).join(', ');

    return (0, _emberNativeDomHelpers.fillIn)(selectors, text);
  }

  function clickTrigger(scope) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var selector = '.ember-power-select-trigger';
    if (scope) {
      selector = scope + ' ' + selector;
    }
    return (0, _emberNativeDomHelpers.click)(selector, options);
  }

  function nativeTouch(selectorOrDomElement) {
    (0, _emberNativeDomHelpers.triggerEvent)(selectorOrDomElement, 'touchstart');
    (0, _emberNativeDomHelpers.triggerEvent)(selectorOrDomElement, 'touchend');
  }

  function touchTrigger() {
    nativeTouch('.ember-power-select-trigger');
  }

  // Helpers for acceptance tests
});
define('ghost-admin/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, _test) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;


  var TEST_CONTAINER_KEY = 'authenticator:test'; /* global wait */

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, _test.default);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  }

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  }
});
define('ghost-admin/tests/helpers/ember-sortable/test-helpers', ['ember-sortable/helpers/drag', 'ember-sortable/helpers/reorder'], function () {
  'use strict';
});
define('ghost-admin/tests/helpers/ember-test-selectors', ['exports', 'ember', 'ember-test-selectors'], function (exports, _ember, _emberTestSelectors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var deprecate = _ember.default.deprecate;


  var message = 'Importing testSelector() from "<appname>/tests/helpers/ember-test-selectors" is deprecated. ' + 'Please import testSelector() from "ember-test-selectors" instead.';

  deprecate(message, false, {
    id: 'ember-test-selectors.test-selector-import',
    until: '0.2.0',
    url: 'https://github.com/simplabs/ember-test-selectors#usage'
  });

  exports.default = _emberTestSelectors.default;
});
define('ghost-admin/tests/helpers/file-upload', ['exports', 'jquery', 'ember-test'], function (exports, _jquery, _emberTest) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.createFile = createFile;
    exports.fileUpload = fileUpload;
    /* global Blob */
    function createFile() {
        var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['test'];
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var name = options.name,
            type = options.type;


        var file = new Blob(content, { type: type ? type : 'text/plain' });
        file.name = name ? name : 'test.txt';

        return file;
    }

    function fileUpload($element, content, options) {
        var file = createFile(content, options);
        // eslint-disable-next-line new-cap
        var event = _jquery.default.Event('change', {
            testingFiles: [file]
        });

        $element.trigger(event);
    }

    exports.default = _emberTest.default.registerAsyncHelper('fileUpload', function (app, selector, content, options) {
        var file = createFile(content, options);

        return triggerEvent(selector, 'change', { testingFiles: [file] });
    });
});
define('ghost-admin/tests/helpers/oauth', ['exports', 'rsvp', 'ember-cli-mirage'], function (exports, _rsvp, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.stubFailedOAuthConnect = exports.stubSuccessfulOAuthConnect = undefined;


    var generateCode = function generateCode() {
        return _emberCliMirage.faker.internet.password(32, false, /[a-zA-Z0-9]/);
    };

    var generateSecret = function generateSecret() {
        return _emberCliMirage.faker.internet.password(12, false, /[a-f0-9]/);
    };

    var stubSuccessfulOAuthConnect = function stubSuccessfulOAuthConnect(application) {
        var provider = application.__container__.lookup('torii-provider:ghost-oauth2');

        provider.open = function () {
            return _rsvp.default.Promise.resolve({
                /* eslint-disable camelcase */
                authorizationCode: generateCode(),
                client_id: 'ghost-admin',
                client_secret: generateSecret(),
                provider: 'ghost-oauth2',
                redirectUrl: 'http://localhost:2368/ghost/'
                /* eslint-enable camelcase */
            });
        };
    };

    var stubFailedOAuthConnect = function stubFailedOAuthConnect(application) {
        var provider = application.__container__.lookup('torii-provider:ghost-oauth2');

        provider.open = function () {
            return _rsvp.default.Promise.reject();
        };
    };

    exports.stubSuccessfulOAuthConnect = stubSuccessfulOAuthConnect;
    exports.stubFailedOAuthConnect = stubFailedOAuthConnect;
});
define('ghost-admin/tests/helpers/resolver', ['exports', 'ghost-admin/resolver', 'ghost-admin/config/environment'], function (exports, _resolver, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    var resolver = _resolver.default.create();

    resolver.namespace = {
        modulePrefix: _environment.default.modulePrefix,
        podModulePrefix: _environment.default.podModulePrefix
    };

    exports.default = resolver;
});
define('ghost-admin/tests/helpers/start-app', ['exports', 'ghost-admin/app', 'ghost-admin/config/environment', 'ghost-admin/tests/helpers/file-upload', 'ghost-admin/tests/helpers/ember-power-datepicker', 'ghost-admin/tests/helpers/ember-power-select', 'ember-runloop', 'ember-platform'], function (exports, _app, _environment, _fileUpload, _emberPowerDatepicker, _emberPowerSelect, _emberRunloop, _emberPlatform) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = startApp;
    // eslint-disable-line
    (0, _emberPowerSelect.default)();
    (0, _emberPowerDatepicker.default)();

    function startApp(attrs) {
        var attributes = (0, _emberPlatform.assign)({}, _environment.default.APP);
        attributes = (0, _emberPlatform.assign)(attributes, attrs); // use defaults, but you can override;

        return (0, _emberRunloop.default)(function () {
            var application = _app.default.create(attributes);
            application.setupForTesting();
            application.injectTestHelpers();
            return application;
        });
    }
});
define('ghost-admin/tests/helpers/torii', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.stubValidSession = stubValidSession;
  function stubValidSession(application, sessionData) {
    var session = application.__container__.lookup('service:session');
    var sm = session.get('stateMachine');
    Ember.run(function () {
      sm.send('startOpen');
      sm.send('finishOpen', sessionData);
    });
  }
});
define('ghost-admin/tests/integration/adapters/tag-test', ['pretender', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Adapter: tag', function () {
        (0, _emberMocha.setupTest)('adapter:tag', {
            integration: true
        });

        var server = void 0,
            store = void 0;

        beforeEach(function () {
            store = this.container.lookup('service:store');
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('loads tags from regular endpoint when all are fetched', function (done) {
            server.get('/ghost/api/v0.1/tags/', function () {
                return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ tags: [{
                        id: 1,
                        name: 'Tag 1',
                        slug: 'tag-1'
                    }, {
                        id: 2,
                        name: 'Tag 2',
                        slug: 'tag-2'
                    }] })];
            });

            store.findAll('tag', { reload: true }).then(function (tags) {
                (0, _chai.expect)(tags).to.be.ok;
                (0, _chai.expect)(tags.objectAtContent(0).get('name')).to.equal('Tag 1');
                done();
            });
        });

        (0, _mocha.it)('loads tag from slug endpoint when single tag is queried and slug is passed in', function (done) {
            server.get('/ghost/api/v0.1/tags/slug/tag-1/', function () {
                return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ tags: [{
                        id: 1,
                        slug: 'tag-1',
                        name: 'Tag 1'
                    }] })];
            });

            store.queryRecord('tag', { slug: 'tag-1' }).then(function (tag) {
                (0, _chai.expect)(tag).to.be.ok;
                (0, _chai.expect)(tag.get('name')).to.equal('Tag 1');
                done();
            });
        });
    });
});
define('ghost-admin/tests/integration/adapters/user-test', ['pretender', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Adapter: user', function () {
        (0, _emberMocha.setupTest)('adapter:user', {
            integration: true
        });

        var server = void 0,
            store = void 0;

        beforeEach(function () {
            store = this.container.lookup('service:store');
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('loads users from regular endpoint when all are fetched', function (done) {
            server.get('/ghost/api/v0.1/users/', function () {
                return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ users: [{
                        id: 1,
                        name: 'User 1',
                        slug: 'user-1'
                    }, {
                        id: 2,
                        name: 'User 2',
                        slug: 'user-2'
                    }] })];
            });

            store.findAll('user', { reload: true }).then(function (users) {
                (0, _chai.expect)(users).to.be.ok;
                (0, _chai.expect)(users.objectAtContent(0).get('name')).to.equal('User 1');
                done();
            });
        });

        (0, _mocha.it)('loads user from slug endpoint when single user is queried and slug is passed in', function (done) {
            server.get('/ghost/api/v0.1/users/slug/user-1/', function () {
                return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ users: [{
                        id: 1,
                        slug: 'user-1',
                        name: 'User 1'
                    }] })];
            });

            store.queryRecord('user', { slug: 'user-1' }).then(function (user) {
                (0, _chai.expect)(user).to.be.ok;
                (0, _chai.expect)(user.get('name')).to.equal('User 1');
                done();
            });
        });

        (0, _mocha.it)('handles "include" parameter when querying single user via slug', function (done) {
            server.get('/ghost/api/v0.1/users/slug/user-1/', function (request) {
                var params = request.queryParams;
                (0, _chai.expect)(params.include, 'include query').to.equal('roles,count.posts');

                return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ users: [{
                        id: 1,
                        slug: 'user-1',
                        name: 'User 1',
                        count: {
                            posts: 5
                        }
                    }] })];
            });

            store.queryRecord('user', { slug: 'user-1', include: 'count.posts' }).then(function (user) {
                (0, _chai.expect)(user).to.be.ok;
                (0, _chai.expect)(user.get('name')).to.equal('User 1');
                (0, _chai.expect)(user.get('count.posts')).to.equal(5);
                done();
            });
        });
    });
});
define('ghost-admin/tests/integration/components/gh-alert-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: gh-alert', function () {
        (0, _emberMocha.setupComponentTest)('gh-alert', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            this.set('message', { message: 'Test message', type: 'success' });

            this.render(Ember.HTMLBars.template({
                "id": "BN0oOrVG",
                "block": "{\"statements\":[[1,[33,[\"gh-alert\"],null,[[\"message\"],[[28,[\"message\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('article.gh-alert')).to.have.length(1);
            var $alert = this.$('.gh-alert');

            (0, _chai.expect)($alert.text()).to.match(/Test message/);
        });

        (0, _mocha.it)('maps message types to CSS classes', function () {
            this.set('message', { message: 'Test message', type: 'success' });

            this.render(Ember.HTMLBars.template({
                "id": "BN0oOrVG",
                "block": "{\"statements\":[[1,[33,[\"gh-alert\"],null,[[\"message\"],[[28,[\"message\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $alert = this.$('.gh-alert');

            this.set('message.type', 'success');
            (0, _chai.expect)($alert.hasClass('gh-alert-green'), 'success class isn\'t green').to.be.true;

            this.set('message.type', 'error');
            (0, _chai.expect)($alert.hasClass('gh-alert-red'), 'success class isn\'t red').to.be.true;

            this.set('message.type', 'warn');
            (0, _chai.expect)($alert.hasClass('gh-alert-blue'), 'success class isn\'t yellow').to.be.true;

            this.set('message.type', 'info');
            (0, _chai.expect)($alert.hasClass('gh-alert-blue'), 'success class isn\'t blue').to.be.true;
        });
    });
});
define('ghost-admin/tests/integration/components/gh-alerts-test', ['ember-service', 'mocha', 'ember-array/utils', 'chai', 'ember-mocha'], function (_emberService, _mocha, _utils, _chai, _emberMocha) {
    'use strict';

    var notificationsStub = _emberService.default.extend({
        alerts: (0, _utils.A)()
    }); /* jshint expr:true */


    (0, _mocha.describe)('Integration: Component: gh-alerts', function () {
        (0, _emberMocha.setupComponentTest)('gh-alerts', {
            integration: true
        });

        beforeEach(function () {
            this.register('service:notifications', notificationsStub);
            this.inject.service('notifications', { as: 'notifications' });

            this.set('notifications.alerts', [{ message: 'First', type: 'error' }, { message: 'Second', type: 'warn' }]);
        });

        (0, _mocha.it)('renders', function () {
            this.render(Ember.HTMLBars.template({
                "id": "wp8zCAzm",
                "block": "{\"statements\":[[1,[26,[\"gh-alerts\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.gh-alerts').length).to.equal(1);
            (0, _chai.expect)(this.$('.gh-alerts').children().length).to.equal(2);

            this.set('notifications.alerts', (0, _utils.A)());
            (0, _chai.expect)(this.$('.gh-alerts').children().length).to.equal(0);
        });

        (0, _mocha.it)('triggers "notify" action when message count changes', function () {
            var expectedCount = 0;

            // test double for notify action
            this.set('notify', function (count) {
                return (0, _chai.expect)(count).to.equal(expectedCount);
            });

            this.render(Ember.HTMLBars.template({
                "id": "0vW25bVT",
                "block": "{\"statements\":[[1,[33,[\"gh-alerts\"],null,[[\"notify\"],[[33,[\"action\"],[[28,[null]],[28,[\"notify\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            expectedCount = 3;
            this.get('notifications.alerts').pushObject({ message: 'Third', type: 'success' });

            expectedCount = 0;
            this.set('notifications.alerts', (0, _utils.A)());
        });
    });
});
define('ghost-admin/tests/integration/components/gh-basic-dropdown-test', ['jquery', 'ember-runloop', 'ghost-admin/tests/helpers/ember-basic-dropdown', 'mocha', 'chai', 'ember-native-dom-helpers', 'ember-mocha'], function (_jquery, _emberRunloop, _emberBasicDropdown, _mocha, _chai, _emberNativeDomHelpers, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-basic-dropdown', function () {
        (0, _emberMocha.setupComponentTest)('gh-basic-dropdown', {
            integration: true
        });

        (0, _mocha.it)('closes when dropdown service fires close event', function () {
            var dropdownService = this.container.lookup('service:dropdown');

            this.render(Ember.HTMLBars.template({
                "id": "wYioJxzI",
                "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-basic-dropdown\"],null,null,{\"statements\":[[0,\"                \"],[11,\"button\",[]],[15,\"class\",\"ember-basic-dropdown-trigger\"],[16,\"onclick\",[28,[\"dropdown\",\"actions\",\"toggle\"]],null],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"dropdown\",\"isOpen\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"id\",\"dropdown-is-opened\"],[13],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"dropdown\"]},null],[0,\"        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberBasicDropdown.clickTrigger)();
            (0, _chai.expect)((0, _jquery.default)((0, _emberNativeDomHelpers.find)('#dropdown-is-opened'))).to.exist;

            (0, _emberRunloop.default)(function () {
                dropdownService.closeDropdowns();
            });

            (0, _chai.expect)((0, _jquery.default)((0, _emberNativeDomHelpers.find)('#dropdown-is-opened'))).to.not.exist;
        });
    });
});
define('ghost-admin/tests/integration/components/gh-cm-editor-test', ['jquery', 'ember-test-helpers/wait', 'ember-native-dom-helpers', 'mocha', 'chai', 'ember-mocha'], function (_jquery, _wait, _emberNativeDomHelpers, _mocha, _chai, _emberMocha) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    // NOTE: If the browser window is not focused/visible CodeMirror (or Chrome?) will
    // take longer to respond to/fire events so it's possible that some of these tests
    // will take 1-3 seconds

    (0, _mocha.describe)('Integration: Component: gh-cm-editor', function () {
        (0, _emberMocha.setupComponentTest)('gh-cm-editor', {
            integration: true
        });

        (0, _mocha.it)('handles change event', function () {
            var _this = this;

            this.set('text', '');

            this.render(Ember.HTMLBars.template({
                "id": "6rFAdWfy",
                "block": "{\"statements\":[[1,[33,[\"gh-cm-editor\"],[[28,[\"text\"]]],[[\"class\",\"update\"],[\"gh-input\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"text\"]]],null]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            // access CodeMirror directly as it doesn't pick up changes to the textarea
            var cm = (0, _emberNativeDomHelpers.find)('.gh-input .CodeMirror').CodeMirror;
            cm.setValue('Testing');

            return (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this.get('text'), 'text value after CM editor change').to.equal('Testing');
            });
        });

        (0, _mocha.it)('handles focus event', function (done) {
            // CodeMirror's events are triggered outside of anything we can watch for
            // in the tests so let's run the class check when we know the event has
            // been fired and timeout if it's not fired as we expect
            var onFocus = function onFocus() {
                // wait for runloop to finish so that the new class has been rendered
                (0, _wait.default)().then(function () {
                    (0, _chai.expect)((0, _jquery.default)((0, _emberNativeDomHelpers.find)('.gh-input')).hasClass('focus'), 'has focused class on first render with autofocus').to.be.true;

                    done();
                });
            };

            this.set('onFocus', onFocus);
            this.set('text', '');

            this.render(Ember.HTMLBars.template({
                "id": "W6KiQT38",
                "block": "{\"statements\":[[1,[33,[\"gh-cm-editor\"],[[28,[\"text\"]]],[[\"class\",\"update\",\"focus-in\"],[\"gh-input\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"text\"]]],null]],null],[33,[\"action\"],[[28,[null]],[28,[\"onFocus\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            // CodeMirror polls the input for changes every 100ms
            (0, _emberNativeDomHelpers.click)('textarea');
            (0, _emberNativeDomHelpers.triggerEvent)('textarea', 'focus');
        });

        (0, _mocha.it)('handles blur event', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            this.set('text', '');
                            this.render(Ember.HTMLBars.template({
                                "id": "6rFAdWfy",
                                "block": "{\"statements\":[[1,[33,[\"gh-cm-editor\"],[[28,[\"text\"]]],[[\"class\",\"update\"],[\"gh-input\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"text\"]]],null]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                "meta": {}
                            }));

                            (0, _chai.expect)((0, _jquery.default)((0, _emberNativeDomHelpers.find)('.gh-input')).hasClass('focus')).to.be.false;

                            _context.next = 5;
                            return (0, _emberNativeDomHelpers.click)('textarea');

                        case 5:
                            _context.next = 7;
                            return (0, _emberNativeDomHelpers.triggerEvent)('textarea', 'focus');

                        case 7:

                            (0, _chai.expect)((0, _jquery.default)((0, _emberNativeDomHelpers.find)('.gh-input')).hasClass('focus')).to.be.true;

                            _context.next = 10;
                            return (0, _emberNativeDomHelpers.triggerEvent)('textarea', 'blur');

                        case 10:

                            (0, _chai.expect)((0, _jquery.default)((0, _emberNativeDomHelpers.find)('.gh-input')).hasClass('focus')).to.be.false;

                        case 11:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('can autofocus', function (done) {
            var _this2 = this;

            // CodeMirror's events are triggered outside of anything we can watch for
            // in the tests so let's run the class check when we know the event has
            // been fired and timeout if it's not fired as we expect
            var onFocus = function onFocus() {
                // wait for runloop to finish so that the new class has been rendered
                (0, _wait.default)().then(function () {
                    (0, _chai.expect)(_this2.$('.gh-input').hasClass('focus'), 'has focused class on first render with autofocus').to.be.true;

                    done();
                });
            };

            this.set('onFocus', onFocus);
            this.set('text', '');

            this.render(Ember.HTMLBars.template({
                "id": "0njkUIRQ",
                "block": "{\"statements\":[[1,[33,[\"gh-cm-editor\"],[[28,[\"text\"]]],[[\"class\",\"update\",\"autofocus\",\"focus-in\"],[\"gh-input\",[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"text\"]]],null]],null],true,[33,[\"action\"],[[28,[null]],[28,[\"onFocus\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
        });
    });
});
define('ghost-admin/tests/integration/components/gh-date-time-picker-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-date-time-picker', function () {
        (0, _emberMocha.setupComponentTest)('gh-date-time-picker', {
            integration: true
        });

        _mocha.it.skip('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#gh-date-time-picker}}
            //     template content
            //   {{/gh-date-time-picker}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "n+2sVrsV",
                "block": "{\"statements\":[[1,[26,[\"gh-date-time-picker\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-download-count-test', ['pretender', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _wait, _mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-download-count', function () {
        (0, _emberMocha.setupComponentTest)('gh-download-count', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
            server.get('https://count.ghost.org/', function () {
                return [200, {}, JSON.stringify({ count: 42 })];
            });
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('hits count endpoint and renders', function () {
            var _this = this;

            this.render(Ember.HTMLBars.template({
                "id": "N+06LmUW",
                "block": "{\"statements\":[[1,[26,[\"gh-download-count\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            return (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this.$().text().trim()).to.equal('42');
            });
        });

        (0, _mocha.it)('renders with a block', function () {
            var _this2 = this;

            this.render(Ember.HTMLBars.template({
                "id": "TaV+2Uj7",
                "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-download-count\"],null,null,{\"statements\":[[0,\"                \"],[1,[28,[\"count\"]],false],[0,\" downloads\\n\"]],\"locals\":[\"count\"]},null],[0,\"        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            return (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this2.$().text().trim()).to.equal('42 downloads');
            });
        });
    });
});
define('ghost-admin/tests/integration/components/gh-editor-post-status-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-editor-post-status', function () {
        (0, _emberMocha.setupComponentTest)('gh-editor-post-status', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#gh-editor-post-status}}
            //     template content
            //   {{/gh-editor-post-status}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "H3fwill+",
                "block": "{\"statements\":[[1,[26,[\"gh-editor-post-status\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-feature-flag-test', ['ember-service', 'mocha', 'chai', 'ember-mocha'], function (_emberService, _mocha, _chai, _emberMocha) {
    'use strict';

    var featureStub = _emberService.default.extend({
        testFlag: true
    });

    (0, _mocha.describe)('Integration: Component: gh-feature-flag', function () {
        (0, _emberMocha.setupComponentTest)('gh-feature-flag', {
            integration: true
        });

        beforeEach(function () {
            this.register('service:feature', featureStub);
            this.inject.service('feature', { as: 'feature' });
        });

        (0, _mocha.it)('renders properties correctly', function () {
            this.render(Ember.HTMLBars.template({
                "id": "jE+fvCAr",
                "block": "{\"statements\":[[1,[33,[\"gh-feature-flag\"],[\"testFlag\"],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
            (0, _chai.expect)(this.$('label').attr('for')).to.equal(this.$('input[type="checkbox"]').attr('id'));
        });

        (0, _mocha.it)('renders correctly when flag is set to true', function () {
            this.render(Ember.HTMLBars.template({
                "id": "jE+fvCAr",
                "block": "{\"statements\":[[1,[33,[\"gh-feature-flag\"],[\"testFlag\"],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
            (0, _chai.expect)(this.$('label input[type="checkbox"]').prop('checked')).to.be.true;
        });

        (0, _mocha.it)('renders correctly when flag is set to false', function () {
            this.set('feature.testFlag', false);

            this.render(Ember.HTMLBars.template({
                "id": "jE+fvCAr",
                "block": "{\"statements\":[[1,[33,[\"gh-feature-flag\"],[\"testFlag\"],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);

            (0, _chai.expect)(this.$('label input[type="checkbox"]').prop('checked')).to.be.false;
        });

        (0, _mocha.it)('updates to reflect changes in flag property', function () {
            this.render(Ember.HTMLBars.template({
                "id": "jE+fvCAr",
                "block": "{\"statements\":[[1,[33,[\"gh-feature-flag\"],[\"testFlag\"],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);

            (0, _chai.expect)(this.$('label input[type="checkbox"]').prop('checked')).to.be.true;

            this.$('label').click();

            (0, _chai.expect)(this.$('label input[type="checkbox"]').prop('checked')).to.be.false;
        });
    });
});
define('ghost-admin/tests/integration/components/gh-file-uploader-test', ['jquery', 'pretender', 'ember-service', 'ember-runloop', 'sinon', 'ember-test-helpers/wait', 'ghost-admin/services/ajax', 'ghost-admin/tests/helpers/file-upload', 'mocha', 'chai', 'ember-mocha'], function (_jquery, _pretender, _emberService, _emberRunloop, _sinon, _wait, _ajax, _fileUpload, _mocha, _chai, _emberMocha) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var notificationsStub = _emberService.default.extend({
        showAPIError: function showAPIError() {
            // noop - to be stubbed
        }
    });

    var stubSuccessfulUpload = function stubSuccessfulUpload(server) {
        var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        server.post('/ghost/api/v0.1/uploads/', function () {
            return [200, { 'Content-Type': 'application/json' }, '"/content/images/test.png"'];
        }, delay);
    };

    var stubFailedUpload = function stubFailedUpload(server, code, error) {
        var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        server.post('/ghost/api/v0.1/uploads/', function () {
            return [code, { 'Content-Type': 'application/json' }, JSON.stringify({
                errors: [{
                    errorType: error,
                    message: 'Error: ' + error
                }]
            })];
        }, delay);
    };

    (0, _mocha.describe)('Integration: Component: gh-file-uploader', function () {
        (0, _emberMocha.setupComponentTest)('gh-file-uploader', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
            this.set('uploadUrl', '/ghost/api/v0.1/uploads/');

            this.register('service:notifications', notificationsStub);
            this.inject.service('notifications', { as: 'notifications' });
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('renders', function () {
            this.render(Ember.HTMLBars.template({
                "id": "Ml4dIAFN",
                "block": "{\"statements\":[[1,[26,[\"gh-file-uploader\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('label').text().trim(), 'default label').to.equal('Select or drag-and-drop a file');
        });

        (0, _mocha.it)('allows file input "accept" attribute to be changed', function () {
            this.render(Ember.HTMLBars.template({
                "id": "Ml4dIAFN",
                "block": "{\"statements\":[[1,[26,[\"gh-file-uploader\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('input[type="file"]').attr('accept'), 'default "accept" attribute').to.equal('text/csv');

            this.render(Ember.HTMLBars.template({
                "id": "JjlzM5B4",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"accept\"],[\"application/zip\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('input[type="file"]').attr('accept'), 'specified "accept" attribute').to.equal('application/zip');
        });

        (0, _mocha.it)('renders form with supplied label text', function () {
            this.set('labelText', 'My label');
            this.render(Ember.HTMLBars.template({
                "id": "tHEDGh5o",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"labelText\"],[[28,[\"labelText\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('label').text().trim(), 'label').to.equal('My label');
        });

        (0, _mocha.it)('generates request to supplied endpoint', function (done) {
            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "/S+DINJP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\"],[[28,[\"uploadUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(server.handledRequests.length).to.equal(1);
                (0, _chai.expect)(server.handledRequests[0].url).to.equal('/ghost/api/v0.1/uploads/');
                done();
            });
        });

        (0, _mocha.it)('fires uploadSuccess action on successful upload', function (done) {
            var uploadSuccess = _sinon.default.spy();
            this.set('uploadSuccess', uploadSuccess);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "FBdXvgdr",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadSuccess\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadSuccess.calledOnce).to.be.true;
                (0, _chai.expect)(uploadSuccess.firstCall.args[0]).to.equal('/content/images/test.png');
                done();
            });
        });

        (0, _mocha.it)('doesn\'t fire uploadSuccess action on failed upload', function (done) {
            var uploadSuccess = _sinon.default.spy();
            this.set('uploadSuccess', uploadSuccess);

            stubFailedUpload(server, 500);

            this.render(Ember.HTMLBars.template({
                "id": "FBdXvgdr",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadSuccess\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadSuccess.calledOnce).to.be.false;
                done();
            });
        });

        (0, _mocha.it)('fires fileSelected action on file selection', function (done) {
            var fileSelected = _sinon.default.spy();
            this.set('fileSelected', fileSelected);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "KSqLEisv",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"fileSelected\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"fileSelected\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(fileSelected.calledOnce).to.be.true;
                (0, _chai.expect)(fileSelected.args[0]).to.not.be.blank;
                done();
            });
        });

        (0, _mocha.it)('fires uploadStarted action on upload start', function (done) {
            var uploadStarted = _sinon.default.spy();
            this.set('uploadStarted', uploadStarted);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "kKVQDhH6",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadStarted\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadStarted\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadStarted.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('fires uploadFinished action on successful upload', function (done) {
            var uploadFinished = _sinon.default.spy();
            this.set('uploadFinished', uploadFinished);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "8hJJJz7n",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadFinished\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadFinished\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadFinished.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('fires uploadFinished action on failed upload', function (done) {
            var uploadFinished = _sinon.default.spy();
            this.set('uploadFinished', uploadFinished);

            stubFailedUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "8hJJJz7n",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadFinished\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadFinished\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadFinished.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('displays invalid file type error', function (done) {
            var _this = this;

            stubFailedUpload(server, 415, 'UnsupportedMediaTypeError');
            this.render(Ember.HTMLBars.template({
                "id": "/S+DINJP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\"],[[28,[\"uploadUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this.$('.failed').text()).to.match(/The file type you uploaded is not supported/);
                (0, _chai.expect)(_this.$('.gh-btn-green').length, 'reset button is displayed').to.equal(1);
                (0, _chai.expect)(_this.$('.gh-btn-green').text()).to.equal('Try Again');
                done();
            });
        });

        (0, _mocha.it)('displays file too large for server error', function (done) {
            var _this2 = this;

            stubFailedUpload(server, 413, 'RequestEntityTooLargeError');
            this.render(Ember.HTMLBars.template({
                "id": "/S+DINJP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\"],[[28,[\"uploadUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this2.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this2.$('.failed').text()).to.match(/The file you uploaded was larger/);
                done();
            });
        });

        (0, _mocha.it)('handles file too large error directly from the web server', function (done) {
            var _this3 = this;

            server.post('/ghost/api/v0.1/uploads/', function () {
                return [413, {}, ''];
            });
            this.render(Ember.HTMLBars.template({
                "id": "/S+DINJP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\"],[[28,[\"uploadUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this3.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this3.$('.failed').text()).to.match(/The file you uploaded was larger/);
                done();
            });
        });

        (0, _mocha.it)('displays other server-side error with message', function (done) {
            var _this4 = this;

            stubFailedUpload(server, 400, 'UnknownError');
            this.render(Ember.HTMLBars.template({
                "id": "/S+DINJP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\"],[[28,[\"uploadUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this4.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this4.$('.failed').text()).to.match(/Error: UnknownError/);
                done();
            });
        });

        (0, _mocha.it)('handles unknown failure', function (done) {
            var _this5 = this;

            server.post('/ghost/api/v0.1/uploads/', function () {
                return [500, { 'Content-Type': 'application/json' }, ''];
            });
            this.render(Ember.HTMLBars.template({
                "id": "/S+DINJP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\"],[[28,[\"uploadUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this5.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this5.$('.failed').text()).to.match(/Something went wrong/);
                done();
            });
        });

        (0, _mocha.it)('triggers notifications.showAPIError for VersionMismatchError', function (done) {
            var showAPIError = _sinon.default.spy();
            this.set('notifications.showAPIError', showAPIError);

            stubFailedUpload(server, 400, 'VersionMismatchError');

            this.render(Ember.HTMLBars.template({
                "id": "/S+DINJP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\"],[[28,[\"uploadUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(showAPIError.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('doesn\'t trigger notifications.showAPIError for other errors', function (done) {
            var showAPIError = _sinon.default.spy();
            this.set('notifications.showAPIError', showAPIError);

            stubFailedUpload(server, 400, 'UnknownError');
            this.render(Ember.HTMLBars.template({
                "id": "/S+DINJP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\"],[[28,[\"uploadUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(showAPIError.called).to.be.false;
                done();
            });
        });

        (0, _mocha.it)('can be reset after a failed upload', function (done) {
            var _this6 = this;

            stubFailedUpload(server, 400, 'UnknownError');
            this.render(Ember.HTMLBars.template({
                "id": "/S+DINJP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\"],[[28,[\"uploadUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _emberRunloop.default)(function () {
                    _this6.$('.gh-btn-green').click();
                });
            });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this6.$('input[type="file"]').length).to.equal(1);
                done();
            });
        });

        (0, _mocha.it)('displays upload progress', function (done) {
            this.set('done', done);

            // pretender fires a progress event every 50ms
            stubSuccessfulUpload(server, 150);

            this.render(Ember.HTMLBars.template({
                "id": "AW7kpogr",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadFinished\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"done\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            // after 75ms we should have had one progress event
            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('.progress .bar').length).to.equal(1);

                var _$$attr$match = this.$('.progress .bar').attr('style').match(/width: (\d+)%?/),
                    _$$attr$match2 = _slicedToArray(_$$attr$match, 2),
                    percentageWidth = _$$attr$match2[1];

                (0, _chai.expect)(percentageWidth).to.be.above(0);
                (0, _chai.expect)(percentageWidth).to.be.below(100);
            }, 75);
        });

        (0, _mocha.it)('handles drag over/leave', function () {
            var _this7 = this;

            this.render(Ember.HTMLBars.template({
                "id": "Ml4dIAFN",
                "block": "{\"statements\":[[1,[26,[\"gh-file-uploader\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                // eslint-disable-next-line new-cap
                var dragover = _jquery.default.Event('dragover', {
                    dataTransfer: {
                        files: []
                    }
                });
                _this7.$('.gh-image-uploader').trigger(dragover);
            });

            (0, _chai.expect)(this.$('.gh-image-uploader').hasClass('-drag-over'), 'has drag-over class').to.be.true;

            (0, _emberRunloop.default)(function () {
                _this7.$('.gh-image-uploader').trigger('dragleave');
            });

            (0, _chai.expect)(this.$('.gh-image-uploader').hasClass('-drag-over'), 'has drag-over class').to.be.false;
        });

        (0, _mocha.it)('triggers file upload on file drop', function (done) {
            var _this8 = this;

            var uploadSuccess = _sinon.default.spy();
            // eslint-disable-next-line new-cap
            var drop = _jquery.default.Event('drop', {
                dataTransfer: {
                    files: [(0, _fileUpload.createFile)(['test'], { name: 'test.csv' })]
                }
            });

            this.set('uploadSuccess', uploadSuccess);

            stubSuccessfulUpload(server);
            this.render(Ember.HTMLBars.template({
                "id": "FBdXvgdr",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadSuccess\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this8.$('.gh-image-uploader').trigger(drop);
            });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadSuccess.calledOnce).to.be.true;
                (0, _chai.expect)(uploadSuccess.firstCall.args[0]).to.equal('/content/images/test.png');
                done();
            });
        });

        (0, _mocha.it)('validates extension by default', function (done) {
            var _this9 = this;

            var uploadSuccess = _sinon.default.spy();
            var uploadFailed = _sinon.default.spy();

            this.set('uploadSuccess', uploadSuccess);
            this.set('uploadFailed', uploadFailed);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "TG8DHV0t",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadSuccess\",\"uploadFailed\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"uploadFailed\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.txt' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadSuccess.called).to.be.false;
                (0, _chai.expect)(uploadFailed.calledOnce).to.be.true;
                (0, _chai.expect)(_this9.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this9.$('.failed').text()).to.match(/The file type you uploaded is not supported/);
                done();
            });
        });

        (0, _mocha.it)('uploads if validate action supplied and returns true', function (done) {
            var validate = _sinon.default.stub().returns(true);
            var uploadSuccess = _sinon.default.spy();

            this.set('validate', validate);
            this.set('uploadSuccess', uploadSuccess);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "jooue3NP",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadSuccess\",\"validate\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"validate\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(validate.calledOnce).to.be.true;
                (0, _chai.expect)(uploadSuccess.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('skips upload and displays error if validate action supplied and doesn\'t return true', function (done) {
            var _this10 = this;

            var validate = _sinon.default.stub().returns(new _ajax.UnsupportedMediaTypeError());
            var uploadSuccess = _sinon.default.spy();
            var uploadFailed = _sinon.default.spy();

            this.set('validate', validate);
            this.set('uploadSuccess', uploadSuccess);
            this.set('uploadFailed', uploadFailed);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "LJLLqPMW",
                "block": "{\"statements\":[[1,[33,[\"gh-file-uploader\"],null,[[\"url\",\"uploadSuccess\",\"uploadFailed\",\"validate\"],[[28,[\"uploadUrl\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"uploadFailed\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"validate\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.csv' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(validate.calledOnce).to.be.true;
                (0, _chai.expect)(uploadSuccess.called).to.be.false;
                (0, _chai.expect)(uploadFailed.calledOnce).to.be.true;
                (0, _chai.expect)(_this10.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this10.$('.failed').text()).to.match(/The file type you uploaded is not supported/);
                done();
            });
        });
    });
});
define('ghost-admin/tests/integration/components/gh-image-uploader-test', ['jquery', 'pretender', 'ember-service', 'ember-runloop', 'sinon', 'ember-test-selectors', 'ember-test-helpers/wait', 'ghost-admin/services/ajax', 'ghost-admin/tests/helpers/file-upload', 'mocha', 'chai', 'ember-mocha'], function (_jquery, _pretender, _emberService, _emberRunloop, _sinon, _emberTestSelectors, _wait, _ajax, _fileUpload, _mocha, _chai, _emberMocha) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var notificationsStub = _emberService.default.extend({
        showAPIError: function showAPIError() /* error, options */{
            // noop - to be stubbed
        }
    });

    var sessionStub = _emberService.default.extend({
        isAuthenticated: false,
        authorize: function authorize(authorizer, block) {
            if (this.get('isAuthenticated')) {
                block('Authorization', 'Bearer token');
            }
        }
    });

    var stubSuccessfulUpload = function stubSuccessfulUpload(server) {
        var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        server.post('/ghost/api/v0.1/uploads/', function () {
            return [200, { 'Content-Type': 'application/json' }, '"/content/images/test.png"'];
        }, delay);
    };

    var stubFailedUpload = function stubFailedUpload(server, code, error) {
        var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        server.post('/ghost/api/v0.1/uploads/', function () {
            return [code, { 'Content-Type': 'application/json' }, JSON.stringify({
                errors: [{
                    errorType: error,
                    message: 'Error: ' + error
                }]
            })];
        }, delay);
    };

    (0, _mocha.describe)('Integration: Component: gh-image-uploader', function () {
        (0, _emberMocha.setupComponentTest)('gh-image-upload', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            this.register('service:session', sessionStub);
            this.register('service:notifications', notificationsStub);
            this.inject.service('session', { as: 'sessionService' });
            this.inject.service('notifications', { as: 'notifications' });
            this.set('update', function () {});
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('renders', function () {
            this.set('image', 'http://example.com/test.png');
            this.render(Ember.HTMLBars.template({
                "id": "ptFXl1bZ",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\"],[[28,[\"image\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });

        (0, _mocha.it)('renders form with supplied alt text', function () {
            this.render(Ember.HTMLBars.template({
                "id": "cLW6hHm3",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"altText\"],[[28,[\"image\"]],\"text test\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('file-input-description')).text().trim()).to.equal('Upload image of "text test"');
        });

        (0, _mocha.it)('renders form with supplied text', function () {
            this.render(Ember.HTMLBars.template({
                "id": "RS9O1p7A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"text\"],[[28,[\"image\"]],\"text test\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('file-input-description')).text().trim()).to.equal('text test');
        });

        (0, _mocha.it)('generates request to correct endpoint', function (done) {
            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(server.handledRequests.length).to.equal(1);
                (0, _chai.expect)(server.handledRequests[0].url).to.equal('/ghost/api/v0.1/uploads/');
                (0, _chai.expect)(server.handledRequests[0].requestHeaders.Authorization).to.be.undefined;
                done();
            });
        });

        (0, _mocha.it)('adds authentication headers to request', function (done) {
            stubSuccessfulUpload(server);

            this.get('sessionService').set('isAuthenticated', true);

            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                var _server$handledReques = _slicedToArray(server.handledRequests, 1),
                    request = _server$handledReques[0];

                (0, _chai.expect)(request.requestHeaders.Authorization).to.equal('Bearer token');
                done();
            });
        });

        (0, _mocha.it)('fires update action on successful upload', function (done) {
            var update = _sinon.default.spy();
            this.set('update', update);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(update.calledOnce).to.be.true;
                (0, _chai.expect)(update.firstCall.args[0]).to.equal('/content/images/test.png');
                done();
            });
        });

        (0, _mocha.it)('doesn\'t fire update action on failed upload', function (done) {
            var update = _sinon.default.spy();
            this.set('update', update);

            stubFailedUpload(server, 500);

            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(update.calledOnce).to.be.false;
                done();
            });
        });

        (0, _mocha.it)('fires fileSelected action on file selection', function (done) {
            var fileSelected = _sinon.default.spy();
            this.set('fileSelected', fileSelected);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "d+Ea5ubb",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"fileSelected\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"fileSelected\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(fileSelected.calledOnce).to.be.true;
                (0, _chai.expect)(fileSelected.args[0]).to.not.be.blank;
                done();
            });
        });

        (0, _mocha.it)('fires uploadStarted action on upload start', function (done) {
            var uploadStarted = _sinon.default.spy();
            this.set('uploadStarted', uploadStarted);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "h38IxbNu",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"uploadStarted\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadStarted\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadStarted.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('fires uploadFinished action on successful upload', function (done) {
            var uploadFinished = _sinon.default.spy();
            this.set('uploadFinished', uploadFinished);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "OyLazG2m",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"uploadFinished\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadFinished\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadFinished.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('fires uploadFinished action on failed upload', function (done) {
            var uploadFinished = _sinon.default.spy();
            this.set('uploadFinished', uploadFinished);

            stubFailedUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "OyLazG2m",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"uploadFinished\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadFinished\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadFinished.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('displays invalid file type error', function (done) {
            var _this = this;

            stubFailedUpload(server, 415, 'UnsupportedMediaTypeError');
            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this.$('.failed').text()).to.match(/The image type you uploaded is not supported/);
                (0, _chai.expect)(_this.$('.gh-btn-green').length, 'reset button is displayed').to.equal(1);
                (0, _chai.expect)(_this.$('.gh-btn-green').text()).to.equal('Try Again');
                done();
            });
        });

        (0, _mocha.it)('displays file too large for server error', function (done) {
            var _this2 = this;

            stubFailedUpload(server, 413, 'RequestEntityTooLargeError');
            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this2.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this2.$('.failed').text()).to.match(/The image you uploaded was larger/);
                done();
            });
        });

        (0, _mocha.it)('handles file too large error directly from the web server', function (done) {
            var _this3 = this;

            server.post('/ghost/api/v0.1/uploads/', function () {
                return [413, {}, ''];
            });
            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this3.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this3.$('.failed').text()).to.match(/The image you uploaded was larger/);
                done();
            });
        });

        (0, _mocha.it)('displays other server-side error with message', function (done) {
            var _this4 = this;

            stubFailedUpload(server, 400, 'UnknownError');
            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this4.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this4.$('.failed').text()).to.match(/Error: UnknownError/);
                done();
            });
        });

        (0, _mocha.it)('handles unknown failure', function (done) {
            var _this5 = this;

            server.post('/ghost/api/v0.1/uploads/', function () {
                return [500, { 'Content-Type': 'application/json' }, ''];
            });
            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this5.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this5.$('.failed').text()).to.match(/Something went wrong/);
                done();
            });
        });

        (0, _mocha.it)('triggers notifications.showAPIError for VersionMismatchError', function (done) {
            var showAPIError = _sinon.default.spy();
            this.set('notifications.showAPIError', showAPIError);

            stubFailedUpload(server, 400, 'VersionMismatchError');

            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(showAPIError.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('doesn\'t trigger notifications.showAPIError for other errors', function (done) {
            var showAPIError = _sinon.default.spy();
            this.set('notifications.showAPIError', showAPIError);

            stubFailedUpload(server, 400, 'UnknownError');
            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(showAPIError.called).to.be.false;
                done();
            });
        });

        (0, _mocha.it)('can be reset after a failed upload', function (done) {
            var _this6 = this;

            stubFailedUpload(server, 400, 'UnknownError');
            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { type: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _emberRunloop.default)(function () {
                    _this6.$('.gh-btn-green').click();
                });
            });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this6.$('input[type="file"]').length).to.equal(1);
                done();
            });
        });

        (0, _mocha.it)('displays upload progress', function (done) {
            this.set('done', done);

            // pretender fires a progress event every 50ms
            stubSuccessfulUpload(server, 150);

            this.render(Ember.HTMLBars.template({
                "id": "EQVS5QB6",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"uploadFinished\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"done\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            // after 75ms we should have had one progress event
            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('.progress .bar').length).to.equal(1);

                var _$$attr$match = this.$('.progress .bar').attr('style').match(/width: (\d+)%?/),
                    _$$attr$match2 = _slicedToArray(_$$attr$match, 2),
                    percentageWidth = _$$attr$match2[1];

                (0, _chai.expect)(percentageWidth).to.be.above(0);
                (0, _chai.expect)(percentageWidth).to.be.below(100);
            }, 75);
        });

        (0, _mocha.it)('handles drag over/leave', function () {
            var _this7 = this;

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "t2wcVQ8A",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"image\",\"update\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                // eslint-disable-next-line new-cap
                var dragover = _jquery.default.Event('dragover', {
                    dataTransfer: {
                        files: []
                    }
                });
                _this7.$('.gh-image-uploader').trigger(dragover);
            });

            (0, _chai.expect)(this.$('.gh-image-uploader').hasClass('-drag-over'), 'has drag-over class').to.be.true;

            (0, _emberRunloop.default)(function () {
                _this7.$('.gh-image-uploader').trigger('dragleave');
            });

            (0, _chai.expect)(this.$('.gh-image-uploader').hasClass('-drag-over'), 'has drag-over class').to.be.false;
        });

        (0, _mocha.it)('triggers file upload on file drop', function (done) {
            var _this8 = this;

            var uploadSuccess = _sinon.default.spy();
            // eslint-disable-next-line new-cap
            var drop = _jquery.default.Event('drop', {
                dataTransfer: {
                    files: [(0, _fileUpload.createFile)(['test'], { name: 'test.png' })]
                }
            });

            this.set('uploadSuccess', uploadSuccess);

            stubSuccessfulUpload(server);
            this.render(Ember.HTMLBars.template({
                "id": "0tH089tD",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"uploadSuccess\"],[[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this8.$('.gh-image-uploader').trigger(drop);
            });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadSuccess.calledOnce).to.be.true;
                (0, _chai.expect)(uploadSuccess.firstCall.args[0]).to.equal('/content/images/test.png');
                done();
            });
        });

        (0, _mocha.it)('validates extension by default', function (done) {
            var _this9 = this;

            var uploadSuccess = _sinon.default.spy();
            var uploadFailed = _sinon.default.spy();

            this.set('uploadSuccess', uploadSuccess);
            this.set('uploadFailed', uploadFailed);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "LHpddoCz",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"uploadSuccess\",\"uploadFailed\"],[[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"uploadFailed\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.json' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(uploadSuccess.called).to.be.false;
                (0, _chai.expect)(uploadFailed.calledOnce).to.be.true;
                (0, _chai.expect)(_this9.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this9.$('.failed').text()).to.match(/The image type you uploaded is not supported/);
                done();
            });
        });

        (0, _mocha.it)('uploads if validate action supplied and returns true', function (done) {
            var validate = _sinon.default.stub().returns(true);
            var uploadSuccess = _sinon.default.spy();

            this.set('validate', validate);
            this.set('uploadSuccess', uploadSuccess);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "Dn+Mp5Xc",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"uploadSuccess\",\"validate\"],[[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"validate\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.txt' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(validate.calledOnce).to.be.true;
                (0, _chai.expect)(uploadSuccess.calledOnce).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('skips upload and displays error if validate action supplied and doesn\'t return true', function (done) {
            var _this10 = this;

            var validate = _sinon.default.stub().returns(new _ajax.UnsupportedMediaTypeError());
            var uploadSuccess = _sinon.default.spy();
            var uploadFailed = _sinon.default.spy();

            this.set('validate', validate);
            this.set('uploadSuccess', uploadSuccess);
            this.set('uploadFailed', uploadFailed);

            stubSuccessfulUpload(server);

            this.render(Ember.HTMLBars.template({
                "id": "IweO1TPt",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader\"],null,[[\"uploadSuccess\",\"uploadFailed\",\"validate\"],[[33,[\"action\"],[[28,[null]],[28,[\"uploadSuccess\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"uploadFailed\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"validate\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _fileUpload.fileUpload)(this.$('input[type="file"]'), ['test'], { name: 'test.png' });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(validate.calledOnce).to.be.true;
                (0, _chai.expect)(uploadSuccess.called).to.be.false;
                (0, _chai.expect)(uploadFailed.calledOnce).to.be.true;
                (0, _chai.expect)(_this10.$('.failed').length, 'error message is displayed').to.equal(1);
                (0, _chai.expect)(_this10.$('.failed').text()).to.match(/The image type you uploaded is not supported/);
                done();
            });
        });
    });
});
define('ghost-admin/tests/integration/components/gh-image-uploader-with-preview-test', ['ember-runloop', 'sinon', 'mocha', 'chai', 'ember-mocha'], function (_emberRunloop, _sinon, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: gh-image-uploader-with-preview', function () {
        (0, _emberMocha.setupComponentTest)('gh-image-uploader-with-preview', {
            integration: true
        });

        (0, _mocha.it)('renders image if provided', function () {
            this.set('image', 'http://example.com/test.png');

            this.render(Ember.HTMLBars.template({
                "id": "rGev3hmF",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader-with-preview\"],null,[[\"image\"],[[28,[\"image\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('.gh-image-uploader.-with-image').length).to.equal(1);
            (0, _chai.expect)(this.$('img').attr('src')).to.equal('http://example.com/test.png');
        });

        (0, _mocha.it)('renders upload form when no image provided', function () {
            this.render(Ember.HTMLBars.template({
                "id": "rGev3hmF",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader-with-preview\"],null,[[\"image\"],[[28,[\"image\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('input[type="file"]').length).to.equal(1);
        });

        (0, _mocha.it)('triggers remove action when delete icon is clicked', function () {
            var _this = this;

            var remove = _sinon.default.spy();
            this.set('remove', remove);
            this.set('image', 'http://example.com/test.png');

            this.render(Ember.HTMLBars.template({
                "id": "ua41nMtw",
                "block": "{\"statements\":[[1,[33,[\"gh-image-uploader-with-preview\"],null,[[\"image\",\"remove\"],[[28,[\"image\"]],[33,[\"action\"],[[28,[null]],[28,[\"remove\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _emberRunloop.default)(function () {
                _this.$('.image-cancel').click();
            });

            (0, _chai.expect)(remove.calledOnce).to.be.true;
        });
    });
});
define('ghost-admin/tests/integration/components/gh-markdown-editor-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-markdown-editor', function () {
        (0, _emberMocha.setupComponentTest)('gh-markdown-editor', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#gh-markdown-editor}}
            //     template content
            //   {{/gh-markdown-editor}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "y8xsJX8N",
                "block": "{\"statements\":[[1,[26,[\"gh-markdown-editor\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-navigation-test', ['jquery', 'ghost-admin/models/navigation-item', 'ember-runloop', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha'], function (_jquery, _navigationItem, _emberRunloop, _wait, _mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-navigation', function () {
        (0, _emberMocha.setupComponentTest)('gh-navigation', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            this.render(Ember.HTMLBars.template({
                "id": "NhZ7nZG6",
                "block": "{\"statements\":[[6,[\"gh-navigation\"],null,null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"js-gh-blognav\"],[13],[11,\"div\",[]],[15,\"class\",\"gh-blognav-item\"],[13],[14],[14]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('section.gh-view')).to.have.length(1);
            (0, _chai.expect)(this.$('.ui-sortable')).to.have.length(1);
        });

        (0, _mocha.it)('triggers reorder action', function () {
            var _this = this;

            var navItems = [];
            var expectedOldIndex = -1;
            var expectedNewIndex = -1;

            navItems.pushObject(_navigationItem.default.create({ label: 'First', url: '/first' }));
            navItems.pushObject(_navigationItem.default.create({ label: 'Second', url: '/second' }));
            navItems.pushObject(_navigationItem.default.create({ label: 'Third', url: '/third' }));
            navItems.pushObject(_navigationItem.default.create({ label: '', url: '', last: true }));
            this.set('navigationItems', navItems);
            this.set('blogUrl', 'http://localhost:2368');

            this.on('moveItem', function (oldIndex, newIndex) {
                (0, _chai.expect)(oldIndex).to.equal(expectedOldIndex);
                (0, _chai.expect)(newIndex).to.equal(expectedNewIndex);
            });

            (0, _emberRunloop.default)(function () {
                _this.render(Ember.HTMLBars.template({
                    "id": "gpKcB6M6",
                    "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-navigation\"],null,[[\"moveItem\"],[\"moveItem\"]],{\"statements\":[[0,\"                \"],[11,\"form\",[]],[15,\"id\",\"settings-navigation\"],[15,\"class\",\"gh-blognav js-gh-blognav\"],[15,\"novalidate\",\"novalidate\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"navigationItems\"]]],null,{\"statements\":[[0,\"                        \"],[1,[33,[\"gh-navitem\"],null,[[\"navItem\",\"baseUrl\",\"addItem\",\"deleteItem\",\"updateUrl\"],[[28,[\"navItem\"]],[28,[\"blogUrl\"]],\"addItem\",\"deleteItem\",\"updateUrl\"]]],false],[0,\"\\n\"]],\"locals\":[\"navItem\"]},null],[0,\"                \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                    "meta": {}
                }));
            });

            // check it renders the nav item rows
            (0, _chai.expect)(this.$('.gh-blognav-item')).to.have.length(4);

            // move second item up one
            expectedOldIndex = 1;
            expectedNewIndex = 0;
            (0, _emberRunloop.default)(function () {
                (0, _jquery.default)(_this.$('.gh-blognav-item')[1]).simulateDragSortable({
                    move: -1,
                    handle: '.gh-blognav-grab'
                });
            });

            (0, _wait.default)().then(function () {
                // move second item down one
                expectedOldIndex = 1;
                expectedNewIndex = 2;
                (0, _emberRunloop.default)(function () {
                    (0, _jquery.default)(_this.$('.gh-blognav-item')[1]).simulateDragSortable({
                        move: 1,
                        handle: '.gh-blognav-grab'
                    });
                });
            });
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/integration/components/gh-navitem-test', ['ghost-admin/models/navigation-item', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha'], function (_navigationItem, _wait, _mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-navitem', function () {
        (0, _emberMocha.setupComponentTest)('gh-navitem', {
            integration: true
        });

        beforeEach(function () {
            this.set('baseUrl', 'http://localhost:2368');
        });

        (0, _mocha.it)('renders', function () {
            this.set('navItem', _navigationItem.default.create({ label: 'Test', url: '/url' }));

            this.render(Ember.HTMLBars.template({
                "id": "5PN7fJen",
                "block": "{\"statements\":[[1,[33,[\"gh-navitem\"],null,[[\"navItem\",\"baseUrl\"],[[28,[\"navItem\"]],[28,[\"baseUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $item = this.$('.gh-blognav-item');

            (0, _chai.expect)($item.find('.gh-blognav-grab').length).to.equal(1);
            (0, _chai.expect)($item.find('.gh-blognav-label').length).to.equal(1);
            (0, _chai.expect)($item.find('.gh-blognav-url').length).to.equal(1);
            (0, _chai.expect)($item.find('.gh-blognav-delete').length).to.equal(1);

            // doesn't show any errors
            (0, _chai.expect)($item.hasClass('gh-blognav-item--error')).to.be.false;
            (0, _chai.expect)($item.find('.error').length).to.equal(0);
            (0, _chai.expect)($item.find('.response:visible').length).to.equal(0);
        });

        (0, _mocha.it)('doesn\'t show drag handle for new items', function () {
            this.set('navItem', _navigationItem.default.create({ label: 'Test', url: '/url', isNew: true }));

            this.render(Ember.HTMLBars.template({
                "id": "5PN7fJen",
                "block": "{\"statements\":[[1,[33,[\"gh-navitem\"],null,[[\"navItem\",\"baseUrl\"],[[28,[\"navItem\"]],[28,[\"baseUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $item = this.$('.gh-blognav-item');

            (0, _chai.expect)($item.find('.gh-blognav-grab').length).to.equal(0);
        });

        (0, _mocha.it)('shows add button for new items', function () {
            this.set('navItem', _navigationItem.default.create({ label: 'Test', url: '/url', isNew: true }));

            this.render(Ember.HTMLBars.template({
                "id": "5PN7fJen",
                "block": "{\"statements\":[[1,[33,[\"gh-navitem\"],null,[[\"navItem\",\"baseUrl\"],[[28,[\"navItem\"]],[28,[\"baseUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $item = this.$('.gh-blognav-item');

            (0, _chai.expect)($item.find('.gh-blognav-add').length).to.equal(1);
            (0, _chai.expect)($item.find('.gh-blognav-delete').length).to.equal(0);
        });

        (0, _mocha.it)('triggers delete action', function () {
            var _this = this;

            this.set('navItem', _navigationItem.default.create({ label: 'Test', url: '/url' }));

            var deleteActionCallCount = 0;
            this.on('deleteItem', function (navItem) {
                (0, _chai.expect)(navItem).to.equal(_this.get('navItem'));
                deleteActionCallCount++;
            });

            this.render(Ember.HTMLBars.template({
                "id": "WFzGOtGw",
                "block": "{\"statements\":[[1,[33,[\"gh-navitem\"],null,[[\"navItem\",\"baseUrl\",\"deleteItem\"],[[28,[\"navItem\"]],[28,[\"baseUrl\"]],\"deleteItem\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            this.$('.gh-blognav-delete').trigger('click');

            (0, _chai.expect)(deleteActionCallCount).to.equal(1);
        });

        (0, _mocha.it)('triggers add action', function () {
            this.set('navItem', _navigationItem.default.create({ label: 'Test', url: '/url', isNew: true }));

            var addActionCallCount = 0;
            this.on('add', function () {
                addActionCallCount++;
            });

            this.render(Ember.HTMLBars.template({
                "id": "czUUY23j",
                "block": "{\"statements\":[[1,[33,[\"gh-navitem\"],null,[[\"navItem\",\"baseUrl\",\"addItem\"],[[28,[\"navItem\"]],[28,[\"baseUrl\"]],\"add\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            this.$('.gh-blognav-add').trigger('click');

            (0, _chai.expect)(addActionCallCount).to.equal(1);
        });

        (0, _mocha.it)('triggers update action', function () {
            this.set('navItem', _navigationItem.default.create({ label: 'Test', url: '/url' }));

            var updateActionCallCount = 0;
            this.on('update', function () {
                updateActionCallCount++;
            });

            this.render(Ember.HTMLBars.template({
                "id": "d2mKiVWU",
                "block": "{\"statements\":[[1,[33,[\"gh-navitem\"],null,[[\"navItem\",\"baseUrl\",\"updateUrl\"],[[28,[\"navItem\"]],[28,[\"baseUrl\"]],\"update\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            this.$('.gh-blognav-url input').trigger('blur');

            (0, _chai.expect)(updateActionCallCount).to.equal(1);
        });

        (0, _mocha.it)('displays inline errors', function () {
            this.set('navItem', _navigationItem.default.create({ label: '', url: '' }));
            this.get('navItem').validate();

            this.render(Ember.HTMLBars.template({
                "id": "5PN7fJen",
                "block": "{\"statements\":[[1,[33,[\"gh-navitem\"],null,[[\"navItem\",\"baseUrl\"],[[28,[\"navItem\"]],[28,[\"baseUrl\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $item = this.$('.gh-blognav-item');

            return (0, _wait.default)().then(function () {
                (0, _chai.expect)($item.hasClass('gh-blognav-item--error')).to.be.true;
                (0, _chai.expect)($item.find('.gh-blognav-label').hasClass('error')).to.be.true;
                (0, _chai.expect)($item.find('.gh-blognav-label .response').text().trim()).to.equal('You must specify a label');
                (0, _chai.expect)($item.find('.gh-blognav-url').hasClass('error')).to.be.true;
                (0, _chai.expect)($item.find('.gh-blognav-url .response').text().trim()).to.equal('You must specify a URL or relative path');
            });
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/integration/components/gh-navitem-url-input-test', ['ember', 'mocha', 'chai', 'ember-mocha'], function (_ember, _mocha, _chai, _emberMocha) {
    'use strict';

    var $ = _ember.default.$,
        run = _ember.default.run;


    // we want baseUrl to match the running domain so relative URLs are
    // handled as expected (browser auto-sets the domain when using a.href)
    var currentUrl = window.location.protocol + '//' + window.location.host + '/';

    (0, _mocha.describe)('Integration: Component: gh-navitem-url-input', function () {
        (0, _emberMocha.setupComponentTest)('gh-navitem-url-input', {
            integration: true
        });

        beforeEach(function () {
            // set defaults
            this.set('baseUrl', currentUrl);
            this.set('url', '');
            this.set('isNew', false);
            this.on('clearErrors', function () {
                return null;
            });
        });

        (0, _mocha.it)('renders correctly with blank url', function () {
            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            (0, _chai.expect)($input).to.have.length(1);
            (0, _chai.expect)($input.hasClass('gh-input')).to.be.true;
            (0, _chai.expect)($input.val()).to.equal(currentUrl);
        });

        (0, _mocha.it)('renders correctly with relative urls', function () {
            this.set('url', '/about');
            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            (0, _chai.expect)($input.val()).to.equal(currentUrl + 'about');

            this.set('url', '/about#contact');
            (0, _chai.expect)($input.val()).to.equal(currentUrl + 'about#contact');
        });

        (0, _mocha.it)('renders correctly with absolute urls', function () {
            this.set('url', 'https://example.com:2368/#test');
            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            (0, _chai.expect)($input.val()).to.equal('https://example.com:2368/#test');

            this.set('url', 'mailto:test@example.com');
            (0, _chai.expect)($input.val()).to.equal('mailto:test@example.com');

            this.set('url', 'tel:01234-5678-90');
            (0, _chai.expect)($input.val()).to.equal('tel:01234-5678-90');

            this.set('url', '//protocol-less-url.com');
            (0, _chai.expect)($input.val()).to.equal('//protocol-less-url.com');

            this.set('url', '#anchor');
            (0, _chai.expect)($input.val()).to.equal('#anchor');
        });

        (0, _mocha.it)('deletes base URL on backspace', function () {
            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            (0, _chai.expect)($input.val()).to.equal(currentUrl);
            run(function () {
                // TODO: why is ember's keyEvent helper not available here?
                // eslint-disable-next-line new-cap
                var e = $.Event('keydown');
                e.keyCode = 8;
                $input.trigger(e);
            });
            (0, _chai.expect)($input.val()).to.equal('');
        });

        (0, _mocha.it)('deletes base URL on delete', function () {
            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            (0, _chai.expect)($input.val()).to.equal(currentUrl);
            run(function () {
                // TODO: why is ember's keyEvent helper not available here?
                // eslint-disable-next-line new-cap
                var e = $.Event('keydown');
                e.keyCode = 46;
                $input.trigger(e);
            });
            (0, _chai.expect)($input.val()).to.equal('');
        });

        (0, _mocha.it)('adds base url to relative urls on blur', function () {
            this.on('updateUrl', function () {
                return null;
            });
            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            run(function () {
                $input.val('/about').trigger('input');
            });
            run(function () {
                $input.trigger('blur');
            });

            (0, _chai.expect)($input.val()).to.equal(currentUrl + 'about');
        });

        (0, _mocha.it)('adds "mailto:" to email addresses on blur', function () {
            this.on('updateUrl', function () {
                return null;
            });
            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            run(function () {
                $input.val('test@example.com').trigger('input');
            });
            run(function () {
                $input.trigger('blur');
            });

            (0, _chai.expect)($input.val()).to.equal('mailto:test@example.com');

            // ensure we don't double-up on the mailto:
            run(function () {
                $input.trigger('blur');
            });
            (0, _chai.expect)($input.val()).to.equal('mailto:test@example.com');
        });

        (0, _mocha.it)('doesn\'t add base url to invalid urls on blur', function () {
            this.on('updateUrl', function () {
                return null;
            });
            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            var changeValue = function changeValue(value) {
                run(function () {
                    $input.val(value).trigger('input').trigger('blur');
                });
            };

            changeValue('with spaces');
            (0, _chai.expect)($input.val()).to.equal('with spaces');

            changeValue('/with spaces');
            (0, _chai.expect)($input.val()).to.equal('/with spaces');
        });

        (0, _mocha.it)('doesn\'t mangle invalid urls on blur', function () {
            this.on('updateUrl', function () {
                return null;
            });
            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            run(function () {
                $input.val(currentUrl + ' /test').trigger('input').trigger('blur');
            });

            (0, _chai.expect)($input.val()).to.equal(currentUrl + ' /test');
        });

        (0, _mocha.it)('triggers "change" action on blur', function () {
            var changeActionCallCount = 0;
            this.on('updateUrl', function () {
                changeActionCallCount++;
            });

            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            $input.trigger('blur');

            (0, _chai.expect)(changeActionCallCount).to.equal(1);
        });

        (0, _mocha.it)('triggers "change" action on enter', function () {
            var changeActionCallCount = 0;
            this.on('updateUrl', function () {
                changeActionCallCount++;
            });

            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            run(function () {
                // TODO: why is ember's keyEvent helper not available here?
                // eslint-disable-next-line new-cap
                var e = $.Event('keypress');
                e.keyCode = 13;
                $input.trigger(e);
            });

            (0, _chai.expect)(changeActionCallCount).to.equal(1);
        });

        (0, _mocha.it)('triggers "change" action on CMD-S', function () {
            var changeActionCallCount = 0;
            this.on('updateUrl', function () {
                changeActionCallCount++;
            });

            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            run(function () {
                // TODO: why is ember's keyEvent helper not available here?
                // eslint-disable-next-line new-cap
                var e = $.Event('keydown');
                e.keyCode = 83;
                e.metaKey = true;
                $input.trigger(e);
            });

            (0, _chai.expect)(changeActionCallCount).to.equal(1);
        });

        (0, _mocha.it)('sends absolute urls straight through to change action', function () {
            var expectedUrl = '';

            this.on('updateUrl', function (url) {
                (0, _chai.expect)(url).to.equal(expectedUrl);
            });

            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            var testUrl = function testUrl(url) {
                expectedUrl = url;
                run(function () {
                    $input.val(url).trigger('input');
                });
                run(function () {
                    $input.trigger('blur');
                });
            };

            testUrl('http://example.com');
            testUrl('http://example.com/');
            testUrl('https://example.com');
            testUrl('//example.com');
            testUrl('//localhost:1234');
            testUrl('#anchor');
            testUrl('mailto:test@example.com');
            testUrl('tel:12345-567890');
            testUrl('javascript:alert("testing");');
        });

        (0, _mocha.it)('strips base url from relative urls before sending to change action', function () {
            var expectedUrl = '';

            this.on('updateUrl', function (url) {
                (0, _chai.expect)(url).to.equal(expectedUrl);
            });

            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            var testUrl = function testUrl(url) {
                expectedUrl = '/' + url;
                run(function () {
                    $input.val('' + currentUrl + url).trigger('input');
                });
                run(function () {
                    $input.trigger('blur');
                });
            };

            testUrl('about/');
            testUrl('about#contact');
            testUrl('test/nested/');
        });

        (0, _mocha.it)('handles links to subdomains of blog domain', function () {
            var expectedUrl = '';

            this.set('baseUrl', 'http://example.com/');

            this.on('updateUrl', function (url) {
                (0, _chai.expect)(url).to.equal(expectedUrl);
            });

            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            expectedUrl = 'http://test.example.com/';
            run(function () {
                $input.val(expectedUrl).trigger('input').trigger('blur');
            });
            (0, _chai.expect)($input.val()).to.equal(expectedUrl);
        });

        (0, _mocha.it)('adds trailing slash to relative URL', function () {
            var expectedUrl = '';

            this.on('updateUrl', function (url) {
                (0, _chai.expect)(url).to.equal(expectedUrl);
            });

            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            var testUrl = function testUrl(url) {
                expectedUrl = '/' + url + '/';
                run(function () {
                    $input.val('' + currentUrl + url).trigger('input');
                });
                run(function () {
                    $input.trigger('blur');
                });
            };

            testUrl('about');
            testUrl('test/nested');
        });

        (0, _mocha.it)('does not add trailing slash on relative URL with [.?#]', function () {
            var expectedUrl = '';

            this.on('updateUrl', function (url) {
                (0, _chai.expect)(url).to.equal(expectedUrl);
            });

            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            var testUrl = function testUrl(url) {
                expectedUrl = '/' + url;
                run(function () {
                    $input.val('' + currentUrl + url).trigger('input');
                });
                run(function () {
                    $input.trigger('blur');
                });
            };

            testUrl('about#contact');
            testUrl('test/nested.svg');
            testUrl('test?gho=sties');
            testUrl('test/nested?sli=mer');
        });

        (0, _mocha.it)('does not add trailing slash on non-relative URLs', function () {
            var expectedUrl = '';

            this.on('updateUrl', function (url) {
                (0, _chai.expect)(url).to.equal(expectedUrl);
            });

            this.render(_ember.default.HTMLBars.template({
                "id": "/67LtOqS",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $input = this.$('input');

            var testUrl = function testUrl(url) {
                expectedUrl = '/' + url;
                run(function () {
                    $input.val('' + currentUrl + url).trigger('input');
                });
                run(function () {
                    $input.trigger('blur');
                });
            };

            testUrl('http://woo.ff/test');
            testUrl('http://me.ow:2342/nested/test');
            testUrl('https://wro.om/car#race');
            testUrl('https://kabo.om/explosion?really=now');
        });

        (0, _mocha.describe)('with sub-folder baseUrl', function () {
            beforeEach(function () {
                this.set('baseUrl', currentUrl + 'blog/');
            });

            (0, _mocha.it)('handles URLs relative to base url', function () {
                var expectedUrl = '';

                this.on('updateUrl', function (url) {
                    (0, _chai.expect)(url).to.equal(expectedUrl);
                });

                this.render(_ember.default.HTMLBars.template({
                    "id": "kfKKjrSX",
                    "block": "{\"statements\":[[0,\"\\n                \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n            \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                    "meta": {}
                }));
                var $input = this.$('input');

                var testUrl = function testUrl(url) {
                    expectedUrl = url;
                    run(function () {
                        $input.val(currentUrl + 'blog' + url).trigger('input');
                    });
                    run(function () {
                        $input.trigger('blur');
                    });
                };

                testUrl('/about/');
                testUrl('/about#contact');
                testUrl('/test/nested/');
            });

            (0, _mocha.it)('handles URLs relative to base host', function () {
                var expectedUrl = '';

                this.on('updateUrl', function (url) {
                    (0, _chai.expect)(url).to.equal(expectedUrl);
                });

                this.render(_ember.default.HTMLBars.template({
                    "id": "kfKKjrSX",
                    "block": "{\"statements\":[[0,\"\\n                \"],[1,[33,[\"gh-navitem-url-input\"],null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[28,[\"baseUrl\"]],[28,[\"url\"]],[28,[\"isNew\"]],\"updateUrl\",[33,[\"action\"],[[28,[null]],\"clearErrors\"],null]]]],false],[0,\"\\n            \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                    "meta": {}
                }));
                var $input = this.$('input');

                var testUrl = function testUrl(url) {
                    expectedUrl = url;
                    run(function () {
                        $input.val(url).trigger('input');
                    });
                    run(function () {
                        $input.trigger('blur');
                    });
                };

                testUrl('http://' + window.location.host);
                testUrl('https://' + window.location.host);
                testUrl('http://' + window.location.host + '/');
                testUrl('https://' + window.location.host + '/');
                testUrl('http://' + window.location.host + '/test');
                testUrl('https://' + window.location.host + '/test');
                testUrl('http://' + window.location.host + '/#test');
                testUrl('https://' + window.location.host + '/#test');
                testUrl('http://' + window.location.host + '/another/folder');
                testUrl('https://' + window.location.host + '/another/folder');
            });
        });
    });
});
define('ghost-admin/tests/integration/components/gh-notification-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: gh-notification', function () {
        (0, _emberMocha.setupComponentTest)('gh-notification', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            this.set('message', { message: 'Test message', type: 'success' });

            this.render(Ember.HTMLBars.template({
                "id": "yf33kev8",
                "block": "{\"statements\":[[1,[33,[\"gh-notification\"],null,[[\"message\"],[[28,[\"message\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('article.gh-notification')).to.have.length(1);
            var $notification = this.$('.gh-notification');

            (0, _chai.expect)($notification.hasClass('gh-notification-passive')).to.be.true;
            (0, _chai.expect)($notification.text()).to.match(/Test message/);
        });

        (0, _mocha.it)('maps message types to CSS classes', function () {
            this.set('message', { message: 'Test message', type: 'success' });

            this.render(Ember.HTMLBars.template({
                "id": "yf33kev8",
                "block": "{\"statements\":[[1,[33,[\"gh-notification\"],null,[[\"message\"],[[28,[\"message\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var $notification = this.$('.gh-notification');

            this.set('message.type', 'success');
            (0, _chai.expect)($notification.hasClass('gh-notification-green'), 'success class isn\'t green').to.be.true;

            this.set('message.type', 'error');
            (0, _chai.expect)($notification.hasClass('gh-notification-red'), 'success class isn\'t red').to.be.true;

            this.set('message.type', 'warn');
            (0, _chai.expect)($notification.hasClass('gh-notification-yellow'), 'success class isn\'t yellow').to.be.true;
        });
    });
});
define('ghost-admin/tests/integration/components/gh-notifications-test', ['ember-service', 'mocha', 'ember-array/utils', 'chai', 'ember-mocha'], function (_emberService, _mocha, _utils, _chai, _emberMocha) {
    'use strict';

    var notificationsStub = _emberService.default.extend({
        notifications: (0, _utils.A)()
    }); /* jshint expr:true */


    (0, _mocha.describe)('Integration: Component: gh-notifications', function () {
        (0, _emberMocha.setupComponentTest)('gh-notifications', {
            integration: true
        });

        beforeEach(function () {
            this.register('service:notifications', notificationsStub);
            this.inject.service('notifications', { as: 'notifications' });

            this.set('notifications.notifications', [{ message: 'First', type: 'error' }, { message: 'Second', type: 'warn' }]);
        });

        (0, _mocha.it)('renders', function () {
            this.render(Ember.HTMLBars.template({
                "id": "S5KQ6SPj",
                "block": "{\"statements\":[[1,[26,[\"gh-notifications\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.gh-notifications').length).to.equal(1);

            (0, _chai.expect)(this.$('.gh-notifications').children().length).to.equal(2);

            this.set('notifications.notifications', (0, _utils.A)());
            (0, _chai.expect)(this.$('.gh-notifications').children().length).to.equal(0);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-profile-image-test', ['pretender', 'ember-service', 'ember-runloop', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha', 'ember-concurrency'], function (_pretender, _emberService, _emberRunloop, _wait, _mocha, _chai, _emberMocha, _emberConcurrency) {
    'use strict';

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    var pathsStub = _emberService.default.extend({
        url: {
            api: function api() {
                return '';
            },
            asset: function asset(src) {
                return src;
            }
        }
    });

    var stubKnownGravatar = function stubKnownGravatar(server) {
        server.get('http://www.gravatar.com/avatar/:md5', function () {
            return [200, { 'Content-Type': 'image/png' }, ''];
        });

        server.head('http://www.gravatar.com/avatar/:md5', function () {
            return [200, { 'Content-Type': 'image/png' }, ''];
        });
    };

    var stubUnknownGravatar = function stubUnknownGravatar(server) {
        server.get('http://www.gravatar.com/avatar/:md5', function () {
            return [404, {}, ''];
        });

        server.head('http://www.gravatar.com/avatar/:md5', function () {
            return [404, {}, ''];
        });
    };

    var configStubuseGravatar = _emberService.default.extend({
        useGravatar: true
    });

    (0, _mocha.describe)('Integration: Component: gh-profile-image', function () {
        (0, _emberMocha.setupComponentTest)('gh-profile-image', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            this.register('service:ghost-paths', pathsStub);
            this.inject.service('ghost-paths', { as: 'ghost-paths' });
            this.register('service:config', configStubuseGravatar);
            this.inject.service('config', { as: 'config' });

            server = new _pretender.default();
            stubKnownGravatar(server);
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('renders', function () {
            this.set('email', '');

            this.render(Ember.HTMLBars.template({
                "id": "WnrJVWcr",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-profile-image\"],null,[[\"email\"],[[28,[\"email\"]]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$()).to.have.length(1);
        });

        (0, _mocha.it)('renders default image if no email supplied', function () {
            this.set('email', null);

            this.render(Ember.HTMLBars.template({
                "id": "dCnHg8+Z",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-profile-image\"],null,[[\"email\",\"size\",\"debounce\"],[[28,[\"email\"]],100,50]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('.gravatar-img').attr('style'), 'gravatar image style').to.equal('display: none');
        });

        (0, _mocha.it)('renders the gravatar if valid email supplied and privacy.useGravatar allows it', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var email, expectedUrl;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            email = 'test@example.com';
                            expectedUrl = '//www.gravatar.com/avatar/' + md5(email) + '?s=100&d=404';


                            this.set('email', email);

                            this.render(Ember.HTMLBars.template({
                                "id": "dCnHg8+Z",
                                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-profile-image\"],null,[[\"email\",\"size\",\"debounce\"],[[28,[\"email\"]],100,50]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                "meta": {}
                            }));

                            // wait for the ajax request to complete
                            _context.next = 6;
                            return (0, _wait.default)();

                        case 6:

                            (0, _chai.expect)(this.$('.gravatar-img').attr('style'), 'gravatar image style').to.equal('background-image: url(' + expectedUrl + '); display: block');

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        (0, _mocha.it)('doesn\'t render the gravatar if valid email supplied but privacy.useGravatar forbids it', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var email;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            email = 'test@example.com';


                            this.set('email', email);
                            this.set('config.useGravatar', false);

                            this.render(Ember.HTMLBars.template({
                                "id": "dCnHg8+Z",
                                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-profile-image\"],null,[[\"email\",\"size\",\"debounce\"],[[28,[\"email\"]],100,50]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                "meta": {}
                            }));

                            _context2.next = 6;
                            return (0, _wait.default)();

                        case 6:

                            (0, _chai.expect)(this.$('.gravatar-img').attr('style'), 'gravatar image style').to.equal('display: none');

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));

        (0, _mocha.it)('doesn\'t add background url if gravatar image doesn\'t exist', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            stubUnknownGravatar(server);

                            this.render(Ember.HTMLBars.template({
                                "id": "waOm7kzN",
                                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-profile-image\"],null,[[\"email\",\"size\",\"debounce\"],[\"test@example.com\",100,50]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                "meta": {}
                            }));

                            _context3.next = 4;
                            return (0, _wait.default)();

                        case 4:

                            (0, _chai.expect)(this.$('.gravatar-img').attr('style'), 'gravatar image style').to.equal('background-image: url(); display: none');

                        case 5:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));

        (0, _mocha.it)('throttles gravatar loading as email is changed', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            var _this = this;

            var email, expectedUrl;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            email = 'test@example.com';
                            expectedUrl = '//www.gravatar.com/avatar/' + md5(email) + '?s=100&d=404';


                            this.set('email', 'test');

                            this.render(Ember.HTMLBars.template({
                                "id": "bIIgOVuD",
                                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-profile-image\"],null,[[\"email\",\"size\",\"debounce\"],[[28,[\"email\"]],100,300]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                "meta": {}
                            }));

                            (0, _emberRunloop.default)(function () {
                                _this.set('email', email);
                            });

                            (0, _chai.expect)(this.$('.gravatar-img').attr('style'), '.gravatar-img background not immediately changed on email change').to.equal('display: none');

                            _context4.next = 8;
                            return (0, _emberConcurrency.timeout)(250);

                        case 8:

                            (0, _chai.expect)(this.$('.gravatar-img').attr('style'), '.gravatar-img background still not changed before debounce timeout').to.equal('display: none');

                            _context4.next = 11;
                            return (0, _emberConcurrency.timeout)(100);

                        case 11:

                            (0, _chai.expect)(this.$('.gravatar-img').attr('style'), '.gravatar-img background changed after debounce timeout').to.equal('background-image: url(' + expectedUrl + '); display: block');

                        case 12:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        })));
    });
});
define('ghost-admin/tests/integration/components/gh-progress-bar-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-progress-bar', function () {
        (0, _emberMocha.setupComponentTest)('gh-progress-bar', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#gh-progress-bar}}
            //     template content
            //   {{/gh-progress-bar}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "JKzjLuTq",
                "block": "{\"statements\":[[1,[26,[\"gh-progress-bar\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-publishmenu-draft-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-publishmenu-draft', function () {
        (0, _emberMocha.setupComponentTest)('gh-publishmenu-draft', {
            integration: true
        });

        _mocha.it.skip('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#gh-publishmenu-draft}}
            //     template content
            //   {{/gh-publishmenu-draft}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "oMFl+9eJ",
                "block": "{\"statements\":[[1,[26,[\"gh-publishmenu-draft\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-publishmenu-published-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-publishmenu-published', function () {
        (0, _emberMocha.setupComponentTest)('gh-publishmenu-published', {
            integration: true
        });

        _mocha.it.skip('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#gh-publishmenu-published}}
            //     template content
            //   {{/gh-publishmenu-published}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "DvFL+FUP",
                "block": "{\"statements\":[[1,[26,[\"gh-publishmenu-published\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-publishmenu-scheduled-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-publishmenu-scheduled', function () {
        (0, _emberMocha.setupComponentTest)('gh-publishmenu-scheduled', {
            integration: true
        });

        _mocha.it.skip('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#gh-publishmenu-scheduled}}
            //     template content
            //   {{/gh-publishmenu-scheduled}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "qTWdCdBM",
                "block": "{\"statements\":[[1,[26,[\"gh-publishmenu-scheduled\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-publishmenu-test', ['mocha', 'chai', 'ember-mocha', 'ghost-admin/initializers/ember-cli-mirage'], function (_mocha, _chai, _emberMocha, _emberCliMirage) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-publishmenu', function () {
        (0, _emberMocha.setupComponentTest)('gh-publishmenu', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = (0, _emberCliMirage.startMirage)();
            server.loadFixtures();

            server.create('user');
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('renders', function () {
            this.post = server.create('post');
            this.render(Ember.HTMLBars.template({
                "id": "NzSANwLf",
                "block": "{\"statements\":[[1,[33,[\"gh-publishmenu\"],null,[[\"post\"],[[28,[\"post\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-search-input-test', ['pretender', 'ember-runloop', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _emberRunloop, _wait, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: gh-search-input', function () {
        (0, _emberMocha.setupComponentTest)('gh-search-input', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('renders', function () {
            // renders the component on the page
            this.render(Ember.HTMLBars.template({
                "id": "bd3xHglA",
                "block": "{\"statements\":[[1,[26,[\"gh-search-input\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('.ember-power-select-search input')).to.have.length(1);
        });

        (0, _mocha.it)('opens the dropdown on text entry', function (done) {
            var _this = this;

            this.render(Ember.HTMLBars.template({
                "id": "bd3xHglA",
                "block": "{\"statements\":[[1,[26,[\"gh-search-input\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            // enter text to trigger search
            (0, _emberRunloop.default)(function () {
                _this.$('input[type="search"]').val('test').trigger('input');
            });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this.$('.ember-basic-dropdown-content').length).to.equal(1);
                done();
            });
        });
    });
});
define('ghost-admin/tests/integration/components/gh-simplemde-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-simplemde', function () {
        (0, _emberMocha.setupComponentTest)('gh-simplemde', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#gh-simplemde}}
            //     template content
            //   {{/gh-simplemde}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "eNxY3Thv",
                "block": "{\"statements\":[[1,[26,[\"gh-simplemde\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-subscribers-table-test', ['ember-light-table', 'mocha', 'chai', 'ember-mocha'], function (_emberLightTable, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: gh-subscribers-table', function () {
        (0, _emberMocha.setupComponentTest)('gh-subscribers-table', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            this.set('table', new _emberLightTable.default([], []));
            this.set('sortByColumn', function () {});
            this.set('delete', function () {});

            this.render(Ember.HTMLBars.template({
                "id": "05VNlPPP",
                "block": "{\"statements\":[[1,[33,[\"gh-subscribers-table\"],null,[[\"table\",\"sortByColumn\",\"delete\"],[[28,[\"table\"]],[33,[\"action\"],[[28,[null]],[28,[\"sortByColumn\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"delete\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-tag-settings-form-test', ['ember-data', 'ember-object', 'ember-service', 'ember-runloop', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha'], function (_emberData, _emberObject, _emberService, _emberRunloop, _wait, _mocha, _chai, _emberMocha) {
    'use strict';

    var Errors = _emberData.default.Errors;


    var configStub = _emberService.default.extend({
        blogUrl: 'http://localhost:2368'
    });

    var mediaQueriesStub = _emberService.default.extend({
        maxWidth600: false
    });

    (0, _mocha.describe)('Integration: Component: gh-tag-settings-form', function () {
        (0, _emberMocha.setupComponentTest)('gh-tag-settings-form', {
            integration: true
        });

        beforeEach(function () {
            /* eslint-disable camelcase */
            var tag = _emberObject.default.create({
                id: 1,
                name: 'Test',
                slug: 'test',
                description: 'Description.',
                metaTitle: 'Meta Title',
                metaDescription: 'Meta description',
                errors: Errors.create(),
                hasValidated: []
            });
            /* eslint-enable camelcase */

            this.set('tag', tag);
            this.set('actions.setProperty', function (property, value) {
                // this should be overridden if a call is expected
                // eslint-disable-next-line no-console
                console.error('setProperty called \'' + property + ': ' + value + '\'');
            });

            this.register('service:config', configStub);
            this.inject.service('config', { as: 'config' });

            this.register('service:media-queries', mediaQueriesStub);
            this.inject.service('media-queries', { as: 'mediaQueries' });
        });

        (0, _mocha.it)('renders', function () {
            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });

        (0, _mocha.it)('has the correct title', function () {
            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.tag-settings-pane h4').text(), 'existing tag title').to.equal('Tag Settings');

            this.set('tag.isNew', true);
            (0, _chai.expect)(this.$('.tag-settings-pane h4').text(), 'new tag title').to.equal('New Tag');
        });

        (0, _mocha.it)('renders main settings', function () {
            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('.gh-image-uploader').length, 'displays image uploader').to.equal(1);
            (0, _chai.expect)(this.$('input[name="name"]').val(), 'name field value').to.equal('Test');
            (0, _chai.expect)(this.$('input[name="slug"]').val(), 'slug field value').to.equal('test');
            (0, _chai.expect)(this.$('textarea[name="description"]').val(), 'description field value').to.equal('Description.');
            (0, _chai.expect)(this.$('input[name="metaTitle"]').val(), 'metaTitle field value').to.equal('Meta Title');
            (0, _chai.expect)(this.$('textarea[name="metaDescription"]').val(), 'metaDescription field value').to.equal('Meta description');
        });

        (0, _mocha.it)('can switch between main/meta settings', function () {
            var _this = this;

            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('.tag-settings-pane').hasClass('settings-menu-pane-in'), 'main settings are displayed by default').to.be.true;
            (0, _chai.expect)(this.$('.tag-meta-settings-pane').hasClass('settings-menu-pane-out-right'), 'meta settings are hidden by default').to.be.true;

            (0, _emberRunloop.default)(function () {
                _this.$('.meta-data-button').click();
            });

            (0, _chai.expect)(this.$('.tag-settings-pane').hasClass('settings-menu-pane-out-left'), 'main settings are hidden after clicking Meta Data button').to.be.true;
            (0, _chai.expect)(this.$('.tag-meta-settings-pane').hasClass('settings-menu-pane-in'), 'meta settings are displayed after clicking Meta Data button').to.be.true;

            (0, _emberRunloop.default)(function () {
                _this.$('.back').click();
            });

            (0, _chai.expect)(this.$('.tag-settings-pane').hasClass('settings-menu-pane-in'), 'main settings are displayed after clicking "back"').to.be.true;
            (0, _chai.expect)(this.$('.tag-meta-settings-pane').hasClass('settings-menu-pane-out-right'), 'meta settings are hidden after clicking "back"').to.be.true;
        });

        (0, _mocha.it)('has one-way binding for properties', function () {
            var _this2 = this;

            this.set('actions.setProperty', function () {
                // noop
            });

            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this2.$('input[name="name"]').val('New name');
                _this2.$('input[name="slug"]').val('new-slug');
                _this2.$('textarea[name="description"]').val('New description');
                _this2.$('input[name="metaTitle"]').val('New metaTitle');
                _this2.$('textarea[name="metaDescription"]').val('New metaDescription');
            });

            (0, _chai.expect)(this.get('tag.name'), 'tag name').to.equal('Test');
            (0, _chai.expect)(this.get('tag.slug'), 'tag slug').to.equal('test');
            (0, _chai.expect)(this.get('tag.description'), 'tag description').to.equal('Description.');
            (0, _chai.expect)(this.get('tag.metaTitle'), 'tag metaTitle').to.equal('Meta Title');
            (0, _chai.expect)(this.get('tag.metaDescription'), 'tag metaDescription').to.equal('Meta description');
        });

        (0, _mocha.it)('triggers setProperty action on blur of all fields', function () {
            var _this3 = this;

            var expectedProperty = '';
            var expectedValue = '';

            this.set('actions.setProperty', function (property, value) {
                (0, _chai.expect)(property, 'property').to.equal(expectedProperty);
                (0, _chai.expect)(value, 'value').to.equal(expectedValue);
            });

            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            expectedProperty = 'name';
            expectedValue = 'new-slug';
            (0, _emberRunloop.default)(function () {
                _this3.$('input[name="name"]').val('New name');
            });

            expectedProperty = 'url';
            expectedValue = 'new-slug';
            (0, _emberRunloop.default)(function () {
                _this3.$('input[name="slug"]').val('new-slug');
            });

            expectedProperty = 'description';
            expectedValue = 'New description';
            (0, _emberRunloop.default)(function () {
                _this3.$('textarea[name="description"]').val('New description');
            });

            expectedProperty = 'metaTitle';
            expectedValue = 'New metaTitle';
            (0, _emberRunloop.default)(function () {
                _this3.$('input[name="metaTitle"]').val('New metaTitle');
            });

            expectedProperty = 'metaDescription';
            expectedValue = 'New metaDescription';
            (0, _emberRunloop.default)(function () {
                _this3.$('textarea[name="metaDescription"]').val('New metaDescription');
            });
        });

        (0, _mocha.it)('displays error messages for validated fields', function () {
            var _this4 = this;

            var errors = this.get('tag.errors');
            var hasValidated = this.get('tag.hasValidated');

            errors.add('name', 'must be present');
            hasValidated.push('name');

            errors.add('slug', 'must be present');
            hasValidated.push('slug');

            errors.add('description', 'is too long');
            hasValidated.push('description');

            errors.add('metaTitle', 'is too long');
            hasValidated.push('metaTitle');

            errors.add('metaDescription', 'is too long');
            hasValidated.push('metaDescription');

            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            return (0, _wait.default)().then(function () {
                var nameFormGroup = _this4.$('input[name="name"]').closest('.form-group');
                (0, _chai.expect)(nameFormGroup.hasClass('error'), 'name form group has error state').to.be.true;
                (0, _chai.expect)(nameFormGroup.find('.response').length, 'name form group has error message').to.equal(1);

                var slugFormGroup = _this4.$('input[name="slug"]').closest('.form-group');
                (0, _chai.expect)(slugFormGroup.hasClass('error'), 'slug form group has error state').to.be.true;
                (0, _chai.expect)(slugFormGroup.find('.response').length, 'slug form group has error message').to.equal(1);

                var descriptionFormGroup = _this4.$('textarea[name="description"]').closest('.form-group');
                (0, _chai.expect)(descriptionFormGroup.hasClass('error'), 'description form group has error state').to.be.true;

                var metaTitleFormGroup = _this4.$('input[name="metaTitle"]').closest('.form-group');
                (0, _chai.expect)(metaTitleFormGroup.hasClass('error'), 'metaTitle form group has error state').to.be.true;
                (0, _chai.expect)(metaTitleFormGroup.find('.response').length, 'metaTitle form group has error message').to.equal(1);

                var metaDescriptionFormGroup = _this4.$('textarea[name="metaDescription"]').closest('.form-group');
                (0, _chai.expect)(metaDescriptionFormGroup.hasClass('error'), 'metaDescription form group has error state').to.be.true;
                (0, _chai.expect)(metaDescriptionFormGroup.find('.response').length, 'metaDescription form group has error message').to.equal(1);
            });
        });

        (0, _mocha.it)('displays char count for text fields', function () {
            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            var descriptionFormGroup = this.$('textarea[name="description"]').closest('.form-group');
            (0, _chai.expect)(descriptionFormGroup.find('.word-count').text(), 'description char count').to.equal('12');

            var metaDescriptionFormGroup = this.$('textarea[name="metaDescription"]').closest('.form-group');
            (0, _chai.expect)(metaDescriptionFormGroup.find('.word-count').text(), 'description char count').to.equal('16');
        });

        (0, _mocha.it)('renders SEO title preview', function () {
            var _this5 = this;

            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.seo-preview-title').text(), 'displays meta title if present').to.equal('Meta Title');

            (0, _emberRunloop.default)(function () {
                _this5.set('tag.metaTitle', '');
            });
            (0, _chai.expect)(this.$('.seo-preview-title').text(), 'falls back to tag name without metaTitle').to.equal('Test');

            (0, _emberRunloop.default)(function () {
                _this5.set('tag.name', new Array(151).join('x'));
            });
            var expectedLength = 70 + '…'.length;
            (0, _chai.expect)(this.$('.seo-preview-title').text().length, 'cuts title to max 70 chars').to.equal(expectedLength);
        });

        (0, _mocha.it)('renders SEO URL preview', function () {
            var _this6 = this;

            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.seo-preview-link').text(), 'adds url and tag prefix').to.equal('http://localhost:2368/tag/test/');

            (0, _emberRunloop.default)(function () {
                _this6.set('tag.slug', new Array(151).join('x'));
            });
            var expectedLength = 70 + '…'.length;
            (0, _chai.expect)(this.$('.seo-preview-link').text().length, 'cuts slug to max 70 chars').to.equal(expectedLength);
        });

        (0, _mocha.it)('renders SEO description preview', function () {
            var _this7 = this;

            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.seo-preview-description').text(), 'displays meta description if present').to.equal('Meta description');

            (0, _emberRunloop.default)(function () {
                _this7.set('tag.metaDescription', '');
            });
            (0, _chai.expect)(this.$('.seo-preview-description').text(), 'falls back to tag description without metaDescription').to.equal('Description.');

            (0, _emberRunloop.default)(function () {
                _this7.set('tag.description', new Array(200).join('x'));
            });
            var expectedLength = 156 + '…'.length;
            (0, _chai.expect)(this.$('.seo-preview-description').text().length, 'cuts description to max 156 chars').to.equal(expectedLength);
        });

        (0, _mocha.it)('resets if a new tag is received', function () {
            var _this8 = this;

            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _emberRunloop.default)(function () {
                _this8.$('.meta-data-button').click();
            });
            (0, _chai.expect)(this.$('.tag-meta-settings-pane').hasClass('settings-menu-pane-in'), 'meta data pane is shown').to.be.true;

            (0, _emberRunloop.default)(function () {
                _this8.set('tag', _emberObject.default.create({ id: '2' }));
            });
            (0, _chai.expect)(this.$('.tag-settings-pane').hasClass('settings-menu-pane-in'), 'resets to main settings').to.be.true;
        });

        (0, _mocha.it)('triggers delete tag modal on delete click', function (done) {
            var _this9 = this;

            // TODO: will time out if this isn't hit, there's probably a better
            // way of testing this
            this.set('actions.openModal', function () {
                done();
            });

            this.render(Ember.HTMLBars.template({
                "id": "Kw0yLG/o",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\",\"showDeleteTagModal\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null],[33,[\"action\"],[[28,[null]],\"openModal\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this9.$('.settings-menu-delete-button').click();
            });
        });

        (0, _mocha.it)('shows settings.tags arrow link on mobile', function () {
            this.set('mediaQueries.maxWidth600', true);

            this.render(Ember.HTMLBars.template({
                "id": "QN2VuPqO",
                "block": "{\"statements\":[[0,\"\\n            \"],[1,[33,[\"gh-tag-settings-form\"],null,[[\"tag\",\"setProperty\"],[[28,[\"tag\"]],[33,[\"action\"],[[28,[null]],\"setProperty\"],null]]]],false],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$('.tag-settings-pane .settings-menu-header .settings-menu-header-action').length, 'settings.tags link is shown').to.equal(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-tags-management-container-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: gh-tags-management-container', function () {
        (0, _emberMocha.setupComponentTest)('gh-tags-management-container', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            this.set('tags', []);
            this.set('selectedTag', null);
            this.on('enteredMobile', function () {
                // noop
            });
            this.on('leftMobile', function () {
                // noop
            });

            this.render(Ember.HTMLBars.template({
                "id": "0YETgWTi",
                "block": "{\"statements\":[[0,\"\\n            \"],[6,[\"gh-tags-management-container\"],null,[[\"tags\",\"selectedTag\",\"enteredMobile\",\"leftMobile\"],[[28,[\"tags\"]],[28,[\"selectedTag\"]],\"enteredMobile\",\"leftMobile\"]],{\"statements\":[],\"locals\":[]},null],[0,\"\\n        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-task-button-test', ['ember-runloop', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha', 'ember-concurrency'], function (_emberRunloop, _wait, _mocha, _chai, _emberMocha, _emberConcurrency) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    (0, _mocha.describe)('Integration: Component: gh-task-button', function () {
        (0, _emberMocha.setupComponentTest)('gh-task-button', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            // sets button text using positional param
            this.render(Ember.HTMLBars.template({
                "id": "VLp4hV73",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],[\"Test\"],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('button')).to.exist;
            (0, _chai.expect)(this.$('button')).to.contain('Test');
            (0, _chai.expect)(this.$('button')).to.have.prop('disabled', false);

            this.render(Ember.HTMLBars.template({
                "id": "vo5P8q2g",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"class\"],[\"testing\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('button')).to.have.class('testing');
            // default button text is "Save"
            (0, _chai.expect)(this.$('button')).to.contain('Save');

            // passes disabled attr
            this.render(Ember.HTMLBars.template({
                "id": "wZMY0DMM",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"disabled\",\"buttonText\"],[true,\"Test\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('button')).to.have.prop('disabled', true);
            // allows button text to be set via hash param
            (0, _chai.expect)(this.$('button')).to.contain('Test');

            // passes type attr
            this.render(Ember.HTMLBars.template({
                "id": "lD5ouDNl",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"type\"],[\"submit\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('button')).to.have.attr('type', 'submit');

            // passes tabindex attr
            this.render(Ember.HTMLBars.template({
                "id": "FG6w+b/Q",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"tabindex\"],[\"-1\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('button')).to.have.attr('tabindex', '-1');
        });

        (0, _mocha.it)('shows spinner whilst running', function (done) {
            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _emberConcurrency.timeout)(50);

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "3JticPpy",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\"],[[28,[\"myTask\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            this.get('myTask').perform();

            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('button')).to.have.descendants('svg');
            }, 20);

            (0, _wait.default)().then(done);
        });

        (0, _mocha.it)('shows running text when passed whilst running', function (done) {
            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return (0, _emberConcurrency.timeout)(50);

                            case 2:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "Zp0Ncc9K",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\",\"runningText\"],[[28,[\"myTask\"]],\"Running\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            this.get('myTask').perform();

            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('button')).to.have.descendants('svg');
                (0, _chai.expect)(this.$('button')).to.contain('Running');
            }, 20);

            (0, _wait.default)().then(done);
        });

        (0, _mocha.it)('appears disabled whilst running', function (done) {
            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return (0, _emberConcurrency.timeout)(50);

                            case 2:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "3JticPpy",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\"],[[28,[\"myTask\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('button'), 'initial class').to.not.have.class('appear-disabled');

            this.get('myTask').perform();

            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('button'), 'running class').to.have.class('appear-disabled');
            }, 20);

            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('button'), 'ended class').to.not.have.class('appear-disabled');
            }, 100);

            (0, _wait.default)().then(done);
        });

        (0, _mocha.it)('shows success on success', function (done) {
            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return (0, _emberConcurrency.timeout)(50);

                            case 2:
                                return _context4.abrupt('return', true);

                            case 3:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "3JticPpy",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\"],[[28,[\"myTask\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            this.get('myTask').perform();

            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('button')).to.have.class('gh-btn-green');
                (0, _chai.expect)(this.$('button')).to.contain('Saved');
            }, 100);

            (0, _wait.default)().then(done);
        });

        (0, _mocha.it)('assigns specified success class on success', function (done) {
            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return (0, _emberConcurrency.timeout)(50);

                            case 2:
                                return _context5.abrupt('return', true);

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "VSW8pBsC",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\",\"successClass\"],[[28,[\"myTask\"]],\"im-a-success\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            this.get('myTask').perform();

            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('button')).to.not.have.class('gh-btn-green');
                (0, _chai.expect)(this.$('button')).to.have.class('im-a-success');
                (0, _chai.expect)(this.$('button')).to.contain('Saved');
            }, 100);

            (0, _wait.default)().then(done);
        });

        (0, _mocha.it)('shows failure when task errors', function (done) {
            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.prev = 0;
                                _context6.next = 3;
                                return (0, _emberConcurrency.timeout)(50);

                            case 3:
                                throw new ReferenceError('test error');

                            case 6:
                                _context6.prev = 6;
                                _context6.t0 = _context6['catch'](0);

                            case 8:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[0, 6]]);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "3JticPpy",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\"],[[28,[\"myTask\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            this.get('myTask').perform();

            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('button')).to.have.class('gh-btn-red');
                (0, _chai.expect)(this.$('button')).to.contain('Retry');
            }, 100);

            (0, _wait.default)().then(done);
        });

        (0, _mocha.it)('shows failure on falsy response', function (done) {
            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return (0, _emberConcurrency.timeout)(50);

                            case 2:
                                return _context7.abrupt('return', false);

                            case 3:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "3JticPpy",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\"],[[28,[\"myTask\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            this.get('myTask').perform();

            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('button')).to.have.class('gh-btn-red');
                (0, _chai.expect)(this.$('button')).to.contain('Retry');
            }, 100);

            (0, _wait.default)().then(done);
        });

        (0, _mocha.it)('assigns specified failure class on failure', function (done) {
            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return (0, _emberConcurrency.timeout)(50);

                            case 2:
                                return _context8.abrupt('return', false);

                            case 3:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "+fJNcIFz",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\",\"failureClass\"],[[28,[\"myTask\"]],\"im-a-failure\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            this.get('myTask').perform();

            _emberRunloop.default.later(this, function () {
                (0, _chai.expect)(this.$('button')).to.not.have.class('gh-btn-red');
                (0, _chai.expect)(this.$('button')).to.have.class('im-a-failure');
                (0, _chai.expect)(this.$('button')).to.contain('Retry');
            }, 100);

            (0, _wait.default)().then(done);
        });

        (0, _mocha.it)('performs task on click', function (done) {
            var taskCount = 0;

            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return (0, _emberConcurrency.timeout)(50);

                            case 2:
                                taskCount = taskCount + 1;

                            case 3:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "3JticPpy",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\"],[[28,[\"myTask\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            this.$('button').click();

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(taskCount, 'taskCount').to.equal(1);
                done();
            });
        });

        _mocha.it.skip('keeps button size when showing spinner', function (done) {
            this.set('myTask', (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee10() {
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return (0, _emberConcurrency.timeout)(50);

                            case 2:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            })));

            this.render(Ember.HTMLBars.template({
                "id": "3JticPpy",
                "block": "{\"statements\":[[1,[33,[\"gh-task-button\"],null,[[\"task\"],[[28,[\"myTask\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            var width = this.$('button').width();
            var height = this.$('button').height();
            (0, _chai.expect)(this.$('button')).to.not.have.attr('style');

            this.get('myTask').perform();

            _emberRunloop.default.later(this, function () {
                var _width$toString$split = width.toString().split('.'),
                    _width$toString$split2 = _slicedToArray(_width$toString$split, 1),
                    widthInt = _width$toString$split2[0];

                var _height$toString$spli = height.toString().split('.'),
                    _height$toString$spli2 = _slicedToArray(_height$toString$spli, 1),
                    heightInt = _height$toString$spli2[0];

                (0, _chai.expect)(this.$('button').attr('style')).to.have.string('width: ' + widthInt);
                (0, _chai.expect)(this.$('button').attr('style')).to.have.string('height: ' + heightInt);
            }, 20);

            _emberRunloop.default.later(this, function () {
                // chai-jquery test doesn't work because Firefox outputs blank string
                // expect(this.$('button')).to.not.have.attr('style');
                (0, _chai.expect)(this.$('button').attr('style')).to.be.blank;
            }, 100);

            (0, _wait.default)().then(done);
        });
    });
});
define('ghost-admin/tests/integration/components/gh-theme-table-test', ['jquery', 'ember-runloop', 'sinon', 'ember-test-selectors', 'mocha', 'chai', 'ember-mocha'], function (_jquery, _emberRunloop, _sinon, _emberTestSelectors, _mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-theme-table', function () {
        (0, _emberMocha.setupComponentTest)('gh-theme-table', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            this.set('themes', [{ name: 'Daring', package: { name: 'Daring', version: '0.1.4' }, active: true }, { name: 'casper', package: { name: 'Casper', version: '1.3.1' } }, { name: 'oscar-ghost-1.1.0', package: { name: 'Lanyon', version: '1.1.0' } }, { name: 'foo' }]);
            this.set('actionHandler', _sinon.default.spy());

            this.render(Ember.HTMLBars.template({
                "id": "pbwmmRld",
                "block": "{\"statements\":[[1,[33,[\"gh-theme-table\"],null,[[\"themes\",\"activateTheme\",\"downloadTheme\",\"deleteTheme\"],[[28,[\"themes\"]],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('themes-list')).length, 'themes list is present').to.equal(1);
            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('theme-id')).length, 'number of rows').to.equal(4);

            var packageNames = this.$((0, _emberTestSelectors.default)('theme-title')).map(function (i, name) {
                return (0, _jquery.default)(name).text().trim();
            }).toArray();

            (0, _chai.expect)(packageNames, 'themes are ordered by label, casper has "default"').to.deep.equal(['Casper (default)', 'Daring', 'foo', 'Lanyon']);

            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('theme-active', 'true')).find((0, _emberTestSelectors.default)('theme-title')).text().trim(), 'active theme is highlighted').to.equal('Daring');

            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('theme-activate-button')).length === 3, 'non-active themes have an activate link').to.be.true;

            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('theme-active', 'true')).find((0, _emberTestSelectors.default)('theme-activate-button')).length === 0, 'active theme doesn\'t have an activate link').to.be.true;

            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('theme-download-button')).length, 'all themes have a download link').to.equal(4);

            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('theme-id', 'foo')).find((0, _emberTestSelectors.default)('theme-delete-button')).length === 1, 'non-active, non-casper theme has delete link').to.be.true;

            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('theme-id', 'casper')).find((0, _emberTestSelectors.default)('theme-delete-button')).length === 0, 'casper doesn\'t have delete link').to.be.true;

            (0, _chai.expect)(this.$((0, _emberTestSelectors.default)('theme-active', 'true')).find((0, _emberTestSelectors.default)('theme-delete-button')).length === 0, 'active theme doesn\'t have delete link').to.be.true;
        });

        (0, _mocha.it)('delete link triggers passed in action', function () {
            var _this = this;

            var deleteAction = _sinon.default.spy();
            var actionHandler = _sinon.default.spy();

            this.set('themes', [{ name: 'Foo', active: true }, { name: 'Bar' }]);
            this.set('deleteAction', deleteAction);
            this.set('actionHandler', actionHandler);

            this.render(Ember.HTMLBars.template({
                "id": "l9Ey0Gov",
                "block": "{\"statements\":[[1,[33,[\"gh-theme-table\"],null,[[\"themes\",\"activateTheme\",\"downloadTheme\",\"deleteTheme\"],[[28,[\"themes\"]],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"deleteAction\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this.$((0, _emberTestSelectors.default)('theme-id', 'Bar') + ' ' + (0, _emberTestSelectors.default)('theme-delete-button')).click();
            });

            (0, _chai.expect)(deleteAction.calledOnce).to.be.true;
            (0, _chai.expect)(deleteAction.firstCall.args[0].name).to.equal('Bar');
        });

        (0, _mocha.it)('download link triggers passed in action', function () {
            var _this2 = this;

            var downloadAction = _sinon.default.spy();
            var actionHandler = _sinon.default.spy();

            this.set('themes', [{ name: 'Foo', active: true }, { name: 'Bar' }]);
            this.set('downloadAction', downloadAction);
            this.set('actionHandler', actionHandler);

            this.render(Ember.HTMLBars.template({
                "id": "sDICX5nb",
                "block": "{\"statements\":[[1,[33,[\"gh-theme-table\"],null,[[\"themes\",\"activateTheme\",\"downloadTheme\",\"deleteTheme\"],[[28,[\"themes\"]],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"downloadAction\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this2.$((0, _emberTestSelectors.default)('theme-id', 'Foo') + ' ' + (0, _emberTestSelectors.default)('theme-download-button')).click();
            });

            (0, _chai.expect)(downloadAction.calledOnce).to.be.true;
            (0, _chai.expect)(downloadAction.firstCall.args[0].name).to.equal('Foo');
        });

        (0, _mocha.it)('activate link triggers passed in action', function () {
            var _this3 = this;

            var activateAction = _sinon.default.spy();
            var actionHandler = _sinon.default.spy();

            this.set('themes', [{ name: 'Foo', active: true }, { name: 'Bar' }]);
            this.set('activateAction', activateAction);
            this.set('actionHandler', actionHandler);

            this.render(Ember.HTMLBars.template({
                "id": "8B03t2r+",
                "block": "{\"statements\":[[1,[33,[\"gh-theme-table\"],null,[[\"themes\",\"activateTheme\",\"downloadTheme\",\"deleteTheme\"],[[28,[\"themes\"]],[33,[\"action\"],[[28,[null]],[28,[\"activateAction\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this3.$((0, _emberTestSelectors.default)('theme-id', 'Bar') + ' ' + (0, _emberTestSelectors.default)('theme-activate-button')).click();
            });

            (0, _chai.expect)(activateAction.calledOnce).to.be.true;
            (0, _chai.expect)(activateAction.firstCall.args[0].name).to.equal('Bar');
        });

        (0, _mocha.it)('displays folder names if there are duplicate package names', function () {
            this.set('themes', [{ name: 'daring', package: { name: 'Daring', version: '0.1.4' }, active: true }, { name: 'daring-0.1.5', package: { name: 'Daring', version: '0.1.4' } }, { name: 'casper', package: { name: 'Casper', version: '1.3.1' } }, { name: 'another', package: { name: 'Casper', version: '1.3.1' } }, { name: 'mine', package: { name: 'Casper', version: '1.3.1' } }, { name: 'foo' }]);
            this.set('actionHandler', _sinon.default.spy());

            this.render(Ember.HTMLBars.template({
                "id": "pbwmmRld",
                "block": "{\"statements\":[[1,[33,[\"gh-theme-table\"],null,[[\"themes\",\"activateTheme\",\"downloadTheme\",\"deleteTheme\"],[[28,[\"themes\"]],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"actionHandler\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            var packageNames = this.$((0, _emberTestSelectors.default)('theme-title')).map(function (i, name) {
                return (0, _jquery.default)(name).text().trim();
            }).toArray();

            (0, _chai.expect)(packageNames, 'themes are ordered by label, folder names shown for duplicates').to.deep.equal(['Casper (another)', 'Casper (default)', 'Casper (mine)', 'Daring (daring)', 'Daring (daring-0.1.5)', 'foo']);
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/integration/components/gh-timezone-select-test', ['ember-runloop', 'sinon', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha'], function (_emberRunloop, _sinon, _wait, _mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-timezone-select', function () {
        (0, _emberMocha.setupComponentTest)('gh-timezone-select', {
            integration: true
        });

        beforeEach(function () {
            this.set('availableTimezones', [{ name: 'Pacific/Pago_Pago', label: '(GMT -11:00) Midway Island, Samoa' }, { name: 'Etc/UTC', label: '(GMT) UTC' }, { name: 'Pacific/Kwajalein', label: '(GMT +12:00) International Date Line West' }]);
            this.set('activeTimezone', 'Etc/UTC');
        });

        (0, _mocha.it)('renders', function () {
            this.render(Ember.HTMLBars.template({
                "id": "C2pULtZC",
                "block": "{\"statements\":[[1,[33,[\"gh-timezone-select\"],null,[[\"availableTimezones\",\"activeTimezone\"],[[28,[\"availableTimezones\"]],[28,[\"activeTimezone\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _chai.expect)(this.$(), 'top-level elements').to.have.length(1);
            (0, _chai.expect)(this.$('option'), 'number of options').to.have.length(3);
            (0, _chai.expect)(this.$('select').val(), 'selected option value').to.equal('Etc/UTC');
        });

        (0, _mocha.it)('handles an unknown timezone', function () {
            this.set('activeTimezone', 'Europe/London');

            this.render(Ember.HTMLBars.template({
                "id": "C2pULtZC",
                "block": "{\"statements\":[[1,[33,[\"gh-timezone-select\"],null,[[\"availableTimezones\",\"activeTimezone\"],[[28,[\"availableTimezones\"]],[28,[\"activeTimezone\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            // we have an additional blank option at the top
            (0, _chai.expect)(this.$('option'), 'number of options').to.have.length(4);
            // blank option is selected
            (0, _chai.expect)(this.$('select').val(), 'selected option value').to.equal('');
            // we indicate the manual override
            (0, _chai.expect)(this.$('p').text()).to.match(/Your timezone has been automatically set to Europe\/London/);
        });

        (0, _mocha.it)('triggers update action on change', function (done) {
            var _this = this;

            var update = _sinon.default.spy();
            this.set('update', update);

            this.render(Ember.HTMLBars.template({
                "id": "0wmIfPrW",
                "block": "{\"statements\":[[1,[33,[\"gh-timezone-select\"],null,[[\"availableTimezones\",\"activeTimezone\",\"update\"],[[28,[\"availableTimezones\"]],[28,[\"activeTimezone\"]],[33,[\"action\"],[[28,[null]],[28,[\"update\"]]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this.$('select').val('Pacific/Pago_Pago').change();
            });

            (0, _wait.default)().then(function () {
                (0, _chai.expect)(update.calledOnce, 'update was called once').to.be.true;
                (0, _chai.expect)(update.firstCall.args[0].name, 'update was passed new timezone').to.equal('Pacific/Pago_Pago');
                done();
            });
        });

        // TODO: mock clock service, fake the time, test we have the correct
        // local time and it changes alongside selection changes
        (0, _mocha.it)('renders local time');
    }); /* jshint expr:true */
});
define('ghost-admin/tests/integration/components/gh-trim-focus-input-test', ['ember-runloop', 'mocha', 'chai', 'ember-mocha'], function (_emberRunloop, _mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Component: gh-trim-focus-input', function () {
        (0, _emberMocha.setupComponentTest)('gh-trim-focus-input', {
            integration: true
        });

        (0, _mocha.it)('trims value on focusOut', function () {
            var _this = this;

            this.set('text', 'some random stuff    ');
            this.render(Ember.HTMLBars.template({
                "id": "vHI0ZKrC",
                "block": "{\"statements\":[[1,[33,[\"gh-trim-focus-input\"],[[28,[\"text\"]]],[[\"update\"],[[33,[\"action\"],[[28,[null]],[33,[\"mut\"],[[28,[\"text\"]]],null]],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this.$('.gh-input').trigger('focusout');
            });

            (0, _chai.expect)(this.get('text')).to.equal('some random stuff');
        });

        (0, _mocha.it)('does not have the autofocus attribute if not set to focus', function () {
            this.set('text', 'some text');
            this.render(Ember.HTMLBars.template({
                "id": "Xcwxj6R2",
                "block": "{\"statements\":[[1,[33,[\"gh-trim-focus-input\"],[[28,[\"text\"]]],[[\"shouldFocus\"],[false]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.gh-input').attr('autofocus')).to.not.be.ok;
        });

        (0, _mocha.it)('has the autofocus attribute if set to focus', function () {
            this.set('text', 'some text');
            this.render(Ember.HTMLBars.template({
                "id": "ks3LKDTs",
                "block": "{\"statements\":[[1,[33,[\"gh-trim-focus-input\"],[[28,[\"text\"]]],[[\"shouldFocus\"],[true]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.gh-input').attr('autofocus')).to.be.ok;
        });

        (0, _mocha.it)('handles undefined values', function () {
            this.set('text', undefined);
            this.render(Ember.HTMLBars.template({
                "id": "ks3LKDTs",
                "block": "{\"statements\":[[1,[33,[\"gh-trim-focus-input\"],[[28,[\"text\"]]],[[\"shouldFocus\"],[true]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.gh-input').attr('autofocus')).to.be.ok;
        });

        (0, _mocha.it)('handles non-string values', function () {
            this.set('text', 10);
            this.render(Ember.HTMLBars.template({
                "id": "ks3LKDTs",
                "block": "{\"statements\":[[1,[33,[\"gh-trim-focus-input\"],[[28,[\"text\"]]],[[\"shouldFocus\"],[true]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$('.gh-input').val()).to.equal('10');
        });
    });
});
define('ghost-admin/tests/integration/components/gh-uploader-test', ['pretender', 'ember-runloop', 'sinon', 'ember-test-selectors', 'ember-test-helpers/wait', 'ember-native-dom-helpers', 'ghost-admin/tests/helpers/file-upload', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _emberRunloop, _sinon, _emberTestSelectors, _wait, _emberNativeDomHelpers, _fileUpload, _mocha, _chai, _emberMocha) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    var stubSuccessfulUpload = function stubSuccessfulUpload(server) {
        var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        server.post('/ghost/api/v0.1/uploads/', function () {
            return [200, { 'Content-Type': 'application/json' }, '"/content/images/test.png"'];
        }, delay);
    };

    var stubFailedUpload = function stubFailedUpload(server, code, error) {
        var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        server.post('/ghost/api/v0.1/uploads/', function () {
            return [code, { 'Content-Type': 'application/json' }, JSON.stringify({
                errors: [{
                    errorType: error,
                    message: 'Error: ' + error
                }]
            })];
        }, delay);
    };

    (0, _mocha.describe)('Integration: Component: gh-uploader', function () {
        (0, _emberMocha.setupComponentTest)('gh-uploader', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.describe)('uploads', function () {
            beforeEach(function () {
                stubSuccessfulUpload(server);
            });

            (0, _mocha.it)('triggers uploads when `files` is set', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var _server$handledReques, lastRequest;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.render(Ember.HTMLBars.template({
                                    "id": "Bwvamxsh",
                                    "block": "{\"statements\":[[6,[\"gh-uploader\"],null,[[\"files\"],[[28,[\"files\"]]]],{\"statements\":[],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));

                                this.set('files', [(0, _fileUpload.createFile)()]);
                                _context.next = 4;
                                return (0, _wait.default)();

                            case 4:
                                _server$handledReques = _slicedToArray(server.handledRequests, 1), lastRequest = _server$handledReques[0];

                                (0, _chai.expect)(server.handledRequests.length).to.equal(1);
                                (0, _chai.expect)(lastRequest.url).to.equal('/ghost/api/v0.1/uploads/');
                                // requestBody is a FormData object
                                // this will fail in anything other than Chrome and Firefox
                                // https://developer.mozilla.org/en-US/docs/Web/API/FormData#Browser_compatibility
                                (0, _chai.expect)(lastRequest.requestBody.has('uploadimage')).to.be.true;

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));

            (0, _mocha.it)('triggers multiple uploads', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.render(Ember.HTMLBars.template({
                                    "id": "Bwvamxsh",
                                    "block": "{\"statements\":[[6,[\"gh-uploader\"],null,[[\"files\"],[[28,[\"files\"]]]],{\"statements\":[],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));

                                this.set('files', [(0, _fileUpload.createFile)(), (0, _fileUpload.createFile)()]);
                                _context2.next = 4;
                                return (0, _wait.default)();

                            case 4:

                                (0, _chai.expect)(server.handledRequests.length).to.equal(2);

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })));

            (0, _mocha.it)('triggers onStart when upload starts', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.set('uploadStarted', _sinon.default.spy());

                                this.render(Ember.HTMLBars.template({
                                    "id": "6yQOo5oh",
                                    "block": "{\"statements\":[[6,[\"gh-uploader\"],null,[[\"files\",\"onStart\"],[[28,[\"files\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadStarted\"]]],null]]],{\"statements\":[],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(), (0, _fileUpload.createFile)()]);
                                _context3.next = 5;
                                return (0, _wait.default)();

                            case 5:

                                (0, _chai.expect)(this.get('uploadStarted').calledOnce).to.be.true;

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));

            (0, _mocha.it)('triggers onUploadSuccess when a file uploads', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var firstCall;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                this.set('fileUploaded', _sinon.default.spy());

                                this.render(Ember.HTMLBars.template({
                                    "id": "VCYs/91v",
                                    "block": "{\"statements\":[[6,[\"gh-uploader\"],null,[[\"files\",\"onUploadSuccess\"],[[28,[\"files\"]],[33,[\"action\"],[[28,[null]],[28,[\"fileUploaded\"]]],null]]],{\"statements\":[],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'file1.png' }), (0, _fileUpload.createFile)()]);
                                _context4.next = 5;
                                return (0, _wait.default)();

                            case 5:

                                // triggered for each file
                                (0, _chai.expect)(this.get('fileUploaded').calledTwice).to.be.true;

                                // filename and url is passed in arg
                                firstCall = this.get('fileUploaded').getCall(0);

                                (0, _chai.expect)(firstCall.args[0].fileName).to.equal('file1.png');
                                (0, _chai.expect)(firstCall.args[0].url).to.equal('/content/images/test.png');

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            })));

            (0, _mocha.it)('triggers onComplete when all files uploaded', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                var _get$getCall$args, result;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                this.set('uploadsFinished', _sinon.default.spy());

                                this.render(Ember.HTMLBars.template({
                                    "id": "5S8Tqkx4",
                                    "block": "{\"statements\":[[6,[\"gh-uploader\"],null,[[\"files\",\"onComplete\"],[[28,[\"files\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadsFinished\"]]],null]]],{\"statements\":[],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'file1.png' }), (0, _fileUpload.createFile)(['test'], { name: 'file2.png' })]);
                                _context5.next = 5;
                                return (0, _wait.default)();

                            case 5:

                                (0, _chai.expect)(this.get('uploadsFinished').calledOnce).to.be.true;

                                // array of filenames and urls is passed in arg
                                _get$getCall$args = _slicedToArray(this.get('uploadsFinished').getCall(0).args, 1), result = _get$getCall$args[0];

                                (0, _chai.expect)(result.length).to.equal(2);
                                (0, _chai.expect)(result[0].fileName).to.equal('file1.png');
                                (0, _chai.expect)(result[0].url).to.equal('/content/images/test.png');
                                (0, _chai.expect)(result[1].fileName).to.equal('file2.png');
                                (0, _chai.expect)(result[1].url).to.equal('/content/images/test.png');

                            case 12:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));

            (0, _mocha.it)('onComplete only passes results for last upload', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                var _get$getCall$args2, results;

                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                this.set('uploadsFinished', _sinon.default.spy());

                                this.render(Ember.HTMLBars.template({
                                    "id": "5S8Tqkx4",
                                    "block": "{\"statements\":[[6,[\"gh-uploader\"],null,[[\"files\",\"onComplete\"],[[28,[\"files\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadsFinished\"]]],null]]],{\"statements\":[],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'file1.png' })]);
                                _context6.next = 5;
                                return (0, _wait.default)();

                            case 5:

                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'file2.png' })]);

                                _context6.next = 8;
                                return (0, _wait.default)();

                            case 8:
                                _get$getCall$args2 = _slicedToArray(this.get('uploadsFinished').getCall(1).args, 1), results = _get$getCall$args2[0];

                                (0, _chai.expect)(results.length).to.equal(1);
                                (0, _chai.expect)(results[0].fileName).to.equal('file2.png');

                            case 11:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            })));

            (0, _mocha.it)('doesn\'t allow new files to be set whilst uploading', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                var _this = this;

                var errorSpy;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                errorSpy = _sinon.default.spy(console, 'error');

                                stubSuccessfulUpload(server, 100);

                                this.render(Ember.HTMLBars.template({
                                    "id": "Bwvamxsh",
                                    "block": "{\"statements\":[[6,[\"gh-uploader\"],null,[[\"files\"],[[28,[\"files\"]]]],{\"statements\":[],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)()]);

                                // logs error because upload is in progress
                                _emberRunloop.default.later(function () {
                                    _this.set('files', [(0, _fileUpload.createFile)()]);
                                }, 50);

                                // runs ok because original upload has finished
                                _emberRunloop.default.later(function () {
                                    _this.set('files', [(0, _fileUpload.createFile)()]);
                                }, 200);

                                _context7.next = 8;
                                return (0, _wait.default)();

                            case 8:

                                (0, _chai.expect)(server.handledRequests.length).to.equal(2);
                                (0, _chai.expect)(errorSpy.calledOnce).to.be.true;
                                errorSpy.restore();

                            case 11:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            })));

            (0, _mocha.it)('yields isUploading whilst upload is in progress', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                stubSuccessfulUpload(server, 200);

                                this.render(Ember.HTMLBars.template({
                                    "id": "YtWmcDPn",
                                    "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-uploader\"],null,[[\"files\"],[[28,[\"files\"]]]],{\"statements\":[[6,[\"if\"],[[28,[\"uploader\",\"isUploading\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"is-uploading-test\"],[13],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"uploader\"]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));

                                this.set('files', [(0, _fileUpload.createFile)(), (0, _fileUpload.createFile)()]);

                                _emberRunloop.default.later(function () {
                                    (0, _chai.expect)((0, _emberNativeDomHelpers.find)('.is-uploading-test')).to.exist;
                                }, 100);

                                _context8.next = 6;
                                return (0, _wait.default)();

                            case 6:

                                (0, _chai.expect)((0, _emberNativeDomHelpers.find)('.is-uploading-test')).to.not.exist;

                            case 7:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            })));

            (0, _mocha.it)('yields progressBar component with total upload progress', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
                var progressWidth;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                stubSuccessfulUpload(server, 200);

                                this.render(Ember.HTMLBars.template({
                                    "id": "4uOmjq3g",
                                    "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-uploader\"],null,[[\"files\"],[[28,[\"files\"]]]],{\"statements\":[[0,\"                \"],[1,[28,[\"uploader\",\"progressBar\"]],false],[0,\"\\n\"]],\"locals\":[\"uploader\"]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));

                                this.set('files', [(0, _fileUpload.createFile)(), (0, _fileUpload.createFile)()]);

                                _emberRunloop.default.later(function () {
                                    (0, _chai.expect)((0, _emberNativeDomHelpers.find)((0, _emberTestSelectors.default)('progress-bar'))).to.exist;
                                    var progressWidth = parseInt((0, _emberNativeDomHelpers.find)((0, _emberTestSelectors.default)('progress-bar')).style.width);
                                    (0, _chai.expect)(progressWidth).to.be.above(0);
                                    (0, _chai.expect)(progressWidth).to.be.below(100);
                                }, 100);

                                _context9.next = 6;
                                return (0, _wait.default)();

                            case 6:
                                progressWidth = parseInt((0, _emberNativeDomHelpers.find)((0, _emberTestSelectors.default)('progress-bar')).style.width);

                                (0, _chai.expect)(progressWidth).to.equal(100);

                            case 8:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            })));

            (0, _mocha.it)('yields files property', function () {
                this.render(Ember.HTMLBars.template({
                    "id": "L6iMhTOh",
                    "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-uploader\"],null,[[\"files\"],[[28,[\"files\"]]]],{\"statements\":[[6,[\"each\"],[[28,[\"uploader\",\"files\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"file\"],[13],[1,[28,[\"file\",\"name\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"file\"]},null]],\"locals\":[\"uploader\"]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                    "meta": {}
                }));

                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'file1.png' }), (0, _fileUpload.createFile)(['test'], { name: 'file2.png' })]);

                (0, _chai.expect)((0, _emberNativeDomHelpers.findAll)('.file')[0].textContent).to.equal('file1.png');
                (0, _chai.expect)((0, _emberNativeDomHelpers.findAll)('.file')[1].textContent).to.equal('file2.png');
            });

            (0, _mocha.it)('can be cancelled', _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                stubSuccessfulUpload(server, 200);
                                this.set('cancelled', _sinon.default.spy());
                                this.set('complete', _sinon.default.spy());

                                this.render(Ember.HTMLBars.template({
                                    "id": "onMyIPM9",
                                    "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-uploader\"],null,[[\"files\",\"onCancel\"],[[28,[\"files\"]],[33,[\"action\"],[[28,[null]],[28,[\"cancelled\"]]],null]]],{\"statements\":[[0,\"                \"],[11,\"button\",[]],[15,\"class\",\"cancel-button\"],[5,[\"action\"],[[28,[null]],[28,[\"uploader\",\"cancel\"]]]],[13],[0,\"Cancel\"],[14],[0,\"\\n\"]],\"locals\":[\"uploader\"]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));

                                this.set('files', [(0, _fileUpload.createFile)()]);

                                _emberRunloop.default.later(function () {
                                    (0, _emberNativeDomHelpers.click)('.cancel-button');
                                }, 50);

                                _context10.next = 8;
                                return (0, _wait.default)();

                            case 8:

                                (0, _chai.expect)(this.get('cancelled').calledOnce, 'onCancel triggered').to.be.true;
                                (0, _chai.expect)(this.get('complete').notCalled, 'onComplete triggered').to.be.true;

                            case 10:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            })));

            (0, _mocha.it)('uploads to supplied `uploadUrl`', _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
                var _server$handledReques2, lastRequest;

                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                server.post('/ghost/api/v0.1/images/', function () {
                                    return [200, { 'Content-Type': 'application/json' }, '"/content/images/test.png"'];
                                });

                                this.render(Ember.HTMLBars.template({
                                    "id": "v1Xg9OuY",
                                    "block": "{\"statements\":[[6,[\"gh-uploader\"],null,[[\"files\",\"uploadUrl\"],[[28,[\"files\"]],\"/images/\"]],{\"statements\":[],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)()]);
                                _context11.next = 5;
                                return (0, _wait.default)();

                            case 5:
                                _server$handledReques2 = _slicedToArray(server.handledRequests, 1), lastRequest = _server$handledReques2[0];

                                (0, _chai.expect)(lastRequest.url).to.equal('/ghost/api/v0.1/images/');

                            case 7:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            })));

            (0, _mocha.it)('passes supplied paramName in request', _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
                var _server$handledReques3, lastRequest;

                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                this.render(Ember.HTMLBars.template({
                                    "id": "vXc9ONS/",
                                    "block": "{\"statements\":[[6,[\"gh-uploader\"],null,[[\"files\",\"paramName\"],[[28,[\"files\"]],\"testupload\"]],{\"statements\":[],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)()]);
                                _context12.next = 4;
                                return (0, _wait.default)();

                            case 4:
                                _server$handledReques3 = _slicedToArray(server.handledRequests, 1), lastRequest = _server$handledReques3[0];
                                // requestBody is a FormData object
                                // this will fail in anything other than Chrome and Firefox
                                // https://developer.mozilla.org/en-US/docs/Web/API/FormData#Browser_compatibility

                                (0, _chai.expect)(lastRequest.requestBody.has('testupload')).to.be.true;

                            case 6:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            })));
        });

        (0, _mocha.describe)('validation', function () {
            (0, _mocha.it)('validates file extensions by default', _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
                var _get$firstCall$args, onFailedResult;

                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                this.set('onFailed', _sinon.default.spy());

                                this.render(Ember.HTMLBars.template({
                                    "id": "LpLdCHNW",
                                    "block": "{\"statements\":[[0,\"\\n                \"],[6,[\"gh-uploader\"],null,[[\"files\",\"extensions\",\"onFailed\"],[[28,[\"files\"]],\"jpg,jpeg\",[33,[\"action\"],[[28,[null]],[28,[\"onFailed\"]]],null]]],{\"statements\":[],\"locals\":[]},null],[0,\"\\n            \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'test.png' })]);
                                _context13.next = 5;
                                return (0, _wait.default)();

                            case 5:
                                _get$firstCall$args = _slicedToArray(this.get('onFailed').firstCall.args, 1), onFailedResult = _get$firstCall$args[0];

                                (0, _chai.expect)(onFailedResult.length).to.equal(1);
                                (0, _chai.expect)(onFailedResult[0].fileName, 'onFailed file name').to.equal('test.png');
                                (0, _chai.expect)(onFailedResult[0].message, 'onFailed message').to.match(/not supported/);

                            case 9:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            })));

            (0, _mocha.it)('accepts custom validation method', _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
                var _get$firstCall$args2, onFailedResult;

                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                this.set('validate', function (file) {
                                    return file.name + ' failed test validation';
                                });
                                this.set('onFailed', _sinon.default.spy());

                                this.render(Ember.HTMLBars.template({
                                    "id": "ZtJJN3H1",
                                    "block": "{\"statements\":[[0,\"\\n                \"],[6,[\"gh-uploader\"],null,[[\"files\",\"validate\",\"onFailed\"],[[28,[\"files\"]],[33,[\"action\"],[[28,[null]],[28,[\"validate\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"onFailed\"]]],null]]],{\"statements\":[],\"locals\":[]},null],[0,\"\\n            \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'test.png' })]);
                                _context14.next = 6;
                                return (0, _wait.default)();

                            case 6:
                                _get$firstCall$args2 = _slicedToArray(this.get('onFailed').firstCall.args, 1), onFailedResult = _get$firstCall$args2[0];

                                (0, _chai.expect)(onFailedResult.length).to.equal(1);
                                (0, _chai.expect)(onFailedResult[0].fileName).to.equal('test.png');
                                (0, _chai.expect)(onFailedResult[0].message).to.equal('test.png failed test validation');

                            case 10:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            })));

            (0, _mocha.it)('yields errors when validation fails', _asyncToGenerator(regeneratorRuntime.mark(function _callee15() {
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                this.render(Ember.HTMLBars.template({
                                    "id": "SCrkDn/L",
                                    "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-uploader\"],null,[[\"files\",\"extensions\"],[[28,[\"files\"]],\"jpg,jpeg\"]],{\"statements\":[[6,[\"each\"],[[28,[\"uploader\",\"errors\"]]],null,{\"statements\":[[0,\"                        \"],[11,\"div\",[]],[15,\"class\",\"error-fileName\"],[13],[1,[28,[\"error\",\"fileName\"]],false],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[28,[\"error\",\"message\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"error\"]},null]],\"locals\":[\"uploader\"]},null],[0,\"            \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'test.png' })]);
                                _context15.next = 4;
                                return (0, _wait.default)();

                            case 4:

                                (0, _chai.expect)((0, _emberNativeDomHelpers.find)('.error-fileName').textContent).to.equal('test.png');
                                (0, _chai.expect)((0, _emberNativeDomHelpers.find)('.error-message').textContent).to.match(/not supported/);

                            case 6:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            })));
        });

        (0, _mocha.describe)('server errors', function () {
            beforeEach(function () {
                stubFailedUpload(server, 500, 'No upload for you');
            });

            (0, _mocha.it)('triggers onFailed when uploads complete', _asyncToGenerator(regeneratorRuntime.mark(function _callee16() {
                var _get$firstCall$args3, failures;

                return regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                this.set('uploadFailed', _sinon.default.spy());
                                this.set('uploadComplete', _sinon.default.spy());

                                this.render(Ember.HTMLBars.template({
                                    "id": "XimNpjoT",
                                    "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-uploader\"],null,[[\"files\",\"onFailed\",\"onComplete\"],[[28,[\"files\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadFailed\"]]],null],[33,[\"action\"],[[28,[null]],[28,[\"uploadComplete\"]]],null]]],{\"statements\":[],\"locals\":[]},null],[0,\"            \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'file1.png' }), (0, _fileUpload.createFile)(['test'], { name: 'file2.png' })]);
                                _context16.next = 6;
                                return (0, _wait.default)();

                            case 6:

                                (0, _chai.expect)(this.get('uploadFailed').calledOnce).to.be.true;
                                (0, _chai.expect)(this.get('uploadComplete').calledOnce).to.be.true;

                                _get$firstCall$args3 = _slicedToArray(this.get('uploadFailed').firstCall.args, 1), failures = _get$firstCall$args3[0];

                                (0, _chai.expect)(failures.length).to.equal(2);
                                (0, _chai.expect)(failures[0].fileName).to.equal('file1.png');
                                (0, _chai.expect)(failures[0].message).to.equal('Error: No upload for you');

                            case 12:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            })));

            (0, _mocha.it)('triggers onUploadFail when each upload fails', _asyncToGenerator(regeneratorRuntime.mark(function _callee17() {
                var _get$firstCall$args4, firstFailure, _get$secondCall$args, secondFailure;

                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                this.set('uploadFail', _sinon.default.spy());

                                this.render(Ember.HTMLBars.template({
                                    "id": "Nj3hG13n",
                                    "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-uploader\"],null,[[\"files\",\"onUploadFail\"],[[28,[\"files\"]],[33,[\"action\"],[[28,[null]],[28,[\"uploadFail\"]]],null]]],{\"statements\":[],\"locals\":[]},null],[0,\"            \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'file1.png' }), (0, _fileUpload.createFile)(['test'], { name: 'file2.png' })]);
                                _context17.next = 5;
                                return (0, _wait.default)();

                            case 5:

                                (0, _chai.expect)(this.get('uploadFail').calledTwice).to.be.true;

                                _get$firstCall$args4 = _slicedToArray(this.get('uploadFail').firstCall.args, 1), firstFailure = _get$firstCall$args4[0];

                                (0, _chai.expect)(firstFailure.fileName).to.equal('file1.png');
                                (0, _chai.expect)(firstFailure.message).to.equal('Error: No upload for you');

                                _get$secondCall$args = _slicedToArray(this.get('uploadFail').secondCall.args, 1), secondFailure = _get$secondCall$args[0];

                                (0, _chai.expect)(secondFailure.fileName).to.equal('file2.png');
                                (0, _chai.expect)(secondFailure.message).to.equal('Error: No upload for you');

                            case 12:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            })));

            (0, _mocha.it)('yields errors when uploads fail', _asyncToGenerator(regeneratorRuntime.mark(function _callee18() {
                return regeneratorRuntime.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                this.render(Ember.HTMLBars.template({
                                    "id": "HXdF0GDI",
                                    "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-uploader\"],null,[[\"files\"],[[28,[\"files\"]]]],{\"statements\":[[6,[\"each\"],[[28,[\"uploader\",\"errors\"]]],null,{\"statements\":[[0,\"                        \"],[11,\"div\",[]],[15,\"class\",\"error-fileName\"],[13],[1,[28,[\"error\",\"fileName\"]],false],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"error-message\"],[13],[1,[28,[\"error\",\"message\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"error\"]},null]],\"locals\":[\"uploader\"]},null],[0,\"            \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                                    "meta": {}
                                }));
                                this.set('files', [(0, _fileUpload.createFile)(['test'], { name: 'test.png' })]);
                                _context18.next = 4;
                                return (0, _wait.default)();

                            case 4:

                                (0, _chai.expect)((0, _emberNativeDomHelpers.find)('.error-fileName').textContent).to.equal('test.png');
                                (0, _chai.expect)((0, _emberNativeDomHelpers.find)('.error-message').textContent).to.equal('Error: No upload for you');

                            case 6:
                            case 'end':
                                return _context18.stop();
                        }
                    }
                }, _callee18, this);
            })));
        });
    });
});
define('ghost-admin/tests/integration/components/gh-validation-status-container-test', ['ember-data', 'ember-object', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha'], function (_emberData, _emberObject, _wait, _mocha, _chai, _emberMocha) {
    'use strict';

    var Errors = _emberData.default.Errors;


    (0, _mocha.describe)('Integration: Component: gh-validation-status-container', function () {
        (0, _emberMocha.setupComponentTest)('gh-validation-status-container', {
            integration: true
        });

        beforeEach(function () {
            var testObject = _emberObject.default.create();
            testObject.set('name', 'Test');
            testObject.set('hasValidated', []);
            testObject.set('errors', Errors.create());

            this.set('testObject', testObject);
        });

        (0, _mocha.it)('has no success/error class by default', function () {
            var _this = this;

            this.render(Ember.HTMLBars.template({
                "id": "0XQiIclj",
                "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-validation-status-container\"],null,[[\"class\",\"property\",\"errors\",\"hasValidated\"],[\"gh-test\",\"name\",[28,[\"testObject\",\"errors\"]],[28,[\"testObject\",\"hasValidated\"]]]],{\"statements\":[],\"locals\":[]},null],[0,\"        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            return (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this.$('.gh-test')).to.have.length(1);
                (0, _chai.expect)(_this.$('.gh-test').hasClass('success')).to.be.false;
                (0, _chai.expect)(_this.$('.gh-test').hasClass('error')).to.be.false;
            });
        });

        (0, _mocha.it)('has success class when valid', function () {
            var _this2 = this;

            this.get('testObject.hasValidated').push('name');

            this.render(Ember.HTMLBars.template({
                "id": "0XQiIclj",
                "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-validation-status-container\"],null,[[\"class\",\"property\",\"errors\",\"hasValidated\"],[\"gh-test\",\"name\",[28,[\"testObject\",\"errors\"]],[28,[\"testObject\",\"hasValidated\"]]]],{\"statements\":[],\"locals\":[]},null],[0,\"        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            return (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this2.$('.gh-test')).to.have.length(1);
                (0, _chai.expect)(_this2.$('.gh-test').hasClass('success')).to.be.true;
                (0, _chai.expect)(_this2.$('.gh-test').hasClass('error')).to.be.false;
            });
        });

        (0, _mocha.it)('has error class when invalid', function () {
            var _this3 = this;

            this.get('testObject.hasValidated').push('name');
            this.get('testObject.errors').add('name', 'has error');

            this.render(Ember.HTMLBars.template({
                "id": "0XQiIclj",
                "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-validation-status-container\"],null,[[\"class\",\"property\",\"errors\",\"hasValidated\"],[\"gh-test\",\"name\",[28,[\"testObject\",\"errors\"]],[28,[\"testObject\",\"hasValidated\"]]]],{\"statements\":[],\"locals\":[]},null],[0,\"        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            return (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this3.$('.gh-test')).to.have.length(1);
                (0, _chai.expect)(_this3.$('.gh-test').hasClass('success')).to.be.false;
                (0, _chai.expect)(_this3.$('.gh-test').hasClass('error')).to.be.true;
            });
        });

        (0, _mocha.it)('still renders if hasValidated is undefined', function () {
            var _this4 = this;

            this.set('testObject.hasValidated', undefined);

            this.render(Ember.HTMLBars.template({
                "id": "0XQiIclj",
                "block": "{\"statements\":[[0,\"\\n\"],[6,[\"gh-validation-status-container\"],null,[[\"class\",\"property\",\"errors\",\"hasValidated\"],[\"gh-test\",\"name\",[28,[\"testObject\",\"errors\"]],[28,[\"testObject\",\"hasValidated\"]]]],{\"statements\":[],\"locals\":[]},null],[0,\"        \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            return (0, _wait.default)().then(function () {
                (0, _chai.expect)(_this4.$('.gh-test')).to.have.length(1);
            });
        });
    });
});
define('ghost-admin/tests/integration/components/modals/delete-subscriber-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: modals/delete-subscriber', function () {
        (0, _emberMocha.setupComponentTest)('modals/delete-subscriber', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#modals/delete-subscriber}}
            //     template content
            //   {{/modals/delete-subscriber}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "UuE/2A1B",
                "block": "{\"statements\":[[1,[26,[\"modals/delete-subscriber\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/modals/import-subscribers-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: modals/import-subscribers', function () {
        (0, _emberMocha.setupComponentTest)('modals/import-subscribers', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#modals/import-subscribers}}
            //     template content
            //   {{/modals/import-subscribers}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "PhZN2N62",
                "block": "{\"statements\":[[1,[26,[\"modals/import-subscribers\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/modals/new-subscriber-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: modals/new-subscriber', function () {
        (0, _emberMocha.setupComponentTest)('modals/new-subscriber', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#modals/new-subscriber}}
            //     template content
            //   {{/modals/new-subscriber}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "Lv3GPsAp",
                "block": "{\"statements\":[[1,[26,[\"modals/new-subscriber\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/modals/upload-theme-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: modals/upload-theme', function () {
        (0, _emberMocha.setupComponentTest)('modals/upload-theme', {
            integration: true
        });

        (0, _mocha.it)('renders', function () {
            // Set any properties with this.set('myProperty', 'value');
            // Handle any actions with this.on('myAction', function(val) { ... });
            // Template block usage:
            // this.render(hbs`
            //   {{#modals/upload-theme}}
            //     template content
            //   {{/modals/upload-theme}}
            // `);

            this.render(Ember.HTMLBars.template({
                "id": "+IUGjS2E",
                "block": "{\"statements\":[[1,[26,[\"modals/upload-theme\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));
            (0, _chai.expect)(this.$()).to.have.length(1);
        });
    });
});
define('ghost-admin/tests/integration/components/transfer-owner-test', ['rsvp', 'ember-runloop', 'sinon', 'mocha', 'chai', 'ember-mocha'], function (_rsvp, _emberRunloop, _sinon, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Integration: Component: modals/transfer-owner', function () {
        (0, _emberMocha.setupComponentTest)('transfer-owner', {
            integration: true
        });

        (0, _mocha.it)('triggers confirm action', function () {
            var _this = this;

            var confirm = _sinon.default.stub();
            var closeModal = _sinon.default.spy();

            confirm.returns(_rsvp.default.resolve({}));

            this.on('confirm', confirm);
            this.on('closeModal', closeModal);

            this.render(Ember.HTMLBars.template({
                "id": "2JU4lDJI",
                "block": "{\"statements\":[[1,[33,[\"modals/transfer-owner\"],null,[[\"confirm\",\"closeModal\"],[[33,[\"action\"],[[28,[null]],\"confirm\"],null],[33,[\"action\"],[[28,[null]],\"closeModal\"],null]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
            }));

            (0, _emberRunloop.default)(function () {
                _this.$('.gh-btn.gh-btn-red').click();
            });

            (0, _chai.expect)(confirm.calledOnce, 'confirm called').to.be.true;
            (0, _chai.expect)(closeModal.calledOnce, 'closeModal called').to.be.true;
        });
    });
});
define('ghost-admin/tests/integration/services/ajax-test', ['pretender', 'rsvp', 'ember-service', 'ghost-admin/config/environment', 'mocha', 'chai', 'ember-ajax/errors', 'ghost-admin/services/ajax', 'ember-mocha'], function (_pretender, _rsvp, _emberService, _environment, _mocha, _chai, _errors, _ajax, _emberMocha) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function stubAjaxEndpoint(server) {
        var response = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

        server.get('/test/', function () {
            return [code, { 'Content-Type': 'application/json' }, JSON.stringify(response)];
        });
    }

    (0, _mocha.describe)('Integration: Service: ajax', function () {
        (0, _emberMocha.setupTest)('service:ajax', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('adds Ghost version header to requests', function (done) {
            var version = _environment.default.APP.version;

            var ajax = this.subject();

            stubAjaxEndpoint(server, {});

            ajax.request('/test/').then(function () {
                var _server$handledReques = _slicedToArray(server.handledRequests, 1),
                    request = _server$handledReques[0];

                (0, _chai.expect)(request.requestHeaders['X-Ghost-Version']).to.equal(version);
                done();
            });
        });

        (0, _mocha.it)('correctly parses single message response text', function (done) {
            var error = { message: 'Test Error' };
            stubAjaxEndpoint(server, error, 500);

            var ajax = this.subject();

            ajax.request('/test/').then(function () {
                (0, _chai.expect)(false).to.be.true();
            }).catch(function (error) {
                (0, _chai.expect)(error.errors.length).to.equal(1);
                (0, _chai.expect)(error.errors[0].message).to.equal('Test Error');
                done();
            });
        });

        (0, _mocha.it)('correctly parses single error response text', function (done) {
            var error = { error: 'Test Error' };
            stubAjaxEndpoint(server, error, 500);

            var ajax = this.subject();

            ajax.request('/test/').then(function () {
                (0, _chai.expect)(false).to.be.true();
            }).catch(function (error) {
                (0, _chai.expect)(error.errors.length).to.equal(1);
                (0, _chai.expect)(error.errors[0].message).to.equal('Test Error');
                done();
            });
        });

        (0, _mocha.it)('correctly parses multiple error messages', function (done) {
            var error = { errors: ['First Error', 'Second Error'] };
            stubAjaxEndpoint(server, error, 500);

            var ajax = this.subject();

            ajax.request('/test/').then(function () {
                (0, _chai.expect)(false).to.be.true();
            }).catch(function (error) {
                (0, _chai.expect)(error.errors.length).to.equal(2);
                (0, _chai.expect)(error.errors[0].message).to.equal('First Error');
                (0, _chai.expect)(error.errors[1].message).to.equal('Second Error');
                done();
            });
        });

        (0, _mocha.it)('returns default error object for non built-in error', function (done) {
            stubAjaxEndpoint(server, {}, 500);

            var ajax = this.subject();

            ajax.request('/test/').then(function () {
                (0, _chai.expect)(false).to.be.true;
            }).catch(function (error) {
                (0, _chai.expect)((0, _errors.isAjaxError)(error)).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('handles error checking for built-in errors', function (done) {
            stubAjaxEndpoint(server, '', 401);

            var ajax = this.subject();

            ajax.request('/test/').then(function () {
                (0, _chai.expect)(false).to.be.true;
            }).catch(function (error) {
                (0, _chai.expect)((0, _errors.isUnauthorizedError)(error)).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('handles error checking for VersionMismatchError', function (done) {
            server.get('/test/', function () {
                return [400, { 'Content-Type': 'application/json' }, JSON.stringify({
                    errors: [{
                        errorType: 'VersionMismatchError',
                        statusCode: 400
                    }]
                })];
            });

            var ajax = this.subject();

            ajax.request('/test/').then(function () {
                (0, _chai.expect)(false).to.be.true;
            }).catch(function (error) {
                (0, _chai.expect)((0, _ajax.isVersionMismatchError)(error)).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('handles error checking for RequestEntityTooLargeError on 413 errors', function (done) {
            stubAjaxEndpoint(server, {}, 413);

            var ajax = this.subject();

            ajax.request('/test/').then(function () {
                (0, _chai.expect)(false).to.be.true;
            }).catch(function (error) {
                (0, _chai.expect)((0, _ajax.isRequestEntityTooLargeError)(error)).to.be.true;
                done();
            });
        });

        (0, _mocha.it)('handles error checking for UnsupportedMediaTypeError on 415 errors', function (done) {
            stubAjaxEndpoint(server, {}, 415);

            var ajax = this.subject();

            ajax.request('/test/').then(function () {
                (0, _chai.expect)(false).to.be.true;
            }).catch(function (error) {
                (0, _chai.expect)((0, _ajax.isUnsupportedMediaTypeError)(error)).to.be.true;
                done();
            });
        });

        /* eslint-disable camelcase */
        (0, _mocha.describe)('session handling', function () {
            var successfulRequest = false;

            var sessionStub = _emberService.default.extend({
                isAuthenticated: true,
                restoreCalled: false,
                authenticated: null,

                init: function init() {
                    this.authenticated = {
                        expires_at: new Date().getTime() - 10000,
                        refresh_token: 'RefreshMe123'
                    };
                },
                restore: function restore() {
                    this.restoreCalled = true;
                    this.authenticated.expires_at = new Date().getTime() + 10000;
                    return _rsvp.default.resolve();
                },
                authorize: function authorize() {}
            });

            beforeEach(function () {
                server.get('/ghost/api/v0.1/test/', function () {
                    return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
                        success: true
                    })];
                });

                server.post('/ghost/api/v0.1/authentication/token', function () {
                    return [401, { 'Content-Type': 'application/json' }, JSON.stringify({})];
                });
            });

            (0, _mocha.it)('can restore an expired session', function (done) {
                var ajax = this.subject();
                ajax.set('session', sessionStub.create());

                ajax.request('/ghost/api/v0.1/test/');

                ajax.request('/ghost/api/v0.1/test/').then(function (result) {
                    (0, _chai.expect)(ajax.get('session.restoreCalled'), 'restoreCalled').to.be.true;
                    (0, _chai.expect)(result.success, 'result.success').to.be.true;
                    done();
                }).catch(function () {
                    (0, _chai.expect)(true, 'request failed').to.be.false;
                    done();
                });
            });

            (0, _mocha.it)('errors correctly when session restoration fails', function (done) {
                var ajax = this.subject();
                var invalidateCalled = false;

                ajax.set('session', sessionStub.create());
                ajax.set('session.restore', function () {
                    this.set('restoreCalled', true);
                    return ajax.post('/ghost/api/v0.1/authentication/token');
                });
                ajax.set('session.invalidate', function () {
                    invalidateCalled = true;
                });

                stubAjaxEndpoint(server, {}, 401);

                ajax.request('/ghost/api/v0.1/test/').then(function () {
                    (0, _chai.expect)(true, 'request was successful').to.be.false;
                    done();
                }).catch(function () {
                    // TODO: fix the error return when a session restore fails
                    // expect(isUnauthorizedError(error)).to.be.true;
                    (0, _chai.expect)(ajax.get('session.restoreCalled'), 'restoreCalled').to.be.true;
                    (0, _chai.expect)(successfulRequest, 'successfulRequest').to.be.false;
                    (0, _chai.expect)(invalidateCalled, 'invalidateCalled').to.be.true;
                    done();
                });
            });
        });
    });
});
define('ghost-admin/tests/integration/services/config-test', ['pretender', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _wait, _mocha, _chai, _emberMocha) {
    'use strict';

    function stubAvailableTimezonesEndpoint(server) {
        server.get('/ghost/api/v0.1/configuration/timezones', function () {
            return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
                configuration: [{
                    timezones: [{
                        label: '(GMT -11:00) Midway Island, Samoa',
                        name: 'Pacific/Pago_Pago',
                        offset: -660
                    }, {
                        label: '(GMT) Greenwich Mean Time : Dublin, Edinburgh, London',
                        name: 'Europe/Dublin',
                        offset: 0
                    }]
                }]
            })];
        });
    }

    (0, _mocha.describe)('Integration: Service: config', function () {
        (0, _emberMocha.setupTest)('service:config', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('returns a list of timezones in the expected format', function (done) {
            var service = this.subject();
            stubAvailableTimezonesEndpoint(server);

            service.get('availableTimezones').then(function (timezones) {
                (0, _chai.expect)(timezones.length).to.equal(2);
                (0, _chai.expect)(timezones[0].name).to.equal('Pacific/Pago_Pago');
                (0, _chai.expect)(timezones[0].label).to.equal('(GMT -11:00) Midway Island, Samoa');
                (0, _chai.expect)(timezones[1].name).to.equal('Europe/Dublin');
                (0, _chai.expect)(timezones[1].label).to.equal('(GMT) Greenwich Mean Time : Dublin, Edinburgh, London');
                done();
            });
        });

        (0, _mocha.it)('normalizes blogUrl to non-trailing-slash', function (done) {
            var stubBlogUrl = function stubBlogUrl(blogUrl) {
                server.get('/ghost/api/v0.1/configuration/', function () {
                    return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
                        configuration: [{
                            blogUrl: blogUrl
                        }]
                    })];
                });
            };
            var service = this.subject();

            stubBlogUrl('http://localhost:2368/');

            service.fetch().then(function () {
                (0, _chai.expect)(service.get('blogUrl'), 'trailing-slash').to.equal('http://localhost:2368');
            });

            (0, _wait.default)().then(function () {
                stubBlogUrl('http://localhost:2368');

                service.fetch().then(function () {
                    (0, _chai.expect)(service.get('blogUrl'), 'non-trailing-slash').to.equal('http://localhost:2368');

                    done();
                });
            });
        });
    });
});
define('ghost-admin/tests/integration/services/feature-test', ['ember', 'ghost-admin/services/feature', 'pretender', 'ember-runloop', 'ember-test-helpers/wait', 'mocha', 'ember-mocha'], function (_ember, _feature, _pretender, _emberRunloop, _wait, _mocha, _emberMocha) {
    'use strict';

    var EmberError = _ember.default.Error;


    function stubSettings(server, labs) {
        var validSave = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var settings = [{
            id: '1',
            type: 'blog',
            key: 'labs',
            value: JSON.stringify(labs)
        }];

        server.get('/ghost/api/v0.1/settings/', function () {
            return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ settings: settings })];
        });

        server.put('/ghost/api/v0.1/settings/', function (request) {
            var statusCode = validSave ? 200 : 400;
            var response = validSave ? request.requestBody : JSON.stringify({
                errors: [{
                    message: 'Test Error'
                }]
            });

            return [statusCode, { 'Content-Type': 'application/json' }, response];
        });
    }

    function stubUser(server, accessibility) {
        var validSave = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var users = [{
            id: '1',
            // Add extra properties for the validations
            name: 'Test User',
            email: 'test@example.com',
            accessibility: JSON.stringify(accessibility),
            roles: [{
                id: 1,
                name: 'Owner',
                description: 'Owner'
            }]
        }];

        server.get('/ghost/api/v0.1/users/me/', function () {
            return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ users: users })];
        });

        server.put('/ghost/api/v0.1/users/1/', function (request) {
            var statusCode = validSave ? 200 : 400;
            var response = validSave ? request.requestBody : JSON.stringify({
                errors: [{
                    message: 'Test Error'
                }]
            });

            return [statusCode, { 'Content-Type': 'application/json' }, response];
        });
    }

    function addTestFlag() {
        _feature.default.reopen({
            testFlag: (0, _feature.feature)('testFlag'),
            testUserFlag: (0, _feature.feature)('testUserFlag', true)
        });
    }

    (0, _mocha.describe)('Integration: Service: feature', function () {
        (0, _emberMocha.setupTest)('service:feature', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('loads labs and user settings correctly', function () {
            stubSettings(server, { testFlag: true });
            stubUser(server, { testUserFlag: true });

            addTestFlag();

            var service = this.subject();

            return service.fetch().then(function () {
                expect(service.get('testFlag')).to.be.true;
                expect(service.get('testUserFlag')).to.be.true;
            });
        });

        (0, _mocha.it)('returns false for set flag with config false and labs false', function () {
            stubSettings(server, { testFlag: false });
            stubUser(server, {});

            addTestFlag();

            var service = this.subject();
            service.get('config').set('testFlag', false);

            return service.fetch().then(function () {
                expect(service.get('labs.testFlag')).to.be.false;
                expect(service.get('testFlag')).to.be.false;
            });
        });

        (0, _mocha.it)('returns true for set flag with config true and labs false', function () {
            stubSettings(server, { testFlag: false });
            stubUser(server, {});

            addTestFlag();

            var service = this.subject();
            service.get('config').set('testFlag', true);

            return service.fetch().then(function () {
                expect(service.get('labs.testFlag')).to.be.false;
                expect(service.get('testFlag')).to.be.true;
            });
        });

        (0, _mocha.it)('returns true for set flag with config false and labs true', function () {
            stubSettings(server, { testFlag: true });
            stubUser(server, {});

            addTestFlag();

            var service = this.subject();
            service.get('config').set('testFlag', false);

            return service.fetch().then(function () {
                expect(service.get('labs.testFlag')).to.be.true;
                expect(service.get('testFlag')).to.be.true;
            });
        });

        (0, _mocha.it)('returns true for set flag with config true and labs true', function () {
            stubSettings(server, { testFlag: true });
            stubUser(server, {});

            addTestFlag();

            var service = this.subject();
            service.get('config').set('testFlag', true);

            return service.fetch().then(function () {
                expect(service.get('labs.testFlag')).to.be.true;
                expect(service.get('testFlag')).to.be.true;
            });
        });

        (0, _mocha.it)('returns false for set flag with accessibility false', function () {
            stubSettings(server, {});
            stubUser(server, { testUserFlag: false });

            addTestFlag();

            var service = this.subject();

            return service.fetch().then(function () {
                expect(service.get('accessibility.testUserFlag')).to.be.false;
                expect(service.get('testUserFlag')).to.be.false;
            });
        });

        (0, _mocha.it)('returns true for set flag with accessibility true', function () {
            stubSettings(server, {});
            stubUser(server, { testUserFlag: true });

            addTestFlag();

            var service = this.subject();

            return service.fetch().then(function () {
                expect(service.get('accessibility.testUserFlag')).to.be.true;
                expect(service.get('testUserFlag')).to.be.true;
            });
        });

        (0, _mocha.it)('saves labs setting correctly', function () {
            stubSettings(server, { testFlag: false });
            stubUser(server, { testUserFlag: false });

            addTestFlag();

            var service = this.subject();
            service.get('config').set('testFlag', false);

            return service.fetch().then(function () {
                expect(service.get('testFlag')).to.be.false;

                (0, _emberRunloop.default)(function () {
                    service.set('testFlag', true);
                });

                return (0, _wait.default)().then(function () {
                    expect(server.handlers[1].numberOfCalls).to.equal(1);
                    expect(service.get('testFlag')).to.be.true;
                });
            });
        });

        (0, _mocha.it)('saves accessibility setting correctly', function () {
            stubSettings(server, {});
            stubUser(server, { testUserFlag: false });

            addTestFlag();

            var service = this.subject();

            return service.fetch().then(function () {
                expect(service.get('testUserFlag')).to.be.false;

                (0, _emberRunloop.default)(function () {
                    service.set('testUserFlag', true);
                });

                return (0, _wait.default)().then(function () {
                    expect(server.handlers[3].numberOfCalls).to.equal(1);
                    expect(service.get('testUserFlag')).to.be.true;
                });
            });
        });

        (0, _mocha.it)('notifies for server errors on labs save', function () {
            stubSettings(server, { testFlag: false }, false);
            stubUser(server, {});

            addTestFlag();

            var service = this.subject();
            service.get('config').set('testFlag', false);

            return service.fetch().then(function () {
                expect(service.get('testFlag')).to.be.false;

                (0, _emberRunloop.default)(function () {
                    service.set('testFlag', true);
                });

                return (0, _wait.default)().then(function () {
                    expect(server.handlers[1].numberOfCalls, 'PUT call is made').to.equal(1);

                    expect(service.get('notifications.alerts').length, 'number of alerts shown').to.equal(1);

                    expect(service.get('testFlag')).to.be.false;
                });
            });
        });

        (0, _mocha.it)('notifies for server errors on accessibility save', function () {
            stubSettings(server, {});
            stubUser(server, { testUserFlag: false }, false);

            addTestFlag();

            var service = this.subject();

            return service.fetch().then(function () {
                expect(service.get('testUserFlag')).to.be.false;

                (0, _emberRunloop.default)(function () {
                    service.set('testUserFlag', true);
                });

                return (0, _wait.default)().then(function () {
                    expect(server.handlers[3].numberOfCalls, 'PUT call is made').to.equal(1);

                    expect(service.get('notifications.alerts').length, 'number of alerts shown').to.equal(1);

                    expect(service.get('testUserFlag')).to.be.false;
                });
            });
        });

        (0, _mocha.it)('notifies for validation errors', function () {
            stubSettings(server, { testFlag: false }, true, false);
            stubUser(server, {});

            addTestFlag();

            var service = this.subject();
            service.get('config').set('testFlag', false);

            return service.fetch().then(function () {
                expect(service.get('testFlag')).to.be.false;

                (0, _emberRunloop.default)(function () {
                    expect(function () {
                        service.set('testFlag', true);
                    }, EmberError, 'threw validation error');
                });

                return (0, _wait.default)().then(function () {
                    // ensure validation is happening before the API is hit
                    expect(server.handlers[1].numberOfCalls).to.equal(0);
                    expect(service.get('testFlag')).to.be.false;
                });
            });
        });
    });
});
define('ghost-admin/tests/integration/services/lazy-loader-test', ['jquery', 'pretender', 'mocha', 'chai', 'ember-mocha'], function (_jquery, _pretender, _mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Integration: Service: lazy-loader', function () {
        (0, _emberMocha.setupTest)('service:lazy-loader', { integration: true });
        var server = void 0;
        var ghostPaths = {
            adminRoot: '/assets/'
        };

        beforeEach(function () {
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('loads a script correctly and only once', function () {
            var subject = this.subject({
                ghostPaths: ghostPaths,
                scriptPromises: {},
                testing: false
            });

            server.get('/assets/test.js', function (_ref) {
                var requestHeaders = _ref.requestHeaders;

                (0, _chai.expect)(requestHeaders.Accept).to.match(/text\/javascript/);

                return [200, { 'Content-Type': 'text/javascript' }, 'window.testLoadScript = \'testvalue\''];
            });

            return subject.loadScript('test-script', 'test.js').then(function () {
                (0, _chai.expect)(subject.get('scriptPromises.test-script')).to.exist;
                (0, _chai.expect)(window.testLoadScript).to.equal('testvalue');
                (0, _chai.expect)(server.handlers[0].numberOfCalls).to.equal(1);

                return subject.loadScript('test-script', 'test.js');
            }).then(function () {
                (0, _chai.expect)(server.handlers[0].numberOfCalls).to.equal(1);
            });
        });

        (0, _mocha.it)('loads styles correctly', function () {
            var subject = this.subject({
                ghostPaths: ghostPaths,
                testing: false
            });

            return subject.loadStyle('testing', 'style.css').catch(function () {
                // we add a catch handler here because `/assets/style.css` doesn't exist
                (0, _chai.expect)((0, _jquery.default)('#testing-styles').length).to.equal(1);
                (0, _chai.expect)((0, _jquery.default)('#testing-styles').attr('href')).to.equal('/assets/style.css');
            });
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/integration/services/slug-generator-test', ['pretender', 'ember-string', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _emberString, _mocha, _chai, _emberMocha) {
    'use strict';

    function stubSlugEndpoint(server, type, slug) {
        server.get('/ghost/api/v0.1/slugs/:type/:slug/', function (request) {
            (0, _chai.expect)(request.params.type).to.equal(type);
            (0, _chai.expect)(request.params.slug).to.equal(slug);

            return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ slugs: [{ slug: (0, _emberString.dasherize)(slug) }] })];
        });
    }

    (0, _mocha.describe)('Integration: Service: slug-generator', function () {
        (0, _emberMocha.setupTest)('service:slug-generator', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('returns empty if no slug is provided', function (done) {
            var service = this.subject();

            service.generateSlug('post', '').then(function (slug) {
                (0, _chai.expect)(slug).to.equal('');
                done();
            });
        });

        (0, _mocha.it)('calls correct endpoint and returns correct data', function (done) {
            var rawSlug = 'a test post';
            stubSlugEndpoint(server, 'post', rawSlug);

            var service = this.subject();

            service.generateSlug('post', rawSlug).then(function (slug) {
                (0, _chai.expect)(slug).to.equal((0, _emberString.dasherize)(rawSlug));
                done();
            });
        });
    });
});
define('ghost-admin/tests/integration/services/store-test', ['pretender', 'ghost-admin/config/environment', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _environment, _mocha, _chai, _emberMocha) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    (0, _mocha.describe)('Integration: Service: store', function () {
        (0, _emberMocha.setupTest)('service:store', {
            integration: true
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('adds Ghost version header to requests', function (done) {
            var version = _environment.default.APP.version;

            var store = this.subject();

            server.get('/ghost/api/v0.1/posts/1/', function () {
                return [404, { 'Content-Type': 'application/json' }, JSON.stringify({})];
            });

            store.find('post', 1).catch(function () {
                var _server$handledReques = _slicedToArray(server.handledRequests, 1),
                    request = _server$handledReques[0];

                (0, _chai.expect)(request.requestHeaders['X-Ghost-Version']).to.equal(version);
                done();
            });
        });
    });
});
define('ghost-admin/tests/test-helper', ['ghost-admin/tests/helpers/resolver', 'ember-mocha'], function (_resolver, _emberMocha) {
    'use strict';

    (0, _emberMocha.setResolver)(_resolver.default);

    /* jshint ignore:start */
    mocha.setup({
        timeout: 15000,
        slow: 500
    });
    /* jshint ignore:end */
});
define('ghost-admin/tests/tests.lint-test', [], function () {
  'use strict';

  describe('ESLint | tests', function () {

    it('acceptance/authentication-test.js', function () {
      // test passed
    });

    it('acceptance/content-test.js', function () {
      // test passed
    });

    it('acceptance/editor-test.js', function () {
      // test passed
    });

    it('acceptance/ghost-desktop-test.js', function () {
      // test passed
    });

    it('acceptance/password-reset-test.js', function () {
      // test passed
    });

    it('acceptance/settings/amp-test.js', function () {
      // test passed
    });

    it('acceptance/settings/apps-test.js', function () {
      // test passed
    });

    it('acceptance/settings/code-injection-test.js', function () {
      // test passed
    });

    it('acceptance/settings/design-test.js', function () {
      // test passed
    });

    it('acceptance/settings/general-test.js', function () {
      // test passed
    });

    it('acceptance/settings/labs-test.js', function () {
      // test passed
    });

    it('acceptance/settings/slack-test.js', function () {
      // test passed
    });

    it('acceptance/settings/tags-test.js', function () {
      // test passed
    });

    it('acceptance/setup-test.js', function () {
      // test passed
    });

    it('acceptance/signin-test.js', function () {
      // test passed
    });

    it('acceptance/signup-test.js', function () {
      // test passed
    });

    it('acceptance/subscribers-test.js', function () {
      // test passed
    });

    it('acceptance/team-test.js', function () {
      // test passed
    });

    it('acceptance/version-mismatch-test.js', function () {
      // test passed
    });

    it('helpers/adapter-error.js', function () {
      // test passed
    });

    it('helpers/configuration.js', function () {
      // test passed
    });

    it('helpers/destroy-app.js', function () {
      // test passed
    });

    it('helpers/editor-helpers.js', function () {
      // test passed
    });

    it('helpers/file-upload.js', function () {
      // test passed
    });

    it('helpers/oauth.js', function () {
      // test passed
    });

    it('helpers/resolver.js', function () {
      // test passed
    });

    it('helpers/start-app.js', function () {
      // test passed
    });

    it('integration/adapters/tag-test.js', function () {
      // test passed
    });

    it('integration/adapters/user-test.js', function () {
      // test passed
    });

    it('integration/components/gh-alert-test.js', function () {
      // test passed
    });

    it('integration/components/gh-alerts-test.js', function () {
      // test passed
    });

    it('integration/components/gh-basic-dropdown-test.js', function () {
      // test passed
    });

    it('integration/components/gh-cm-editor-test.js', function () {
      // test passed
    });

    it('integration/components/gh-date-time-picker-test.js', function () {
      // test passed
    });

    it('integration/components/gh-download-count-test.js', function () {
      // test passed
    });

    it('integration/components/gh-editor-post-status-test.js', function () {
      // test passed
    });

    it('integration/components/gh-feature-flag-test.js', function () {
      // test passed
    });

    it('integration/components/gh-file-uploader-test.js', function () {
      // test passed
    });

    it('integration/components/gh-image-uploader-test.js', function () {
      // test passed
    });

    it('integration/components/gh-image-uploader-with-preview-test.js', function () {
      // test passed
    });

    it('integration/components/gh-markdown-editor-test.js', function () {
      // test passed
    });

    it('integration/components/gh-navigation-test.js', function () {
      // test passed
    });

    it('integration/components/gh-navitem-test.js', function () {
      // test passed
    });

    it('integration/components/gh-navitem-url-input-test.js', function () {
      // test passed
    });

    it('integration/components/gh-notification-test.js', function () {
      // test passed
    });

    it('integration/components/gh-notifications-test.js', function () {
      // test passed
    });

    it('integration/components/gh-profile-image-test.js', function () {
      // test passed
    });

    it('integration/components/gh-progress-bar-test.js', function () {
      // test passed
    });

    it('integration/components/gh-publishmenu-draft-test.js', function () {
      // test passed
    });

    it('integration/components/gh-publishmenu-published-test.js', function () {
      // test passed
    });

    it('integration/components/gh-publishmenu-scheduled-test.js', function () {
      // test passed
    });

    it('integration/components/gh-publishmenu-test.js', function () {
      // test passed
    });

    it('integration/components/gh-search-input-test.js', function () {
      // test passed
    });

    it('integration/components/gh-simplemde-test.js', function () {
      // test passed
    });

    it('integration/components/gh-subscribers-table-test.js', function () {
      // test passed
    });

    it('integration/components/gh-tag-settings-form-test.js', function () {
      // test passed
    });

    it('integration/components/gh-tags-management-container-test.js', function () {
      // test passed
    });

    it('integration/components/gh-task-button-test.js', function () {
      // test passed
    });

    it('integration/components/gh-theme-table-test.js', function () {
      // test passed
    });

    it('integration/components/gh-timezone-select-test.js', function () {
      // test passed
    });

    it('integration/components/gh-trim-focus-input-test.js', function () {
      // test passed
    });

    it('integration/components/gh-uploader-test.js', function () {
      // test passed
    });

    it('integration/components/gh-validation-status-container-test.js', function () {
      // test passed
    });

    it('integration/components/modals/delete-subscriber-test.js', function () {
      // test passed
    });

    it('integration/components/modals/import-subscribers-test.js', function () {
      // test passed
    });

    it('integration/components/modals/new-subscriber-test.js', function () {
      // test passed
    });

    it('integration/components/modals/upload-theme-test.js', function () {
      // test passed
    });

    it('integration/components/transfer-owner-test.js', function () {
      // test passed
    });

    it('integration/services/ajax-test.js', function () {
      // test passed
    });

    it('integration/services/config-test.js', function () {
      // test passed
    });

    it('integration/services/feature-test.js', function () {
      // test passed
    });

    it('integration/services/lazy-loader-test.js', function () {
      // test passed
    });

    it('integration/services/slug-generator-test.js', function () {
      // test passed
    });

    it('integration/services/store-test.js', function () {
      // test passed
    });

    it('test-helper.js', function () {
      // test passed
    });

    it('unit/components/gh-alert-test.js', function () {
      // test passed
    });

    it('unit/components/gh-app-test.js', function () {
      // test passed
    });

    it('unit/components/gh-infinite-scroll-test.js', function () {
      // test passed
    });

    it('unit/components/gh-navitem-url-input-test.js', function () {
      // test passed
    });

    it('unit/components/gh-notification-test.js', function () {
      // test passed
    });

    it('unit/components/gh-post-settings-menu-test.js', function () {
      // test passed
    });

    it('unit/components/gh-selectize-test.js', function () {
      // test passed
    });

    it('unit/components/gh-upgrade-notification-test.js', function () {
      // test passed
    });

    it('unit/components/gh-url-preview-test.js', function () {
      // test passed
    });

    it('unit/components/gh-user-active-test.js', function () {
      // test passed
    });

    it('unit/components/gh-user-invited-test.js', function () {
      // test passed
    });

    it('unit/controllers/settings/design-test.js', function () {
      // test passed
    });

    it('unit/controllers/settings/general-test.js', function () {
      // test passed
    });

    it('unit/controllers/subscribers-test.js', function () {
      // test passed
    });

    it('unit/helpers/gh-count-characters-test.js', function () {
      // test passed
    });

    it('unit/helpers/gh-count-down-characters-test.js', function () {
      // test passed
    });

    it('unit/helpers/gh-format-timeago-test.js', function () {
      // test passed
    });

    it('unit/helpers/gh-user-can-admin-test.js', function () {
      // test passed
    });

    it('unit/helpers/highlighted-text-test.js', function () {
      // test passed
    });

    it('unit/helpers/is-equal-test.js', function () {
      // test passed
    });

    it('unit/helpers/is-not-test.js', function () {
      // test passed
    });

    it('unit/mixins/editor-base-controller-test.js', function () {
      // test passed
    });

    it('unit/mixins/infinite-scroll-test.js', function () {
      // test passed
    });

    it('unit/mixins/validation-engine-test.js', function () {
      // test passed
    });

    it('unit/models/invite-test.js', function () {
      // test passed
    });

    it('unit/models/navigation-item-test.js', function () {
      // test passed
    });

    it('unit/models/post-test.js', function () {
      // test passed
    });

    it('unit/models/role-test.js', function () {
      // test passed
    });

    it('unit/models/setting-test.js', function () {
      // test passed
    });

    it('unit/models/subscriber-test.js', function () {
      // test passed
    });

    it('unit/models/tag-test.js', function () {
      // test passed
    });

    it('unit/models/user-test.js', function () {
      // test passed
    });

    it('unit/routes/subscribers-test.js', function () {
      // test passed
    });

    it('unit/routes/subscribers/import-test.js', function () {
      // test passed
    });

    it('unit/routes/subscribers/new-test.js', function () {
      // test passed
    });

    it('unit/serializers/notification-test.js', function () {
      // test passed
    });

    it('unit/serializers/post-test.js', function () {
      // test passed
    });

    it('unit/serializers/role-test.js', function () {
      // test passed
    });

    it('unit/serializers/setting-test.js', function () {
      // test passed
    });

    it('unit/serializers/subscriber-test.js', function () {
      // test passed
    });

    it('unit/serializers/tag-test.js', function () {
      // test passed
    });

    it('unit/serializers/user-test.js', function () {
      // test passed
    });

    it('unit/services/config-test.js', function () {
      // test passed
    });

    it('unit/services/event-bus-test.js', function () {
      // test passed
    });

    it('unit/services/notifications-test.js', function () {
      // test passed
    });

    it('unit/services/upgrade-status-test.js', function () {
      // test passed
    });

    it('unit/transforms/facebook-url-user-test.js', function () {
      // test passed
    });

    it('unit/transforms/json-string-test.js', function () {
      // test passed
    });

    it('unit/transforms/navigation-settings-test.js', function () {
      // test passed
    });

    it('unit/transforms/slack-settings-test.js', function () {
      // test passed
    });

    it('unit/transforms/twitter-url-user-test.js', function () {
      // test passed
    });

    it('unit/utils/date-formatting-test.js', function () {
      // test passed
    });

    it('unit/utils/ghost-paths-test.js', function () {
      // test passed
    });

    it('unit/validators/nav-item-test.js', function () {
      // test passed
    });

    it('unit/validators/slack-integration-test.js', function () {
      // test passed
    });

    it('unit/validators/subscriber-test.js', function () {
      // test passed
    });

    it('unit/validators/tag-settings-test.js', function () {
      // test passed
    });
  });
});
define('ghost-admin/tests/unit/components/gh-alert-test', ['sinon', 'mocha', 'chai', 'ember-mocha'], function (_sinon, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Unit: Component: gh-alert', function () {
        (0, _emberMocha.setupComponentTest)('gh-alert', {
            unit: true,
            // specify the other units that are required for this test
            needs: ['service:notifications', 'helper:inline-svg']
        });

        (0, _mocha.it)('closes notification through notifications service', function () {
            var component = this.subject();
            var notifications = {};
            var notification = { message: 'Test close', type: 'success' };

            notifications.closeNotification = _sinon.default.spy();
            component.set('notifications', notifications);
            component.set('message', notification);

            this.$().find('button').click();

            (0, _chai.expect)(notifications.closeNotification.calledWith(notification)).to.be.true;
        });
    });
});
define('ghost-admin/tests/unit/components/gh-app-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Component: gh-app', function () {
        (0, _emberMocha.setupComponentTest)('gh-app', {
            unit: true
            // specify the other units that are required for this test
            // needs: ['component:foo', 'helper:bar']
        });

        (0, _mocha.it)('renders', function () {
            // creates the component instance
            var component = this.subject();

            (0, _chai.expect)(component._state).to.equal('preRender');

            // renders the component on the page
            this.render();
            (0, _chai.expect)(component._state).to.equal('inDOM');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/components/gh-infinite-scroll-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Component: gh-infinite-scroll', function () {
        (0, _emberMocha.setupComponentTest)('gh-infinite-scroll', {
            unit: true
            // specify the other units that are required for this test
            // needs: ['component:foo', 'helper:bar']
        });

        (0, _mocha.it)('renders', function () {
            // creates the component instance
            var component = this.subject();

            (0, _chai.expect)(component._state).to.equal('preRender');

            // renders the component on the page
            this.render();
            (0, _chai.expect)(component._state).to.equal('inDOM');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/components/gh-navitem-url-input-test', ['ember-runloop', 'mocha', 'chai', 'ember-mocha'], function (_emberRunloop, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Unit: Component: gh-navitem-url-input', function () {
        (0, _emberMocha.setupComponentTest)('gh-navitem-url-input', {
            unit: true
        });

        (0, _mocha.it)('identifies a URL as the base URL', function () {
            var component = this.subject({
                url: '',
                baseUrl: 'http://example.com/'
            });

            this.render();

            (0, _emberRunloop.default)(function () {
                component.set('value', 'http://example.com/');
            });

            (0, _chai.expect)(component.get('isBaseUrl')).to.be.ok;

            (0, _emberRunloop.default)(function () {
                component.set('value', 'http://example.com/go/');
            });

            (0, _chai.expect)(component.get('isBaseUrl')).to.not.be.ok;
        });
    });
});
define('ghost-admin/tests/unit/components/gh-notification-test', ['sinon', 'mocha', 'chai', 'ember-mocha'], function (_sinon, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Unit: Component: gh-notification', function () {
        (0, _emberMocha.setupComponentTest)('gh-notification', {
            unit: true,
            // specify the other units that are required for this test
            needs: ['service:notifications', 'helper:inline-svg']
        });

        (0, _mocha.it)('closes notification through notifications service', function () {
            var component = this.subject();
            var notifications = {};
            var notification = { message: 'Test close', type: 'success' };

            notifications.closeNotification = _sinon.default.spy();
            component.set('notifications', notifications);
            component.set('message', notification);

            this.$().find('button').click();

            (0, _chai.expect)(notifications.closeNotification.calledWith(notification)).to.be.true;
        });

        (0, _mocha.it)('closes notification when animationend event is triggered', function (done) {
            var component = this.subject();
            var notifications = {};
            var notification = { message: 'Test close', type: 'success' };

            notifications.closeNotification = _sinon.default.spy();
            component.set('notifications', notifications);
            component.set('message', notification);

            // shorten the animation delay to speed up test
            this.$().css('animation-delay', '0.1s');
            setTimeout(function () {
                (0, _chai.expect)(notifications.closeNotification.calledWith(notification)).to.be.true;
                done();
            }, 150);
        });
    });
});
define('ghost-admin/tests/unit/components/gh-post-settings-menu-test', ['ember-object', 'rsvp', 'ghost-admin/utils/bound-one-way', 'ember-runloop', 'mocha', 'ember-mocha'], function (_emberObject, _rsvp, _boundOneWay, _emberRunloop, _mocha, _emberMocha) {
    'use strict';

    /* eslint-disable camelcase */
    function K() {
        return this;
    }

    // TODO: convert to integration tests
    _mocha.describe.skip('Unit: Component: post-settings-menu', function () {
        (0, _emberMocha.setupComponentTest)('gh-post-settings-menu', {
            needs: ['service:notifications', 'service:slug-generator', 'service:settings']
        });

        (0, _mocha.it)('slugValue is one-way bound to model.slug', function () {
            var component = this.subject({
                model: _emberObject.default.create({
                    slug: 'a-slug'
                })
            });

            expect(component.get('model.slug')).to.equal('a-slug');
            expect(component.get('slugValue')).to.equal('a-slug');

            (0, _emberRunloop.default)(function () {
                component.set('model.slug', 'changed-slug');

                expect(component.get('slugValue')).to.equal('changed-slug');
            });

            (0, _emberRunloop.default)(function () {
                component.set('slugValue', 'changed-directly');

                expect(component.get('model.slug')).to.equal('changed-slug');
                expect(component.get('slugValue')).to.equal('changed-directly');
            });

            (0, _emberRunloop.default)(function () {
                // test that the one-way binding is still in place
                component.set('model.slug', 'should-update');

                expect(component.get('slugValue')).to.equal('should-update');
            });
        });

        (0, _mocha.it)('metaTitleScratch is one-way bound to model.metaTitle', function () {
            var component = this.subject({
                model: _emberObject.default.extend({
                    metaTitle: 'a title',
                    metaTitleScratch: (0, _boundOneWay.default)('metaTitle')
                }).create()
            });

            expect(component.get('model.metaTitle')).to.equal('a title');
            expect(component.get('metaTitleScratch')).to.equal('a title');

            (0, _emberRunloop.default)(function () {
                component.set('model.metaTitle', 'a different title');

                expect(component.get('metaTitleScratch')).to.equal('a different title');
            });

            (0, _emberRunloop.default)(function () {
                component.set('metaTitleScratch', 'changed directly');

                expect(component.get('model.metaTitle')).to.equal('a different title');
                expect(component.get('model.metaTitleScratch')).to.equal('changed directly');
            });

            (0, _emberRunloop.default)(function () {
                // test that the one-way binding is still in place
                component.set('model.metaTitle', 'should update');

                expect(component.get('metaTitleScratch')).to.equal('should update');
            });
        });

        (0, _mocha.it)('metaDescriptionScratch is one-way bound to model.metaDescription', function () {
            var component = this.subject({
                model: _emberObject.default.extend({
                    metaDescription: 'a description',
                    metaDescriptionScratch: (0, _boundOneWay.default)('metaDescription')
                }).create()
            });

            expect(component.get('model.metaDescription')).to.equal('a description');
            expect(component.get('metaDescriptionScratch')).to.equal('a description');

            (0, _emberRunloop.default)(function () {
                component.set('model.metaDescription', 'a different description');

                expect(component.get('metaDescriptionScratch')).to.equal('a different description');
            });

            (0, _emberRunloop.default)(function () {
                component.set('metaDescriptionScratch', 'changed directly');

                expect(component.get('model.metaDescription')).to.equal('a different description');
                expect(component.get('metaDescriptionScratch')).to.equal('changed directly');
            });

            (0, _emberRunloop.default)(function () {
                // test that the one-way binding is still in place
                component.set('model.metaDescription', 'should update');

                expect(component.get('metaDescriptionScratch')).to.equal('should update');
            });
        });

        (0, _mocha.describe)('seoTitle', function () {
            (0, _mocha.it)('should be the metaTitle if one exists', function () {
                var component = this.subject({
                    model: _emberObject.default.extend({
                        metaTitle: 'a meta-title',
                        metaTitleScratch: (0, _boundOneWay.default)('metaTitle'),
                        titleScratch: 'should not be used'
                    }).create()
                });

                expect(component.get('seoTitle')).to.equal('a meta-title');
            });

            (0, _mocha.it)('should default to the title if an explicit meta-title does not exist', function () {
                var component = this.subject({
                    model: _emberObject.default.create({
                        titleScratch: 'should be the meta-title'
                    })
                });

                expect(component.get('seoTitle')).to.equal('should be the meta-title');
            });

            (0, _mocha.it)('should be the metaTitle if both title and metaTitle exist', function () {
                var component = this.subject({
                    model: _emberObject.default.extend({
                        metaTitle: 'a meta-title',
                        metaTitleScratch: (0, _boundOneWay.default)('metaTitle'),
                        titleScratch: 'a title'
                    }).create()
                });

                expect(component.get('seoTitle')).to.equal('a meta-title');
            });

            (0, _mocha.it)('should revert to the title if explicit metaTitle is removed', function () {
                var component = this.subject({
                    model: _emberObject.default.extend({
                        metaTitle: 'a meta-title',
                        metaTitleScratch: (0, _boundOneWay.default)('metaTitle'),
                        titleScratch: 'a title'
                    }).create()
                });

                expect(component.get('seoTitle')).to.equal('a meta-title');

                (0, _emberRunloop.default)(function () {
                    component.set('model.metaTitle', '');

                    expect(component.get('seoTitle')).to.equal('a title');
                });
            });

            (0, _mocha.it)('should truncate to 70 characters with an appended ellipsis', function () {
                var longTitle = new Array(100).join('a');
                var component = this.subject({
                    model: _emberObject.default.create()
                });

                expect(longTitle.length).to.equal(99);

                (0, _emberRunloop.default)(function () {
                    var expected = longTitle.substr(0, 70) + '&hellip;';

                    component.set('metaTitleScratch', longTitle);

                    expect(component.get('seoTitle').toString().length).to.equal(78);
                    expect(component.get('seoTitle').toString()).to.equal(expected);
                });
            });
        });

        (0, _mocha.describe)('seoDescription', function () {
            (0, _mocha.it)('should be the metaDescription if one exists', function () {
                var component = this.subject({
                    model: _emberObject.default.extend({
                        metaDescription: 'a description',
                        metaDescriptionScratch: (0, _boundOneWay.default)('metaDescription')
                    }).create()
                });

                expect(component.get('seoDescription')).to.equal('a description');
            });

            (0, _mocha.it)('should be generated from the rendered mobiledoc if not explicitly set', function () {
                var component = this.subject({
                    model: _emberObject.default.extend({
                        author: _rsvp.default.resolve(),
                        metaDescription: null,
                        metaDescriptionScratch: (0, _boundOneWay.default)('metaDescription'),
                        scratch: {
                            cards: [['markdown-card', {
                                markdown: '# This is a <strong>test</strong> <script>foo</script>'
                            }]]
                        }
                    }).create()
                });

                expect(component.get('seoDescription')).to.equal('This is a test');
            });

            (0, _mocha.it)('should truncate to 156 characters with an appended ellipsis', function () {
                var longDescription = new Array(200).join('a');
                var component = this.subject({
                    model: _emberObject.default.create()
                });

                expect(longDescription.length).to.equal(199);

                (0, _emberRunloop.default)(function () {
                    var expected = longDescription.substr(0, 156) + '&hellip;';

                    component.set('metaDescriptionScratch', longDescription);

                    expect(component.get('seoDescription').toString().length).to.equal(164);
                    expect(component.get('seoDescription').toString()).to.equal(expected);
                });
            });
        });

        (0, _mocha.describe)('seoURL', function () {
            (0, _mocha.it)('should be the URL of the blog if no post slug exists', function () {
                var component = this.subject({
                    config: _emberObject.default.create({ blogUrl: 'http://my-ghost-blog.com' }),
                    model: _emberObject.default.create()
                });

                expect(component.get('seoURL')).to.equal('http://my-ghost-blog.com/');
            });

            (0, _mocha.it)('should be the URL of the blog plus the post slug', function () {
                var component = this.subject({
                    config: _emberObject.default.create({ blogUrl: 'http://my-ghost-blog.com' }),
                    model: _emberObject.default.create({ slug: 'post-slug' })
                });

                expect(component.get('seoURL')).to.equal('http://my-ghost-blog.com/post-slug/');
            });

            (0, _mocha.it)('should update when the post slug changes', function () {
                var component = this.subject({
                    config: _emberObject.default.create({ blogUrl: 'http://my-ghost-blog.com' }),
                    model: _emberObject.default.create({ slug: 'post-slug' })
                });

                expect(component.get('seoURL')).to.equal('http://my-ghost-blog.com/post-slug/');

                (0, _emberRunloop.default)(function () {
                    component.set('model.slug', 'changed-slug');

                    expect(component.get('seoURL')).to.equal('http://my-ghost-blog.com/changed-slug/');
                });
            });

            (0, _mocha.it)('should truncate a long URL to 70 characters with an appended ellipsis', function () {
                var blogURL = 'http://my-ghost-blog.com';
                var longSlug = new Array(75).join('a');
                var component = this.subject({
                    config: _emberObject.default.create({ blogUrl: blogURL }),
                    model: _emberObject.default.create({ slug: longSlug })
                });
                var expected = void 0;

                expect(longSlug.length).to.equal(74);

                expected = blogURL + '/' + longSlug + '/';
                expected = expected.substr(0, 70) + '&hellip;';

                expect(component.get('seoURL').toString().length).to.equal(78);
                expect(component.get('seoURL').toString()).to.equal(expected);
            });
        });

        (0, _mocha.describe)('togglePage', function () {
            (0, _mocha.it)('should toggle the page property', function () {
                var component = this.subject({
                    model: _emberObject.default.create({
                        page: false,
                        isNew: true
                    })
                });

                expect(component.get('model.page')).to.not.be.ok;

                (0, _emberRunloop.default)(function () {
                    component.send('togglePage');

                    expect(component.get('model.page')).to.be.ok;
                });
            });

            (0, _mocha.it)('should not save the post if it is still new', function () {
                var component = this.subject({
                    model: _emberObject.default.create({
                        page: false,
                        isNew: true,
                        save: function save() {
                            this.incrementProperty('saved');
                            return _rsvp.default.resolve();
                        }
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.send('togglePage');

                    expect(component.get('model.page')).to.be.ok;
                    expect(component.get('model.saved')).to.not.be.ok;
                });
            });

            (0, _mocha.it)('should save the post if it is not new', function () {
                var component = this.subject({
                    model: _emberObject.default.create({
                        page: false,
                        isNew: false,
                        save: function save() {
                            this.incrementProperty('saved');
                            return _rsvp.default.resolve();
                        }
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.send('togglePage');

                    expect(component.get('model.page')).to.be.ok;
                    expect(component.get('model.saved')).to.equal(1);
                });
            });
        });

        (0, _mocha.describe)('toggleFeatured', function () {
            (0, _mocha.it)('should toggle the featured property', function () {
                var component = this.subject({
                    model: _emberObject.default.create({
                        featured: false,
                        isNew: true
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.send('toggleFeatured');

                    expect(component.get('model.featured')).to.be.ok;
                });
            });

            (0, _mocha.it)('should not save the post if it is still new', function () {
                var component = this.subject({
                    model: _emberObject.default.create({
                        featured: false,
                        isNew: true,
                        save: function save() {
                            this.incrementProperty('saved');
                            return _rsvp.default.resolve();
                        }
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.send('toggleFeatured');

                    expect(component.get('model.featured')).to.be.ok;
                    expect(component.get('model.saved')).to.not.be.ok;
                });
            });

            (0, _mocha.it)('should save the post if it is not new', function () {
                var component = this.subject({
                    model: _emberObject.default.create({
                        featured: false,
                        isNew: false,
                        save: function save() {
                            this.incrementProperty('saved');
                            return _rsvp.default.resolve();
                        }
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.send('toggleFeatured');

                    expect(component.get('model.featured')).to.be.ok;
                    expect(component.get('model.saved')).to.equal(1);
                });
            });
        });

        (0, _mocha.describe)('updateSlug', function () {
            (0, _mocha.it)('should reset slugValue to the previous slug when the new slug is blank or unchanged', function () {
                var component = this.subject({
                    model: _emberObject.default.create({
                        slug: 'slug'
                    })
                });

                (0, _emberRunloop.default)(function () {
                    // unchanged
                    component.set('slugValue', 'slug');
                    component.send('updateSlug', component.get('slugValue'));

                    expect(component.get('model.slug')).to.equal('slug');
                    expect(component.get('slugValue')).to.equal('slug');
                });

                (0, _emberRunloop.default)(function () {
                    // unchanged after trim
                    component.set('slugValue', 'slug  ');
                    component.send('updateSlug', component.get('slugValue'));

                    expect(component.get('model.slug')).to.equal('slug');
                    expect(component.get('slugValue')).to.equal('slug');
                });

                (0, _emberRunloop.default)(function () {
                    // blank
                    component.set('slugValue', '');
                    component.send('updateSlug', component.get('slugValue'));

                    expect(component.get('model.slug')).to.equal('slug');
                    expect(component.get('slugValue')).to.equal('slug');
                });
            });

            (0, _mocha.it)('should not set a new slug if the server-generated slug matches existing slug', function (done) {
                var component = this.subject({
                    slugGenerator: _emberObject.default.create({
                        generateSlug: function generateSlug(slugType, str) {
                            var promise = _rsvp.default.resolve(str.split('#')[0]);
                            this.set('lastPromise', promise);
                            return promise;
                        }
                    }),
                    model: _emberObject.default.create({
                        slug: 'whatever'
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.set('slugValue', 'whatever#slug');
                    component.send('updateSlug', component.get('slugValue'));

                    _rsvp.default.resolve(component.get('lastPromise')).then(function () {
                        expect(component.get('model.slug')).to.equal('whatever');

                        done();
                    }).catch(done);
                });
            });

            (0, _mocha.it)('should not set a new slug if the only change is to the appended increment value', function (done) {
                var component = this.subject({
                    slugGenerator: _emberObject.default.create({
                        generateSlug: function generateSlug(slugType, str) {
                            var sanitizedStr = str.replace(/[^a-zA-Z]/g, '');
                            var promise = _rsvp.default.resolve(sanitizedStr + '-2');
                            this.set('lastPromise', promise);
                            return promise;
                        }
                    }),
                    model: _emberObject.default.create({
                        slug: 'whatever'
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.set('slugValue', 'whatever!');
                    component.send('updateSlug', component.get('slugValue'));

                    _rsvp.default.resolve(component.get('lastPromise')).then(function () {
                        expect(component.get('model.slug')).to.equal('whatever');

                        done();
                    }).catch(done);
                });
            });

            (0, _mocha.it)('should set the slug if the new slug is different', function (done) {
                var component = this.subject({
                    slugGenerator: _emberObject.default.create({
                        generateSlug: function generateSlug(slugType, str) {
                            var promise = _rsvp.default.resolve(str);
                            this.set('lastPromise', promise);
                            return promise;
                        }
                    }),
                    model: _emberObject.default.create({
                        slug: 'whatever',
                        save: K
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.set('slugValue', 'changed');
                    component.send('updateSlug', component.get('slugValue'));

                    _rsvp.default.resolve(component.get('lastPromise')).then(function () {
                        expect(component.get('model.slug')).to.equal('changed');

                        done();
                    }).catch(done);
                });
            });

            (0, _mocha.it)('should save the post when the slug changes and the post is not new', function (done) {
                var component = this.subject({
                    slugGenerator: _emberObject.default.create({
                        generateSlug: function generateSlug(slugType, str) {
                            var promise = _rsvp.default.resolve(str);
                            this.set('lastPromise', promise);
                            return promise;
                        }
                    }),
                    model: _emberObject.default.create({
                        slug: 'whatever',
                        saved: 0,
                        isNew: false,
                        save: function save() {
                            this.incrementProperty('saved');
                        }
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.set('slugValue', 'changed');
                    component.send('updateSlug', component.get('slugValue'));

                    _rsvp.default.resolve(component.get('lastPromise')).then(function () {
                        expect(component.get('model.slug')).to.equal('changed');
                        expect(component.get('model.saved')).to.equal(1);

                        done();
                    }).catch(done);
                });
            });

            (0, _mocha.it)('should not save the post when the slug changes and the post is new', function (done) {
                var component = this.subject({
                    slugGenerator: _emberObject.default.create({
                        generateSlug: function generateSlug(slugType, str) {
                            var promise = _rsvp.default.resolve(str);
                            this.set('lastPromise', promise);
                            return promise;
                        }
                    }),
                    model: _emberObject.default.create({
                        slug: 'whatever',
                        saved: 0,
                        isNew: true,
                        save: function save() {
                            this.incrementProperty('saved');
                        }
                    })
                });

                (0, _emberRunloop.default)(function () {
                    component.set('slugValue', 'changed');
                    component.send('updateSlug', component.get('slugValue'));

                    _rsvp.default.resolve(component.get('lastPromise')).then(function () {
                        expect(component.get('model.slug')).to.equal('changed');
                        expect(component.get('model.saved')).to.equal(0);

                        done();
                    }).catch(done);
                });
            });
        });
    });
});
define('ghost-admin/tests/unit/components/gh-selectize-test', ['ember-runloop', 'mocha', 'ember-array/utils', 'chai', 'ember-mocha'], function (_emberRunloop, _mocha, _utils, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Component: gh-selectize', function () {
        (0, _emberMocha.setupComponentTest)('gh-selectize', {
            // Specify the other units that are required for this test
            // needs: ['component:foo', 'helper:bar'],
            unit: true
        });

        (0, _mocha.it)('re-orders selection when selectize order is changed', function () {
            var component = this.subject();

            var item1 = { id: '1', name: 'item 1' };
            var item2 = { id: '2', name: 'item 2' };
            var item3 = { id: '3', name: 'item 3' };

            (0, _emberRunloop.default)(function () {
                component.set('content', (0, _utils.A)([item1, item2, item3]));
                component.set('selection', (0, _utils.A)([item2, item3]));
                component.set('multiple', true);
                component.set('optionValuePath', 'content.id');
                component.set('optionLabelPath', 'content.name');
            });

            this.render();

            (0, _emberRunloop.default)(function () {
                component._selectize.setValue(['3', '2']);
            });

            (0, _chai.expect)(component.get('selection').toArray(), 'component selection').to.deep.equal([item3, item2]);
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/components/gh-upgrade-notification-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Component: gh-upgrade-notification', function () {
        (0, _emberMocha.setupComponentTest)('gh-upgrade-notification', {
            unit: true,
            needs: ['helper:gh-format-html', 'service:upgrade-notification']
        });

        beforeEach(function () {
            var upgradeMessage = { 'content': 'Ghost 10.02.91 is available! Hot Damn. <a href="http://support.ghost.org/how-to-upgrade/" target="_blank">Click here</a> to upgrade.' };
            this.subject().set('upgradeNotification', upgradeMessage);
        });

        (0, _mocha.it)('renders', function () {
            // creates the component instance
            var component = this.subject();
            (0, _chai.expect)(component._state).to.equal('preRender');

            // renders the component on the page
            this.render();
            (0, _chai.expect)(component._state).to.equal('inDOM');

            (0, _chai.expect)(this.$().prop('tagName')).to.equal('SECTION');
            (0, _chai.expect)(this.$().hasClass('gh-upgrade-notification')).to.be.true;
            // caja tools sanitize target='_blank' attribute
            (0, _chai.expect)(this.$().html()).to.contain('Hot Damn. <a href="http://support.ghost.org/how-to-upgrade/">Click here</a>');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/components/gh-url-preview-test', ['mocha', 'ember-mocha'], function (_mocha, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Component: gh-url-preview', function () {
        (0, _emberMocha.setupComponentTest)('gh-url-preview', {
            unit: true,
            needs: ['service:config']
        });

        (0, _mocha.it)('generates the correct preview URL with a prefix', function () {
            var component = this.subject({
                prefix: 'tag',
                slug: 'test-slug',
                tagName: 'p',
                classNames: 'test-class',

                config: { blogUrl: 'http://my-ghost-blog.com' }
            });

            this.render();

            expect(component.get('url')).to.equal('my-ghost-blog.com/tag/test-slug/');
        });

        (0, _mocha.it)('generates the correct preview URL without a prefix', function () {
            var component = this.subject({
                slug: 'test-slug',
                tagName: 'p',
                classNames: 'test-class',

                config: { blogUrl: 'http://my-ghost-blog.com' }
            });

            this.render();

            expect(component.get('url')).to.equal('my-ghost-blog.com/test-slug/');
        });
    });
});
define('ghost-admin/tests/unit/components/gh-user-active-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Component: gh-user-active', function () {
        (0, _emberMocha.setupComponentTest)('gh-user-active', {
            unit: true,
            // specify the other units that are required for this test
            needs: ['service:ghostPaths']
        });

        (0, _mocha.it)('renders', function () {
            // creates the component instance
            var component = this.subject();

            (0, _chai.expect)(component._state).to.equal('preRender');

            // renders the component on the page
            this.render();
            (0, _chai.expect)(component._state).to.equal('inDOM');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/components/gh-user-invited-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Component: gh-user-invited', function () {
        (0, _emberMocha.setupComponentTest)('gh-user-invited', {
            unit: true,
            // specify the other units that are required for this test
            needs: ['service:notifications']
        });

        (0, _mocha.it)('renders', function () {
            // creates the component instance
            var component = this.subject();

            (0, _chai.expect)(component._state).to.equal('preRender');

            // renders the component on the page
            this.render();
            (0, _chai.expect)(component._state).to.equal('inDOM');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/controllers/settings/design-test', ['ember', 'ghost-admin/models/navigation-item', 'chai', 'mocha', 'ember-mocha'], function (_ember, _navigationItem, _chai, _mocha, _emberMocha) {
    'use strict';

    var run = _ember.default.run,
        EmberObject = _ember.default.Object;


    // const navSettingJSON = `[
    //     {"label":"Home","url":"/"},
    //     {"label":"JS Test","url":"javascript:alert('hello');"},
    //     {"label":"About","url":"/about"},
    //     {"label":"Sub Folder","url":"/blah/blah"},
    //     {"label":"Telephone","url":"tel:01234-567890"},
    //     {"label":"Mailto","url":"mailto:test@example.com"},
    //     {"label":"External","url":"https://example.com/testing?query=test#anchor"},
    //     {"label":"No Protocol","url":"//example.com"}
    // ]`;

    (0, _mocha.describe)('Unit: Controller: settings/design', function () {
        (0, _emberMocha.setupTest)('controller:settings/design', {
            // Specify the other units that are required for this test.
            needs: ['model:navigation-item', 'service:ajax', 'service:config', 'service:ghostPaths', 'service:notifications', 'service:session', 'service:upgrade-status']
        });

        (0, _mocha.it)('blogUrl: captures config and ensures trailing slash', function () {
            var ctrl = this.subject();
            ctrl.set('config.blogUrl', 'http://localhost:2368/blog');
            (0, _chai.expect)(ctrl.get('blogUrl')).to.equal('http://localhost:2368/blog/');
        });

        (0, _mocha.it)('init: creates a new navigation item', function () {
            var ctrl = this.subject();

            run(function () {
                (0, _chai.expect)(ctrl.get('newNavItem')).to.exist;
                (0, _chai.expect)(ctrl.get('newNavItem.isNew')).to.be.true;
            });
        });

        (0, _mocha.it)('blogUrl: captures config and ensures trailing slash', function () {
            var ctrl = this.subject();
            ctrl.set('config.blogUrl', 'http://localhost:2368/blog');
            (0, _chai.expect)(ctrl.get('blogUrl')).to.equal('http://localhost:2368/blog/');
        });

        (0, _mocha.it)('save: validates nav items', function (done) {
            var ctrl = this.subject();

            run(function () {
                ctrl.set('model', EmberObject.create({ navigation: [_navigationItem.default.create({ label: 'First', url: '/' }), _navigationItem.default.create({ label: '', url: '/second' }), _navigationItem.default.create({ label: 'Third', url: '' })] }));
                // blank item won't get added because the last item is incomplete
                (0, _chai.expect)(ctrl.get('model.navigation.length')).to.equal(3);

                ctrl.get('save').perform().then(function passedValidation() {
                    (0, _chai.assert)(false, 'navigationItems weren\'t validated on save');
                    done();
                }).catch(function failedValidation() {
                    var navItems = ctrl.get('model.navigation');
                    (0, _chai.expect)(navItems[0].get('errors').toArray()).to.be.empty;
                    (0, _chai.expect)(navItems[1].get('errors.firstObject.attribute')).to.equal('label');
                    (0, _chai.expect)(navItems[2].get('errors.firstObject.attribute')).to.equal('url');
                    done();
                });
            });
        });

        (0, _mocha.it)('save: ignores blank last item when saving', function (done) {
            var ctrl = this.subject();

            run(function () {
                ctrl.set('model', EmberObject.create({ navigation: [_navigationItem.default.create({ label: 'First', url: '/' }), _navigationItem.default.create({ label: '', url: '' })] }));

                (0, _chai.expect)(ctrl.get('model.navigation.length')).to.equal(2);

                ctrl.get('save').perform().then(function passedValidation() {
                    (0, _chai.assert)(false, 'navigationItems weren\'t validated on save');
                    done();
                }).catch(function failedValidation() {
                    var navItems = ctrl.get('model.navigation');
                    (0, _chai.expect)(navItems[0].get('errors').toArray()).to.be.empty;
                    done();
                });
            });
        });

        (0, _mocha.it)('action - addNavItem: adds item to navigationItems', function () {
            var ctrl = this.subject();

            run(function () {
                ctrl.set('model', EmberObject.create({ navigation: [_navigationItem.default.create({ label: 'First', url: '/first', last: true })] }));
            });

            (0, _chai.expect)(ctrl.get('model.navigation.length')).to.equal(1);

            ctrl.set('newNavItem.label', 'New');
            ctrl.set('newNavItem.url', '/new');

            run(function () {
                ctrl.send('addNavItem');
            });

            (0, _chai.expect)(ctrl.get('model.navigation.length')).to.equal(2);
            (0, _chai.expect)(ctrl.get('model.navigation.lastObject.label')).to.equal('New');
            (0, _chai.expect)(ctrl.get('model.navigation.lastObject.url')).to.equal('/new');
            (0, _chai.expect)(ctrl.get('model.navigation.lastObject.isNew')).to.be.false;
            (0, _chai.expect)(ctrl.get('newNavItem.label')).to.be.blank;
            (0, _chai.expect)(ctrl.get('newNavItem.url')).to.be.blank;
            (0, _chai.expect)(ctrl.get('newNavItem.isNew')).to.be.true;
        });

        (0, _mocha.it)('action - addNavItem: doesn\'t insert new item if last object is incomplete', function () {
            var ctrl = this.subject();

            run(function () {
                ctrl.set('model', EmberObject.create({ navigation: [_navigationItem.default.create({ label: '', url: '', last: true })] }));
                (0, _chai.expect)(ctrl.get('model.navigation.length')).to.equal(1);
                ctrl.send('addNavItem');
                (0, _chai.expect)(ctrl.get('model.navigation.length')).to.equal(1);
            });
        });

        (0, _mocha.it)('action - deleteNavItem: removes item from navigationItems', function () {
            var ctrl = this.subject();
            var navItems = [_navigationItem.default.create({ label: 'First', url: '/first' }), _navigationItem.default.create({ label: 'Second', url: '/second', last: true })];

            run(function () {
                ctrl.set('model', EmberObject.create({ navigation: navItems }));
                (0, _chai.expect)(ctrl.get('model.navigation').mapBy('label')).to.deep.equal(['First', 'Second']);
                ctrl.send('deleteNavItem', ctrl.get('model.navigation.firstObject'));
                (0, _chai.expect)(ctrl.get('model.navigation').mapBy('label')).to.deep.equal(['Second']);
            });
        });

        (0, _mocha.it)('action - reorderItems: updates navigationItems list', function () {
            var ctrl = this.subject();
            var navItems = [_navigationItem.default.create({ label: 'First', url: '/first' }), _navigationItem.default.create({ label: 'Second', url: '/second', last: true })];

            run(function () {
                ctrl.set('model', EmberObject.create({ navigation: navItems }));
                (0, _chai.expect)(ctrl.get('model.navigation').mapBy('label')).to.deep.equal(['First', 'Second']);
                ctrl.send('reorderItems', navItems.reverseObjects());
                (0, _chai.expect)(ctrl.get('model.navigation').mapBy('label')).to.deep.equal(['Second', 'First']);
            });
        });

        (0, _mocha.it)('action - updateUrl: updates URL on navigationItem', function () {
            var ctrl = this.subject();
            var navItems = [_navigationItem.default.create({ label: 'First', url: '/first' }), _navigationItem.default.create({ label: 'Second', url: '/second', last: true })];

            run(function () {
                ctrl.set('model', EmberObject.create({ navigation: navItems }));
                (0, _chai.expect)(ctrl.get('model.navigation').mapBy('url')).to.deep.equal(['/first', '/second']);
                ctrl.send('updateUrl', '/new', ctrl.get('model.navigation.firstObject'));
                (0, _chai.expect)(ctrl.get('model.navigation').mapBy('url')).to.deep.equal(['/new', '/second']);
            });
        });
    });
});
define('ghost-admin/tests/unit/controllers/settings/general-test', ['ember', 'mocha', 'ember-mocha'], function (_ember, _mocha, _emberMocha) {
    'use strict';

    var run = _ember.default.run,
        EmberObject = _ember.default.Object;


    (0, _mocha.describe)('Unit: Controller: settings/general', function () {
        (0, _emberMocha.setupTest)('controller:settings/general', {
            needs: ['service:config', 'service:ghostPaths', 'service:notifications', 'service:session']
        });

        (0, _mocha.it)('isDatedPermalinks should be correct', function () {
            var controller = this.subject({
                model: EmberObject.create({
                    permalinks: '/:year/:month/:day/:slug/'
                })
            });

            expect(controller.get('isDatedPermalinks')).to.be.ok;

            run(function () {
                controller.set('model.permalinks', '/:slug/');

                expect(controller.get('isDatedPermalinks')).to.not.be.ok;
            });
        });

        (0, _mocha.it)('setting isDatedPermalinks should switch between dated and slug', function () {
            var controller = this.subject({
                model: EmberObject.create({
                    permalinks: '/:year/:month/:day/:slug/'
                })
            });

            run(function () {
                controller.set('isDatedPermalinks', false);

                expect(controller.get('isDatedPermalinks')).to.not.be.ok;
                expect(controller.get('model.permalinks')).to.equal('/:slug/');
            });

            run(function () {
                controller.set('isDatedPermalinks', true);

                expect(controller.get('isDatedPermalinks')).to.be.ok;
                expect(controller.get('model.permalinks')).to.equal('/:year/:month/:day/:slug/');
            });
        });
    });
});
define('ghost-admin/tests/unit/controllers/subscribers-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Controller: subscribers', function () {
        (0, _emberMocha.setupTest)('controller:subscribers', {
            needs: ['service:notifications', 'service:session']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('exists', function () {
            var controller = this.subject();
            (0, _chai.expect)(controller).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/helpers/gh-count-characters-test', ['ghost-admin/helpers/gh-count-characters', 'mocha', 'chai'], function (_ghCountCharacters, _mocha, _chai) {
    'use strict';

    (0, _mocha.describe)('Unit: Helper: gh-count-characters', function () {
        var defaultStyle = 'color: rgb(115, 138, 148);';
        var errorStyle = 'color: rgb(240, 82, 48);';

        (0, _mocha.it)('counts remaining chars', function () {
            var result = (0, _ghCountCharacters.countCharacters)(['test']);
            (0, _chai.expect)(result.string).to.equal('<span class="word-count" style="' + defaultStyle + '">196</span>');
        });

        (0, _mocha.it)('warns when nearing limit', function () {
            var result = (0, _ghCountCharacters.countCharacters)([Array(195 + 1).join('x')]);
            (0, _chai.expect)(result.string).to.equal('<span class="word-count" style="' + errorStyle + '">5</span>');
        });

        (0, _mocha.it)('indicates too many chars', function () {
            var result = (0, _ghCountCharacters.countCharacters)([Array(205 + 1).join('x')]);
            (0, _chai.expect)(result.string).to.equal('<span class="word-count" style="' + errorStyle + '">-5</span>');
        });

        (0, _mocha.it)('counts multibyte correctly', function () {
            var result = (0, _ghCountCharacters.countCharacters)(['💩']);
            (0, _chai.expect)(result.string).to.equal('<span class="word-count" style="' + defaultStyle + '">199</span>');

            // emoji + modifier is still two chars
            result = (0, _ghCountCharacters.countCharacters)(['💃🏻']);
            (0, _chai.expect)(result.string).to.equal('<span class="word-count" style="' + defaultStyle + '">198</span>');
        });
    });
});
define('ghost-admin/tests/unit/helpers/gh-count-down-characters-test', ['ghost-admin/helpers/gh-count-down-characters', 'mocha', 'chai'], function (_ghCountDownCharacters, _mocha, _chai) {
    'use strict';

    (0, _mocha.describe)('Unit: Helper: gh-count-down-characters', function () {
        var validStyle = 'color: rgb(159, 187, 88);';
        var errorStyle = 'color: rgb(226, 84, 64);';

        (0, _mocha.it)('counts chars', function () {
            var result = (0, _ghCountDownCharacters.countDownCharacters)(['test', 200]);
            (0, _chai.expect)(result.string).to.equal('<span class="word-count" style="' + validStyle + '">4</span>');
        });

        (0, _mocha.it)('warns with too many chars', function () {
            var result = (0, _ghCountDownCharacters.countDownCharacters)([Array(205 + 1).join('x'), 200]);
            (0, _chai.expect)(result.string).to.equal('<span class="word-count" style="' + errorStyle + '">205</span>');
        });

        (0, _mocha.it)('counts multibyte correctly', function () {
            var result = (0, _ghCountDownCharacters.countDownCharacters)(['💩', 200]);
            (0, _chai.expect)(result.string).to.equal('<span class="word-count" style="' + validStyle + '">1</span>');

            // emoji + modifier is still two chars
            result = (0, _ghCountDownCharacters.countDownCharacters)(['💃🏻', 200]);
            (0, _chai.expect)(result.string).to.equal('<span class="word-count" style="' + validStyle + '">2</span>');
        });
    });
});
define('ghost-admin/tests/unit/helpers/gh-format-timeago-test', ['moment', 'sinon', 'mocha', 'chai', 'ghost-admin/helpers/gh-format-timeago'], function (_moment, _sinon, _mocha, _chai, _ghFormatTimeago) {
    'use strict';

    (0, _mocha.describe)('Unit: Helper: gh-format-timeago', function () {
        // eslint-disable-next-line no-unused-vars
        var mockDate = void 0,
            utcStub = void 0;

        (0, _mocha.it)('calculates the correct time difference', function () {
            mockDate = '2016-05-30T10:00:00.000Z';
            utcStub = _sinon.default.stub(_moment.default, 'utc').returns('2016-05-30T11:00:00.000Z');

            var result = (0, _ghFormatTimeago.timeAgo)([mockDate]);
            (0, _chai.expect)(result).to.be.equal('an hour ago');

            _moment.default.utc.restore();
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/helpers/gh-user-can-admin-test', ['ghost-admin/helpers/gh-user-can-admin', 'mocha'], function (_ghUserCanAdmin, _mocha) {
    'use strict';

    describe('Unit: Helper: gh-user-can-admin', function () {
        // Mock up roles and test for truthy
        describe('Owner role', function () {
            var user = {
                get: function get(role) {
                    if (role === 'isOwner') {
                        return true;
                    } else if (role === 'isAdmin') {
                        return false;
                    }
                }
            };

            (0, _mocha.it)(' - can be Admin', function () {
                var result = (0, _ghUserCanAdmin.ghUserCanAdmin)([user]);
                expect(result).to.equal(true);
            });
        });

        describe('Administrator role', function () {
            var user = {
                get: function get(role) {
                    if (role === 'isOwner') {
                        return false;
                    } else if (role === 'isAdmin') {
                        return true;
                    }
                }
            };

            (0, _mocha.it)(' - can be Admin', function () {
                var result = (0, _ghUserCanAdmin.ghUserCanAdmin)([user]);
                expect(result).to.equal(true);
            });
        });

        describe('Editor and Author roles', function () {
            var user = {
                get: function get(role) {
                    if (role === 'isOwner') {
                        return false;
                    } else if (role === 'isAdmin') {
                        return false;
                    }
                }
            };

            (0, _mocha.it)(' - cannot be Admin', function () {
                var result = (0, _ghUserCanAdmin.ghUserCanAdmin)([user]);
                expect(result).to.equal(false);
            });
        });
    });
});
define('ghost-admin/tests/unit/helpers/highlighted-text-test', ['mocha', 'chai', 'ghost-admin/helpers/highlighted-text'], function (_mocha, _chai, _highlightedText) {
    'use strict';

    (0, _mocha.describe)('Unit: Helper: highlighted-text', function () {

        (0, _mocha.it)('works', function () {
            var result = (0, _highlightedText.highlightedText)(['Test', 'e']);
            (0, _chai.expect)(result).to.be.an('object');
            (0, _chai.expect)(result.string).to.equal('T<span class="highlight">e</span>st');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/helpers/is-equal-test', ['mocha', 'chai', 'ghost-admin/helpers/is-equal'], function (_mocha, _chai, _isEqual) {
    'use strict';

    (0, _mocha.describe)('Unit: Helper: is-equal', function () {
        // Replace this with your real tests.
        (0, _mocha.it)('works', function () {
            var result = (0, _isEqual.isEqual)([42, 42]);

            (0, _chai.expect)(result).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/helpers/is-not-test', ['mocha', 'chai', 'ghost-admin/helpers/is-not'], function (_mocha, _chai, _isNot) {
    'use strict';

    (0, _mocha.describe)('Unit: Helper: is-not', function () {
        // Replace this with your real tests.
        (0, _mocha.it)('works', function () {
            var result = (0, _isNot.isNot)(false);

            (0, _chai.expect)(result).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/mixins/editor-base-controller-test', ['ghost-admin/mixins/editor-base-controller', 'ember-object', 'rsvp', 'ember-runloop', 'ember-test-helpers/wait', 'mocha', 'chai', 'ember-concurrency'], function (_editorBaseController, _emberObject, _rsvp, _emberRunloop, _wait, _mocha, _chai, _emberConcurrency) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Unit: Mixin: editor-base-controller', function () {
        (0, _mocha.describe)('generateSlug', function () {
            (0, _mocha.it)('should generate a slug and set it on the model', function (done) {
                var object = void 0;

                (0, _emberRunloop.default)(function () {
                    object = _emberObject.default.extend(_editorBaseController.default, {
                        slugGenerator: _emberObject.default.create({
                            generateSlug: function generateSlug(slugType, str) {
                                return _rsvp.default.resolve(str + '-slug');
                            }
                        }),
                        model: _emberObject.default.create({ slug: '' })
                    }).create();

                    object.set('model.titleScratch', 'title');

                    (0, _chai.expect)(object.get('model.slug')).to.equal('');

                    (0, _emberRunloop.default)(function () {
                        object.get('generateSlug').perform();
                    });

                    (0, _wait.default)().then(function () {
                        (0, _chai.expect)(object.get('model.slug')).to.equal('title-slug');
                        done();
                    });
                });
            });

            (0, _mocha.it)('should not set the destination if the title is "(Untitled)" and the post already has a slug', function (done) {
                var object = void 0;

                (0, _emberRunloop.default)(function () {
                    object = _emberObject.default.extend(_editorBaseController.default, {
                        slugGenerator: _emberObject.default.create({
                            generateSlug: function generateSlug(slugType, str) {
                                return _rsvp.default.resolve(str + '-slug');
                            }
                        }),
                        model: _emberObject.default.create({
                            slug: 'whatever'
                        })
                    }).create();
                });

                (0, _chai.expect)(object.get('model.slug')).to.equal('whatever');

                object.set('model.titleScratch', '(Untitled)');

                (0, _emberRunloop.default)(function () {
                    object.get('generateSlug').perform();
                });

                (0, _wait.default)().then(function () {
                    (0, _chai.expect)(object.get('model.slug')).to.equal('whatever');
                    done();
                });
            });
        });

        (0, _mocha.describe)('saveTitle', function () {
            (0, _mocha.it)('should invoke generateSlug if the post is new and a title has not been set', function (done) {
                var object = void 0;

                (0, _emberRunloop.default)(function () {
                    object = _emberObject.default.extend(_editorBaseController.default, {
                        model: _emberObject.default.create({ isNew: true }),
                        generateSlug: (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            this.set('model.slug', 'test-slug');
                                            _context.next = 3;
                                            return _rsvp.default.resolve();

                                        case 3:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, this);
                        }))
                    }).create();
                });

                (0, _chai.expect)(object.get('model.isNew')).to.be.true;
                (0, _chai.expect)(object.get('model.titleScratch')).to.not.be.ok;

                object.set('model.titleScratch', 'test');

                (0, _emberRunloop.default)(function () {
                    object.get('saveTitle').perform();
                });

                (0, _wait.default)().then(function () {
                    (0, _chai.expect)(object.get('model.titleScratch')).to.equal('test');
                    (0, _chai.expect)(object.get('model.slug')).to.equal('test-slug');
                    done();
                });
            });

            (0, _mocha.it)('should invoke generateSlug if the post is not new and it\'s title is "(Untitled)"', function (done) {
                var object = void 0;

                (0, _emberRunloop.default)(function () {
                    object = _emberObject.default.extend(_editorBaseController.default, {
                        model: _emberObject.default.create({ isNew: false, title: '(Untitled)' }),
                        generateSlug: (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee2() {
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                while (1) {
                                    switch (_context2.prev = _context2.next) {
                                        case 0:
                                            this.set('model.slug', 'test-slug');
                                            _context2.next = 3;
                                            return _rsvp.default.resolve();

                                        case 3:
                                        case 'end':
                                            return _context2.stop();
                                    }
                                }
                            }, _callee2, this);
                        }))
                    }).create();
                });

                (0, _chai.expect)(object.get('model.isNew')).to.be.false;
                (0, _chai.expect)(object.get('model.titleScratch')).to.not.be.ok;

                object.set('model.titleScratch', 'New Title');

                (0, _emberRunloop.default)(function () {
                    object.get('saveTitle').perform();
                });

                (0, _wait.default)().then(function () {
                    (0, _chai.expect)(object.get('model.titleScratch')).to.equal('New Title');
                    (0, _chai.expect)(object.get('model.slug')).to.equal('test-slug');
                    done();
                });
            });

            (0, _mocha.it)('should not invoke generateSlug if the post is new but has a title', function (done) {
                var object = void 0;

                (0, _emberRunloop.default)(function () {
                    object = _emberObject.default.extend(_editorBaseController.default, {
                        model: _emberObject.default.create({
                            isNew: true,
                            title: 'a title'
                        }),
                        generateSlug: (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee3() {
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            (0, _chai.expect)(false, 'generateSlug should not be called').to.equal(true);

                                            _context3.next = 3;
                                            return _rsvp.default.resolve();

                                        case 3:
                                        case 'end':
                                            return _context3.stop();
                                    }
                                }
                            }, _callee3, this);
                        }))
                    }).create();
                });

                (0, _chai.expect)(object.get('model.isNew')).to.be.true;
                (0, _chai.expect)(object.get('model.title')).to.equal('a title');
                (0, _chai.expect)(object.get('model.titleScratch')).to.not.be.ok;

                object.set('model.titleScratch', 'test');

                (0, _emberRunloop.default)(function () {
                    object.get('saveTitle').perform();
                });

                (0, _wait.default)().then(function () {
                    (0, _chai.expect)(object.get('model.titleScratch')).to.equal('test');
                    (0, _chai.expect)(object.get('model.slug')).to.not.be.ok;
                    done();
                });
            });

            (0, _mocha.it)('should not invoke generateSlug if the post is not new and the title is not "(Untitled)"', function (done) {
                var object = void 0;

                (0, _emberRunloop.default)(function () {
                    object = _emberObject.default.extend(_editorBaseController.default, {
                        model: _emberObject.default.create({ isNew: false }),
                        generateSlug: (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee4() {
                            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                while (1) {
                                    switch (_context4.prev = _context4.next) {
                                        case 0:
                                            (0, _chai.expect)(false, 'generateSlug should not be called').to.equal(true);

                                            _context4.next = 3;
                                            return _rsvp.default.resolve();

                                        case 3:
                                        case 'end':
                                            return _context4.stop();
                                    }
                                }
                            }, _callee4, this);
                        }))
                    }).create();
                });

                (0, _chai.expect)(object.get('model.isNew')).to.be.false;
                (0, _chai.expect)(object.get('model.title')).to.not.be.ok;

                object.set('model.titleScratch', 'title');

                (0, _emberRunloop.default)(function () {
                    object.get('saveTitle').perform();
                });

                (0, _wait.default)().then(function () {
                    (0, _chai.expect)(object.get('model.titleScratch')).to.equal('title');
                    (0, _chai.expect)(object.get('model.slug')).to.not.be.ok;
                    done();
                });
            });
        });
    });
});
define('ghost-admin/tests/unit/mixins/infinite-scroll-test', ['ember-object', 'ghost-admin/mixins/infinite-scroll', 'mocha', 'chai'], function (_emberObject, _infiniteScroll, _mocha, _chai) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Unit: Mixin: infinite-scroll', function () {
        // Replace this with your real tests.
        (0, _mocha.it)('works', function () {
            var InfiniteScrollObject = _emberObject.default.extend(_infiniteScroll.default);
            var subject = InfiniteScrollObject.create();

            (0, _chai.expect)(subject).to.be.ok;
        });
    });
});
define('ghost-admin/tests/unit/mixins/validation-engine-test', ['mocha'], function (_mocha) {
    'use strict';

    // import EmberObject from 'ember-object';
    // import ValidationEngineMixin from 'ghost-admin/mixins/validation-engine';

    (0, _mocha.describe)('ValidationEngineMixin', function () {
        // Replace this with your real tests.
        // it('works', function () {
        //     var ValidationEngineObject = EmberObject.extend(ValidationEngineMixin);
        //     var subject = ValidationEngineObject.create();
        //     expect(subject).to.be.ok;
        // });

        (0, _mocha.describe)('#validate', function () {
            (0, _mocha.it)('loads the correct validator');
            (0, _mocha.it)('rejects if the validator doesn\'t exist');
            (0, _mocha.it)('resolves with valid object');
            (0, _mocha.it)('rejects with invalid object');
            (0, _mocha.it)('clears all existing errors');

            (0, _mocha.describe)('with a specified property', function () {
                (0, _mocha.it)('resolves with valid property');
                (0, _mocha.it)('rejects with invalid property');
                (0, _mocha.it)('adds property to hasValidated array');
                (0, _mocha.it)('clears existing error on specified property');
            });

            (0, _mocha.it)('handles a passed in model');
            (0, _mocha.it)('uses this.model if available');
        });

        (0, _mocha.describe)('#save', function () {
            (0, _mocha.it)('calls validate');
            (0, _mocha.it)('rejects with validation errors');
            (0, _mocha.it)('calls object\'s #save if validation passes');
            (0, _mocha.it)('skips validation if it\'s a deletion');
        });
    }); /* jshint expr:true */
    // import {expect} from 'chai';
});
define('ghost-admin/tests/unit/models/invite-test', ['pretender', 'ember-runloop', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _emberRunloop, _mocha, _chai, _emberMocha) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    (0, _mocha.describe)('Unit: Model: invite', function () {
        (0, _emberMocha.setupModelTest)('invite', {
            needs: ['model:role', 'serializer:application', 'serializer:invite', 'transform:moment-utc', 'service:ghost-paths', 'service:ajax', 'service:session', 'service:feature', 'service:tour']
        });

        (0, _mocha.describe)('with network', function () {
            var server = void 0;

            beforeEach(function () {
                server = new _pretender.default();
            });

            afterEach(function () {
                server.shutdown();
            });

            (0, _mocha.it)('resend hits correct endpoint', function () {
                var _this = this;

                var model = this.subject();
                var role = void 0;

                server.post('/ghost/api/v0.1/invites/', function () {
                    return [200, {}, '{}'];
                });

                (0, _emberRunloop.default)(function () {
                    role = _this.store().push({ data: { id: 1, type: 'role', attributes: { name: 'Editor' } } });
                    model.set('email', 'resend-test@example.com');
                    model.set('role', role);
                    model.resend();
                });

                (0, _chai.expect)(server.handledRequests.length, 'number of requests').to.equal(1);

                var _server$handledReques = _slicedToArray(server.handledRequests, 1),
                    lastRequest = _server$handledReques[0];

                var requestBody = JSON.parse(lastRequest.requestBody);

                var _requestBody$invites = _slicedToArray(requestBody.invites, 1),
                    invite = _requestBody$invites[0];

                (0, _chai.expect)(requestBody.invites.length, 'number of invites in request body').to.equal(1);

                (0, _chai.expect)(invite.email).to.equal('resend-test@example.com');
                // eslint-disable-next-line camelcase
                (0, _chai.expect)(invite.role_id, 'role ID').to.equal('1');
            });
        });
    });
});
define('ghost-admin/tests/unit/models/navigation-item-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Model: navigation-item', function () {
        (0, _emberMocha.setupTest)('model:navigation-item', {
            // Specify the other units that are required for this test.
            needs: []
        });

        (0, _mocha.it)('isComplete is true when label and url are filled', function () {
            var model = this.subject();

            model.set('label', 'test');
            model.set('url', 'test');

            (0, _chai.expect)(model.get('isComplete')).to.be.true;
        });

        (0, _mocha.it)('isComplete is false when label is blank', function () {
            var model = this.subject();

            model.set('label', '');
            model.set('url', 'test');

            (0, _chai.expect)(model.get('isComplete')).to.be.false;
        });

        (0, _mocha.it)('isComplete is false when url is blank', function () {
            var model = this.subject();

            model.set('label', 'test');
            model.set('url', '');

            (0, _chai.expect)(model.get('isComplete')).to.be.false;
        });

        (0, _mocha.it)('isBlank is true when label and url are blank', function () {
            var model = this.subject();

            model.set('label', '');
            model.set('url', '');

            (0, _chai.expect)(model.get('isBlank')).to.be.true;
        });

        (0, _mocha.it)('isBlank is false when label is present', function () {
            var model = this.subject();

            model.set('label', 'test');
            model.set('url', '');

            (0, _chai.expect)(model.get('isBlank')).to.be.false;
        });

        (0, _mocha.it)('isBlank is false when url is present', function () {
            var model = this.subject();

            model.set('label', '');
            model.set('url', 'test');

            (0, _chai.expect)(model.get('isBlank')).to.be.false;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/models/post-test', ['ember-object', 'ember-runloop', 'mocha', 'ember-mocha'], function (_emberObject, _emberRunloop, _mocha, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Model: post', function () {
        (0, _emberMocha.setupModelTest)('post', {
            needs: ['model:user', 'model:tag', 'model:role', 'service:clock', 'service:config', 'service:feature', 'service:ghostPaths', 'service:session', 'service:settings']
        });

        (0, _mocha.it)('has a validation type of "post"', function () {
            var model = this.subject();

            expect(model.validationType).to.equal('post');
        });

        (0, _mocha.it)('isPublished, isDraft and isScheduled are correct', function () {
            var model = this.subject({
                status: 'published'
            });

            expect(model.get('isPublished')).to.be.ok;
            expect(model.get('isDraft')).to.not.be.ok;
            expect(model.get('isScheduled')).to.not.be.ok;

            (0, _emberRunloop.default)(function () {
                model.set('status', 'draft');

                expect(model.get('isPublished')).to.not.be.ok;
                expect(model.get('isDraft')).to.be.ok;
                expect(model.get('isScheduled')).to.not.be.ok;
            });

            (0, _emberRunloop.default)(function () {
                model.set('status', 'scheduled');

                expect(model.get('isScheduled')).to.be.ok;
                expect(model.get('isPublished')).to.not.be.ok;
                expect(model.get('isDraft')).to.not.be.ok;
            });
        });

        (0, _mocha.it)('isAuthoredByUser is correct', function () {
            var model = this.subject({
                authorId: 'abcd1234'
            });
            var user = _emberObject.default.create({ id: 'abcd1234' });

            expect(model.isAuthoredByUser(user)).to.be.ok;

            (0, _emberRunloop.default)(function () {
                model.set('authorId', 'wxyz9876');

                expect(model.isAuthoredByUser(user)).to.not.be.ok;
            });
        });

        (0, _mocha.it)('updateTags removes and deletes old tags', function () {
            var model = this.subject();

            (0, _emberRunloop.default)(this, function () {
                var modelTags = model.get('tags');
                var tag1 = this.store().createRecord('tag', { id: '1' });
                var tag2 = this.store().createRecord('tag', { id: '2' });
                var tag3 = this.store().createRecord('tag');

                // During testing a record created without an explicit id will get
                // an id of 'fixture-n' instead of null
                tag3.set('id', null);

                modelTags.pushObject(tag1);
                modelTags.pushObject(tag2);
                modelTags.pushObject(tag3);

                expect(model.get('tags.length')).to.equal(3);

                model.updateTags();

                expect(model.get('tags.length')).to.equal(2);
                expect(model.get('tags.firstObject.id')).to.equal('1');
                expect(model.get('tags').objectAt(1).get('id')).to.equal('2');
                expect(tag1.get('isDeleted')).to.not.be.ok;
                expect(tag2.get('isDeleted')).to.not.be.ok;
                expect(tag3.get('isDeleted')).to.be.ok;
            });
        });
    });
});
define('ghost-admin/tests/unit/models/role-test', ['ember-runloop', 'mocha', 'ember-mocha'], function (_emberRunloop, _mocha, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Model: role', function () {
        (0, _emberMocha.setupModelTest)('role', {
            needs: ['service:ajax']
        });

        (0, _mocha.it)('provides a lowercase version of the name', function () {
            var model = this.subject({
                name: 'Author'
            });

            expect(model.get('name')).to.equal('Author');
            expect(model.get('lowerCaseName')).to.equal('author');

            (0, _emberRunloop.default)(function () {
                model.set('name', 'Editor');

                expect(model.get('name')).to.equal('Editor');
                expect(model.get('lowerCaseName')).to.equal('editor');
            });
        });
    });
});
define('ghost-admin/tests/unit/models/setting-test', ['mocha', 'ember-mocha'], function (_mocha, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Model: setting', function () {
        (0, _emberMocha.setupModelTest)('setting');
        (0, _mocha.it)('has a validation type of "setting"', function () {
            var model = this.subject();

            expect(model.get('validationType')).to.equal('setting');
        });
    });
});
define('ghost-admin/tests/unit/models/subscriber-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Model: subscriber', function () {
        (0, _emberMocha.setupModelTest)('subscriber', {
            // Specify the other units that are required for this test.
            needs: ['model:post', 'service:session']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('exists', function () {
            var model = this.subject();
            // var store = this.store();
            (0, _chai.expect)(model).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/models/tag-test', ['mocha', 'ember-mocha'], function (_mocha, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Model: tag', function () {
        (0, _emberMocha.setupModelTest)('tag', {
            needs: ['service:feature']
        });

        (0, _mocha.it)('has a validation type of "tag"', function () {
            var model = this.subject();

            expect(model.get('validationType')).to.equal('tag');
        });
    });
});
define('ghost-admin/tests/unit/models/user-test', ['ember-runloop', 'mocha', 'ember-mocha'], function (_emberRunloop, _mocha, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Model: user', function () {
        (0, _emberMocha.setupModelTest)('user', {
            needs: ['model:role', 'serializer:application', 'serializer:user', 'service:ajax', 'service:ghostPaths', 'service:notifications', 'service:session']
        });

        (0, _mocha.it)('has a validation type of "user"', function () {
            var model = this.subject();

            expect(model.get('validationType')).to.equal('user');
        });

        (0, _mocha.it)('isActive/isSuspended properties are correct', function () {
            var model = this.subject({
                status: 'active'
            });

            expect(model.get('isActive')).to.be.ok;
            expect(model.get('isSuspended')).to.not.be.ok;

            ['warn-1', 'warn-2', 'warn-3', 'warn-4', 'locked'].forEach(function (status) {
                (0, _emberRunloop.default)(function () {
                    model.set('status', status);
                });
                expect(model.get('isActive')).to.be.ok;
                expect(model.get('isSuspended')).to.not.be.ok;
            });

            (0, _emberRunloop.default)(function () {
                model.set('status', 'inactive');
            });
            expect(model.get('isSuspended')).to.be.ok;
            expect(model.get('isActive')).to.not.be.ok;
        });

        (0, _mocha.it)('role property is correct', function () {
            var _this = this;

            var model = this.subject();

            (0, _emberRunloop.default)(function () {
                var role = _this.store().push({ data: { id: 1, type: 'role', attributes: { name: 'Author' } } });
                model.get('roles').pushObject(role);
            });
            expect(model.get('role.name')).to.equal('Author');

            (0, _emberRunloop.default)(function () {
                var role = _this.store().push({ data: { id: 1, type: 'role', attributes: { name: 'Editor' } } });
                model.set('role', role);
            });
            expect(model.get('role.name')).to.equal('Editor');
        });

        (0, _mocha.it)('isAuthor property is correct', function () {
            var _this2 = this;

            var model = this.subject();

            (0, _emberRunloop.default)(function () {
                var role = _this2.store().push({ data: { id: 1, type: 'role', attributes: { name: 'Author' } } });
                model.set('role', role);
            });
            expect(model.get('isAuthor')).to.be.ok;
            expect(model.get('isEditor')).to.not.be.ok;
            expect(model.get('isAdmin')).to.not.be.ok;
            expect(model.get('isOwner')).to.not.be.ok;
        });

        (0, _mocha.it)('isEditor property is correct', function () {
            var _this3 = this;

            var model = this.subject();

            (0, _emberRunloop.default)(function () {
                var role = _this3.store().push({ data: { id: 1, type: 'role', attributes: { name: 'Editor' } } });
                model.set('role', role);
            });
            expect(model.get('isEditor')).to.be.ok;
            expect(model.get('isAuthor')).to.not.be.ok;
            expect(model.get('isAdmin')).to.not.be.ok;
            expect(model.get('isOwner')).to.not.be.ok;
        });

        (0, _mocha.it)('isAdmin property is correct', function () {
            var _this4 = this;

            var model = this.subject();

            (0, _emberRunloop.default)(function () {
                var role = _this4.store().push({ data: { id: 1, type: 'role', attributes: { name: 'Administrator' } } });
                model.set('role', role);
            });
            expect(model.get('isAdmin')).to.be.ok;
            expect(model.get('isAuthor')).to.not.be.ok;
            expect(model.get('isEditor')).to.not.be.ok;
            expect(model.get('isOwner')).to.not.be.ok;
        });

        (0, _mocha.it)('isOwner property is correct', function () {
            var _this5 = this;

            var model = this.subject();

            (0, _emberRunloop.default)(function () {
                var role = _this5.store().push({ data: { id: 1, type: 'role', attributes: { name: 'Owner' } } });
                model.set('role', role);
            });
            expect(model.get('isOwner')).to.be.ok;
            expect(model.get('isAuthor')).to.not.be.ok;
            expect(model.get('isAdmin')).to.not.be.ok;
            expect(model.get('isEditor')).to.not.be.ok;
        });
    });
});
define('ghost-admin/tests/unit/routes/subscribers-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Route: subscribers', function () {
        (0, _emberMocha.setupTest)('route:subscribers', {
            needs: ['service:feature', 'service:notifications', 'service:session']
        });

        (0, _mocha.it)('exists', function () {
            var route = this.subject();
            (0, _chai.expect)(route).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/routes/subscribers/import-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Route: subscribers/import', function () {
        (0, _emberMocha.setupTest)('route:subscribers/import', {
            // Specify the other units that are required for this test.
            needs: ['service:notifications']
        });

        (0, _mocha.it)('exists', function () {
            var route = this.subject();
            (0, _chai.expect)(route).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/routes/subscribers/new-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Route: subscribers/new', function () {
        (0, _emberMocha.setupTest)('route:subscribers/new', {
            needs: ['service:notifications']
        });

        (0, _mocha.it)('exists', function () {
            var route = this.subject();
            (0, _chai.expect)(route).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/serializers/notification-test', ['pretender', 'mocha', 'chai', 'ember-mocha'], function (_pretender, _mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Serializer: notification', function () {
        (0, _emberMocha.setupModelTest)('notification', {
            // Specify the other units that are required for this test.
            needs: ['serializer:notification']
        });

        var server = void 0;

        beforeEach(function () {
            server = new _pretender.default();
        });

        afterEach(function () {
            server.shutdown();
        });

        (0, _mocha.it)('converts location->key when deserializing', function () {
            server.get('/notifications', function () {
                var response = {
                    notifications: [{
                        id: 1,
                        dismissible: false,
                        status: 'alert',
                        type: 'info',
                        location: 'test.foo',
                        message: 'This is a test'
                    }]
                };

                return [200, { 'Content-Type': 'application/json' }, JSON.stringify(response)];
            });

            return this.store().findAll('notification').then(function (notifications) {
                (0, _chai.expect)(notifications.get('length')).to.equal(1);
                (0, _chai.expect)(notifications.get('firstObject.key')).to.equal('test.foo');
            });
        });
    });
});
define('ghost-admin/tests/unit/serializers/post-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Serializer: post', function () {
        (0, _emberMocha.setupModelTest)('post', {
            // Specify the other units that are required for this test.
            needs: ['transform:moment-utc', 'transform:json-string', 'model:user', 'model:tag', 'service:clock', 'service:config', 'service:ghostPaths', 'service:settings']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('serializes records', function () {
            var record = this.subject();

            var serializedRecord = record.serialize();

            (0, _chai.expect)(serializedRecord).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/serializers/role-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit:Serializer: role', function () {
        (0, _emberMocha.setupModelTest)('role', {
            // Specify the other units that are required for this test.
            needs: ['transform:moment-utc']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('serializes records', function () {
            var record = this.subject();

            var serializedRecord = record.serialize();

            (0, _chai.expect)(serializedRecord).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/serializers/setting-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit:Serializer: setting', function () {
        (0, _emberMocha.setupModelTest)('setting', {
            // Specify the other units that are required for this test.
            needs: ['transform:moment-utc', 'transform:facebook-url-user', 'transform:twitter-url-user', 'transform:navigation-settings', 'transform:slack-settings']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('serializes records', function () {
            var record = this.subject();

            var serializedRecord = record.serialize();

            (0, _chai.expect)(serializedRecord).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/serializers/subscriber-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit:Serializer: subscriber', function () {
        (0, _emberMocha.setupModelTest)('subscriber', {
            // Specify the other units that are required for this test.
            needs: ['model:post', 'transform:moment-utc']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('serializes records', function () {
            var record = this.subject();

            var serializedRecord = record.serialize();

            (0, _chai.expect)(serializedRecord).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/serializers/tag-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Serializer: tag', function () {
        (0, _emberMocha.setupModelTest)('tag', {
            // Specify the other units that are required for this test.
            needs: ['service:feature', 'transform:moment-utc', 'transform:raw']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('serializes records', function () {
            var record = this.subject();

            var serializedRecord = record.serialize();

            (0, _chai.expect)(serializedRecord).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/serializers/user-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Serializer: user', function () {
        (0, _emberMocha.setupModelTest)('user', {
            // Specify the other units that are required for this test.
            needs: ['model:role', 'service:ajax', 'service:ghostPaths', 'service:notifications', 'service:session', 'transform:facebook-url-user', 'transform:json-string', 'transform:moment-utc', 'transform:raw', 'transform:twitter-url-user']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('serializes records', function () {
            var record = this.subject();

            var serializedRecord = record.serialize();

            (0, _chai.expect)(serializedRecord).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/services/config-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Service: config', function () {
        (0, _emberMocha.setupTest)('service:config', {
            needs: ['service:ajax', 'service:ghostPaths']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('exists', function () {
            var service = this.subject();
            (0, _chai.expect)(service).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/services/event-bus-test', ['sinon', 'mocha', 'chai', 'ember-mocha'], function (_sinon, _mocha, _chai, _emberMocha) {
    'use strict';

    /* jshint expr:true */
    (0, _mocha.describe)('Unit: Service: event-bus', function () {
        (0, _emberMocha.setupTest)('service:event-bus', {});
        (0, _mocha.it)('works', function () {
            var service = this.subject();
            var eventHandler = _sinon.default.spy();

            service.subscribe('test-event', eventHandler);

            service.publish('test-event', 'test');

            service.unsubscribe('test-event', eventHandler);

            service.publish('test-event', 'test two');

            (0, _chai.expect)(eventHandler.calledOnce, 'event handler only triggered once').to.be.true;

            (0, _chai.expect)(eventHandler.calledWith('test'), 'event handler was passed correct arguments').to.be.true;
        });
    });
});
define('ghost-admin/tests/unit/services/notifications-test', ['ember-object', 'ember-metal/get', 'ember-runloop', 'sinon', 'ember-ajax/errors', 'ghost-admin/services/ajax', 'mocha', 'ember-array/utils', 'chai', 'ember-mocha'], function (_emberObject, _get, _emberRunloop, _sinon, _errors, _ajax, _mocha, _utils, _chai, _emberMocha) {
    'use strict';

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    (0, _mocha.describe)('Unit: Service: notifications', function () {
        (0, _emberMocha.setupTest)('service:notifications', {
            needs: ['service:upgradeStatus']
        });

        beforeEach(function () {
            this.subject().set('content', (0, _utils.A)());
            this.subject().set('delayedNotifications', (0, _utils.A)());
        });

        (0, _mocha.it)('filters alerts/notifications', function () {
            var notifications = this.subject();

            // wrapped in run-loop to enure alerts/notifications CPs are updated
            (0, _emberRunloop.default)(function () {
                notifications.showAlert('Alert');
                notifications.showNotification('Notification');
            });

            (0, _chai.expect)(notifications.get('alerts.length')).to.equal(1);
            (0, _chai.expect)(notifications.get('alerts.firstObject.message')).to.equal('Alert');

            (0, _chai.expect)(notifications.get('notifications.length')).to.equal(1);
            (0, _chai.expect)(notifications.get('notifications.firstObject.message')).to.equal('Notification');
        });

        (0, _mocha.it)('#handleNotification deals with DS.Notification notifications', function () {
            var notifications = this.subject();
            var notification = _emberObject.default.create({ message: '<h1>Test</h1>', status: 'alert' });

            notification.toJSON = function () {};

            notifications.handleNotification(notification);

            notification = notifications.get('alerts')[0];

            // alerts received from the server should be marked html safe
            (0, _chai.expect)(notification.get('message')).to.have.property('toHTML');
        });

        (0, _mocha.it)('#handleNotification defaults to notification if no status supplied', function () {
            var notifications = this.subject();

            notifications.handleNotification({ message: 'Test' }, false);

            (0, _chai.expect)(notifications.get('content')).to.deep.include({ message: 'Test', status: 'notification' });
        });

        (0, _mocha.it)('#showAlert adds POJO alerts', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showAlert('Test Alert', { type: 'error' });
            });

            (0, _chai.expect)(notifications.get('alerts')).to.deep.include({ message: 'Test Alert', status: 'alert', type: 'error', key: undefined });
        });

        (0, _mocha.it)('#showAlert adds delayed notifications', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showNotification('Test Alert', { type: 'error', delayed: true });
            });

            (0, _chai.expect)(notifications.get('delayedNotifications')).to.deep.include({ message: 'Test Alert', status: 'notification', type: 'error', key: undefined });
        });

        // in order to cater for complex keys that are suitable for i18n
        // we split on the second period and treat the resulting base as
        // the key for duplicate checking
        (0, _mocha.it)('#showAlert clears duplicates', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showAlert('Kept');
                notifications.showAlert('Duplicate', { key: 'duplicate.key.fail' });
            });

            (0, _chai.expect)(notifications.get('alerts.length')).to.equal(2);

            (0, _emberRunloop.default)(function () {
                notifications.showAlert('Duplicate with new message', { key: 'duplicate.key.success' });
            });

            (0, _chai.expect)(notifications.get('alerts.length')).to.equal(2);
            (0, _chai.expect)(notifications.get('alerts.lastObject.message')).to.equal('Duplicate with new message');
        });

        (0, _mocha.it)('#showNotification adds POJO notifications', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showNotification('Test Notification', { type: 'success' });
            });

            (0, _chai.expect)(notifications.get('notifications')).to.deep.include({ message: 'Test Notification', status: 'notification', type: 'success', key: undefined });
        });

        (0, _mocha.it)('#showNotification adds delayed notifications', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showNotification('Test Notification', { delayed: true });
            });

            (0, _chai.expect)(notifications.get('delayedNotifications')).to.deep.include({ message: 'Test Notification', status: 'notification', type: undefined, key: undefined });
        });

        (0, _mocha.it)('#showNotification clears existing notifications', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showNotification('First');
                notifications.showNotification('Second');
            });

            (0, _chai.expect)(notifications.get('notifications.length')).to.equal(1);
            (0, _chai.expect)(notifications.get('notifications')).to.deep.equal([{ message: 'Second', status: 'notification', type: undefined, key: undefined }]);
        });

        (0, _mocha.it)('#showNotification keeps existing notifications if doNotCloseNotifications option passed', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showNotification('First');
                notifications.showNotification('Second', { doNotCloseNotifications: true });
            });

            (0, _chai.expect)(notifications.get('notifications.length')).to.equal(2);
        });

        (0, _mocha.it)('#showAPIError handles single json response error', function () {
            var notifications = this.subject();
            var error = new _errors.AjaxError([{ message: 'Single error' }]);

            (0, _emberRunloop.default)(function () {
                notifications.showAPIError(error);
            });

            var alert = notifications.get('alerts.firstObject');
            (0, _chai.expect)((0, _get.default)(alert, 'message')).to.equal('Single error');
            (0, _chai.expect)((0, _get.default)(alert, 'status')).to.equal('alert');
            (0, _chai.expect)((0, _get.default)(alert, 'type')).to.equal('error');
            (0, _chai.expect)((0, _get.default)(alert, 'key')).to.equal('api-error');
        });

        (0, _mocha.it)('#showAPIError handles multiple json response errors', function () {
            var notifications = this.subject();
            var error = new _errors.AjaxError([{ title: 'First error', message: 'First error message' }, { title: 'Second error', message: 'Second error message' }]);

            (0, _emberRunloop.default)(function () {
                notifications.showAPIError(error);
            });

            (0, _chai.expect)(notifications.get('alerts.length')).to.equal(2);

            var _notifications$get = notifications.get('alerts'),
                _notifications$get2 = _slicedToArray(_notifications$get, 2),
                alert1 = _notifications$get2[0],
                alert2 = _notifications$get2[1];

            (0, _chai.expect)(alert1).to.deep.equal({ message: 'First error message', status: 'alert', type: 'error', key: 'api-error.first-error' });
            (0, _chai.expect)(alert2).to.deep.equal({ message: 'Second error message', status: 'alert', type: 'error', key: 'api-error.second-error' });
        });

        (0, _mocha.it)('#showAPIError displays default error text if response has no error/message', function () {
            var notifications = this.subject();
            var resp = false;

            (0, _emberRunloop.default)(function () {
                notifications.showAPIError(resp);
            });

            (0, _chai.expect)(notifications.get('content').toArray()).to.deep.equal([{ message: 'There was a problem on the server, please try again.', status: 'alert', type: 'error', key: 'api-error' }]);

            notifications.set('content', (0, _utils.A)());

            (0, _emberRunloop.default)(function () {
                notifications.showAPIError(resp, { defaultErrorText: 'Overridden default' });
            });
            (0, _chai.expect)(notifications.get('content').toArray()).to.deep.equal([{ message: 'Overridden default', status: 'alert', type: 'error', key: 'api-error' }]);
        });

        (0, _mocha.it)('#showAPIError sets correct key when passed a base key', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showAPIError('Test', { key: 'test.alert' });
            });

            (0, _chai.expect)(notifications.get('alerts.firstObject.key')).to.equal('api-error.test.alert');
        });

        (0, _mocha.it)('#showAPIError sets correct key when not passed a key', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showAPIError('Test');
            });

            (0, _chai.expect)(notifications.get('alerts.firstObject.key')).to.equal('api-error');
        });

        (0, _mocha.it)('#showAPIError parses default ember-ajax errors correctly', function () {
            var notifications = this.subject();
            var error = new _errors.InvalidError();

            (0, _emberRunloop.default)(function () {
                notifications.showAPIError(error);
            });

            var notification = notifications.get('alerts.firstObject');
            (0, _chai.expect)((0, _get.default)(notification, 'message')).to.equal('Request was rejected because it was invalid');
            (0, _chai.expect)((0, _get.default)(notification, 'status')).to.equal('alert');
            (0, _chai.expect)((0, _get.default)(notification, 'type')).to.equal('error');
            (0, _chai.expect)((0, _get.default)(notification, 'key')).to.equal('api-error.ajax-error');
        });

        (0, _mocha.it)('#showAPIError parses custom ember-ajax errors correctly', function () {
            var notifications = this.subject();
            var error = new _ajax.ServerUnreachableError();

            (0, _emberRunloop.default)(function () {
                notifications.showAPIError(error);
            });

            var notification = notifications.get('alerts.firstObject');
            (0, _chai.expect)((0, _get.default)(notification, 'message')).to.equal('Server was unreachable');
            (0, _chai.expect)((0, _get.default)(notification, 'status')).to.equal('alert');
            (0, _chai.expect)((0, _get.default)(notification, 'type')).to.equal('error');
            (0, _chai.expect)((0, _get.default)(notification, 'key')).to.equal('api-error.ajax-error');
        });

        (0, _mocha.it)('#displayDelayed moves delayed notifications into content', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showNotification('First', { delayed: true });
                notifications.showNotification('Second', { delayed: true });
                notifications.showNotification('Third', { delayed: false });
                notifications.displayDelayed();
            });

            (0, _chai.expect)(notifications.get('notifications')).to.deep.equal([{ message: 'Third', status: 'notification', type: undefined, key: undefined }, { message: 'First', status: 'notification', type: undefined, key: undefined }, { message: 'Second', status: 'notification', type: undefined, key: undefined }]);
        });

        (0, _mocha.it)('#closeNotification removes POJO notifications', function () {
            var notification = { message: 'Close test', status: 'notification' };
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.handleNotification(notification);
            });

            (0, _chai.expect)(notifications.get('notifications')).to.include(notification);

            (0, _emberRunloop.default)(function () {
                notifications.closeNotification(notification);
            });

            (0, _chai.expect)(notifications.get('notifications')).to.not.include(notification);
        });

        (0, _mocha.it)('#closeNotification removes and deletes DS.Notification records', function () {
            var notification = _emberObject.default.create({ message: 'Close test', status: 'alert' });
            var notifications = this.subject();

            notification.toJSON = function () {};
            notification.deleteRecord = function () {};
            _sinon.default.spy(notification, 'deleteRecord');
            notification.save = function () {
                return {
                    finally: function _finally(callback) {
                        return callback(notification);
                    }
                };
            };
            _sinon.default.spy(notification, 'save');

            (0, _emberRunloop.default)(function () {
                notifications.handleNotification(notification);
            });

            (0, _chai.expect)(notifications.get('alerts')).to.include(notification);

            (0, _emberRunloop.default)(function () {
                notifications.closeNotification(notification);
            });

            (0, _chai.expect)(notification.deleteRecord.calledOnce).to.be.true;
            (0, _chai.expect)(notification.save.calledOnce).to.be.true;

            (0, _chai.expect)(notifications.get('alerts')).to.not.include(notification);
        });

        (0, _mocha.it)('#closeNotifications only removes notifications', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showAlert('First alert');
                notifications.showNotification('First notification');
                notifications.showNotification('Second notification', { doNotCloseNotifications: true });
            });

            (0, _chai.expect)(notifications.get('alerts.length'), 'alerts count').to.equal(1);
            (0, _chai.expect)(notifications.get('notifications.length'), 'notifications count').to.equal(2);

            (0, _emberRunloop.default)(function () {
                notifications.closeNotifications();
            });

            (0, _chai.expect)(notifications.get('alerts.length'), 'alerts count').to.equal(1);
            (0, _chai.expect)(notifications.get('notifications.length'), 'notifications count').to.equal(0);
        });

        (0, _mocha.it)('#closeNotifications only closes notifications with specified key', function () {
            var notifications = this.subject();

            (0, _emberRunloop.default)(function () {
                notifications.showAlert('First alert');
                // using handleNotification as showNotification will auto-prune
                // duplicates and keys will be removed if doNotCloseNotifications
                // is true
                notifications.handleNotification({ message: 'First notification', key: 'test.close', status: 'notification' });
                notifications.handleNotification({ message: 'Second notification', key: 'test.keep', status: 'notification' });
                notifications.handleNotification({ message: 'Third notification', key: 'test.close', status: 'notification' });
            });

            (0, _emberRunloop.default)(function () {
                notifications.closeNotifications('test.close');
            });

            (0, _chai.expect)(notifications.get('notifications.length'), 'notifications count').to.equal(1);
            (0, _chai.expect)(notifications.get('notifications.firstObject.message'), 'notification message').to.equal('Second notification');
            (0, _chai.expect)(notifications.get('alerts.length'), 'alerts count').to.equal(1);
        });

        (0, _mocha.it)('#clearAll removes everything without deletion', function () {
            var notifications = this.subject();
            var notificationModel = _emberObject.default.create({ message: 'model' });

            notificationModel.toJSON = function () {};
            notificationModel.deleteRecord = function () {};
            _sinon.default.spy(notificationModel, 'deleteRecord');
            notificationModel.save = function () {
                return {
                    finally: function _finally(callback) {
                        return callback(notificationModel);
                    }
                };
            };
            _sinon.default.spy(notificationModel, 'save');

            notifications.handleNotification(notificationModel);
            notifications.handleNotification({ message: 'pojo' });

            notifications.clearAll();

            (0, _chai.expect)(notifications.get('content')).to.be.empty;
            (0, _chai.expect)(notificationModel.deleteRecord.called).to.be.false;
            (0, _chai.expect)(notificationModel.save.called).to.be.false;
        });

        (0, _mocha.it)('#closeAlerts only removes alerts', function () {
            var notifications = this.subject();

            notifications.showNotification('First notification');
            notifications.showAlert('First alert');
            notifications.showAlert('Second alert');

            (0, _emberRunloop.default)(function () {
                notifications.closeAlerts();
            });

            (0, _chai.expect)(notifications.get('alerts.length')).to.equal(0);
            (0, _chai.expect)(notifications.get('notifications.length')).to.equal(1);
        });

        (0, _mocha.it)('#closeAlerts closes only alerts with specified key', function () {
            var notifications = this.subject();

            notifications.showNotification('First notification');
            notifications.showAlert('First alert', { key: 'test.close' });
            notifications.showAlert('Second alert', { key: 'test.keep' });
            notifications.showAlert('Third alert', { key: 'test.close' });

            (0, _emberRunloop.default)(function () {
                notifications.closeAlerts('test.close');
            });

            (0, _chai.expect)(notifications.get('alerts.length')).to.equal(1);
            (0, _chai.expect)(notifications.get('alerts.firstObject.message')).to.equal('Second alert');
            (0, _chai.expect)(notifications.get('notifications.length')).to.equal(1);
        });
    });
});
define('ghost-admin/tests/unit/services/upgrade-status-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Service: upgrade-status', function () {
        (0, _emberMocha.setupTest)('service:upgrade-status', {
            // Specify the other units that are required for this test.
            // needs: ['service:foo']
            needs: ['service:notifications']
        });

        // Replace this with your real tests.
        (0, _mocha.it)('exists', function () {
            var service = this.subject();
            (0, _chai.expect)(service).to.be.ok;
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/transforms/facebook-url-user-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Transform: facebook-url-user', function () {
        (0, _emberMocha.setupTest)('transform:facebook-url-user', {});
        (0, _mocha.it)('deserializes facebook url', function () {
            var transform = this.subject();
            var serialized = 'testuser';
            var result = transform.deserialize(serialized);

            (0, _chai.expect)(result).to.equal('https://www.facebook.com/testuser');
        });

        (0, _mocha.it)('serializes url to facebook username', function () {
            var transform = this.subject();
            var deserialized = 'https://www.facebook.com/testuser';
            var result = transform.serialize(deserialized);

            (0, _chai.expect)(result).to.equal('testuser');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/transforms/json-string-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Transform: json-string', function () {
        (0, _emberMocha.setupTest)('transform:json-string', {});
        (0, _mocha.it)('exists', function () {
            var transform = this.subject();
            (0, _chai.expect)(transform).to.be.ok;
        });

        (0, _mocha.it)('serialises an Object to a JSON String', function () {
            var transform = this.subject();
            var obj = { one: 'one', two: 'two' };
            (0, _chai.expect)(transform.serialize(obj)).to.equal(JSON.stringify(obj));
        });

        (0, _mocha.it)('deserialises a JSON String to an Object', function () {
            var transform = this.subject();
            var obj = { one: 'one', two: 'two' };
            (0, _chai.expect)(transform.deserialize(JSON.stringify(obj))).to.deep.equal(obj);
        });
    });
});
define('ghost-admin/tests/unit/transforms/navigation-settings-test', ['ghost-admin/models/navigation-item', 'mocha', 'ember-array/utils', 'chai', 'ember-mocha'], function (_navigationItem, _mocha, _utils, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Transform: navigation-settings', function () {
        (0, _emberMocha.setupTest)('transform:navigation-settings', {});
        (0, _mocha.it)('deserializes navigation json', function () {
            var transform = this.subject();
            var serialized = '[{"label":"One","url":"/one"},{"label":"Two","url":"/two"}]';
            var result = transform.deserialize(serialized);

            (0, _chai.expect)(result.length).to.equal(2);
            (0, _chai.expect)(result[0]).to.be.instanceof(_navigationItem.default);
            (0, _chai.expect)(result[0].get('label')).to.equal('One');
            (0, _chai.expect)(result[0].get('url')).to.equal('/one');
            (0, _chai.expect)(result[1]).to.be.instanceof(_navigationItem.default);
            (0, _chai.expect)(result[1].get('label')).to.equal('Two');
            (0, _chai.expect)(result[1].get('url')).to.equal('/two');
        });

        (0, _mocha.it)('serializes array of NavigationItems', function () {
            var transform = this.subject();
            var deserialized = (0, _utils.A)([_navigationItem.default.create({ label: 'One', url: '/one' }), _navigationItem.default.create({ label: 'Two', url: '/two' })]);
            var result = transform.serialize(deserialized);

            (0, _chai.expect)(result).to.equal('[{"label":"One","url":"/one"},{"label":"Two","url":"/two"}]');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/transforms/slack-settings-test', ['ghost-admin/models/slack-integration', 'mocha', 'ember-array/utils', 'chai', 'ember-mocha'], function (_slackIntegration, _mocha, _utils, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Transform: slack-settings', function () {
        (0, _emberMocha.setupTest)('transform:slack-settings', {});
        (0, _mocha.it)('deserializes settings json', function () {
            var transform = this.subject();
            var serialized = '[{"url":"http://myblog.com/blogpost1"}]';
            var result = transform.deserialize(serialized);

            (0, _chai.expect)(result.length).to.equal(1);
            (0, _chai.expect)(result[0]).to.be.instanceof(_slackIntegration.default);
            (0, _chai.expect)(result[0].get('url')).to.equal('http://myblog.com/blogpost1');
        });

        (0, _mocha.it)('serializes array of Slack settings', function () {
            var transform = this.subject();
            var deserialized = (0, _utils.A)([_slackIntegration.default.create({ url: 'http://myblog.com/blogpost1' })]);
            var result = transform.serialize(deserialized);

            (0, _chai.expect)(result).to.equal('[{"url":"http://myblog.com/blogpost1"}]');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/transforms/twitter-url-user-test', ['mocha', 'chai', 'ember-mocha'], function (_mocha, _chai, _emberMocha) {
    'use strict';

    (0, _mocha.describe)('Unit: Transform: twitter-url-user', function () {
        (0, _emberMocha.setupTest)('transform:twitter-url-user', {});
        (0, _mocha.it)('deserializes twitter url', function () {
            var transform = this.subject();
            var serialized = '@testuser';
            var result = transform.deserialize(serialized);

            (0, _chai.expect)(result).to.equal('https://twitter.com/testuser');
        });

        (0, _mocha.it)('serializes url to twitter username', function () {
            var transform = this.subject();
            var deserialized = 'https://twitter.com/testuser';
            var result = transform.serialize(deserialized);

            (0, _chai.expect)(result).to.equal('@testuser');
        });
    }); /* jshint expr:true */
});
define('ghost-admin/tests/unit/utils/date-formatting-test', [], function () {
    'use strict';

    // import {formatDate} from 'ghost-admin/utils/date-formatting';

    describe('Unit: Util: date-formatting', function () {
        it('formats a date or moment');
    });
});
define('ghost-admin/tests/unit/utils/ghost-paths-test', ['ghost-admin/utils/ghost-paths'], function (_ghostPaths) {
    'use strict';

    describe('Unit: Util: ghost-paths', function () {
        describe('join', function () {
            var join = (0, _ghostPaths.default)().url.join;


            it('should join two or more paths, normalizing slashes', function () {
                var path = void 0;

                path = join('/one/', '/two/');
                expect(path).to.equal('/one/two/');

                path = join('/one', '/two/');
                expect(path).to.equal('/one/two/');

                path = join('/one/', 'two/');
                expect(path).to.equal('/one/two/');

                path = join('/one/', 'two/', '/three/');
                expect(path).to.equal('/one/two/three/');

                path = join('/one/', 'two', 'three/');
                expect(path).to.equal('/one/two/three/');
            });

            it('should not change the slash at the beginning', function () {
                var path = void 0;

                path = join('one/');
                expect(path).to.equal('one/');
                path = join('one/', 'two');
                expect(path).to.equal('one/two/');
                path = join('/one/', 'two');
                expect(path).to.equal('/one/two/');
                path = join('one/', 'two', 'three');
                expect(path).to.equal('one/two/three/');
                path = join('/one/', 'two', 'three');
                expect(path).to.equal('/one/two/three/');
            });

            it('should always return a slash at the end', function () {
                var path = void 0;

                path = join();
                expect(path).to.equal('/');
                path = join('');
                expect(path).to.equal('/');
                path = join('one');
                expect(path).to.equal('one/');
                path = join('one/');
                expect(path).to.equal('one/');
                path = join('one', 'two');
                expect(path).to.equal('one/two/');
                path = join('one', 'two/');
                expect(path).to.equal('one/two/');
            });
        });
    });
});
define('ghost-admin/tests/unit/validators/nav-item-test', ['ghost-admin/models/navigation-item', 'ghost-admin/validators/nav-item', 'mocha', 'chai'], function (_navigationItem, _navItem, _mocha, _chai) {
    'use strict';

    /* jshint expr:true */
    var testInvalidUrl = function testInvalidUrl(url) {
        var navItem = _navigationItem.default.create({ url: url });

        _navItem.default.check(navItem, 'url');

        (0, _chai.expect)(_navItem.default.get('passed'), '"' + url + '" passed').to.be.false;
        (0, _chai.expect)(navItem.get('errors').errorsFor('url').toArray()).to.deep.equal([{
            attribute: 'url',
            message: 'You must specify a valid URL or relative path'
        }]);
        (0, _chai.expect)(navItem.get('hasValidated')).to.include('url');
    };

    var testValidUrl = function testValidUrl(url) {
        var navItem = _navigationItem.default.create({ url: url });

        _navItem.default.check(navItem, 'url');

        (0, _chai.expect)(_navItem.default.get('passed'), '"' + url + '" failed').to.be.true;
        (0, _chai.expect)(navItem.get('hasValidated')).to.include('url');
    };

    (0, _mocha.describe)('Unit: Validator: nav-item', function () {
        (0, _mocha.it)('requires label presence', function () {
            var navItem = _navigationItem.default.create();

            _navItem.default.check(navItem, 'label');

            (0, _chai.expect)(_navItem.default.get('passed')).to.be.false;
            (0, _chai.expect)(navItem.get('errors').errorsFor('label').toArray()).to.deep.equal([{
                attribute: 'label',
                message: 'You must specify a label'
            }]);
            (0, _chai.expect)(navItem.get('hasValidated')).to.include('label');
        });

        (0, _mocha.it)('requires url presence', function () {
            var navItem = _navigationItem.default.create();

            _navItem.default.check(navItem, 'url');

            (0, _chai.expect)(_navItem.default.get('passed')).to.be.false;
            (0, _chai.expect)(navItem.get('errors').errorsFor('url').toArray()).to.deep.equal([{
                attribute: 'url',
                message: 'You must specify a URL or relative path'
            }]);
            (0, _chai.expect)(navItem.get('hasValidated')).to.include('url');
        });

        (0, _mocha.it)('fails on invalid url values', function () {
            var invalidUrls = ['test@example.com', '/has spaces', 'no-leading-slash', 'http://example.com/with spaces'];

            invalidUrls.forEach(function (url) {
                testInvalidUrl(url);
            });
        });

        (0, _mocha.it)('passes on valid url values', function () {
            var validUrls = ['http://localhost:2368', 'http://localhost:2368/some-path', 'https://localhost:2368/some-path', '//localhost:2368/some-path', 'http://localhost:2368/#test', 'http://localhost:2368/?query=test&another=example', 'http://localhost:2368/?query=test&another=example#test', 'tel:01234-567890', 'mailto:test@example.com', 'http://some:user@example.com:1234', '/relative/path'];

            validUrls.forEach(function (url) {
                testValidUrl(url);
            });
        });

        (0, _mocha.it)('validates url and label by default', function () {
            var navItem = _navigationItem.default.create();

            _navItem.default.check(navItem);

            (0, _chai.expect)(navItem.get('errors').errorsFor('label')).to.not.be.empty;
            (0, _chai.expect)(navItem.get('errors').errorsFor('url')).to.not.be.empty;
            (0, _chai.expect)(_navItem.default.get('passed')).to.be.false;
        });
    });
});
define('ghost-admin/tests/unit/validators/slack-integration-test', ['ghost-admin/models/slack-integration', 'ghost-admin/validators/slack-integration', 'mocha', 'chai'], function (_slackIntegration, _slackIntegration2, _mocha, _chai) {
    'use strict';

    /* jshint expr:true */
    var testInvalidUrl = function testInvalidUrl(url) {
        var slackObject = _slackIntegration.default.create({ url: url });

        _slackIntegration2.default.check(slackObject, 'url');

        (0, _chai.expect)(_slackIntegration2.default.get('passed'), '"' + url + '" passed').to.be.false;
        (0, _chai.expect)(slackObject.get('errors').errorsFor('url').toArray()).to.deep.equal([{
            attribute: 'url',
            message: 'The URL must be in a format like https://hooks.slack.com/services/<your personal key>'
        }]);
        (0, _chai.expect)(slackObject.get('hasValidated')).to.include('url');
    };

    var testValidUrl = function testValidUrl(url) {
        var slackObject = _slackIntegration.default.create({ url: url });

        _slackIntegration2.default.check(slackObject, 'url');

        (0, _chai.expect)(_slackIntegration2.default.get('passed'), '"' + url + '" failed').to.be.true;
        (0, _chai.expect)(slackObject.get('hasValidated')).to.include('url');
    };

    (0, _mocha.describe)('Unit: Validator: slack-integration', function () {
        (0, _mocha.it)('fails on invalid url values', function () {
            var invalidUrls = ['test@example.com', '/has spaces', 'no-leading-slash', 'http://example.com/with spaces'];

            invalidUrls.forEach(function (url) {
                testInvalidUrl(url);
            });
        });

        (0, _mocha.it)('passes on valid url values', function () {
            var validUrls = ['https://hooks.slack.com/services/;alskdjf', 'https://hooks.slack.com/services/123445678', 'https://hooks.slack.com/services/some_webhook'];

            validUrls.forEach(function (url) {
                testValidUrl(url);
            });
        });

        (0, _mocha.it)('validates url by default', function () {
            var slackObject = _slackIntegration.default.create();

            _slackIntegration2.default.check(slackObject);

            (0, _chai.expect)(slackObject.get('errors').errorsFor('url')).to.be.empty;
            (0, _chai.expect)(_slackIntegration2.default.get('passed')).to.be.true;
        });
    });
});
define('ghost-admin/tests/unit/validators/subscriber-test', ['ember', 'ghost-admin/mixins/validation-engine', 'mocha', 'chai'], function (_ember, _validationEngine, _mocha, _chai) {
    'use strict';

    var run = _ember.default.run,
        EmberObject = _ember.default.Object;


    var Subscriber = EmberObject.extend(_validationEngine.default, {
        validationType: 'subscriber',

        email: null
    });

    (0, _mocha.describe)('Unit: Validator: subscriber', function () {
        (0, _mocha.it)('validates email by default', function () {
            var subscriber = Subscriber.create({});
            var properties = subscriber.get('validators.subscriber.properties');

            (0, _chai.expect)(properties, 'properties').to.include('email');
        });

        (0, _mocha.it)('passes with a valid email', function () {
            var subscriber = Subscriber.create({ email: 'test@example.com' });
            var passed = false;

            run(function () {
                subscriber.validate({ property: 'email' }).then(function () {
                    passed = true;
                });
            });

            (0, _chai.expect)(passed, 'passed').to.be.true;
            (0, _chai.expect)(subscriber.get('hasValidated'), 'hasValidated').to.include('email');
        });

        (0, _mocha.it)('validates email presence', function () {
            var subscriber = Subscriber.create({});
            var passed = false;

            run(function () {
                subscriber.validate({ property: 'email' }).then(function () {
                    passed = true;
                });
            });

            var emailErrors = subscriber.get('errors').errorsFor('email').get(0);
            (0, _chai.expect)(emailErrors.attribute, 'errors.email.attribute').to.equal('email');
            (0, _chai.expect)(emailErrors.message, 'errors.email.message').to.equal('Please enter an email.');

            (0, _chai.expect)(passed, 'passed').to.be.false;
            (0, _chai.expect)(subscriber.get('hasValidated'), 'hasValidated').to.include('email');
        });

        (0, _mocha.it)('validates email', function () {
            var subscriber = Subscriber.create({ email: 'foo' });
            var passed = false;

            run(function () {
                subscriber.validate({ property: 'email' }).then(function () {
                    passed = true;
                });
            });

            var emailErrors = subscriber.get('errors').errorsFor('email').get(0);
            (0, _chai.expect)(emailErrors.attribute, 'errors.email.attribute').to.equal('email');
            (0, _chai.expect)(emailErrors.message, 'errors.email.message').to.equal('Invalid email.');

            (0, _chai.expect)(passed, 'passed').to.be.false;
            (0, _chai.expect)(subscriber.get('hasValidated'), 'hasValidated').to.include('email');
        });
    });
});
define('ghost-admin/tests/unit/validators/tag-settings-test', ['ember-object', 'ghost-admin/mixins/validation-engine', 'ember-runloop', 'mocha', 'chai'], function (_emberObject, _validationEngine, _emberRunloop, _mocha, _chai) {
    'use strict';

    var Tag = _emberObject.default.extend(_validationEngine.default, {
        validationType: 'tag',

        name: null,
        description: null,
        metaTitle: null,
        metaDescription: null
    });

    // TODO: These tests have way too much duplication, consider creating test
    // helpers for validations

    // TODO: Move testing of validation-engine behaviour into validation-engine-test
    // and replace these tests with specific validator tests

    // import validator from 'ghost-admin/validators/tag-settings';
    /* jshint expr:true */
    (0, _mocha.describe)('Unit: Validator: tag-settings', function () {
        (0, _mocha.it)('validates all fields by default', function () {
            var tag = Tag.create({});
            var properties = tag.get('validators.tag.properties');

            // TODO: This is checking implementation details rather than expected
            // behaviour. Replace once we have consistent behaviour (see below)
            (0, _chai.expect)(properties, 'properties').to.include('name');
            (0, _chai.expect)(properties, 'properties').to.include('slug');
            (0, _chai.expect)(properties, 'properties').to.include('description');
            (0, _chai.expect)(properties, 'properties').to.include('metaTitle');
            (0, _chai.expect)(properties, 'properties').to.include('metaDescription');

            // TODO: .validate (and  by extension .save) doesn't currently affect
            // .hasValidated - it would be good to make this consistent.
            // The following tests currently fail:
            //
            // run(() => {
            //     tag.validate();
            // });
            //
            // expect(tag.get('hasValidated'), 'hasValidated').to.include('name');
            // expect(tag.get('hasValidated'), 'hasValidated').to.include('description');
            // expect(tag.get('hasValidated'), 'hasValidated').to.include('metaTitle');
            // expect(tag.get('hasValidated'), 'hasValidated').to.include('metaDescription');
        });

        (0, _mocha.it)('passes with valid name', function () {
            // longest valid name
            var tag = Tag.create({ name: new Array(151).join('x') });
            var passed = false;

            (0, _chai.expect)(tag.get('name').length, 'name length').to.equal(150);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'name' }).then(function () {
                    passed = true;
                });
            });

            (0, _chai.expect)(passed, 'passed').to.be.true;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('name');
        });

        (0, _mocha.it)('validates name presence', function () {
            var tag = Tag.create();
            var passed = false;
            var nameErrors = void 0;

            // TODO: validator is currently a singleton meaning state leaks
            // between all objects that use it. Each object should either
            // get it's own validator instance or validator objects should not
            // contain state. The following currently fails:
            //
            // let validator = tag.get('validators.tag')
            // expect(validator.get('passed'), 'passed').to.be.false;

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'name' }).then(function () {
                    passed = true;
                });
            });

            nameErrors = tag.get('errors').errorsFor('name').get(0);
            (0, _chai.expect)(nameErrors.attribute, 'errors.name.attribute').to.equal('name');
            (0, _chai.expect)(nameErrors.message, 'errors.name.message').to.equal('You must specify a name for the tag.');

            (0, _chai.expect)(passed, 'passed').to.be.false;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('name');
        });

        (0, _mocha.it)('validates names starting with a comma', function () {
            var tag = Tag.create({ name: ',test' });
            var passed = false;
            var nameErrors = void 0;

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'name' }).then(function () {
                    passed = true;
                });
            });

            nameErrors = tag.get('errors').errorsFor('name').get(0);
            (0, _chai.expect)(nameErrors.attribute, 'errors.name.attribute').to.equal('name');
            (0, _chai.expect)(nameErrors.message, 'errors.name.message').to.equal('Tag names can\'t start with commas.');

            (0, _chai.expect)(passed, 'passed').to.be.false;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('name');
        });

        (0, _mocha.it)('validates name length', function () {
            // shortest invalid name
            var tag = Tag.create({ name: new Array(152).join('x') });
            var passed = false;
            var nameErrors = void 0;

            (0, _chai.expect)(tag.get('name').length, 'name length').to.equal(151);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'name' }).then(function () {
                    passed = true;
                });
            });

            nameErrors = tag.get('errors').errorsFor('name')[0];
            (0, _chai.expect)(nameErrors.attribute, 'errors.name.attribute').to.equal('name');
            (0, _chai.expect)(nameErrors.message, 'errors.name.message').to.equal('Tag names cannot be longer than 150 characters.');

            (0, _chai.expect)(passed, 'passed').to.be.false;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('name');
        });

        (0, _mocha.it)('passes with valid slug', function () {
            // longest valid slug
            var tag = Tag.create({ slug: new Array(151).join('x') });
            var passed = false;

            (0, _chai.expect)(tag.get('slug').length, 'slug length').to.equal(150);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'slug' }).then(function () {
                    passed = true;
                });
            });

            (0, _chai.expect)(passed, 'passed').to.be.true;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('slug');
        });

        (0, _mocha.it)('validates slug length', function () {
            // shortest invalid slug
            var tag = Tag.create({ slug: new Array(152).join('x') });
            var passed = false;
            var slugErrors = void 0;

            (0, _chai.expect)(tag.get('slug').length, 'slug length').to.equal(151);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'slug' }).then(function () {
                    passed = true;
                });
            });

            slugErrors = tag.get('errors').errorsFor('slug')[0];
            (0, _chai.expect)(slugErrors.attribute, 'errors.slug.attribute').to.equal('slug');
            (0, _chai.expect)(slugErrors.message, 'errors.slug.message').to.equal('URL cannot be longer than 150 characters.');

            (0, _chai.expect)(passed, 'passed').to.be.false;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('slug');
        });

        (0, _mocha.it)('passes with a valid description', function () {
            // longest valid description
            var tag = Tag.create({ description: new Array(201).join('x') });
            var passed = false;

            (0, _chai.expect)(tag.get('description').length, 'description length').to.equal(200);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'description' }).then(function () {
                    passed = true;
                });
            });

            (0, _chai.expect)(passed, 'passed').to.be.true;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('description');
        });

        (0, _mocha.it)('validates description length', function () {
            // shortest invalid description
            var tag = Tag.create({ description: new Array(202).join('x') });
            var passed = false;
            var errors = void 0;

            (0, _chai.expect)(tag.get('description').length, 'description length').to.equal(201);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'description' }).then(function () {
                    passed = true;
                });
            });

            errors = tag.get('errors').errorsFor('description')[0];
            (0, _chai.expect)(errors.attribute, 'errors.description.attribute').to.equal('description');
            (0, _chai.expect)(errors.message, 'errors.description.message').to.equal('Description cannot be longer than 200 characters.');

            // TODO: tag.errors appears to be a singleton and previous errors are
            // not cleared despite creating a new tag object
            //
            // console.log(JSON.stringify(tag.get('errors')));
            // expect(tag.get('errors.length')).to.equal(1);

            (0, _chai.expect)(passed, 'passed').to.be.false;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('description');
        });

        // TODO: we have both metaTitle and metaTitle property names on the
        // model/validator respectively - this should be standardised
        (0, _mocha.it)('passes with a valid metaTitle', function () {
            // longest valid metaTitle
            var tag = Tag.create({ metaTitle: new Array(301).join('x') });
            var passed = false;

            (0, _chai.expect)(tag.get('metaTitle').length, 'metaTitle length').to.equal(300);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'metaTitle' }).then(function () {
                    passed = true;
                });
            });

            (0, _chai.expect)(passed, 'passed').to.be.true;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('metaTitle');
        });

        (0, _mocha.it)('validates metaTitle length', function () {
            // shortest invalid metaTitle
            var tag = Tag.create({ metaTitle: new Array(302).join('x') });
            var passed = false;
            var errors = void 0;

            (0, _chai.expect)(tag.get('metaTitle').length, 'metaTitle length').to.equal(301);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'metaTitle' }).then(function () {
                    passed = true;
                });
            });

            errors = tag.get('errors').errorsFor('metaTitle')[0];
            (0, _chai.expect)(errors.attribute, 'errors.metaTitle.attribute').to.equal('metaTitle');
            (0, _chai.expect)(errors.message, 'errors.metaTitle.message').to.equal('Meta Title cannot be longer than 300 characters.');

            (0, _chai.expect)(passed, 'passed').to.be.false;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('metaTitle');
        });

        // TODO: we have both metaDescription and metaDescription property names on
        // the model/validator respectively - this should be standardised
        (0, _mocha.it)('passes with a valid metaDescription', function () {
            // longest valid description
            var tag = Tag.create({ metaDescription: new Array(501).join('x') });
            var passed = false;

            (0, _chai.expect)(tag.get('metaDescription').length, 'metaDescription length').to.equal(500);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'metaDescription' }).then(function () {
                    passed = true;
                });
            });

            (0, _chai.expect)(passed, 'passed').to.be.true;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('metaDescription');
        });

        (0, _mocha.it)('validates metaDescription length', function () {
            // shortest invalid metaDescription
            var tag = Tag.create({ metaDescription: new Array(502).join('x') });
            var passed = false;
            var errors = void 0;

            (0, _chai.expect)(tag.get('metaDescription').length, 'metaDescription length').to.equal(501);

            (0, _emberRunloop.default)(function () {
                tag.validate({ property: 'metaDescription' }).then(function () {
                    passed = true;
                });
            });

            errors = tag.get('errors').errorsFor('metaDescription')[0];
            (0, _chai.expect)(errors.attribute, 'errors.metaDescription.attribute').to.equal('metaDescription');
            (0, _chai.expect)(errors.message, 'errors.metaDescription.message').to.equal('Meta Description cannot be longer than 500 characters.');

            (0, _chai.expect)(passed, 'passed').to.be.false;
            (0, _chai.expect)(tag.get('hasValidated'), 'hasValidated').to.include('metaDescription');
        });
    });
});
require('ghost-admin/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests-738014b019b15910f19eeaa82d03163b.map
