import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { PLACEHOLDER_IMAGE, CATEGORIES, STYLES } from "../../data/products";
import "./ProductFormModal.css";

/**
 * One form, two jobs: passing `product` renders it pre-filled for
 * editing; leaving it out renders a blank "Add Product" form. Both
 * pages just call the same `onSave(data)` callback.
 */
export default function ProductFormModal({ product, categories = CATEGORIES, saving = false, error = "", onSave, onCancel }) {
  const [image, setImage] = useState(product?.image || "");
  const [title, setTitle] = useState(product?.title || "");
  const [category, setCategory] = useState(product?.category || categories[0]);
  const [style, setStyle] = useState(product?.style || "casual");
  const [description, setDescription] = useState(product?.description || "");
  const [quantity, setQuantity] = useState(product?.quantity ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [discount, setDiscount] = useState(product?.discount ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      image: image.trim() || PLACEHOLDER_IMAGE,
      title: title.trim(),
      category,
      style,
      description: description.trim(),
      quantity: Number(quantity) || 0,
      price: Number(price) || 0,
      discount: Number(discount) || 0,
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form__image-row">
        <div className="product-form__preview">
          {image ? <img src={image} alt="" /> : <ImagePlus size={26} />}
        </div>
        <label className="product-form__field product-form__field--grow">
          Image URL
          <input
            type="text"
            placeholder="/images/products/your-image.svg or https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>
      </div>

      <label className="product-form__field">
        Title
        <input type="text" required placeholder="e.g. Oversized Denim Jacket" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="product-form__field">
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label className="product-form__field">
        Store style <span className="product-form__optional">(shown on the website)</span>
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          {STYLES.map((st) => <option key={st} value={st}>{st[0].toUpperCase() + st.slice(1)}</option>)}
        </select>
      </label>

      <div className="product-form__row">
        <label className="product-form__field">
          Quantity in stock
          <input type="number" min="0" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <label className="product-form__field">
          Price ($)
          <input type="number" min="0" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
      </div>

      <label className="product-form__field">
        Discount % <span className="product-form__optional">(optional)</span>
        <input type="number" min="0" max="90" step="any" placeholder="0" value={discount} onChange={(e) => setDiscount(e.target.value)} />
      </label>

      <label className="product-form__field">
        Description <span className="product-form__optional">(optional)</span>
        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{error}</p>}

      <div className="product-form__actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}
