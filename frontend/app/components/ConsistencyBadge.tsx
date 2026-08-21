type ConsistencyBadgeProps = {
  scores: number[];
};

function getAgreement(scores: number[]) {
  const spread = Math.max(...scores) - Math.min(...scores);

  if (spread <= 1) {
    return {
      label: "High Agreement",
      className: "bg-status-green/15 text-status-green",
    };
  }

  if (spread <= 3) {
    return {
      label: "Some Disagreement",
      className: "bg-status-yellow/15 text-status-yellow",
    };
  }

  return {
    label: "Flagged: Raters Disagree Significantly",
    className: "bg-status-red/15 text-status-red",
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
