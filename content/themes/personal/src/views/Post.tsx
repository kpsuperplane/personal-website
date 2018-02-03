import * as hljs from 'highlight.js/lib/highlight.js';
const languages = ['cpp', 'java', 'javascript', 'json', 'kotlin', 'markdown', 'php', 'python', 'rust', 'shell', 'sql', 'swift', 'tex', 'typescript', 'yaml'];
for (const language of languages) {
    hljs.registerLanguage(language, require('highlight.js/lib/languages/' + language));
}
import { DateTime } from 'luxon';
import postscribe from 'postscribe';
import { get } from 'superagent';
import Footer from '../components/Footer';
import GlobalLoader from '../components/GlobalLoader';
import LazyImage from '../components/LazyImage';
import View from './View';

import './Post.scss';

export default class Post extends View<{content: any | null,  image: string | null, title: string, published_at: string}> {
    private lastPath: string = '';
    constructor(props) {
        super('post', props);
        this.state = {
            content: null,
            image: null,
            published_at: '',
            title: ''
        };
        this.load();
    }
    private renderPost = (post) => {
        delete (window as any).instgrm;
        window.scrollTo(0, 0);
        const published_at = DateTime.fromISO(post.published_at);
        View.setDark(post.feature_image);
        let html = post.html;
        const scripts: Array<{id: number, match: string}> = [];
        html = html.replace(/<script(.*)><\/script>/gi, (match) => {
            const id = scripts.length;
            scripts.push({id, match});
            return '<div id="script-' + id + '" class="' + (match.indexOf(' constrain-width ') !== 0 ? 'constrained-script' : '') + '"></div>';
        });
        console.log(html);
        this.setState({content: {__html: html},
            image: post.feature_image || null,
            published_at: post.page ? '' : (post.tags.indexOf('project-page') === -1 ? published_at.toLocaleString(DateTime.DATE_FULL) : published_at.toFormat('MMMM kkkk')),
            title: post.title
        }, () => {
            for (const script of scripts) {
                postscribe('#script-' + script.id, script.match);
            }
            const postElement = document.getElementsByClassName('post')[0];
            for (const block of postElement.getElementsByTagName('pre')) {
                hljs.highlightBlock(block);
            }
            for (const el of postElement.getElementsByTagName('iframe')) {
                const wrapper = document.createElement('div');
                wrapper.classList.add('iframe-wrapper');
                const innerWrapper = document.createElement('div');
                innerWrapper.classList.add('iframe-inner-wrapper');
                wrapper.appendChild(innerWrapper);
                el.parentNode!!.insertBefore(wrapper, el);
                innerWrapper.appendChild(el);
            }
        });
    }
    private load = () => {
        if ((window as any).post) {
            setTimeout(() => this.renderPost((window as any).post), 0);
        }
        this.lastPath = window.location.pathname;
        GlobalLoader.queue();
        get(ghost.url.api('posts', {filter: 'page:[false,true]+slug:' + this.lastPath.replace(/\//g, ''), include: 'tags'})).end((err, {body}) => {
            GlobalLoader.dequeue(() => {
                if (body && body.posts && body.posts.length > 0) {
                    const post = body.posts[0];
                    this.renderPost(post);
                } else {
                    // this.context.router.push('/', null);
                }
            });
        });
    }
    public componentDidUpdate() {
        if (window.location.pathname !== this.lastPath && !(window.location.pathname in ['blog', 'projects'])) {
            this.load();
        }
        super.componentDidUpdate();
    }
    private handleClick = (e) => {
        if (e.target && e.target.tagName === 'A' && e.target.attributes && e.target.attributes.href && !(e.target.attributes.target && e.target.attributes.target !== '_self')) {
            const target = e.target.attributes.href.value;
            if (target.indexOf('http') !== 0 || target.indexOf(window.location.host) !== -1) {
                e.preventDefault();
                this.context.router.push(target, e.target.textContent);
            }
        }
    }
    public render() {
        const { content, title, image, published_at } = this.state!!;
        return <div><article className="post">
            <header className={'post-header' + (image ? ' has-feature-image' : '')}>
                {image ? [
                    <LazyImage path={image} />,
                    <svg className="post-header-curve" viewBox="0 0 400 60" height="2%" preserveAspectRatio="none">
                    <path d="M 0,60 L 0,50 C 100,0 300,0 400,50 L 400,60" strokeWidth={0} fill="white" />
                </svg>] : <div className="navigation-mobile-spacer navigation-desktop-spacer" />}
                <div className="post-header-inner">
                    <h1>{title}</h1>
                    {published_at ? <h5>{published_at}</h5> : null}
                </div>
            </header>
            <section className="post-content" onClick={this.handleClick} dangerouslySetInnerHTML={content} />
        </article>
        {content ? <Footer /> : null}</div>;
    }
}
