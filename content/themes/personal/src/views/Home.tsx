import Component from 'inferno-component';

import './Home.scss';

let top = 0, touchStart = -1, velocityLast = 0, touchLast = -1, touchDelta = -1, touchLastBuffer = -1, scrollStart = -1, touchLastTime = -1, opened = false, winHeight = window.innerHeight, content:HTMLElement|null = null, wrapper:HTMLElement|null = null, hero:HTMLElement|null = null;

export default class Home extends Component<any, {}> {
    constructor(props) {
        super(props);
    }
    updatePosition = () => {
        top = content!!.getBoundingClientRect().top;
    }
    updateHeight = () => {
        wrapper!!.style.height = opened ? null : winHeight + 'px';
    }
    dragRender = () => {
        const delta = touchLast - touchStart;
        let y = opened ? 0 : top + delta;
        const percent = y/(winHeight * 0.85);
        content!!.style.transform = `translate3d(0, ${y}px, 0)`;
        hero!!.style.transform = `translate3d(0, ${-(1-percent) * winHeight / 2}px, 0)`;
        hero!!.style.opacity = `${Math.max(0, (percent*1.3 - 0.3))}`;
    }
    dragStart = (e: TouchEvent) => {
        this.updatePosition();
        touchStart = e.touches[0].clientY;
        touchLastTime = new Date().getTime();
        touchLast = touchStart;
        scrollStart = document.documentElement.scrollTop;
        hero!!.style.transition = content!!.style.transition = "no";
        this.dragRender();
    }
    calculateVelocity() {
        const now = new Date().getTime();
        if (now - touchLastTime > 10) {
            const velocityNew = touchDelta/(now - touchLastTime);
            velocityLast = velocityNew;
            touchLastTime = now;
            touchLastBuffer = touchLast;
        }
    }
    dragEnd = (e: TouchEvent) => {
        this.calculateVelocity();
        const delta = touchLast - touchStart;
        let y = top + delta;
        touchStart = -1;
        touchLast = -1;
        let percent = y / (winHeight * 0.85);
        if (percent > 1) percent = 1 - (percent - 1);
        if (percent <= 0 || (percent < 0.425 && !(velocityLast < -1)) || ((velocityLast > 1))) {
            opened = true;
            top = 0;
        } else {
            opened = false;
            top = winHeight * 0.85;
        }
        const animTime = (opened ? Math.abs(percent) : (1 - Math.abs(percent))) * 200 + 100;
        hero!!.style.transition = content!!.style.transition = `all ${animTime}ms cubic-bezier(0.1,${(Math.abs(velocityLast) * (0.1 * animTime))/Math.abs(y-top)},0.1,1)`;
        this.updateHeight();
        this.dragRender();
    }
    dragCancel = this.dragEnd;
    dragMove = (e: TouchEvent) => {
        touchLast = e.touches[0].clientY;
        touchDelta = touchLastBuffer - e.touches[0].clientY;
        // we lazy-compute scrolltop since getting the actual value causes a DOM reflow
        let scrollTop = -1;
        let y = top + touchLast - touchStart;
        if (opened && y > 0) {
            if (scrollTop == -1) scrollTop = document.documentElement.scrollTop;
            if (scrollTop == 0) {
                opened = false;
                touchStart = touchLast - 1;
                touchDelta = 0;
                top = 0;
                this.updateHeight();
            }
        } else if (!opened && y <= 0) {
            if (scrollTop == -1) scrollTop = document.documentElement.scrollTop;
            if (scrollTop >= 0) {
                opened = true;
                touchStart = touchLast + 1;
                touchDelta = 0;
                top = 0;
                this.updateHeight();
            }
        }
        if(!opened) e.preventDefault();
        this.calculateVelocity();
        requestAnimationFrame(this.dragRender);
    }
    onResize = () => {
        winHeight = window.innerHeight;
        top = opened ? 0 : winHeight * 0.85;
        this.updateHeight();
        requestAnimationFrame(this.dragRender);
    }
    attachWrapper = (el) => {
        if (wrapper == null) {
            wrapper = el;
            el.addEventListener("touchstart", this.dragStart, {passive: false});
            el.addEventListener("touchend", this.dragEnd, {passive: false});
            el.addEventListener("touchcancel", this.dragCancel, {passive: false});
            el.addEventListener("touchmove", this.dragMove, {passive: false});
            window.addEventListener("resize", this.onResize);
            this.updateHeight();
        }
    }
    attachHero = (el) => {
        hero = el;
    }
    attachContent = (el) => {
        if (content == null) {
            content = el;
            el.addEventListener("touchstart", this.dragStart, {passive: false});
            el.addEventListener("touchend", this.dragEnd, {passive: false});
            el.addEventListener("touchcancel", this.dragCancel, {passive: false});
            el.addEventListener("touchmove", this.dragMove, {passive: false});
            window.addEventListener("resize", this.onResize);
        }
    }
    componentWillUnmount() {
        const el = wrapper!!;
        el.removeEventListener("touchstart", this.dragStart);
        el.removeEventListener("touchend", this.dragEnd);
        el.removeEventListener("touchcancel", this.dragCancel);
        el.removeEventListener("touchmove", this.dragMove);
        window.removeEventListener("resize", this.onResize);
    }
    componentDidMount() {
        this.dragRender();
    }
    render() {
        return (<div className="home-component" ref={this.attachWrapper}>
            <div ref={this.attachContent} className="content-wrapper">
                <img style={{width: '100%'}} src="http://lorempixel.com/400/200/food/3/" />
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