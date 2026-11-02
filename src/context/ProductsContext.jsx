import { createContext, useCallback, useEffect, useState } from "react";
import { api, fromApiProduct, toApiProduct } from "../api/client";
import { useAuth } from "./AuthContext";

export const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const { isAuthed } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const d = await api("/products?limit=500", { auth: false });
      setProducts(d.products.map(fromApiProduct));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthed) load();
    else setProducts([]);
  }, [isAuthed, load]);

  // add / update / delete all throw on failure so the page can show the message
  const addProduct = async (data) => {
    const d = await api("/products", { method: "POST", body: toApiProduct(data) });
    setProducts((prev) => [fromApiProduct(d.product), ...prev]);
  };
  const updateProduct = async (id, data) => {
    const d = await api(`/products/${id}`, { method: "PUT", body: toApiProduct(data) });
    setProducts((prev) => prev.map((p) => (p.id === id ? fromApiProduct(d.product) : p)));
  };
  const deleteProduct = async (id) => {
    await api(`/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  const getProductById = (id) => products.find((p) => p.id === id);

  return (
    <ProductsContext.Provider value={{ products, loading, error, reload: load, addProduct, updateProduct, deleteProduct, getProductById }}>
      {children}
    </ProductsContext.Provider>
  );
}
