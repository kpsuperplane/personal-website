import { get } from 'superagent';
import GlobalLoader from '../components/GlobalLoader';
import View from './View';

export default class Post extends View<{content: any | null}> {
    private lastPath: string = '';
    constructor(props) {
        super(props);
        this.state = {
            content: null
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
                    this.setState({content: {__html: post.html}});
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
        const { content } = this.state!!;
        return <div>
            <div class="nav-spacer"></div>
            <div onClick={this.handleClick} dangerouslySetInnerHTML={content} />
        </div>;
    }
}
