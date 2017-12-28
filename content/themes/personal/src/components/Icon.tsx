import Component from 'inferno-component';

export enum Icons {
    ABOUT = 'fas fa-info-circle',
    CHEVRON_LEFT = 'fas fa-chevron-left',
    CHEVRON_RIGHT = 'fas fa-chevron-right',
    CHEVRON_UP = 'fas fa-chevron-up',
    GITHUB = 'fab fa-github',
    HOME = 'fas fa-home',
    LINKEDIN = 'fab fa-linkedin',
    NEWSPAPER = 'fas fa-newspaper',
    OPEN_BOOK = 'fas fa-book',
    PALETTE = 'fas fa-coffee',
    STACKOVERFLOW = 'fab fa-stack-overflow'
}
export default class Icon extends Component<{icon: Icons, [key: string]: any}, {}> {
    public render() {
        return  <i {...this.props} className={this.props.icon + (this.props.className ? ' ' + this.props.className : '')}></i>;
    }
}
