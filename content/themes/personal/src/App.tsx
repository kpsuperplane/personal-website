
import Component from 'inferno-component';
import Navigation from './components/Navigation';

import './App.scss';

export default class App extends Component<any, any> {
    public render() {
        return <div className="app-element">
            <Navigation />
            {this.props.children}
        </div>;
    }
}
