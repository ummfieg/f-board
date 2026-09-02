function SegmentedToggle({
  ariaLabel,
  className = "",
  onChange,
  options,
  value,
}) {
  return (
    <div
      aria-label={ariaLabel}
      className={[
        "inline-flex rounded-md border border-gray-300 bg-white p-0.5",
        className,
      ].join(" ")}
      role="group"
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            aria-pressed={isSelected}
            className={[
              "min-w-12 rounded-[4px] px-3 py-1 text-xs transition-colors",
              isSelected
                ? "bg-black text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-black",
            ].join(" ")}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedToggle;
