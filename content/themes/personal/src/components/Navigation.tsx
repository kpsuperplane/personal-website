import Component from 'inferno-component';

import './Navigation.scss';

import LogoTheme from '../img/logo-theme.png';
import NavRender from '../img/navrender.png';

import GlobalLoader from './GlobalLoader';

class NavigationMobile extends Component <{}, {width: number, active: boolean, loading: boolean}> {
    private wrapper: HTMLElement|null = null;
    private outerWrapper: HTMLElement|null = null;
    private parent: HTMLElement|null = null;
    private background: HTMLElement|null = null;
    private touchStart: number = 0;
    private touchLast: number = 0;
    private height: number = 0;
    private touchLastTime: number = 0;
    private touchDelta: number = 0;
    private velocityLast: number = 0;
    private touchLastBuffer: number = 0;
    private top: number = 0;
    private opened: boolean = false;
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            loading: true,
            width: window.innerWidth
        };
    }
    private onLoadingStateChange = (isLoading: boolean) => {
        this.setState({loading: isLoading});
    }
    private onResize = () => {
        this.setState({width: window.innerWidth});
    }
    private calculateVelocity = () => {
        const now = new Date().getTime();
        if (now - this.touchLastTime > 10) {
            const velocityNew = this.touchDelta / (now - this.touchLastTime);
            this.velocityLast = -velocityNew;
            this.touchLastTime = now;
            this.touchLastBuffer = this.touchLast;
        }
    }
    private dragRender = () => {
        const y = this.opened ? 0 : this.top + this.touchLast - this.touchStart;
        this.outerWrapper!!.style.transform = `translate3d(0, ${y > 0 ? Math.log((y + 100) / 100) * 100 : y}px, 0)`;
        this.background!!.style.opacity = this.opened ? '1' : '' + Math.min(1, Math.max(0, 1 - -y / (this.height - 300)));
    }
    private dragStart = (e) => {
        this.touchStart = e.touches[0].clientY;
        this.outerWrapper!!.style.transition = `none`;
        this.height = this.wrapper!!.getBoundingClientRect().height;
        this.top = this.opened ? 0 : -this.wrapper!!.getBoundingClientRect().height + 300;
        this.opened = false;
        this.parent!!.style.height = '100%';
        this.background!!.style.display = 'block';
        this.background!!.style.transition = 'no';
        e.preventDefault();
    }
    private dragMove = (e) => {
        this.touchLast = e.touches[0].clientY;
        this.touchDelta = this.touchLastBuffer - e.touches[0].clientY;
        if (this.touchLast - this.touchStart > 5) {
            e.preventDefault();
        }
        this.calculateVelocity();
        window.requestAnimationFrame(this.dragRender);
    }
    private dragEnd = (e) => {
        e.preventDefault();
        this.calculateVelocity();
        const delta = this.touchLast - this.touchStart;
        const y = this.top + delta;
        const navHeight = this.wrapper!!.getBoundingClientRect().height - 300;
        this.touchStart = -1;
        this.touchLast = -1;
        const percent = (y + navHeight) / navHeight;
        if ((this.velocityLast < 0)) {
            this.opened = false;
            this.top = -navHeight;
        } else {
            this.opened = true;
            this.top = 0;
        }
        const animTime = Math.abs(percent) * 100 + 100;
        this.outerWrapper!!.style.transition = `all ${animTime}ms cubic-bezier(0.1,${(Math.abs(this.velocityLast) * (0.05 * animTime)) / Math.abs(y - (this.top + navHeight))},0.1,1)`;
        this.background!!.style.transition = 'opacity ' + animTime + 'ms';
        if (!this.opened) {
            setTimeout(() => {
                    this.background!!.style.display = 'none';
                    this.parent!!.style.height = null;
            }, animTime);
        }
        this.dragRender();
        window.requestAnimationFrame(this.dragRender);
    }
    private dragCancel = this.dragEnd;
    private attachWrapper = (el) => {
        if (this.wrapper == null) {
            this.wrapper = el;
            el.addEventListener('touchstart', this.dragStart, {passive: false});
            el.addEventListener('touchend', this.dragEnd, {passive: false});
            el.addEventListener('touchcancel', this.dragCancel, {passive: false});
            el.addEventListener('touchmove', this.dragMove, {passive: false});
        }
    }
    private attachOuterWrapper = (el) => {
        if (this.outerWrapper == null) {
            this.outerWrapper = el;
        }
    }
    private attachParent = (el) => {
        if (this.parent == null) {
            this.parent = el;
        }
    }
    private attachBackground = (el) => {
        if (this.background == null) {
            this.background = el;
        }
    }
    public componentWillUnmount() {
        GlobalLoader.removeUpdateListener(this.onLoadingStateChange);
        window.removeEventListener('resize', this.onResize);
        const el = this.wrapper!!;
        el.removeEventListener('touchstart', this.dragStart);
        el.removeEventListener('touchend', this.dragEnd);
        el.removeEventListener('touchcancel', this.dragCancel);
        el.removeEventListener('touchmove', this.dragMove);
    }
    public componentDidMount() {
        GlobalLoader.addUpdateListener(this.onLoadingStateChange);
        this.setState({loading: GlobalLoader.isLoading});
        window.addEventListener('resize', this.onResize);
    }
    public render() {
        const state = this.state!!;
        const diameter = 75;
        const radius_squared = Math.pow(diameter / 2, 2);
        return <div className="navigation-parent" ref={this.attachParent}>
            <div className="navigation-background" ref={this.attachBackground}></div>
            <div className={'navigation navigation-mobile' + (state.active ? ' active' : '') + (state.loading ? ' loading' : '')} ref={this.attachOuterWrapper}>
                <div className="navigation-bar" ref={this.attachWrapper}>
                    <img src={NavRender} style={{width: '100%'}} />
                    <div className="navigation-bar-handle">
                        <svg className="navigation-bar-handle-background" width={state.width} height={diameter * 1.5}>
                            <defs>
                                <filter xmlns="http://www.w3.org/2000/svg" id="dropshadow" height="130%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                                    <feOffset dx="0" dy="4" result="offsetblur"/>
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.05"/>
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <g filter="url(#dropshadow)">
                                <path d={`M0,0 C 0,${diameter * 0.15} 0,${diameter * 0.4} ${state.width / 2 - diameter},${diameter * 0.4} C ${state.width / 2 - diameter * 0.75},${diameter * 0.4} ${state.width / 2 - Math.sqrt(radius_squared / 2) - 10},${diameter * 0.33 + Math.sqrt(radius_squared / 2) - 20} ${state.width / 2 - Math.sqrt(radius_squared / 2)},${diameter * 0.33 + Math.sqrt(radius_squared / 2)} L ${state.width / 2 + Math.sqrt(radius_squared / 2)},${diameter * 0.33 + Math.sqrt(radius_squared / 2)} C ${state.width / 2 + Math.sqrt(radius_squared / 2) + 10},${diameter * 0.33 + Math.sqrt(radius_squared / 2) - 20} ${state.width / 2 + diameter * 0.75},${diameter * 0.4} ${state.width / 2 + diameter},${diameter * 0.4} C ${state.width},${diameter * 0.4} ${state.width},${diameter * 0.15} ${state.width},0`} strokeWidth={0} fill="white" />
                                <circle cx={state.width / 2} cy={diameter * 0.33} r={diameter / 2} fill="white"/>
                            </g>
                        </svg>
                        <img src={LogoTheme} style={{height: diameter * 0.6}} class="navigation-bar-handle-logo" />
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default class Navigation extends Component<any, any> {
    public render() {
        return <NavigationMobile />;
    }
}
