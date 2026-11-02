import { useInView } from "../../hooks/useInView";

export default function Reveal({ children, delay = 0, className = "", as: Tag = "div", ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${inView ? "reveal--visible" : ""} ${className}`.trim()} style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }} {...rest}>
      {children}
    </Tag>
  );
}
