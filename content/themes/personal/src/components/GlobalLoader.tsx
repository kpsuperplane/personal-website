
import Component from 'inferno-component';

import LogoBlack from '../img/logo-black.png';
import Loader from './Loader';
export default class GlobalLoader extends Component<{}, {loading: boolean, visible: boolean}> {

    private static instances: GlobalLoader[] = [];
    private static queueSize: number = 0;
    private static pageStage: number = -1;
    private static timeout: number | null = null;
    private static add(instance: GlobalLoader) {
        this.instances.push(instance);
    }
    private static remove(instance: GlobalLoader) {
        this.instances.splice(this.instances.indexOf(instance), 1);
    }
    private static updateState = () => {
        GlobalLoader.timeout = null;
        GlobalLoader.instances.forEach((instance) => {
            instance.updateState(GlobalLoader.queueSize > 0);
        });
    }
    private static queueState() {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.updateState, 250);
    }
    private static removeInitial() {
            document.getElementById('main-app-loader')!!.remove();
    }
    public static queue() {
        ++GlobalLoader.queueSize;
        if (GlobalLoader.pageStage === -1) {
            GlobalLoader.pageStage = setTimeout(() => {
                GlobalLoader.pageStage = -2;
                GlobalLoader.removeInitial();
            }, 500);
        }
        GlobalLoader.queueState();
    }
    public static dequeue() {
        --GlobalLoader.queueSize;
        if (GlobalLoader.pageStage !== -2) {
            clearTimeout(GlobalLoader.pageStage);
            GlobalLoader.removeInitial();
        }
        GlobalLoader.queueState();
    }

    private timeout: number | null = null;
    private lastshown: number = 0;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false
        };
        GlobalLoader.add(this);
    }
    private hide = () => {
        this.setState({loading: false});
    }
    private updateState(loading: boolean) {
        if (this.state!!.loading !== loading) {
            if (this.timeout !== null) {
                window.clearTimeout(this.timeout);
            }
            // non-loading to loading
            if (loading === true) {
                this.lastshown = new Date().getTime();
                this.setState({loading: true, visible: true});
            } else { // transition and hide
                this.setState({visible: false});
                this.timeout = setTimeout(this.hide, 300);
            }
        }
    }
    public componentWillUnmount() {
        GlobalLoader.remove(this);
    }
    public render() {
        return this.state!!.loading ? <div className={'app-loader' + (this.state!!.visible ? ' visible' : '')}>
            <img src={LogoBlack} class="app-loader-logo" />
            <Loader />
        </div> : null;
    }
}
