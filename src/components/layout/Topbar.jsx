import { useEffect, useRef, useState } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Topbar.css";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="topbar">
      <button className="topbar__burger" onClick={onMenuClick} aria-label="Open menu"><Menu size={22} /></button>

      <div className="topbar__search">
        <Search size={17} />
        <input
          type="search"
          placeholder="Search orders, products, customers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="topbar__actions">
        <button className="topbar__icon-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="topbar__dot" />
        </button>
        <div className="topbar__profile" ref={menuRef}>
          <button className="topbar__profile-btn" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen}>
            <span className="topbar__avatar">{(user?.name || "A")[0].toUpperCase()}</span>
            <span className="topbar__profile-name">{user?.name || "Admin"}</span>
            <ChevronDown size={15} className={menuOpen ? "rotate" : ""} />
          </button>
          {menuOpen && (
            <div className="topbar__menu">
              <button>My Profile</button>
              <button>Store Settings</button>
              <button onClick={logout}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
