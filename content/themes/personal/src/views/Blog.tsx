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
import View from './View';

import './Blog.scss';

interface PostInterface {
    feature_image: string | null;
    url: string;
    published_at: Date;
    title: string;
    excerpt: string;
    featured: boolean;
}

interface PaginationInterface {
    limit: number;
    next: number | null;
    page: number;
    pages: number;
    prev: number | null;
    total: number;
}

const Post = (post: PostInterface) => <Link to={post.url} className={'post-preview' + (!post.feature_image ? ' no-image' : '')}>
    {post.feature_image ? <LazyImage path={post.feature_image} forceWaitSize={true} loader={true}/> : null}
    <span className="post-preview-body">
        <h3>{post.title}</h3>
        <p><strong>{post.published_at.toLocaleString(DateTime.DATE_FULL)}</strong>{post.excerpt}</p>
    </span>
</Link>;

class PaginationEl extends Component<PaginationInterface, {}> {
    private navigate = ({target: {value}}) => {
        this.context.router.push('/blog/?page=' + value, null);
    }
    public render() {
        const { page, pages } = this.props;
        return <Pagination>
            <PaginationLink to={'/blog/?page=' + (page - 1)} disabled={page === 1}><Icon icon={Icons.CHEVRON_LEFT}/></PaginationLink>
            <span className="expand" />
            <select onChange={this.navigate} style={{paddingRight: 0}} className="pagination-element" selected={pages}>
                {Array.from(new Array(pages), (val, index) =>
                    <option key={index} value={index + 1}>Page {index + 1}</option>)}
            </select>
            <div className="pagination-element" style={{paddingLeft: 0}}>/{pages}</div>
            <span className="expand" />
            <PaginationLink to={'/blog/?page=' + (page + 1)} disabled={page === pages}><Icon icon={Icons.CHEVRON_RIGHT}/></PaginationLink>
        </Pagination>;
    }
}

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
        GlobalLoader.queue(true);
        get(ghost.url.api('posts', {page, filter: 'page:false', fields: 'feature_image, url, published_at, title, custom_excerpt, featured, html'})).end((err, {body}) => {
            GlobalLoader.dequeue(() => {
                if (body.posts.length === 0) {
                    this.context.router.push('/blog/', null);
                } else {
                    window.scrollTo(0, 0);
                    this.setState({
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
    }
    public componentDidMount() {
        this.load();
    }
    public componentDidUpdate(props) {
        if (window.location.href !== this.lastPath) {
            this.load();
        }
    }
    public render() {
        const { posts, pagination } = this.state!!;
        return <div>
            {(posts && posts[0] && !posts[0].feature_image) ? <div className="nav-spacer"></div> : null}
            {posts ? posts.map((post) => <Post {...post} key={post.url}/>) : null}
            <PaginationEl {...pagination} />
            {posts ? <Footer /> : null}
        </div>;
    }
}
