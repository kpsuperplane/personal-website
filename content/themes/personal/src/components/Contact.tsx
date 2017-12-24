import Component from 'inferno-component';
import Icon, {Icons} from './Icon';

import './Contact.scss';

export default class Contact extends Component<{}, {}> {
    public render() {
        return (<div className="contact">
            <div className="contact-social">
                <a href="https://github.com/kpsuperplane"><Icon icon={Icons.GITHUB}/></a>
                <a href="https://stackoverflow.com/users/864528/kevin-pei"><Icon icon={Icons.STACKOVERFLOW}/></a>
                <a href="https://linkedin.com/in/kpsuperplane"><Icon icon={Icons.LINKEDIN}/></a>
                <a href="https://kevinpei.com/assets/documents/kevin-pei-resume-public.pdf" className="contact-resume">RESUMÉ</a>
            </div>
            <a href="mailto:hello@kevinpei.com" className="contact-email">hello@kevinpei.com</a>
        </div>);
    }
}
