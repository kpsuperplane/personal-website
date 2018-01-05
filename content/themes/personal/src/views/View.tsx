import Component from 'inferno-component';

import GlobalLoader from '../components/GlobalLoader';

import { get } from 'superagent';

export default class View<T> extends Component<any, T> {
    protected static setDark = (dark: boolean) => {
        document.body.classList[dark ? 'add' : 'remove']('dark-top');
    }
    private static _lastPath: string = window.location.href;
    constructor(P, props) {
        for (const bodyClass of document.body.classList) {
            if (bodyClass.indexOf('-template') != -1) {
                document.body.classList.remove(bodyClass);
            }
        }
        document.body.classList.add(P + '-template');
        super(props);
        GlobalLoader.dequeue();
    }
    public componentDidMount() {
        this.componentDidUpdate();
    }
    public componentDidUpdate() {
        if (View._lastPath !== window.location.href) {
            GlobalLoader.queue();
            View._lastPath = window.location.href;
            get(View._lastPath).end((err, res) => {
                GlobalLoader.dequeue();
                const html: string = res.text;
                document.title = html.match(/<title>(.*)<\/title>/)!![1];
            });
        }
    }
}
