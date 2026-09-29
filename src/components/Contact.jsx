export default function Contact() {
	return (
		<section className="contact" id="contact">
			<div className="container">
				<h2>Get In Touch</h2>
				<p>Feel free to reach out if you're looking for a collaborator, have a question, or just want to connect.</p>

				{/* Netlify form: a static copy in index.html lets Netlify register it at deploy time */}
				<form className="contact-form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
					<input type="hidden" name="form-name" value="contact" />

					{/* Field to prevent spam */}
					<p style={{ display: "none" }}>
						<label>Don't fill this out if you're human: <input name="bot-field" /></label>
					</p>

					<input type="hidden" name="notification-email" value="edoardogamurrini@gmail.com" />

					<div className="form-group">
						<input type="text" name="name" className="form-control" placeholder="Your Name" required />
					</div>
					<div className="form-group">
						<input type="email" name="email" className="form-control" placeholder="Your Email" required />
					</div>
					<div className="form-group">
						<input type="text" name="subject" className="form-control" placeholder="Subject" required />
					</div>
					<div className="form-group">
						<textarea name="message" className="form-control" rows="5" placeholder="Your Message" required></textarea>
					</div>
					<button type="submit" className="submit-btn">Send Message</button>
				</form>

				<div className="social-links">
					<a href="https://www.linkedin.com/in/edoardo-gamurrini/" className="social-link">
						<i style={{ fontSize: "24px" }} className="fa">{""}</i>
					</a>
					<a href="https://github.com/Edo404" className="social-link">
						<i style={{ fontSize: "24px" }} className="fa">{""}</i>
					</a>
				</div>
			</div>
		</section>
	);
}
