import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format";
import "./PopularStocks.css";

export default function PopularStocks({ products = [], lowStock = [] }) {
  const [featured, ...rest] = products;

  return (
    <div className="popular-stocks card">
      <div className="popular-stocks__header">
        <h3>Top Selling Products</h3>
      </div>

      {!featured ? (
        <p className="admin-table__empty">No sales yet. Orders will show up here.</p>
      ) : (
        <>
          <div className="popular-stocks__featured">
            <div className="popular-stocks__featured-top">
              <div>
                <p className="popular-stocks__featured-name">{featured.title}</p>
                <p className="popular-stocks__featured-price">{formatPrice(featured.price * (1 - (featured.discount || 0) / 100))}</p>
              </div>
              <span className="popular-stocks__profit-tag">{featured.sold} sold</span>
            </div>
          </div>

          <ul className="popular-stocks__list">
            {rest.map((p) => (
              <li key={p.id} className="popular-stocks__row">
                <span className="popular-stocks__row-name">{p.title}</span>
                <div className="popular-stocks__row-right">
                  <span className="popular-stocks__row-price">{formatPrice(p.price * (1 - (p.discount || 0) / 100))}</span>
                  <span className="popular-stocks__row-change popular-stocks__row-change--up">{p.sold} sold</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {lowStock.length > 0 && (
        <p style={{ fontSize: 12, color: "var(--warning)", margin: "12px 0 0" }}>
          Low stock: {lowStock.map((p) => `${p.title} (${p.stock})`).join(", ")}
        </p>
      )}

      <Link to="/product-sales" className="popular-stocks__view-all">View All &rarr;</Link>
    </div>
  );
}
