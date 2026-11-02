import { ShoppingBag } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import "./OrderCard.css";

// `trend` = orders per month (last 12 months), `value` = total orders
export default function OrderCard({ value, trend = [] }) {
  const data = trend.length > 1 ? trend : [{ v: 0 }, { v: 0 }];
  return (
    <div className="order-card">
      <div className="order-card__top">
        <span className="order-card__icon"><ShoppingBag size={17} /></span>
      </div>
      <p className="order-card__value">{value}</p>
      <p className="order-card__label">Total Orders</p>
      <div className="order-card__spark">
        <ResponsiveContainer width="100%" height={46}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8ab4ff" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#8ab4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#8ab4ff" strokeWidth={2} fill="url(#sparkFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
