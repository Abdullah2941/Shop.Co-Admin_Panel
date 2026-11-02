import { Pencil, Trash2 } from "lucide-react";
import { formatPrice, formatPercent } from "../../utils/format";
import "./ProductGridCard.css";

export default function ProductGridCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-grid-card">
      <div className="product-grid-card__image-wrap">
        <img src={product.image} alt={product.title} />
        {product.discount > 0 && <span className="product-grid-card__badge">-{formatPercent(product.discount)}</span>}
      </div>
      <div className="product-grid-card__body">
        <h3>{product.title}</h3>
        <p className="product-grid-card__category">{product.category}</p>
        <div className="product-grid-card__row">
          <span className="product-grid-card__price">{formatPrice(product.price)}</span>
          <span className="product-grid-card__qty">{product.quantity} in stock</span>
        </div>
        <div className="product-grid-card__actions">
          <button className="btn btn-outline" onClick={onEdit}><Pencil size={14} /> Edit</button>
          <button className="btn btn-danger" onClick={onDelete}><Trash2 size={14} /> Delete</button>
        </div>
      </div>
    </div>
  );
}
