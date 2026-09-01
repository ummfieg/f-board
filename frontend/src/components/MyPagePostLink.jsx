import { Link } from "react-router-dom";

function MyPagePostLink({ children, className = "", to }) {
  return (
    <Link
      className={[
        "flex items-center gap-2 text-sm text-black no-underline transition-colors hover:text-[#d4d4d4]",
        className,
      ].join(" ")}
      to={to}
    >
      <span className="h-1 w-1 shrink-0 rounded-full bg-[#d4d4d4]" />
      {children}
    </Link>
  );
}

export default MyPagePostLink;
