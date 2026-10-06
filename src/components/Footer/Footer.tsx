import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">
          Cinema<span>Guide</span>
        </span>
        <span>Portfolio project · React, TypeScript, Vite</span>
        <span>Movie data: CinemaGuide API</span>
      </div>
    </footer>
  );
}

export default Footer;
