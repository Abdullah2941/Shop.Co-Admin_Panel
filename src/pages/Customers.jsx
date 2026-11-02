import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { api } from "../api/client";
import { formatPrice, shortId } from "../utils/format";
import { downloadCsv } from "../utils/csv";
import ListPageHeader from "../components/common/ListPageHeader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Modal from "../components/common/Modal";
import Reveal from "../components/common/Reveal";
import "./Customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "Customers | SHOP.CO Admin";
    api("/users/customers")
      .then((d) => setCustomers(d.customers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || shortId(c.id, "CUS-").toLowerCase().includes(q));
  }, [customers, search]);

  const handleDelete = async () => {
    try {
      await api(`/users/${pendingDelete.id}`, { method: "DELETE" });
      setCustomers((prev) => prev.filter((c) => c.id !== pendingDelete.id));
    } catch (err) {
      setError(err.message);
    }
    setPendingDelete(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setSaving(true);
    try {
      const d = await api(`/users/${editing.id}`, { method: "PUT", body: { name: form.get("name"), isActive: form.get("isActive") === "on" } });
      setCustomers((prev) => prev.map((c) => (c.id === editing.id ? { ...c, name: d.user.name, isActive: d.user.isActive } : c)));
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const csvRows = filtered.map((c) => ({ id: c.id, name: c.name, email: c.email, orders: c.orders, items: c.items, totalSpent: c.spent, active: c.isActive }));

  return (
    <div className="customers-page">
      <ListPageHeader
        title="Customers"
        breadcrumbItems={[{ label: "Customers" }]}
        searchValue={search}
        onSearchChange={setSearch}
        onDownload={() => downloadCsv("customers.csv", csvRows)}
      />

      {error && <p className="admin-table__empty" role="alert">{error}</p>}

      <Reveal className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Orders</th>
              <th>Items Bought</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>#{shortId(c.id, "CUS-")}</td>
                <td>
                  <div className="admin-table__name-cell">
                    <span className="customers-page__avatar">{c.name.charAt(0)}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td>{c.orders}</td>
                <td>{c.items}</td>
                <td>{formatPrice(c.spent)}</td>
                <td style={{ color: c.isActive ? "var(--success)" : "var(--danger)" }}>{c.isActive ? "Active" : "Disabled"}</td>
                <td>
                  <div className="admin-table__actions">
                    <button className="admin-table__icon-btn" aria-label={`Edit ${c.name}`} onClick={() => setEditing(c)}><Pencil size={16} /></button>
                    <button className="admin-table__icon-btn admin-table__icon-btn--danger" aria-label={`Delete ${c.name}`} onClick={() => setPendingDelete(c)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="admin-table__empty">Loading customers…</p>}
        {!loading && filtered.length === 0 && <p className="admin-table__empty">No customers found.</p>}
      </Reveal>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete customer"
          message={`Delete the account of "${pendingDelete.name}"? This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {editing && (
        <Modal title={`Edit customer — ${editing.name}`} onClose={() => setEditing(null)}>
          <form className="customers-page__form" onSubmit={handleSaveEdit}>
            <label>
              Name
              <input name="name" defaultValue={editing.name} required />
            </label>
            <label style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input name="isActive" type="checkbox" defaultChecked={editing.isActive} style={{ width: 18, height: 18 }} />
              Account active (untick to block login)
            </label>
            <div className="customers-page__form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
