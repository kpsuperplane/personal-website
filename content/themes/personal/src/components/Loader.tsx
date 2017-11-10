import Component from 'inferno-component';

import './Navigation.scss';

import LoaderVideo from '../img/loader.mp4';
import './Loader.scss';

export default class Loader extends Component<{}, {}> {
    public render() {
        return  <video className="loader" loop="loop" autoplay="autoplay" muted="muted" playsinline="playsinline">
         <source src={LoaderVideo} type="video/mp4" />
      </video>;
    }
}
