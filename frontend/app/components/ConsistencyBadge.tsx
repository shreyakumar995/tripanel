type ConsistencyBadgeProps = {
  scores: number[];
};

function getAgreement(scores: number[]) {
  const spread = Math.max(...scores) - Math.min(...scores);

  if (spread <= 1) {
    return {
      label: "High Agreement",
      className: "bg-[#E1F3D6] text-[#48B536]",
    };
  }

  if (spread <= 3) {
    return {
      label: "Mixed Signal",
      className: "bg-[#F1F7ED] text-[#667066]",
    };
  }

  return {
    label: "Low Agreement — Investigate",
    className: "bg-[#FCE8EB] text-[#B84A5A]",
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
