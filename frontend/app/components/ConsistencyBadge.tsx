type ConsistencyBadgeProps = {
  scores: number[];
};

function getAgreement(scores: number[]) {
  const spread = Math.max(...scores) - Math.min(...scores);

  if (spread <= 1) {
    return {
      label: "High Agreement",
      className: "bg-green-100 text-green-800",
    };
  }

  if (spread <= 3) {
    return {
      label: "Some Disagreement",
      className: "bg-yellow-100 text-yellow-800",
    };
  }

  return {
    label: "Flagged: Raters Disagree Significantly",
    className: "bg-red-100 text-red-800",
  };
}

export default function ConsistencyBadge({ scores }: ConsistencyBadgeProps) {
  const { label, className } = getAgreement(scores);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
