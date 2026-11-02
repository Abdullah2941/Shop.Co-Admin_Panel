import { Search, Download, Plus } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import "./ListPageHeader.css";

/**
 * Shared header used by every "list" admin page (Customers, Product
 * Sales, Manage Products) — title/breadcrumb on top, search + actions
 * below. Which buttons show is entirely controlled by props so one
 * component serves three different pages.
 */
export default function ListPageHeader({
  title,
  breadcrumbItems,
  searchValue,
  onSearchChange,
  onDownload,
  addLabel,
  onAdd,
}) {
  return (
    <div className="list-page-header">
      <div className="list-page-header__top">
        <h1 className="page-heading">{title}</h1>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="list-page-header__toolbar">
        <div className="list-page-header__search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="list-page-header__actions">
          {onDownload && (
            <button className="btn btn-outline" onClick={onDownload}>
              <Download size={16} /> Download
            </button>
          )}
          {addLabel && onAdd && (
            <button className="btn btn-primary" onClick={onAdd}>
              <Plus size={16} /> {addLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
