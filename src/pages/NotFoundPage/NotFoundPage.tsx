import { Link } from "react-router-dom";

import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="page not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">This page is not in our catalog</h1>
      <Link className="button button--primary" to="/">
        Back to home
      </Link>
    </div>
  );
}

export default NotFoundPage;
