import Component from 'inferno-component';

import GlobalLoader from '../components/GlobalLoader';

export default class View<T> extends Component<any, T> {
    constructor(props) {
        super(props);
        GlobalLoader.dequeue();
    }
}
