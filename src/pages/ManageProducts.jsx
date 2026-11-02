import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { downloadCsv } from "../utils/csv";
import { CATEGORIES } from "../data/products";
import ListPageHeader from "../components/common/ListPageHeader";
import ProductGridCard from "../components/products/ProductGridCard";
import ProductFormModal from "../components/products/ProductFormModal";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Reveal from "../components/common/Reveal";
import "./ManageProducts.css";

export default function ManageProducts() {
  // /products -> plain list. /products/new -> Add form open.
  // /products/edit/:productId -> Edit form open, pre-filled (a
  // shareable, deep-linkable URL for a specific edit).
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading, error: loadError, addProduct, updateProduct, deleteProduct, getProductById } = useProducts();

  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const categories = useMemo(() => [...new Set([...CATEGORIES, ...products.map((p) => p.category)])], [products]);
  const isAdding = location.pathname === "/products/new";
  const editingProduct = productId ? getProductById(productId) : null;
  const modalOpen = isAdding || Boolean(editingProduct);

  useEffect(() => {
    document.title = "Manage Products | SHOP.CO Admin";
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [products, search]);

  const closeModal = () => navigate("/products");

  const handleSave = async (data) => {
    setFormError("");
    setSaving(true);
    try {
      if (editingProduct) await updateProduct(editingProduct.id, data);
      else await addProduct(data);
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setActionError("");
    try {
      await deleteProduct(pendingDelete.id);
    } catch (err) {
      setActionError(err.message);
    }
    setPendingDelete(null);
  };

  return (
    <div className="manage-products-page">
      <ListPageHeader
        title="Manage Products"
        breadcrumbItems={[{ label: "Products" }]}
        searchValue={search}
        onSearchChange={setSearch}
        onDownload={() => downloadCsv("products.csv", filtered.map(({ image: _image, ...rest }) => rest))}
        addLabel="Add Product"
        onAdd={() => navigate("/products/new")}
      />

      {(loadError || actionError) && <p className="admin-table__empty" role="alert">{loadError || actionError}</p>}
      {loading && <p className="admin-table__empty">Loading products…</p>}

      {filtered.length > 0 ? (
        <div className="manage-products-page__grid">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 12) * 40}>
              <ProductGridCard
                product={p}
                onEdit={() => navigate(`/products/edit/${p.id}`)}
                onDelete={() => setPendingDelete(p)}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        !loading && !loadError && <p className="admin-table__empty">No products match your search.</p>
      )}

      {modalOpen && (
        <Modal title={editingProduct ? `Edit — ${editingProduct.title}` : "Add Product"} onClose={closeModal}>
          <ProductFormModal product={editingProduct} categories={categories} saving={saving} error={formError} onSave={handleSave} onCancel={closeModal} />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete product"
          message={`Delete "${pendingDelete.title}" from the catalog? This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
