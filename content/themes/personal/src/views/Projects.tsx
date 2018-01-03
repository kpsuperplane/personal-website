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
import ProjectImage from '../img/projects.jpg';
import View from './View';

import './Projects.scss';

export interface ProjectInterface {
    feature_image: string | null;
    url: string;
    published_at: DateTime;
    title: string;
    theme: string;
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

export const Project = (project: ProjectInterface) => <Link to={project.url} className="project-preview">
    <LazyImage path={project.feature_image} forceWait={project.forceWait} loader={true}/>
    <div className="project-preview-theme" style={{backgroundColor: project.theme}} />
    <div className="project-preview-gradient" />
    <span className="project-preview-body">
        <h3>{project.title}</h3>
        <p>{project.published_at.toFormat('MMMM kkkk')}</p>
    </span>
</Link>;

class PaginationEl extends Component<PaginationInterface, {}> {
    public render() {
        const { page, pages } = this.props;
        return <Pagination>
            <PaginationLink to={'/projects/?page=' + (page - 1)} disabled={page === 1}><Icon icon={Icons.CHEVRON_LEFT}/></PaginationLink>
            <span className="expand" />
            <span>Page {page} of {pages}</span>
            <span className="expand" />
            <PaginationLink to={'/projects/?page=' + (page + 1)} disabled={page === pages}><Icon icon={Icons.CHEVRON_RIGHT}/></PaginationLink>
        </Pagination>;
    }
}

export const getProjects = (page, callback: (projects) => any, limit = 10) => {
    GlobalLoader.queue();
    get(ghost.url.api('posts', {page, filter: 'page:true+tag:[project-page]', limit, include: 'tags'})).end((err, {body}) => {
        GlobalLoader.dequeue(() => {
            if (body.posts.length === 0) {
                callback(null);
            } else {
                callback({
                    pagination: body.meta.pagination,
                    projects: body.posts.map((project) => ({
                        feature_image: project.feature_image,
                        featured: project.featured,
                        published_at: DateTime.fromISO(project.published_at),
                        theme: project.tags.find((tag) => tag.name[0] === '#').name,
                        title: project.title,
                        url: project.url
                    }))
                });
            }
        });
    });
};

export default class Projects extends View<{pagination: PaginationInterface | null, projects: ProjectInterface[] | null}> {
    private lastPath: string = '';
    constructor(props) {
        super(props);
        this.state = {
            pagination: null,
            projects: null
        };
    }
    private load = () => {
        const page = Number(this.props.params.page || '1');
        if (!Number.isInteger(page) || page < 1) {
            this.context.router.push('/projects/', null);
        }
        this.lastPath = window.location.href;
        getProjects(page, (projects) => {
            if (projects) {
                View.setDark(true);
                window.scrollTo(0, 0);
                this.setState(projects);
            } else {
                this.context.router.push('/projects/', null);
            }
        });
    }
    public componentDidMount() {
        this.load();
    }
    public componentDidUpdate(props) {
        if (window.location.href !== this.lastPath && window.location.href.indexOf('/projects/') !== -1) {
            this.load();
        }
    }
    public render() {
        const { projects, pagination } = this.state!!;
        return <div>
            <Title title="Projects" image={ProjectImage} note="Photo: JK Liu" />
            {projects ? <div className="project-entries">{projects.map((post) => <Project {...post} key={post.url}/>)}</div> : null}
            <PaginationEl {...pagination} />
            {projects ? <Footer /> : null}
        </div>;
    }
}
