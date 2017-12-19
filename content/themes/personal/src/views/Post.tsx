import { get } from 'superagent';
import GlobalLoader from '../components/GlobalLoader';
import View from './View';

import './Post.scss';

export default class Post extends View<{content: any | null,  image: string | null, title: string}> {
    private lastPath: string = '';
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            image: null,
            title: ''
        };
        this.load();
    }
    private load = () => {
        this.lastPath = window.location.pathname;
        GlobalLoader.queue(true);
        get(ghost.url.api('posts', {filter: 'page:[false,true]+slug:' + this.lastPath.replace(/\//g, '')})).end((err, {body}) => {
            GlobalLoader.dequeue(() => {
                window.scrollTo(0, 0);
                if (body && body.posts && body.posts.length > 0) {
                    const post = body.posts[0];
                    if (post.feature_image) {
                        GlobalLoader.queue(true);
                        const img = new Image();
                        img.addEventListener('load', () => {
                            GlobalLoader.dequeue();
                        });
                        img.src = post.feature_image;
                    }
                    this.setState({content: {__html: post.html}, title: post.title, image: post.feature_image || null});
                } else {
                    this.context.router.push('/', null);
                }
            });
        });
    }
    public componentDidUpdate(props) {
        if (window.location.pathname !== this.lastPath) {
            this.load();
        }
    }
    private handleClick = (e) => {
        if (e.target && e.target.tagName === 'A' && e.target.attributes && e.target.attributes.href && !(e.target.attributes.target && e.target.attributes.target !== '_self')) {
            const target = e.target.attributes.href.value;
            if (target.indexOf('http') !== 0 || target.indexOf(window.location.host) != -1) {
                e.preventDefault();
                this.context.router.push(target, e.target.textContent);
            }
        }
    }
    public render() {
        const { content, title, image } = this.state!!;
        return <article className="post">
            <header className={'post-header' + (image ? ' has-feature-image' : '')}>
                {image ? [
                    <img src={image} />,
                    <svg className="post-header-curve" viewBox="0 0 400 60" height="2%" preserveAspectRatio="none">
                    <path d="M 0,60 L 0,50 C 100,0 300,0 400,50 L 400,60" strokeWidth={0} fill="white" />
                </svg>] : <div class="nav-spacer"></div>}
                <div className="post-header-inner">
                    <h1>{title}</h1>
                </div>
            </header>
            <section className="post-content" onClick={this.handleClick} dangerouslySetInnerHTML={content} />
        </article>;
    }
}
