
import Component from 'inferno-component';
import Navigation from './components/Navigation';

import GlobalLoader from './components/GlobalLoader';

import './App.scss';

export default class App extends Component<any, any> {
    public render() {
        return <div className="app-element">
            <GlobalLoader />
            <Navigation />
            {this.props.children}
        </div>;
    }
}
