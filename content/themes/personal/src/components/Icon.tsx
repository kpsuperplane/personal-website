import Component from 'inferno-component';

export enum Icons {
    HOME = 'home',
    ABOUT = 'info',
    PALETTE = 'palette',
    OPEN_BOOK = 'import_contacts'
}
export default class Icon extends Component<{icon: Icons, [key: string]: any}, {}> {
    public render() {
        return  <i {...this.props} className={'material-icons' + (this.props.className ? ' ' + this.props.className : '')}>{this.props.icon}</i>;
    }
}