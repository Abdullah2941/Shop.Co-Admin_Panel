import { useEffect, useMemo, useState } from "react";
import { Landmark, Users } from "lucide-react";
import { api } from "../api/client";
import EarningCard from "../components/dashboard/EarningCard";
import OrderCard from "../components/dashboard/OrderCard";
import IncomeCard from "../components/dashboard/IncomeCard";
import GrowthChart, { buildMonthlySeries } from "../components/dashboard/GrowthChart";
import PopularStocks from "../components/dashboard/PopularStocks";
import Reveal from "../components/common/Reveal";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Dashboard | SHOP.CO Admin";
    api("/dashboard")
      .then((d) => setStats(d.stats))
      .catch((err) => setError(err.message));
  }, []);

  const series = useMemo(() => buildMonthlySeries(stats?.monthlySales), [stats]);

  if (error) return <div className="dashboard-page"><p className="admin-table__empty" role="alert">{error}</p></div>;
  if (!stats) return <div className="dashboard-page"><p className="admin-table__empty">Loading dashboard…</p></div>;

  return (
    <div className="dashboard-page">
      <Reveal as="h1" className="page-heading">Dashboard</Reveal>

      <div className="dashboard-page__grid">
        <Reveal className="dashboard-page__cell dashboard-page__cell--earning">
          <EarningCard value={stats.deliveredRevenue} label="Delivered Earnings" />
        </Reveal>
        <Reveal delay={60} className="dashboard-page__cell dashboard-page__cell--order">
          <OrderCard value={stats.totalOrders} trend={series.map((m) => ({ v: m.orders }))} />
        </Reveal>
        <Reveal delay={120} className="dashboard-page__cell dashboard-page__cell--income">
          <IncomeCard icon={Landmark} value={stats.totalRevenue} label="Total Sales" variant="blue" />
        </Reveal>
        <Reveal delay={160} className="dashboard-page__cell dashboard-page__cell--income2">
          <IncomeCard icon={Users} value={stats.totalCustomers} label="Customers" variant="gold" money={false} />
        </Reveal>
      </div>

      <div className="dashboard-page__lower">
        <Reveal delay={100} className="dashboard-page__growth"><GrowthChart data={series} /></Reveal>
        <Reveal delay={160} className="dashboard-page__stocks"><PopularStocks products={stats.topProducts} lowStock={stats.lowStock} /></Reveal>
      </div>
    </div>
  );
}
