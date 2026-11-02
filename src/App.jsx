import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import ProductSales from "./pages/ProductSales";
import ManageProducts from "./pages/ManageProducts";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function RequireAuth() {
  const { isAuthed, booting } = useAuth();
  const location = useLocation();
  if (booting) return <div className="boot-screen">Loading…</div>;
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <AdminLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/product-sales" element={<ProductSales />} />
            <Route path="/products" element={<ManageProducts />} />
            <Route path="/products/new" element={<ManageProducts />} />
            <Route path="/products/edit/:productId" element={<ManageProducts />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/404" element={<Navigate to="/" replace />} />
        </Routes>
      </ProductsProvider>
    </AuthProvider>
  );
}
