import Component from 'inferno-component';
import GlobalLoader from './GlobalLoader';
import './LazyImage.scss';

export default class LazyImage extends Component<{path: string, forceWaitSize: boolean | null, loader: boolean | null}, {loaded: boolean}> {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
        const img = new Image();
        img.addEventListener('load', () => {
            this.setState({loaded: true});
        });
        if (props.forceWaitSize) {
            GlobalLoader.queue(true);
            const poll = setInterval(() => {
                if (img.naturalWidth) {
                    clearInterval(poll);
                    GlobalLoader.dequeue();
                }
            }, 30);
        }
        img.src = props.path;
    }
    public render() {
        const image = <img src={this.props.path} {...this.props} className={'lazy-image' + (this.state!!.loaded ? ' loaded' : '') + (this.props.className ? (' ' + this.props.className) : '')} />;
        return this.props.loader ? <span className={'lazy-image-loader' + (this.state!!.loaded ? ' loaded' : '')}>{image}</span> : image;
    }
}