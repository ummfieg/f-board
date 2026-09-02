function SwitchToggle({
  checked = false,
  className = "",
  label,
  onChange,
}) {
  return (
    <button
      aria-checked={checked}
      className={[
        "inline-flex items-center gap-2 text-xs transition-colors hover:text-black",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black",
        checked ? "text-black" : "text-gray-500",
        className,
      ].join(" ")}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span>{label}</span>
      <span
        className={[
          "relative h-4 w-8 rounded-full border transition-colors",
          checked ? "border-black bg-white" : "border-gray-300 bg-white",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-0.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full transition-transform",
            checked ? "translate-x-4 bg-black" : "translate-x-0 bg-gray-300",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

export default SwitchToggle;
