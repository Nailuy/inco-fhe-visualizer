const KeyIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    {/* Головка ключа (коло) */}
    <circle cx="7" cy="12" r="4" />
    {/* Стержень ключа (прямокутник) */}
    <rect x="11" y="10" width="10" height="4" rx="1" />
    {/* Зубчики ключа (маленькі прямокутники) */}
    <rect x="14" y="7" width="2" height="3" />
    <rect x="17" y="7" width="2" height="3" />
  </svg>
);

export default KeyIcon;
