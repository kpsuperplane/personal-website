
import Component from 'inferno-component';

import Loader from './Loader';
export default class GlobalLoader extends Component<{}, {loading: boolean, visible: number}> {

    private static instances: GlobalLoader[] = [];
    private static queueSize: number = 0;
    private static pageStage: number = -1;
    private static callbacks: Array<() => void> = [];
    private static timeout: number | null = null;
    private static listeners: Array<(isLoading: boolean) => void> = [];
    private static add(instance: GlobalLoader) {
        this.instances.push(instance);
    }
    private static remove(instance: GlobalLoader) {
        this.instances.splice(this.instances.indexOf(instance), 1);
    }
    private static updateState = () => {
        GlobalLoader.timeout = null;
        if (GlobalLoader.queueSize === 0) {
            for (const callback of GlobalLoader.callbacks) {
                callback();
            }
            GlobalLoader.callbacks = [];
        }
        GlobalLoader.listeners.forEach((listener) => {
            listener(GlobalLoader.isLoading);
        });
        GlobalLoader.instances.forEach((instance) => {
            instance.updateState(GlobalLoader.queueSize > 0);
        });
    }
    public static addUpdateListener(cb: (number) => void) {
        GlobalLoader.listeners.push(cb);
    }
    public static removeUpdateListener(cb: (number) => void) {
        GlobalLoader.listeners.splice(GlobalLoader.listeners.indexOf(cb), 1);
    }
    public static get isLoading() {
        return GlobalLoader.queueSize > 0;
    }
    private static queueState(forceAnim: boolean = false) {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.updateState, forceAnim ? 0 : 50);
    }
    private static removeInitial() {
            document.getElementById('main-app-loader')!!.remove();
    }
    public static queue(forceAnim: boolean = false) {
        if (this.queueSize === 0) {
            GlobalLoader.instances.forEach((instance) => {
                instance.startLoad();
            });
        }
        ++GlobalLoader.queueSize;
        if (GlobalLoader.pageStage === -1) {
            GlobalLoader.pageStage = setTimeout(() => {
                GlobalLoader.pageStage = -2;
                GlobalLoader.removeInitial();
            }, 350);
        }
        GlobalLoader.queueState(forceAnim);
    }
    public static dequeue(callback: (() => void) | null = null) {
        GlobalLoader.queueSize = Math.max(GlobalLoader.queueSize - 1, 0);
        if (GlobalLoader.pageStage !== -2) {
            clearTimeout(GlobalLoader.pageStage);
            GlobalLoader.removeInitial();
            GlobalLoader.pageStage = -2;
        }
        if (callback) {
            GlobalLoader.callbacks.push(callback);
        }
        GlobalLoader.queueState();
    }
    public static reset() {
        GlobalLoader.queueSize = 0;
        GlobalLoader.dequeue();
    }

    private timeout: number | null = null;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: 0
        };
        GlobalLoader.add(this);
    }
    private hide = () => {
        this.setState({loading: false, visible: 0});
    }
    private startLoad() {
        this.setState({loading: true, visible: 1});
    }
    private updateState(loading: boolean) {
        if (this.state!!.loading !== loading || this.state!!.visible === 1) {
            if (this.timeout !== null) {
                window.clearTimeout(this.timeout);
            }
            // non-loading to loading
            if (loading === true) {
                this.setState({loading: true, visible: 2});
            } else { // transition and hide
                this.setState({visible: 0});
                this.timeout = setTimeout(this.hide, 300);
            }
        }
    }
    public componentWillUnmount() {
        GlobalLoader.remove(this);
    }
    public render() {
        return this.state!!.loading ? <div className={'app-loader' + (['', ' blank', ' visible'][this.state!!.visible])}>
            <img src="/assets/logo-black.png" class="app-loader-logo" />
            <Loader />
        </div> : null;
    }
}
