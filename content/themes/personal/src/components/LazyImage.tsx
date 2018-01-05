import Component from 'inferno-component';
import GlobalLoader from './GlobalLoader';
import './LazyImage.scss';

export default class LazyImage extends Component<{path: string, forceWait: boolean | null, loader: boolean | null, asBackground: boolean | null}, {loaded: boolean}> {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
        const img = new Image();
        img.addEventListener('load', () => {
            this.setState({loaded: true});
        });
        if (props.forceWait === true) {
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
        const image = <img src={this.props.asBackground ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' : this.props.path} style={this.props.asBackground ? {backgroundImage: 'url(' + this.props.path + ')'} : null} {...this.props} className={'lazy-image' + (this.state!!.loaded ? ' loaded' : '') + (this.props.className ? (' ' + this.props.className) : '')} />;
        return this.props.loader ? <span className={'lazy-image-loader' + (this.state!!.loaded ? ' loaded' : '')}>{image}</span> : image;
    }
}
