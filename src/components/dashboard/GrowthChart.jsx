import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatPrice } from "../../utils/format";
import "./GrowthChart.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Turns the API's list of months-with-sales into 12 bars ending this month
export function buildMonthlySeries(monthlySales = []) {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const hit = monthlySales.find((m) => m.year === d.getFullYear() && m.month === d.getMonth() + 1);
    return { month: MONTHS[d.getMonth()], sales: hit?.sales || 0, orders: hit?.orders || 0 };
  });
}

export default function GrowthChart({ data }) {
  const total = data.reduce((sum, m) => sum + m.sales, 0);

  return (
    <div className="growth-chart card">
      <div className="growth-chart__header">
        <div>
          <p className="growth-chart__eyebrow">Sales (last 12 months)</p>
          <p className="growth-chart__total">{formatPrice(total)}</p>
        </div>
      </div>

      <div className="growth-chart__canvas">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} barSize={16}>
            <CartesianGrid stroke="#2a2e52" vertical={false} />
            <XAxis dataKey="month" stroke="#6b6e93" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke="#6b6e93" tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip contentStyle={{ background: "#1b1e3a", border: "1px solid #2a2e52", borderRadius: 10, fontSize: 12 }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="sales" name="Sales ($)" fill="#7b5fe0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
