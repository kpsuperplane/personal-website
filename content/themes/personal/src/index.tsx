import './types';

import createBrowserHistory from 'history/createBrowserHistory';
import { render } from 'inferno';
import { doAllAsyncBefore, IndexRoute, match, Route, Router } from 'inferno-router';
import GlobalLoader from './components/GlobalLoader';

import App from './App';

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

const Home = (props, cb) => require.ensure([], () => cb(null, (require('./views/Home') as any).default));
const Post = (props, cb) => require.ensure([], () => cb(null, (require('./views/Post') as any).default));

const browserHistory = createBrowserHistory();
let lastPage = '';

function handleNavigation(route) {
    const matched = match(routes, route);
    const newPage = matched.matched.props.children.props.children.props.getComponent.name.toLowerCase() + '-template';
    if (newPage !== lastPage) {
        if (lastPage !== '') {
            document.body.classList.remove(lastPage);
        }
        lastPage = newPage;
        document.body.classList.add(lastPage);
        GlobalLoader.queue();
    }
    return doAllAsyncBefore(matched);
}

const routes = (<Router history={ browserHistory } asyncBefore={handleNavigation} >
    <Route component={ App }>
        <IndexRoute getComponent={Home} />
        <Route path="*" getComponent={Post} />
    </Route>
</Router>);

document.addEventListener('DOMContentLoaded', function(e) {
    handleNavigation(window.location.pathname);
    render(routes, document.getElementById('app'));
});
