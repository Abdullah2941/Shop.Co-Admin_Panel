import { formatCompact } from "../../utils/format";
import "./IncomeCard.css";

// One reusable card, driven entirely by props. `money={false}` shows a plain number.
export default function IncomeCard({ icon: Icon, value, label, variant = "blue", money = true }) {
  return (
    <div className={`income-card income-card--${variant}`}>
      <span className="income-card__icon"><Icon size={18} /></span>
      <div>
        <p className="income-card__value">{money ? formatCompact(value) : value}</p>
        <p className="income-card__label">{label}</p>
      </div>
    </div>
  );
}
