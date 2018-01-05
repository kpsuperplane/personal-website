import View from './View';

import Component from 'inferno-component';
import createElement from 'inferno-create-element';
import { Link } from 'inferno-router';
import {get} from 'superagent';

import Button from '../components/Button';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Icon, { Icons } from '../components/Icon';
import LazyImage from '../components/LazyImage';
import Loader from '../components/Loader';
import { Curve } from '../components/Title';
import Thinking from '../img/thinking.jpg';

import { getPosts, Post, PostInterface } from '../views/Blog';
import { getProjects, Project, ProjectInterface } from '../views/Projects';

import './Home.scss';

const getScrollY = () => {
    const doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
};

class Story<T> extends Component<{onComplete: Function}, T> {}

class LocationStory extends Story<{message: string, emoji: string, visible: boolean}> {
    constructor(props) {
        super(props);
        this.state = {
            emoji: '',
            message: '',
            visible: false
        };
        navigator.geolocation.getCurrentPosition((pos) => {
            get('https://us-central1-personal-website-173519.cloudfunctions.net/getDistance?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude).end((err, res) => {
                this.begin(Number(res.text));
            });
        }, console.error);
    }
    private prompt = (message: string[]) => {
        this.setState({message: message[0], emoji: message[1], visible: true});
    }
    private begin = (distance: number) => {
        const prompts = [
            [`Woah, you\'re like ${distance} km away from me`, '😃'],
            [`That's like ${Math.round(distance * 3280.84)} Subway footlong sandwiches`, '🥪'],
            [`Or ${Math.round(distance * 666.66)} giant pandas`, '🐼'],
            [`It'd take you ${(() => {
                const hours = distance / 15.5;
                if (hours > 24) {
                    return `${Math.round(hours / 24)} day(s)`;
                } else if (hours >= 1) {
                    return `${Math.round(hours)} hour(s)`;
                } else {
                    return `${Math.round(hours * 60)} minute(s)`;
                }
            })()} to bike to me`, '🚴'],
            [`Usain Bolt would piggyback you about 3 times faster`, '😲']
        ];
        this.setState({message: ' '});
        let idx = 0;
        const show = () => {
            this.setState({visible: false}, () => {
                setTimeout(() => {
                    if (idx === prompts.length) {
                        window.clearInterval(interval);
                        this.props.onComplete();
                    }
                    this.prompt(prompts[idx]);
                    ++idx;
                }, 500);
            });
        };
        show();
        const interval = window.setInterval(show, 4000);
    }
    public render() {
        const {message, emoji, visible} = this.state!!;
        if (message === '') {
            return <Loader />;
        } else {
            return <div className={'home-message' + (visible ? ' visible' : '')}><p style={{fontSize: '4rem', margin: 0}}>{emoji}</p><p>{message}</p></div>;
        }
    }
}

class HomeContent extends Component<{}, {story: any, visible: boolean}> {
    constructor(props) {
        super(props);
        this.state = {
            story: null,
            visible: false
        };
        setTimeout(() => {
            this.setState({visible: true});
        }, 10);
    }
    private start = () => {
        this.setState({visible: false}, () => {
            setTimeout(() => {
                this.setState({story: LocationStory});
            }, 500);
        });
    }
    private end = () => {
        this.setState({story: null, visible: false});
        setTimeout(() => {
            this.setState({visible: true});
        }, 10);
    }
    public render() {
        const {story, visible} = this.state!!;
        if (1 === 1) {
            return <h1>Hey, I'm Kevin</h1>;
        } else if (story === null) {
            return <div className={'home-prompt home-message' + (visible ? ' visible' : '')}>
                <LazyImage path={Thinking} style={{width: '5rem', height: '5.1367rem'}} /><br />
                <Button onClick={this.start}>Tell me a story</Button>
            </div>;
        } else {
            return createElement(story, {onComplete: this.end});
        }
    }
}

class HorizontalScroll extends Component<{}, {selected: number}> {
    private container: HTMLElement | null = null;
    private wrapper: HTMLElement | null = null;
    private lastVelocity: number = 0;
    private firstTouch: number[] = [-1, -1];
    private lastTouch: number = 0;
    private dragging: boolean = false;
    private maxPos: number = 0;
    private dragLeft: number = 0;
    private lastTouchTime: number = 0;
    private lastTouchBuffer: number = 0;
    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        };
    }
    private reset = () => {
        this.firstTouch = [0, 0];
        this.lastTouch = 0;
        this.lastVelocity = 0;
    }
    private dragRender = () => {
        const pos = Math.max(Math.min(0, this.dragLeft + (this.lastTouch - this.firstTouch[0])), -this.maxPos);
        this.container!!.style.transform = `translate3d(${pos}px, 0, 0)`;
    }
    private calculateVelocity() {
        const now = new Date().getTime();
        if (now - this.lastTouchTime > 10) {
            const newVelocity = (this.lastTouchBuffer - this.lastTouch) / (now - this.lastTouchTime);
            this.lastVelocity = newVelocity;
            this.lastTouchTime = now;
            this.lastTouchBuffer = this.lastTouch;
        }
    }
    private touchMove = (e) => {
        this.calculateVelocity();
        if (!this.dragging && Math.abs(e.touches[0].clientX - this.firstTouch[0]) >= 5 && Math.abs((e.touches[0].clientY - this.firstTouch[1]) / (e.touches[0].clientX - this.firstTouch[0])) < 0.5) {
            this.dragging = true;
        }
        this.lastTouch = e.touches[0].clientX;
        if (this.dragging) {
            e.preventDefault();
            e.stopPropagation();
            requestAnimationFrame(this.dragRender);
        }
    }
    private touchEnd = (e) => {
        if (getScrollY() === 1) {
            window.scrollTo(0, 0);
        }
        if (!this.dragging) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        this.calculateVelocity();
        const containerWidth = this.wrapper!!.getBoundingClientRect().width;
        const pos = Math.min(Math.max(0, -(this.dragLeft + (this.lastTouch - this.firstTouch[0]))), this.maxPos);
        const leftCoord = Math.floor(pos / containerWidth) * containerWidth;
        const rightCoord = Math.ceil(pos / containerWidth) * containerWidth;
        const percent = (pos - leftCoord) / containerWidth;
        const newLeft = ((percent >= 0.5 && this.lastVelocity >= -0.5) || this.lastVelocity >= 0.5) ? rightCoord : leftCoord;
        const animTime = ((newLeft === rightCoord) ? Math.abs(percent) : (1 - Math.abs(percent))) * 300 + 100;
        this.container!!.style.transition = `transform ${animTime}ms cubic-bezier(0.1, ${(Math.abs(this.lastVelocity) * (0.1 * animTime)) / Math.abs(newLeft - pos)}, 0.1, 1)`;
        this.reset();
        this.dragLeft = -newLeft;
        this.setState({selected: Math.floor(newLeft / containerWidth)});
        requestAnimationFrame(this.dragRender);
    }
    private touchStart = (e) => {
        this.dragging = false;
        this.container!!.style.transition = 'none';
        this.dragLeft = this.container!!.getBoundingClientRect().left;
        this.firstTouch = [e.touches[0].clientX, e.touches[0].clientY];
        this.lastTouchBuffer = this.lastTouch = this.firstTouch[0];
    }
    private prev = (e) => {
        if (this.state!!.selected === 0) {
            return;
        }
        this.reset();
        this.container!!.style.transition = `transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1)`;
        this.dragLeft = -this.wrapper!!.getBoundingClientRect().width * (this.state!!.selected - 1);
        requestAnimationFrame(this.dragRender);
        this.setState({selected: this.state!!.selected - 1});
    }
    private next = (e) => {
        if (this.state!!.selected === (this.props.children as any).length - 1) {
            return;
        }
        this.reset();
        this.container!!.style.transition = `transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1)`;
        this.dragLeft = -this.wrapper!!.getBoundingClientRect().width * (this.state!!.selected + 1);
        requestAnimationFrame(this.dragRender);
        this.setState({selected: this.state!!.selected + 1});
    }
    private attachContainer = (el) => {
        if (this.container == null) {
            this.container = el;
        }
    }
    private attachWrapper = (el) => {
        if (this.wrapper == null) {
            this.wrapper = el;
            el.addEventListener('touchstart', this.touchStart);
            el.addEventListener('touchmove', this.touchMove);
            el.addEventListener('touchend', this.touchEnd);
            this.maxPos = this.container!!.scrollWidth - this.wrapper!!.getBoundingClientRect().width;
        }
    }
    public componentDidUpdate() {
        this.maxPos = this.container!!.scrollWidth - this.wrapper!!.getBoundingClientRect().width;
    }
    public render() {
        return <div className={'h-scroll' + (this.props.className ? ' ' + this.props.className : '')} ref={this.attachWrapper}>
            <div className="h-scroll-contents" ref={this.attachContainer}>{this.props.children}</div>
            <div className={'h-scroll-nav left' + (this.state!!.selected !== 0 ? ' active' : '')} onClick={this.prev}><Icon icon={Icons.CHEVRON_LEFT} /></div>
            <div className={'h-scroll-nav right' + ((this.props.children && this.state!!.selected !== (this.props.children as any).length - 1) ? ' active' : '')} onClick={this.next}><Icon icon={Icons.CHEVRON_RIGHT} /></div>
            {this.props.children ? <div className="h-scroll-indicator">
                {Array.from(new Array((this.props.children as any).length), (val, index) => <div className={'h-scroll-indicator-item' + (index === this.state!!.selected ? ' active' : '')}></div>)}
                <Link to={this.props.linkTo} className="h-scroll-link">{this.props.linkText}</Link>
            </div> : null}
        </div>;
    }
}

export default class Home extends View<{posts: PostInterface[] | null, projects: ProjectInterface[] | null, mouseMode: boolean}> {
    private top: number = 0;
    private touchStart: number = -1;
    private velocityLast: number = 0;
    private touchLast: number = -1;
    private touchDelta: number = -1;
    private touchLastBuffer: number = -1;
    private touchLastTime: number = -1;
    private touchStartTime: number = -1;
    private opened: boolean = false;
    private startTop: boolean = false;
    private openedPreviously: boolean = false;
    private winHeight: number = window.innerHeight;
    private content: HTMLElement|null = null;
    private wrapper: HTMLElement|null = null;
    private hero: HTMLElement|null = null;
    private video: HTMLVideoElement|null = null;
    private isMobile: boolean = false;
    private lastScrollY: number = 0;
    constructor(props) {
        super('home', props);
        this.state = {
            mouseMode: true,
            posts: null,
            projects: null
        };
        getPosts('1', (posts) => {
            this.setState({posts: posts.posts});
        }, true, 5);
        getProjects('1', (projects) => {
            this.setState({projects: projects.projects});
        }, 5);
        this.onResize();
        View.setDark(false);
    }
    private updatePosition = () => {
        this.top = this.content!!.getBoundingClientRect().top;
    }
    private updateHeight = () => {
        if (this.wrapper && this.hero) {
            this.wrapper!!.style.height = this.opened ? null : this.winHeight + 'px';
            this.hero!!.style.height = this.winHeight + 'px';
        }
    }
    private dragRender = () => {
        const delta = this.touchLast - this.touchStart;
        const y = this.top + delta;
        if (this.opened || y < 5) {
            if (this.openedPreviously) {
                return true;
            } else {
                this.openedPreviously = true;
            }
        } else {
            this.openedPreviously = false;
        }
        this.content!!.style.transform = `translate3d(0, ${y}px, 0)`;
    }
    private dragStart = (e: TouchEvent) => {
        if (!this.isMobile) {
            return;
        }
        if (this.state!!.mouseMode) {
            this.setState({mouseMode: false});
            if (this.lastScrollY < this.winHeight * 0.85) {
                this.top = this.winHeight * 0.85 - this.lastScrollY;
                window.scrollTo(0, 0);
                this.opened = false;
            } else {
                this.top = this.winHeight * 0.85;
                this.content!!.style.transform = `translate3d(0, 0, 0)`;
                window.scrollTo(this.lastScrollY - this.top, 0);
                this.opened = true;
            }
        } else {
            this.updatePosition();
        }
        this.startTop = this.lastScrollY <= 0;
        if (this.opened && this.lastScrollY < 1) {
            window.scrollTo(0, 1);
        }
        this.touchStart = e.touches[0].clientY;
        this.touchLastTime = new Date().getTime();
        this.touchStartTime = this.touchLastTime;
        this.touchLast = this.touchStart;
        this.content!!.style.transition = 'border-radius 500ms';
        this.content!!.style.boxShadow = 'none';
        this.video!!.pause();
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
        if (!this.isMobile) {
            return;
        }
        this.calculateVelocity();
        const delta = this.touchLast - this.touchStart;
        const y = this.top + delta;
        let percent = y / (this.winHeight * 0.85);
        if (percent > 1) {
            percent = 1 - (percent - 1);
        }
        if (this.opened === false) {
            if (delta < 1 && this.touchLast > this.top && new Date().getTime() - this.touchStartTime < 3000) {
                e.preventDefault();
                this.opened = true;
                this.velocityLast = 0;
                this.top = 0;
            } else if (percent >= 0 && (percent < 0.425 && !(this.velocityLast < -0.5)) || ((this.velocityLast > 0.5))) {
                this.opened = true;
                this.top = 0;
            } else {
                this.opened = false;
                this.top = this.winHeight * 0.85;
            }
        }
        if (this.opened === false) {
            this.content!!.style.boxShadow = null;
            this.video!!.play();
        }
        this.lastScrollY = 0;
        this.touchStart = -1;
        this.touchLast = -1;
        const animTime = (this.opened ? Math.abs(percent) : (1 - Math.abs(percent))) * 200 + 100;
        this.content!!.style.transition = `all ${animTime}ms cubic-bezier(0.1,${(Math.abs(this.velocityLast) * (0.1 * animTime)) / Math.abs(y - this.top)},0.1,1)`;
        this.content!!.style.borderRadius = this.opened ? '0' : null;
        this.updateHeight();
        this.dragRender();
    }
    private dragCancel = this.dragEnd;
    private dragMove = (e: TouchEvent) => {
        if (!this.isMobile) {
            return;
        }
        this.touchLast = e.touches[0].clientY;
        this.touchDelta = this.touchLastBuffer - e.touches[0].clientY;
        const y = this.top + this.touchLast - this.touchStart;
        if (this.opened && this.lastScrollY - y < 1 && this.startTop) {
            this.opened = false;
            this.touchStart = this.touchLast - 1;
            this.touchDelta = 0;
            this.top = 0;
            this.updateHeight();
            this.content!!.style.borderRadius = null;
            e.preventDefault();
        }
        if (!this.opened) {
            e.preventDefault();
        }
        this.calculateVelocity();
        requestAnimationFrame(this.dragRender);
    }
    private onResize = () => {
        this.winHeight = window.innerHeight;
        this.isMobile = window.innerWidth <= 750;
        this.top = this.opened ? 0 : this.winHeight * 0.85;
        if (this.content) {
            this.content.style.transform = `translate3d(0, ${this.top}px, 0)`;
        }
        this.updateHeight();
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
    private attachVideo = (el) => {
        if (this.video == null) {
            this.video = el;
            this.video!!.play();
        }
    }
    private onWheel = (e) => {
        if (!this.state!!.mouseMode) {
            this.setState({mouseMode: true});
            this.top = this.winHeight * 0.85;
            this.touchLast = 0;
            this.opened = false;
            this.touchStart = 0;
            this.content!!.style.borderRadius = null;
            this.content!!.style.boxShadow = null;
            this.content!!.style.transition = 'none';
            this.content!!.style.transform = `translate3d(0, ${this.top}px, 0)`;
            window.scrollTo(0, this.lastScrollY + this.top);
        }
    }
    private onScroll = () => {
        this.lastScrollY = getScrollY();
        if (this.lastScrollY <= 0) {
            if (this.video!!.paused) {
                this.video!!.play();
            }
        } else {
            if (!this.video!!.paused) {
                this.video!!.pause();
            }
        }
    }
    public componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('wheel', this.onWheel);
    }
    public componentDidMount() {
        this.onResize();
        this.dragRender();
        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('wheel', this.onWheel);
        super.componentDidMount();
    }
    public render() {
        const { posts, projects, mouseMode } = this.state!!;
        const { type, downlink } = ((navigator as any).connection || {type: undefined, downlink: undefined});
        const fastConnection = (downlink === undefined || downlink >= 3.5);
        const assumeWifi = type ? ((type === 'wifi' || type === 'ethernet'  || type === 'mixed') && fastConnection) : (downlink ? (!this.isMobile && fastConnection) : !this.isMobile);
        return (<div className={'home-component' + (mouseMode ? ' mousemode' : '')} ref={this.attachWrapper}>
            <div className="home-video-wrapper">
                <video loop="loop" autoplay="autoplay" muted="muted" className="home-video" playsinline ref={this.attachVideo}>
                    <source src={'/assets/home-video' + (assumeWifi ? '' : '-mobile') + '.webm'} type="video/webm" />
                    <source src={'/assets/home-video' + (assumeWifi ? '' : '-mobile') + '.mp4'} type="video/mp4" />
                </video>
            </div>
            <div className="home-content" ref={this.attachHero}>
                <div className="home-content-inner">
                    <HomeContent />
                </div>
                <div className="home-contact">
                    <div className="swipe-up-indicator">
                        <Icon icon={Icons.CHEVRON_UP} style={{animationDelay: '300ms'}} />
                        <Icon icon={Icons.CHEVRON_UP} style={{animationDelay: '150ms'}}  />
                        <Icon icon={Icons.CHEVRON_UP}/>
                    </div>
                    <Contact hideEmail={true} />
                </div>
            </div>
            <div className="content-background"><Curve /></div>
            <div ref={this.attachContent} className="content-wrapper">
                <div className="content-wrapper-inner">
                    <HorizontalScroll linkText={<span><Icon icon={Icons.NEWSPAPER} />All Posts</span>} linkTo="/blog/" className="home-blog">{posts ? posts.map((post) => <Post {...post} key={post.url} forceWait={false} asBackground={true} />) : null}</HorizontalScroll>
                    <HorizontalScroll linkText={<span><Icon icon={Icons.NEWSPAPER} />All Projects</span>} linkTo="/projects/" className="home-projects">{projects ? projects.map((project) => <Project {...project} key={project.url} forceWait={false} />) : null}</HorizontalScroll>
                </div>
                { (posts || projects) ? <Footer /> : null }
            </div>
        </div>);
    }
}
