import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { api } from "../api/client";
import { formatPrice, shortId } from "../utils/format";
import { downloadCsv } from "../utils/csv";
import ListPageHeader from "../components/common/ListPageHeader";
import Modal from "../components/common/Modal";
import Reveal from "../components/common/Reveal";
import "./Orders.css";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    document.title = "Orders | SHOP.CO Admin";
    api("/orders?limit=100")
      .then((d) => setOrders(d.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      return shortId(o._id).toLowerCase().includes(q) || (o.user?.name || "").toLowerCase().includes(q) || (o.user?.email || "").toLowerCase().includes(q);
    });
  }, [orders, search, statusFilter]);

  const changeStatus = async (order, status) => {
    setError("");
    try {
      const d = await api(`/orders/${order._id}/status`, { method: "PUT", body: { status } });
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, ...d.order, user: o.user } : o)));
    } catch (err) {
      setError(err.message);
    }
  };

  const csvRows = rows.map((o) => ({
    order: shortId(o._id),
    customer: o.user?.name || "(deleted user)",
    email: o.user?.email || "",
    items: o.items.map((i) => `${i.title} x${i.qty}`).join("; "),
    total: o.totalPrice,
    status: o.status,
    date: new Date(o.createdAt).toISOString().slice(0, 10),
  }));

  return (
    <div className="orders-page">
      <ListPageHeader
        title="Orders"
        breadcrumbItems={[{ label: "Orders" }]}
        searchValue={search}
        onSearchChange={setSearch}
        onDownload={() => downloadCsv("orders.csv", csvRows)}
      />

      <div className="orders-page__filter">
        <label>
          Status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {error && <p className="admin-table__empty" role="alert">{error}</p>}

      <Reveal className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o._id}>
                <td>#{shortId(o._id)}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.user?.name || "(deleted user)"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{o.user?.email}</div>
                </td>
                <td>{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                <td>{formatPrice(o.totalPrice)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    className={`orders-page__status orders-page__status--${o.status}`}
                    value={o.status}
                    disabled={o.status === "cancelled"}
                    onChange={(e) => changeStatus(o, e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button className="admin-table__icon-btn" aria-label={`View order ${shortId(o._id)}`} onClick={() => setViewing(o)}><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="admin-table__empty">Loading orders…</p>}
        {!loading && rows.length === 0 && <p className="admin-table__empty">No orders found.</p>}
      </Reveal>

      {viewing && (
        <Modal title={`Order #${shortId(viewing._id)}`} onClose={() => setViewing(null)}>
          <div className="orders-page__detail">
            <ul>
              {viewing.items.map((i, idx) => (
                <li key={idx}>
                  {i.image && <img src={i.image} alt="" />}
                  <div>
                    <strong>{i.title}</strong>
                    <span>{[i.size && `Size ${i.size}`, i.color, `Qty ${i.qty}`].filter(Boolean).join(" · ")}</span>
                  </div>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl>
              <div><dt>Subtotal</dt><dd>{formatPrice(viewing.itemsPrice)}</dd></div>
              {viewing.discountPrice > 0 && <div><dt>Discount ({viewing.promoCode})</dt><dd>-{formatPrice(viewing.discountPrice)}</dd></div>}
              <div><dt>Shipping</dt><dd>{formatPrice(viewing.shippingPrice)}</dd></div>
              <div><dt>Total</dt><dd>{formatPrice(viewing.totalPrice)}</dd></div>
              <div><dt>Payment</dt><dd>{viewing.paymentMethod}{viewing.isPaid ? " (paid)" : ""}</dd></div>
            </dl>
            <p className="orders-page__address">
              <strong>Deliver to:</strong> {viewing.shippingAddress.fullName}, {viewing.shippingAddress.phone}<br />
              {viewing.shippingAddress.address}, {viewing.shippingAddress.city} {viewing.shippingAddress.postalCode}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
