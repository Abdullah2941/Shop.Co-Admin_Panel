import { Layers, ArrowUpRight } from "lucide-react";
import { formatPrice } from "../../utils/format";
import "./EarningCard.css";

export default function EarningCard({ value, label = "Total Earning" }) {
  return (
    <div className="earning-card">
      <div className="earning-card__top">
        <span className="earning-card__icon"><Layers size={18} /></span>
        <span className="earning-card__trend"><ArrowUpRight size={15} /></span>
      </div>
      <p className="earning-card__value">{formatPrice(value)}</p>
      <p className="earning-card__label">{label}</p>
    </div>
  );
}
