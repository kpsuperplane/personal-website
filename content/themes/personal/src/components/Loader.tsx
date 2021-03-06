import Component from 'inferno-component';

import LoaderVideo from '../img/loader.mp4';
import './Loader.scss';

export default class Loader extends Component<{}, {}> {
    public render() {
        return  <video className="loader" loop autoplay muted playsinline>
         <source src={LoaderVideo} type="video/mp4" />
      </video>;
    }
}
