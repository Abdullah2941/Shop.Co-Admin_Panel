# SHOP.CO Admin — React Admin Panel

A dark-themed admin dashboard for the SHOP.CO store, built with React + Vite.
Companion project to the SHOP.CO storefront — same brand, same product
catalog, run as a separate app (as a real admin panel would be).

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Pages

- **Dashboard** (`/`) — Total Earning / Total Order / Total Income / Net
  Profit stat cards, a stacked "Total Growth" bar chart (Recharts), and a
  Popular Stocks panel.
- **Customers** (`/customers`) — every customer's purchases: ID, name,
  total purchases, product price, quantity, discount, with working
  Edit (modal form) and Delete (confirm dialog) actions.
- **Product Sales** (`/product-sales`) — per-product sales performance:
  units sold, total revenue, category, rating, with a quick-view modal.
- **Products** (`/products`) — the full catalog as a card grid, with
  **+ Add Product** opening a modal (image URL, title, category,
  quantity, price, optional discount, Save/Cancel). Edit re-uses the same
  form pre-filled, deep-linkable at `/products/edit/:productId`.

## React features used

- **Routing**: `react-router-dom` with nested layout routes, `useParams`
  (product edit deep link), `useNavigate`, `useLocation`.
- **Hooks**: `useState`, `useEffect`, `useContext`, `useReducer`,
  `useMemo`, plus custom hooks (`useProducts`, `useInView`).
- **Context**: `ProductsContext` holds the catalog (add/update/delete),
  persisted to `localStorage` so your edits survive a refresh.
- **One component per concern** — see `src/components/` split into
  `layout/`, `common/`, `dashboard/`, `products/`.
- Fully responsive (collapsing sidebar/drawer on mobile) with hover and
  entrance animations throughout.

## Notes

- This is a frontend-only demo: there's no real backend, so "Download"
  exports a CSV client-side and all data lives in `localStorage`.
- The product catalog mirrors the SHOP.CO storefront's 13 products —
  the same placeholder SVG art is reused here for consistency.

## Backend (API) connection
- Backend ka live link `.env` ya Vercel Environment Variable me daalo: `VITE_API_URL=https://<your-backend>/api` (`.env.example` dekho)
- Admin login: `/api/auth/admin-login` (seed wala admin user: ADMIN_EMAIL / ADMIN_PASSWORD)
- Dashboard, Customers, Orders, Product Sales aur Products sab API se aate hain
