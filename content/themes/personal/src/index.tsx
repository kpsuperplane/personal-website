import './types';

import createBrowserHistory from 'history/createBrowserHistory';
import { render } from 'inferno';
import { doAllAsyncBefore, IndexRoute, match, Route, Router } from 'inferno-router';
import GlobalLoader from './components/GlobalLoader';

import 'ellipsize';
import 'luxon';
import 'superagent';

import App from './App';

const Home = (props, cb) => require.ensure([], () => cb(null, (require('./views/Home') as any).default));
const Post = (props, cb) => require.ensure([], () => cb(null, (require('./views/Post') as any).default));
const Projects = (props, cb) => require.ensure([], () => cb(null, (require('./views/Projects') as any).default));
const Blog = (props, cb) => require.ensure([], () => cb(null, (require('./views/Blog') as any).default));

const browserHistory = createBrowserHistory();
let lastPage = null;

function handleNavigation(route) {
    const matched = match(routes, route);
    if (matched.type !== lastPage) {
        lastPage = matched.type;
        GlobalLoader.reset();
        GlobalLoader.queue();
    }
    return doAllAsyncBefore(matched);
}

const routes = (<Router history={ browserHistory } asyncBefore={handleNavigation} >
    <Route component={ App }>
        <IndexRoute getComponent={Home} />
        <Route path="p" getComponent={Projects} />
        <Route path="projects" getComponent={Projects} />
        <Route path="blog" getComponent={Blog} />
        <Route path="*" getComponent={Post} />
    </Route>
</Router>);

document.addEventListener('DOMContentLoaded', function(e) {
    handleNavigation(window.location.pathname);
    render(routes, document.getElementById('app'));
});
