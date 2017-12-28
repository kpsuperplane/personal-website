import Component from 'inferno-component';

import GlobalLoader from '../components/GlobalLoader';

export default class View<T> extends Component<any, T> {
    protected static setDark = (dark: boolean) => {
        document.body.classList[dark ? 'add' : 'remove']('dark-top');
    }
    constructor(props) {
        super(props);
        GlobalLoader.dequeue();
    }
}
