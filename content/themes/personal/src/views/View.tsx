import Component from 'inferno-component';

import GlobalLoader from '../components/GlobalLoader';

export default class View extends Component<any, {}> {
    constructor(props) {
        super(props);
        setTimeout(function() {
            GlobalLoader.dequeue();
        }, 2000);
    }
}
