type ConsistencyBadgeProps = {
  scores: number[];
};

function getAgreement(scores: number[]) {
  const spread = Math.max(...scores) - Math.min(...scores);

  if (spread <= 1) {
    return {
      label: "High Agreement",
      className: "bg-accent/12 text-accent",
    };
  }

  if (spread <= 3) {
    return {
      label: "Mixed Signal",
      className: "bg-ivory/8 text-ivory",
    };
  }

  return {
    label: "Low Agreement — Investigate",
    className: "bg-oxblood/20 text-oxblood-muted",
  };
}

export default function ConsistencyBadge({ scores }: ConsistencyBadgeProps) {
  const { label, className } = getAgreement(scores);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
