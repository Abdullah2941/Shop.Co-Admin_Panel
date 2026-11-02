import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, TrendingUp, ShoppingBag, ClipboardList, Settings, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/product-sales", label: "Product Sales", icon: TrendingUp },
  { to: "/products", label: "Products", icon: ShoppingBag },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { logout } = useAuth();
  return (
    <>
      {mobileOpen && <div className="sidebar__backdrop" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__top">
          <span className="sidebar__logo">
            SHOP.CO<span className="sidebar__logo-accent">Admin</span>
          </span>
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
              onClick={onClose}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__bottom">
          <button className="sidebar__link"><Settings size={19} /><span>Settings</span></button>
          <button className="sidebar__link" onClick={logout}><LogOut size={19} /><span>Logout</span></button>
        </div>
      </aside>
    </>
  );
}
