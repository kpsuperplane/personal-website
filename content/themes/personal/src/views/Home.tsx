import View from './View';

import bezier from 'cubic-bezier';

import ellipsize from 'ellipsize';
import Component from 'inferno-component';
import createElement from 'inferno-create-element';
import { DateTime } from 'luxon';
import {get} from 'superagent';

import Button from '../components/Button';
import Footer from '../components/Footer';
import GlobalLoader from '../components/GlobalLoader';
import LazyImage from '../components/LazyImage';
import Loader from '../components/Loader';
import Thinking from '../img/thinking.jpg';

import { Post , PostInterface } from '../views/Blog';

import './Home.scss';

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
        if (story === null) {
            return <div className={'home-prompt home-message' + (visible ? ' visible' : '')}>
                <LazyImage path={Thinking} style={{width: '5rem', height: '5.1367rem'}} /><br />
                <Button onClick={this.start}>Tell me a story</Button>
            </div>;
        } else {
            return createElement(story, {onComplete: this.end});
        }
    }
}

class HorizontalScroll extends Component<{}, {}> {
    private container: HTMLElement | null = null;
    private lastVelocity: number = 0;
    private lastEvent: {scrollLeft: number, timeStamp: number} | null = null;
    private scrolling: boolean = false;
    private animating: boolean = false;
    private handleScroll = (e) => {
        if (this.animating) {
            return;
        }
        this.scrolling = true;
        const scrollLeft = this.container!!.scrollLeft;
        if (this.lastEvent) {
            this.lastVelocity = (scrollLeft - this.lastEvent.scrollLeft) / (e.timeStamp - this.lastEvent.timeStamp);
        }
        this.lastEvent = {scrollLeft, timeStamp: e.timeStamp};
    }
    private touchMove = (e) => {
        if (this.scrolling) {
            e.stopPropagation();
        }
    }
    private touchEnd = (e) => {
        this.scrolling = false;
        this.lastEvent = null;
        const containerWidth = this.container!!.getBoundingClientRect().width;
        const scrollLeft = this.container!!.scrollLeft;
        const leftCoord = Math.floor(scrollLeft / containerWidth) * containerWidth;
        const rightCoord = Math.ceil(scrollLeft / containerWidth) * containerWidth;
        const percent = (scrollLeft - leftCoord) / containerWidth;
        const scrollTo = ((percent >= 0.5 && this.lastVelocity >= -0.5) || this.lastVelocity >= 0.5) ? rightCoord : leftCoord;
        const dist = scrollTo - scrollLeft;
        const animTime = ((scrollTo === rightCoord) ? Math.abs(percent) : (1 - Math.abs(percent))) * 200 + 100;
        const anim = bezier(0.1, (Math.abs(this.lastVelocity) * (0.1 * animTime)) / Math.abs(scrollTo - scrollLeft), 0.1, 1, (1000 / 60 / animTime) / 4);
        const step = 8.33 / animTime;
        this.container!!.style.overflow = 'hidden';
        let inc = 0;
        this.animating = true;
        const scrollAnim = () => {
            if (inc > 1) {
                this.container!!.scrollTo(scrollTo, 0);
                this.container!!.style.overflow = 'scroll';
                this.animating = false;
            } else {
                this.container!!.scrollTo(scrollLeft + dist * anim(inc), 0);
                inc += step;
                setTimeout(() => {
                    scrollAnim();
                }, 8.33);
            }
        };
        requestAnimationFrame(scrollAnim);
        this.lastVelocity = 0;
    }
    private attachContainer = (el) => {
        if (this.container == null) {
            this.container = el;
            el.addEventListener('touchmove', this.touchMove);
            el.addEventListener('touchend', this.touchEnd);
            el.addEventListener('scroll', this.handleScroll);
        }
    }
    public render() {
        return <div className="h-scroll" ref={this.attachContainer}>{this.props.children}</div>;
    }
}

export default class Home extends View<{posts: PostInterface[] | null}> {
    private top: number = 0;
    private touchStart: number = -1;
    private velocityLast: number = 0;
    private touchLast: number = -1;
    private touchDelta: number = -1;
    private touchLastBuffer: number = -1;
    private touchLastTime: number = -1;
    private touchStartTime: number = -1;
    private opened: boolean = false;
    private openedPreviously: boolean = false;
    private winHeight: number = window.innerHeight;
    private content: HTMLElement|null = null;
    private wrapper: HTMLElement|null = null;
    private hero: HTMLElement|null = null;
    constructor(props) {
        super(props);
        this.state = {
            posts: null
        };
        GlobalLoader.queue(true);
        get(ghost.url.api('posts', {page: 1, filter: 'page:false+feature_image:-null', limit: 4, fields: 'feature_image, url, published_at, title, custom_excerpt, featured, html'})).end((err, {body}) => {
            GlobalLoader.dequeue(() => {
                if (body.posts.length === 0) {
                    this.context.router.push('/blog/', null);
                } else {
                    window.scrollTo(0, 0);
                    this.setState({
                        posts: body.posts.map((post) => ({
                            excerpt: post.custom_excerpt || ellipsize(post.html.replace(/<[^>]*>/g, ''), 128),
                            feature_image: post.feature_image,
                            featured: post.featured,
                            published_at: DateTime.fromISO(post.published_at),
                            title: post.title,
                            url: post.url
                        }))
                    });
                }
            });
        });
    }
    private updatePosition = () => {
        this.top = this.content!!.getBoundingClientRect().top;
    }
    private updateHeight = () => {
        this.wrapper!!.style.height = this.opened ? null : this.winHeight + 'px';
        this.hero!!.style.height = this.winHeight + 'px';
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
        const percent = y / (this.winHeight * 0.85);
        this.content!!.style.transform = `translate3d(0, ${y}px, 0)`;
        this.hero!!.style.transform = `scale(${0.8 + percent * 0.2})`;
    }
    private dragStart = (e: TouchEvent) => {
        this.updatePosition();
        if (this.opened && window.scrollY < 1) {
            window.scrollTo(0, 1);
        }
        this.content!!.style.borderRadius = null;
        this.touchStart = e.touches[0].clientY;
        this.touchLastTime = new Date().getTime();
        this.touchStartTime = this.touchLastTime;
        this.touchLast = this.touchStart;
        this.hero!!.style.transition = 'no';
        this.content!!.style.transition = 'border-radius 500ms';
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
            } else if (percent >= 0 && ((percent < 0.425 && !(this.velocityLast < -0.5)) || ((this.velocityLast > 0.5)))) {
                this.opened = true;
                this.top = 0;
            } else {
                this.opened = false;
                this.top = this.winHeight * 0.85;
            }
        }
        this.touchStart = -1;
        this.touchLast = -1;
        const animTime = (this.opened ? Math.abs(percent) : (1 - Math.abs(percent))) * 200 + 100;
        this.hero!!.style.transition = this.content!!.style.transition = `all ${animTime}ms cubic-bezier(0.1,${(Math.abs(this.velocityLast) * (0.1 * animTime)) / Math.abs(y - this.top)},0.1,1)`;
        this.content!!.style.borderRadius = this.opened ? '0' : null;
        this.updateHeight();
        this.dragRender();
    }
    private dragCancel = this.dragEnd;
    private dragMove = (e: TouchEvent) => {
        this.touchLast = e.touches[0].clientY;
        this.touchDelta = this.touchLastBuffer - e.touches[0].clientY;
        const y = this.top + this.touchLast - this.touchStart;
        if (this.opened && window.scrollY - y < 1) {
            this.opened = false;
            this.touchStart = this.touchLast - 1;
            this.touchDelta = 0;
            this.top = 0;
            this.updateHeight();
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
        const { posts } = this.state!!;
        return (<div className="home-component" ref={this.attachWrapper}>
            <div className="home-content" ref={this.attachHero}>
                <div className="home-content-inner">
                    <HomeContent />
                </div>
            </div>
            <div ref={this.attachContent} className="content-wrapper">
                <HorizontalScroll>{posts ? posts.map((post) => <Post {...post} key={post.url} />) : null}</HorizontalScroll>
                <Footer />
            </div>
        </div>);
    }
}
