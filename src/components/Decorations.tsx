function Star({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1.6 14.7 8l6.7.6-5.1 4.4 1.6 6.5L12 16.2 6.1 19.5 7.7 13 2.6 8.6 9.3 8z"
      />
    </svg>
  );
}

export function Decorations() {
  return (
    <div className="confetti" aria-hidden="true">
      <Star className="bit bit-star gold a" />
      <Star className="bit bit-star yellow b" />
      <Star className="bit bit-star lav c wide" />
      <Star className="bit bit-star gold d" />
      <span className="bit dot pink e" />
      <span className="bit dot blue f" />
      <span className="bit dot gold g wide" />
      <span className="bit dot rose h" />
      <span className="bit heart i" />
      <span className="bit heart j wide" />
      <svg className="bit squiggle k" viewBox="0 0 48 20" aria-hidden="true">
        <path d="M2 12c6-8 10 8 16 0s10 8 16 0 10 8 12 2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <svg className="bit squiggle l wide" viewBox="0 0 42 18" aria-hidden="true">
        <path d="M2 10c5-7 8 7 14 0s8 7 13 0 8 6 11 1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Balloons() {
  return (
    <svg className="balloons" viewBox="0 0 210 340" aria-hidden="true">
      <path d="M78 168 C 62 220, 96 260, 108 318" fill="none" stroke="#6d5a66" strokeWidth="2" />
      <path d="M158 176 C 176 230, 142 268, 128 324" fill="none" stroke="#6d5a66" strokeWidth="2" />
      <ellipse cx="78" cy="108" rx="48" ry="60" fill="#CDB6E6" />
      <ellipse cx="62" cy="86" rx="14" ry="9" fill="#fff" opacity="0.4" />
      <path d="M68 164 l10 14 h-20 z" fill="#b79ad4" />
      <ellipse cx="156" cy="118" rx="42" ry="54" fill="#8EAFDA" />
      <ellipse cx="142" cy="98" rx="12" ry="8" fill="#fff" opacity="0.38" />
      <g fill="#fff">
        <circle cx="144" cy="108" r="3.1" />
        <circle cx="162" cy="120" r="2.5" />
        <circle cx="148" cy="134" r="2.3" />
        <circle cx="170" cy="136" r="2.7" />
        <circle cx="158" cy="96" r="2.1" />
        <circle cx="172" cy="112" r="2" />
      </g>
      <path d="M146 168 l10 14 h-20 z" fill="#6f94c4" />
    </svg>
  );
}
