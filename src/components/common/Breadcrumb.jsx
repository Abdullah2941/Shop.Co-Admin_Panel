import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import "./Breadcrumb.css";

export default function Breadcrumb({ items }) {
  return (
    <nav className="admin-breadcrumb" aria-label="Breadcrumb">
      <Link to="/" className="admin-breadcrumb__home"><Home size={14} /></Link>
      {items.map((item) => (
        <span key={item.label} className="admin-breadcrumb__item">
          <ChevronRight size={14} className="admin-breadcrumb__sep" />
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span className="admin-breadcrumb__current">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
