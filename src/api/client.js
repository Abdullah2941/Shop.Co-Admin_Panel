// ─────────────────────────────────────────────────────────────
//  Backend connection. Put your LIVE backend link in a .env file or
//  as a Vercel Environment Variable named VITE_API_URL
//  e.g.  VITE_API_URL=https://your-backend.onrender.com/api
// ─────────────────────────────────────────────────────────────
const BASE = (import.meta.env.VITE_API_URL || "https://shop-co-backend-psi.vercel.app/api").replace(/\/$/, "");

const TOKEN_KEY = "shopco-admin-token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Cannot reach the server. Please check your connection and try again.", 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    if ((res.status === 401 || res.status === 403) && auth && token) window.dispatchEvent(new Event("admin:unauthorized"));
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status);
  }
  return data;
}

// image paths like "/images/x.svg" only exist on this site, so make them absolute
// (the storefront shows the same product from a different domain)
const absoluteImage = (src) => (src && src.startsWith("/") ? window.location.origin + src : src);

// backend product -> shape the admin pages already use
export function fromApiProduct(p) {
  return {
    id: p.id || p._id,
    title: p.title,
    category: p.category,
    price: p.price,
    discount: p.discount || 0,
    quantity: p.stock ?? 0,
    unitsSold: p.sold ?? 0,
    rating: p.rating || 0,
    image: p.image || p.images?.[0] || "",
    style: p.style || "casual",
    description: p.description || "",
  };
}

// admin form data -> backend body
export function toApiProduct(d) {
  const image = absoluteImage(d.image);
  return {
    title: d.title,
    category: d.category,
    price: d.price,
    discount: d.discount,
    stock: d.quantity,
    image,
    images: image ? [image] : [],
    style: d.style,
    description: d.description,
  };
}
