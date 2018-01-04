import ellipsize from 'ellipsize';
import Component from 'inferno-component';
import { Link } from 'inferno-router';
import { DateTime } from 'luxon';
import { get } from 'superagent';
import Footer from '../components/Footer';
import GlobalLoader from '../components/GlobalLoader';
import Icon, { Icons } from '../components/Icon';
import LazyImage from '../components/LazyImage';
import Pagination, {PaginationLink} from '../components/Pagination';
import Title from '../components/Title';
import BlogImage from '../img/blog.jpg';
import View from './View';

import './Blog.scss';

export interface PostInterface {
    feature_image: string | null;
    url: string;
    published_at: DateTime;
    title: string;
    excerpt: string;
    featured: boolean;
    forceWait: boolean | null;
}

interface PaginationInterface {
    limit: number;
    next: number | null;
    page: number;
    pages: number;
    prev: number | null;
    total: number;
}

export const Post = (post: PostInterface) => <Link to={post.url} className={'post-preview' + (!post.feature_image ? ' no-image' : '')}>
    {post.feature_image ? <LazyImage path={post.feature_image} forceWait={post.forceWait} loader={true}/> : null}
    <span className="post-preview-body">
        <h3>{post.title}</h3>
        <p><strong>{post.published_at.toLocaleString(DateTime.DATE_FULL)}</strong>{post.excerpt}</p>
    </span>
</Link>;

class PaginationEl extends Component<PaginationInterface, {}> {
    public render() {
        const { page, pages } = this.props;
        return <Pagination>
            <PaginationLink to={'/blog/?page=' + (page - 1)} disabled={page === 1}><Icon icon={Icons.CHEVRON_LEFT}/></PaginationLink>
            <span className="expand" />
            <span>Page {page} of {pages}</span>
            <span className="expand" />
            <PaginationLink to={'/blog/?page=' + (page + 1)} disabled={page === pages}><Icon icon={Icons.CHEVRON_RIGHT}/></PaginationLink>
        </Pagination>;
    }
}

export const getPosts = (page, callback: (posts) => any, withImages = false, limit = 10) => {
    GlobalLoader.queue();
    get(ghost.url.api('posts', {page, filter: withImages ? 'feature_image:-null' : '', limit, fields: 'feature_image, url, published_at, title, custom_excerpt, html'})).end((err, {body}) => {
        GlobalLoader.dequeue(() => {
            if (body.posts.length === 0) {
                callback(null);
            } else {
                callback({
                    pagination: body.meta.pagination,
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
};

export default class Blog extends View<{pagination: PaginationInterface | null, posts: PostInterface[] | null}> {
    private lastPath: string = '';
    constructor(props) {
        super(props);
        this.state = {
            pagination: null,
            posts: null
        };
    }
    private load = () => {
        const page = Number(this.props.params.page || '1');
        if (!Number.isInteger(page) || page < 1) {
            this.context.router.push('/blog/', null);
        }
        this.lastPath = window.location.href;
        getPosts(page, (posts) => {
            if (posts) {
                View.setDark(false);
                window.scrollTo(0, 0);
                this.setState(posts);
            } else {
                this.context.router.push('/blog/', null);
            }
        });
    }
    public componentDidMount() {
        this.load();
        super.componentDidMount();
    }
    public componentDidUpdate() {
        if (window.location.href !== this.lastPath && window.location.href.indexOf('/blog/') !== -1) {
            this.load();
        }
        super.componentDidUpdate();
    }
    public render() {
        const { posts, pagination } = this.state!!;
        return <div>
            <Title title="My Blog" image={BlogImage} />
            {posts ? <div className="blog-entries">{posts.map((post) => <Post {...post} forceWait={true} key={post.url}/>)}</div> : null}
            <PaginationEl {...pagination} />
            {posts ? <Footer /> : null}
        </div>;
    }
}
