export const formatPrice = (value) => `$${Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
export const formatCompact = (value) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `$${Math.round(Number(value || 0) * 100) / 100}`;
};
export const formatPercent = (value) => `${Number(Number(value || 0).toFixed(1))}%`;
export const shortId = (id, prefix = "") => `${prefix}${String(id).slice(-6).toUpperCase()}`;
export const genId = (prefix = "PRD") => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
