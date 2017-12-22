import 'inferno-component';
import { Link } from 'inferno-router';
import './Pagination.scss';
export const PaginationLink = (props: {disabled: boolean | null, to: string, children: any}) => (props.disabled ? <span>{props.children}</span> : <Link to={props.to}>{props.children}</Link>);
export default (props: {children: any}) => (<div className="pagination">{props.children}</div>);
