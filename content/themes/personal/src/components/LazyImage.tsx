import Component from 'inferno-component';
import './LazyImage.scss';

export default class LazyImage extends Component<{path: string}, {loaded: boolean}> {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
        const img = new Image();
        img.addEventListener('load', () => {
            this.setState({loaded: true});
        });
        img.src = props.path;
    }
    public render() {
        return  <img src={this.props.path} {...this.props} className={'lazy-image' + (this.state!!.loaded ? ' loaded' : '') + (this.props.className ? (' ' + this.props.className) : '')} />;
    }
}
