type Props = { className?: string }

export const DropDownCorner = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 16 8" width="16" height="8" aria-hidden="true">
    <path d="M0 8H16L8 0Z" fill="currentColor" />
    <path
      d="M0 8L8 0L16 8"
      fill="none"
      stroke="var(--dark-100)"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
)
