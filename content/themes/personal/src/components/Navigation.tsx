import Component from 'inferno-component';
import { Link } from 'inferno-router';

import './Navigation.scss';

import LogoTheme from '../img/logo-theme.png';
import LogoWhite from '../img/logo-white.png';
import Contact from './Contact';
import Icon, { Icons } from './Icon';
import LazyImage from './LazyImage';

import ContactBg from '../img/contact-bg.jpg';

import GlobalLoader from './GlobalLoader';

class NavigationMobile extends Component <{loading: boolean}, {width: number, maxHeight: number, active: boolean, scrolledTop: boolean}> {
    private wrapper: HTMLElement|null = null;
    private outerWrapper: HTMLElement|null = null;
    private handle: HTMLElement|null = null;
    private parent: HTMLElement|null = null;
    private background: HTMLElement|null = null;
    private touchStart: number = 0;
    private touchLast: number = 0;
    private height: number = 0;
    private touchLastTime: number = 0;
    private touchStartTime: number = 0;
    private touchDelta: number = 0;
    private velocityLast: number = 0;
    private touchLastBuffer: number = 0;
    private top: number = 0;
    private opened: boolean = false;
    private diameter: number = 75;
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            maxHeight: 10000,
            scrolledTop: true,
            width: window.innerWidth
        };
    }
    private onResize = () => {
        this.setState({width: window.innerWidth, maxHeight: window.innerHeight - this.diameter - 20});
        this.top = this.opened ? 0 : -(this.wrapper!!.getBoundingClientRect().height - 300);
        this.dragRender();
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
        const y = this.top + this.touchLast - this.touchStart;
        this.outerWrapper!!.style.transform = `translate3d(0, ${y > 0 ? Math.log((y + 100) / 100) * 100 : y}px, 0)`;
        this.background!!.style.opacity = this.opened ? '1' : '' + Math.min(1, Math.max(0, 1 - -y / (this.height - 300)));
    }
    private dragStart = (e) => {
        if (e.touches) {
            this.touchStart = e.touches[0].clientY;
            e.preventDefault();
        }
        this.outerWrapper!!.style.transition = `none`;
        this.height = this.wrapper!!.getBoundingClientRect().height;
        this.top = this.opened ? 0 : -this.wrapper!!.getBoundingClientRect().height + 300;
        this.touchStartTime = new Date().getTime();
        this.parent!!.style.height = '100%';
        this.background!!.style.display = 'block';
        this.background!!.style.transition = 'no';
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
    private dragComplete = () => {
        const delta = this.touchLast - this.touchStart;
        this.touchStart = -1;
        this.touchLast = -1;
        const navHeight = this.wrapper!!.getBoundingClientRect().height - 300;
        const y = this.top + delta;
        const percent = (y + navHeight) / navHeight;
        if (delta < 1 && new Date().getTime() - this.touchStartTime < 3000) {
            this.opened = !this.opened;
            this.velocityLast = 0;
        } else {
            if (this.opened && this.velocityLast < -0.5) {
                this.opened = false;
                this.top = -navHeight;
            } else if (!this.opened && this.velocityLast > 0.5) {
                this.opened = true;
                this.top = 0;
            }
        }
        this.top = this.opened ? 0 : -navHeight;
        const animTime = Math.abs(percent) * 100 + 200;
        const slope = (Math.abs(this.velocityLast) * (0.1 * animTime)) / Math.abs(y - (this.top + navHeight));
        this.outerWrapper!!.style.transition = `all ${animTime}ms cubic-bezier(0.1,${isNaN(slope) ? 0 : slope},0.1,1)`;
        this.background!!.style.transition = 'opacity ' + animTime + 'ms';
        if (!this.opened) {
            setTimeout(() => {
                this.background!!.style.display = 'none';
                this.parent!!.style.height = null;
            }, animTime);
        }
        window.requestAnimationFrame(this.dragRender);
    }
    private onClick = (e) => {
        this.touchStart = 0;
        this.touchLast = 0;
        this.velocityLast = 0;
        this.touchStartTime = new Date().getTime();
        this.dragStart(e);
        this.dragComplete();
    }
    private dragEnd = (e) => {
        e.preventDefault();
        this.calculateVelocity();
        this.dragComplete();
    }
    private dragCancel = this.dragEnd;
    private attachHandle = (el) => {
        if (this.handle == null) {
            this.handle = el;
            el.addEventListener('touchstart', this.dragStart, {passive: false});
            el.addEventListener('touchend', this.dragEnd, {passive: false});
            el.addEventListener('touchcancel', this.dragCancel, {passive: false});
            el.addEventListener('touchmove', this.dragMove, {passive: false});
        }
    }
    private attachWrapper = (el) => {
        if (this.wrapper == null) {
            this.wrapper = el;
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
            el.addEventListener('touchstart', this.dragStart, {passive: false});
            el.addEventListener('touchend', this.dragEnd, {passive: false});
            el.addEventListener('touchcancel', this.dragCancel, {passive: false});
            el.addEventListener('touchmove', this.dragMove, {passive: false});
        }
    }
    private onScroll = (e) => {
        if (window.scrollY <= 0) {
            if (this.state!!.scrolledTop === false) {
                this.setState({scrolledTop: true});
            }
        } else {
            if (this.state!!.scrolledTop) {
                this.setState({scrolledTop: false});
            }
        }
    }
    public componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
    }
    public componentDidMount() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('scroll', this.onScroll);
        this.onResize();
    }
    public render() {
        const state = this.state!!;
        const diameter = this.diameter;
        const radius_squared = Math.pow(diameter / 2, 2);
        return <div className="navigation-mobile-parent" ref={this.attachParent}>
            <div className="navigation-mobile-background" ref={this.attachBackground}></div>
            <div className={'navigation-mobile' + (state.active ? ' active' : '') + (this.props.loading ? ' loading' : '')} ref={this.attachOuterWrapper}>
                <div className="navigation-mobile-bar" ref={this.attachWrapper}>
                    <div className="navigation-mobile-bar-main" style={{maxHeight: state.maxHeight}}>
                        <Link onClick={this.onClick} to="/" className="br"><Icon icon={Icons.HOME} />Home</Link>
                        <Link onClick={this.onClick} to="/about/" className=""><Icon icon={Icons.ABOUT} />About</Link>
                        <Link onClick={this.onClick} to="/projects/" className="br"><Icon icon={Icons.PALETTE} />Projects</Link>
                        <Link onClick={this.onClick} to="/blog/"><Icon icon={Icons.OPEN_BOOK} />Blog</Link>
                        <div className="navigation-mobile-bar-contact">
                            <h3>Get in Touch</h3>
                            <Contact />
                        </div>
                    </div>
                    <div className="navigation-mobile-bar-handle" onClick={this.onClick} ref={this.attachHandle}>
                        <svg className="navigation-mobile-bar-handle-background" width={state.width} height={diameter * 0.95}>
                            <defs>
                                <filter xmlns="http://www.w3.org/2000/svg" id="dropshadow" height="130%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                                    <feOffset dx="0" dy="4" result="offsetblur"/>
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.075"/>
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
                        <LazyImage path={LogoTheme} style={{height: diameter * 0.6}} className="navigation-mobile-bar-handle-logo" />
                    </div>
                </div>
            </div>
        </div>;
    }
}

class NavigationDesktop extends Component<{loading: boolean}, {contact: number, scrollHidden: boolean, scrollTop: boolean}> {
    private lastScroll: number = 0;
    constructor(props) {
        super(props);
        this.state = {
            contact: -1,
            scrollHidden: false,
            scrollTop: true
        };
    }
    private onScroll = (e) => {
        const doc = document.documentElement;
        const scrollY = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        const diff = this.lastScroll - scrollY;
        this.lastScroll = scrollY;
        if (this.state!!.scrollTop === false && scrollY <= 0) {
            this.setState({scrollTop: true});
        } else if (this.state!!.scrollTop === true && scrollY > 0) {
            this.setState({scrollTop: false});
        }
        if (this.state!!.scrollHidden === false && diff < 0 && scrollY > 0) {
            this.setState({scrollHidden: true});
        } else if (this.state!!.scrollHidden === true && diff > 0) {
            this.setState({scrollHidden: false});
        }
    }
    private contact = () => {
        this.setState({contact: this.state!!.contact === 1 ? 0 : 1, scrollHidden: false});
    }
    private navigate = () => {
        this.setState({contact:  0});
    }
    public componentDidMount() {
        window.addEventListener('scroll', this.onScroll);
    }
    public componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }
    public render() {
        const { contact, scrollTop, scrollHidden } = this.state!!;
        return <div className={'navigation-desktop' + (this.props.loading ? '' : ' loaded') + (contact === 1 ? ' contact' : '') + (scrollTop && contact !== 1 ? ' top' : '') + (scrollHidden ? ' scroll-hidden' : '')}>
            <div className="navigation-desktop-contact">
                <div className="navigation-desktop-contact-inner" style={ contact >= 0 ? {backgroundImage: `url(${ContactBg})`} : null }>
                    <h2>Get in Touch</h2>
                    <p>Opportunity, cordiality, or just plain curiosity? Either way, feel free to get in touch with one of the ways below!</p>
                    <Contact />
                </div>
            </div>
            <div className="navigation-desktop-inner">
                <div className="navigation-desktop-left">
                    <Link to="/about/" onClick={this.navigate} style="transition-delay:0.14s">ABOUT</Link>
                    <Link to="/projects/" onClick={this.navigate} style="transition-delay:0.07s">PROJECTS</Link>
                </div>
                <Link to="/" onClick={this.navigate} className="navigation-desktop-home"><LazyImage className="theme" path={LogoTheme} /><LazyImage className="white" path={LogoWhite} /></Link>
                <div className="navigation-desktop-right">
                    <Link to="/blog/" class="blog-toggle" onClick={this.navigate} style="transition-delay:0.07s">BLOG</Link>
                    <a href="javascript:void(0);" onClick={this.contact} class={contact === 1 ? 'active' : ''} style="transition-delay:0.14s">CONTACT</a>
                </div>
            </div>
        </div>;
    }
}

export default class Navigation extends Component<{}, {}> {
    private static loading: boolean = true;
    private onResize = () => {
        this.forceUpdate();
    }
    private onLoadingStateChange = (isLoading: boolean) => {
        if (isLoading === false) {
            GlobalLoader.removeUpdateListener(this.onLoadingStateChange);
        }
        Navigation.loading = isLoading;
        this.forceUpdate();
    }
    public componentDidMount() {
        window.addEventListener('resize', this.onResize);
        GlobalLoader.addUpdateListener(this.onLoadingStateChange);
        Navigation.loading = GlobalLoader.isLoading;
        this.forceUpdate();
    }
    public componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }
    public render() {
        return window.innerWidth < 750 ? <NavigationMobile loading={Navigation.loading} /> : <NavigationDesktop loading={Navigation.loading} />;
    }
}
