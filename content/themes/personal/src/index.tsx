import { render } from 'inferno';
import { Router, Route, IndexRoute, Redirect } from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';

import App from './App';

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

const Home = (props, cb) => 
  require.ensure([], require => cb(null, (require('./views/Home') as any).default));


const browserHistory = createBrowserHistory();
let lastPage = "";

function handleNavigation({props}) {
	if (lastPage != "") document.body.classList.remove(lastPage);
	lastPage = props.getComponent.name.toLowerCase() + "-template";
	document.body.classList.add(lastPage);
}

document.addEventListener("DOMContentLoaded", function(e) {
	render(
	<Router history={ browserHistory }>
		<Route component={ App }>
			<IndexRoute onEnter={handleNavigation} getComponent={Home} />
			<Redirect from="*" to="/"/>
		</Route>
	</Router>, document.getElementById('app'));
});
