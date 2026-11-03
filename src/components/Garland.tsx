import { FaceWithHat } from "./FaceWithHat";

const TILTS = [-3, 2.5, -2, 3, -2.5, 2, -3, 2.5];

type GarlandProps = {
  src: string;
  name: string;
};

export function Garland({ src, name }: GarlandProps) {
  return (
    <div className="garland" role="img" aria-label={`A garland of ${name} in party hats`}>
      <div className="garland-row">
        {TILTS.map((tilt, index) => (
          <div className="slot" key={index}>
            <svg className="slot-cord" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0 5 Q 50 26 100 5"
                fill="none"
                stroke="#E089A6"
                strokeWidth="2.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="hanger" style={{ ["--rot" as string]: `${tilt}deg`, ["--i" as string]: index }}>
              <span className="knot" />
              <FaceWithHat src={src} name={name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
