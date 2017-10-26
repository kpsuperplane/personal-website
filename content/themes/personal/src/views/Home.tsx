'use strict';

import Component from 'inferno-component';

import './Home.scss';

export default class Home extends Component<any, {}> {
    private top: number = 0;
    private touchStart: number = -1;
    private velocityLast: number = 0;
    private touchLast: number = -1;
    private touchDelta: number = -1;
    private touchLastBuffer: number = -1;
    private scrollStart: number = -1;
    private touchLastTime: number = -1;
    private opened: boolean = false;
    private winHeight: number = window.innerHeight;
    private content: HTMLElement|null = null;
    private wrapper: HTMLElement|null = null;
    private hero: HTMLElement|null = null;
    constructor(props) {
        super(props);
    }
    private updatePosition = () => {
        this.top = this.content!!.getBoundingClientRect().top;
    }
    private updateHeight = () => {
        this.wrapper!!.style.height = this.opened ? null : this.winHeight + 'px';
    }
    private dragRender = () => {
        const delta = this.touchLast - this.touchStart;
        const y = this.opened ? 0 : this.top + delta;
        const percent = y / (this.winHeight * 0.85);
        this.content!!.style.transform = `translate3d(0, ${y}px, 0)`;
        this.hero!!.style.transform = `translate3d(0, ${-(1 - percent) * this.winHeight / 2}px, 0)`;
        this.hero!!.style.opacity = `${Math.max(0, (percent * 1.3 - 0.3))}`;
    }
    private dragStart = (e: TouchEvent) => {
        this.updatePosition();
        this.touchStart = e.touches[0].clientY;
        this.touchLastTime = new Date().getTime();
        this.touchLast = this.touchStart;
        this.scrollStart = document.documentElement.scrollTop;
        this.hero!!.style.transition = this.content!!.style.transition = 'no';
        this.dragRender();
    }
    private calculateVelocity() {
        const now = new Date().getTime();
        if (now - this.touchLastTime > 10) {
            const velocityNew = this.touchDelta / (now - this.touchLastTime);
            this.velocityLast = velocityNew;
            this.touchLastTime = now;
            this.touchLastBuffer = this.touchLast;
        }
    }
    private dragEnd = (e: TouchEvent) => {
        this.calculateVelocity();
        const delta = this.touchLast - this.touchStart;
        const y = this.top + delta;
        this.touchStart = -1;
        this.touchLast = -1;
        let percent = y / (this.winHeight * 0.85);
        if (percent > 1) {
            percent = 1 - (percent - 1);
        }
        if (percent <= 0 || (percent < 0.425 && !(this.velocityLast < -0.5)) || ((this.velocityLast > 0.5))) {
            this.opened = true;
            this.top = 0;
        } else {
            this.opened = false;
            this.top = this.winHeight * 0.85;
        }
        const animTime = (this.opened ? Math.abs(percent) : (1 - Math.abs(percent))) * 200 + 100;
        this.hero!!.style.transition = this.content!!.style.transition = `all ${animTime}ms cubic-bezier(0.1,${(Math.abs(this.velocityLast) * (0.1 * animTime)) / Math.abs(y - this.top)},0.1,1)`;
        this.updateHeight();
        this.dragRender();
    }
    private dragCancel = this.dragEnd;
    private dragMove = (e: TouchEvent) => {
        this.touchLast = e.touches[0].clientY;
        this.touchDelta = this.touchLastBuffer - e.touches[0].clientY;
        // we lazy-compute scrolltop since getting the actual value causes a DOM reflow
        let scrollTop = -1;
        const y = this.top + this.touchLast - this.touchStart;
        if (this.opened && y > 0) {
            if (scrollTop === -1) {
                scrollTop = document.documentElement.scrollTop;
            }
            if (scrollTop === 0) {
                this.opened = false;
                this.touchStart = this.touchLast - 1;
                this.touchDelta = 0;
                this.top = 0;
                this.updateHeight();
            }
        } else if (!this.opened && y <= 0) {
            if (scrollTop === -1) {
                scrollTop = document.documentElement.scrollTop;
            }
            if (scrollTop >= 0) {
                this.opened = true;
                this.touchStart = this.touchLast + 1;
                this.touchDelta = 0;
                this.top = 0;
                this.updateHeight();
            }
        }
        if (!this.opened) {
            e.preventDefault();
        }
        this.calculateVelocity();
        requestAnimationFrame(this.dragRender);
    }
    private onResize = () => {
        this.winHeight = window.innerHeight;
        this.top = this.opened ? 0 : this.winHeight * 0.85;
        this.updateHeight();
        requestAnimationFrame(this.dragRender);
    }
    private attachWrapper = (el) => {
        if (this.wrapper == null) {
            this.wrapper = el;
            el.addEventListener('touchstart', this.dragStart, {passive: false});
            el.addEventListener('touchend', this.dragEnd, {passive: false});
            el.addEventListener('touchcancel', this.dragCancel, {passive: false});
            el.addEventListener('touchmove', this.dragMove, {passive: false});
            window.addEventListener('resize', this.onResize);
            this.updateHeight();
        }
    }
    private attachHero = (el) => {
        this.hero = el;
    }
    private attachContent = (el) => {
        if (this.content == null) {
            this.content = el;
        }
    }
    public componentWillUnmount() {
        const el = this.wrapper!!;
        el.removeEventListener('touchstart', this.dragStart);
        el.removeEventListener('touchend', this.dragEnd);
        el.removeEventListener('touchcancel', this.dragCancel);
        el.removeEventListener('touchmove', this.dragMove);
        window.removeEventListener('resize', this.onResize);
    }
    public componentDidMount() {
        this.onResize();
        this.dragRender();
    }
    public render() {
        return (<div className="home-component" ref={this.attachWrapper}>
            <div ref={this.attachContent} className="content-wrapper">
                <img style={{width: '100%'}} src="http://via.placeholder.com/350x150" />
                <h1>Test1</h1>
                <h1>Test2</h1>
                <h1>Test3</h1>
                <h1>Test4</h1>
                <h1>Test5</h1>
                <h1>Test6</h1>
                <h1>Test6</h1>
                <h1>Test7</h1>
                <h1>Test8</h1>
                <h1>Test9</h1>
                <h1>Test10</h1>
                <h1>Test11</h1>
                <h1>Test12</h1>
                <h1>Test13</h1>
            </div>
            <div className="home-content" ref={this.attachHero}>
                Hey, I'm Kevin 😄
            </div>
        </div>);
    }
}