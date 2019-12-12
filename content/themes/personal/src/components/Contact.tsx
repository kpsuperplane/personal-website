import Component from "inferno-component";
import Icon, { Icons } from "./Icon";

import "./Contact.scss";

export default class Contact extends Component<
	{ hideEmail: boolean | null },
	{}
> {
	public render() {
		return (
			<div className="contact">
				<div className="contact-social">
					<a href="https://github.com/kpsuperplane">
						<Icon icon={Icons.GITHUB} />
					</a>
					<a href="https://stackoverflow.com/users/864528/kevin-pei">
						<Icon icon={Icons.STACKOVERFLOW} />
					</a>
					<a href="https://linkedin.com/in/kpsuperplane">
						<Icon icon={Icons.LINKEDIN} />
					</a>
					<a
						href="/assets/documents/kevin-pei-resume-20191118.pdf"
						className="contact-resume"
					>
						RESUMÉ
					</a>
				</div>
				{!this.props.hideEmail ? (
					<a href="mailto:hello@kevinpei.com" className="contact-email">
						hello@kevinpei.com
					</a>
				) : null}
			</div>
		);
	}
}
