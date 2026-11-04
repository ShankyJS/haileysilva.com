import { useId } from "react";

/** Striped party hat from the invite generator: pink cone, white bands, scallops, pom, gold dots. */
export function PartyHat() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clip = `hat-${id}`;
  const scallops = Array.from({ length: 9 }, (_, index) => {
    const x = 16 + ((214 - 16) * index) / 8;
    return x;
  });

  return (
    <svg className="party-hat" viewBox="0 0 230 310" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <polygon points="115,46 16,268 214,268" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <polygon points="115,46 16,268 214,268" fill="#F8B2CD" />
        {Array.from({ length: 7 }, (_, index) => {
          const y = 86 + index * 30;
          return (
            <polygon
              key={index}
              points={`-20,${y} 260,${y - 24} 260,${y - 8} -20,${y + 16}`}
              fill="#fff"
              fillOpacity="0.92"
            />
          );
        })}
      </g>
      <polygon
        points="115,46 16,268 214,268"
        fill="none"
        stroke="#DE5F91"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {scallops.map((x) => (
        <circle key={x} cx={x} cy="268" r="13" fill="#fff" stroke="#F6AAC3" strokeWidth="3" />
      ))}
      <circle cx="108" cy="118" r="6.5" fill="#C9A050" />
      <circle cx="136" cy="156" r="5.5" fill="#C9A050" />
      <circle cx="98" cy="196" r="6" fill="#C9A050" />
      <circle cx="142" cy="224" r="5.5" fill="#C9A050" />
      <g>
        {Array.from({ length: 8 }, (_, index) => {
          const angle = (index / 8) * Math.PI * 2;
          const cx = 115 + Math.cos(angle) * 13;
          const cy = 34 + Math.sin(angle) * 13;
          return <circle key={index} cx={cx} cy={cy} r="15" fill="#FCD7E6" />;
        })}
        <circle cx="115" cy="34" r="18" fill="#FAC8DC" />
        <ellipse cx="108" cy="26" rx="7" ry="6" fill="#FFF0F6" />
      </g>
    </svg>
  );
}
