import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { formatPrice } from "../utils/format";
import { downloadCsv } from "../utils/csv";
import ListPageHeader from "../components/common/ListPageHeader";
import Modal from "../components/common/Modal";
import Reveal from "../components/common/Reveal";
import "./ProductSales.css";

function StarsDisplay({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="product-sales__stars" aria-label={`${rating} out of 5`}>
      {"★".repeat(full)}
      <span className="product-sales__stars--empty">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export default function ProductSales() {
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    document.title = "Product Sales | SHOP.CO Admin";
  }, []);

  const rows = useMemo(() => {
    const withRevenue = products.map((p) => ({
      ...p,
      totalPrice: p.unitsSold * p.price * (1 - p.discount / 100),
    }));
    const q = search.trim().toLowerCase();
    const filteredRows = q ? withRevenue.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : withRevenue;
    return [...filteredRows].sort((a, b) => b.unitsSold - a.unitsSold);
  }, [products, search]);

  return (
    <div className="product-sales-page">
      <ListPageHeader
        title="Product Sales"
        breadcrumbItems={[{ label: "Product Sales" }]}
        searchValue={search}
        onSearchChange={setSearch}
        onDownload={() => downloadCsv("product-sales.csv", rows.map(({ image: _image, ...rest }) => rest))}
      />

      <Reveal className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity Sold</th>
              <th>Total Price</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="admin-table__name-cell">
                    <img src={p.image} alt="" className="admin-table__avatar" />
                    <span style={{ fontWeight: 600 }}>{p.title}</span>
                  </div>
                </td>
                <td>{p.category}</td>
                <td>{p.unitsSold}</td>
                <td>{formatPrice(p.totalPrice)}</td>
                <td><StarsDisplay rating={p.rating} /></td>
                <td>
                  <button className="admin-table__icon-btn" aria-label={`View ${p.title}`} onClick={() => setViewing(p)}><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="admin-table__empty">No products match your search.</p>}
      </Reveal>

      {viewing && (
        <Modal title={viewing.title} onClose={() => setViewing(null)}>
          <div className="product-sales__preview">
            <img src={viewing.image} alt={viewing.title} />
            <dl>
              <div><dt>Category</dt><dd>{viewing.category}</dd></div>
              <div><dt>Price</dt><dd>{formatPrice(viewing.price)}</dd></div>
              <div><dt>Units sold</dt><dd>{viewing.unitsSold}</dd></div>
              <div><dt>In stock</dt><dd>{viewing.quantity}</dd></div>
              <div><dt>Rating</dt><dd>{viewing.rating.toFixed(1)} / 5</dd></div>
            </dl>
          </div>
        </Modal>
      )}
    </div>
  );
}
