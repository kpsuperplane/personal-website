import Component from 'inferno-component';

import './Button.scss';

export default class Button extends Component<any, {}> {
    public render() {
        return  <button className="button" {...this.props}>{this.props.children}</button>;
    }
}
