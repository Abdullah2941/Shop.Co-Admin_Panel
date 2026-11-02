import { Link } from "react-router-dom";
import "./NotFound.css";
export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h1>Page not found</h1>
      <p className="not-found__text">This admin page doesn't exist or may have moved.</p>
      <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
    </div>
  );
}
