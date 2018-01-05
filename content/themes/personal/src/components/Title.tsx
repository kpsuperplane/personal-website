import 'inferno-component';
import './Title.scss';
export const Curve = (props: {}) => {
    return <svg className="title-curve" viewBox="0 0 400 80" height="2%" preserveAspectRatio="none">
        <path d="M 0,80 L 0,50 C 100,0 300,0 400,50 L 400,80" strokeWidth={0} fill="white" />
    </svg>;
};
export default (props: {image: string, title: string, note: string | null}) => <div className="title-wrapper"><header className="title" style={{backgroundImage: 'url(' + props.image + ')'}}>
        <h1>{props.title}</h1>
        {props.note ? <small>{props.note}</small> : null}
    </header>
    <Curve />
</div>;
