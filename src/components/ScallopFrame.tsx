import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

function scallopPath(width: number, height: number, radius: number): string {
  const stroke = 8;
  const margin = Math.ceil(radius + stroke / 2 + 3);
  const left = margin;
  const top = margin;
  const right = width - margin;
  const bottom = height - margin;
  const innerW = right - left;
  const innerH = bottom - top;
  if (innerW < radius * 6 || innerH < radius * 6) return "";

  const nx = Math.max(6, Math.round(innerW / (radius * 2.2)));
  const ny = Math.max(8, Math.round(innerH / (radius * 2.2)));
  const sx = innerW / nx;
  const sy = innerH / ny;
  const cmd: string[] = [`M ${left.toFixed(2)} ${top.toFixed(2)}`];
  const arc = (rx: number, ry: number, x: number, y: number) =>
    `A ${rx.toFixed(2)} ${ry.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;

  for (let i = 1; i <= nx; i += 1) cmd.push(arc(sx / 2, radius, left + sx * i, top));
  for (let i = 1; i <= ny; i += 1) cmd.push(arc(radius, sy / 2, right, top + sy * i));
  for (let i = 1; i <= nx; i += 1) cmd.push(arc(sx / 2, radius, right - sx * i, bottom));
  for (let i = 1; i <= ny; i += 1) cmd.push(arc(radius, sy / 2, left, bottom - sy * i));
  cmd.push("Z");
  return cmd.join(" ");
}

export function ScallopFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<{ width: number; height: number; d: string } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const width = Math.round(el.clientWidth);
      const height = Math.round(el.clientHeight);
      const radius = width < 640 ? 9 : 12;
      const d = scallopPath(width, height, radius);
      setShape((prev) => {
        if (prev && prev.width === width && prev.height === height && prev.d === d) return prev;
        return { width, height, d };
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ready = Boolean(shape?.d);

  return (
    <div className={ready ? "sheet is-measured" : "sheet"} ref={ref}>
      {ready && shape ? (
        <svg
          className="scallop"
          viewBox={`0 0 ${shape.width} ${shape.height}`}
          width={shape.width}
          height={shape.height}
          aria-hidden="true"
        >
          <path d={shape.d} fill="#F5F2ED" stroke="#E98EA7" strokeWidth="8" />
        </svg>
      ) : null}
      <div className="sheet-inner">{children}</div>
    </div>
  );
}
