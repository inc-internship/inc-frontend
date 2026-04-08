export const MingloIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="#0B0F19" />

    <defs>
      <linearGradient
        id="mingloGradient"
        x1="4"
        y1="4"
        x2="20"
        y2="20"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7B61FF" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>

    <path
      d="M6 16V8L10 13L14 8V16"
      stroke="url(#mingloGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <circle cx="18" cy="10" r="1.5" fill="#3B82F6" />
  </svg>
)
