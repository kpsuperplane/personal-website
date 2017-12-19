import Component from 'inferno-component';
import { Link } from 'inferno-router';

import Contact from './Contact';
import LazyImage from './LazyImage';

import FooterProfile from '../img/profile-footer.png';

import './Footer.scss';

export default class Footer extends Component<{}, {hover: boolean}> {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
    }
    private onTouchStart = () => {
        this.setState({hover: true});
    }
    private onTouchEnd = () => {
        this.setState({hover: false});
    }
    public render() {
        return (<footer className="footer">
            <Link to="/about" onMouseEnter={this.onTouchStart} onMouseLeave={this.onTouchEnd} onClick={this.onTouchEnd} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} className={'footer-about' + (this.state!!.hover ? ' touched' : '')}><LazyImage path={FooterProfile} /></Link>
            <p>Skiing like a madman, git committing with passion, and coding for the betterment of society.</p>
            <Contact />
        </footer>);
    }
}
