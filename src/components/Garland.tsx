import { garlandFaces } from "../garlandFaces";
import { FaceWithHat } from "./FaceWithHat";

const TILTS = [-3, 2.5, -2, 3, -2.5, 2, -3, 2.5, -2, 3];

type GarlandProps = {
  name: string;
};

export function Garland({ name }: GarlandProps) {
  return (
    <div className="garland" role="img" aria-label={`A garland of ${name} in different expressions, wearing hats`}>
      <div className="garland-row">
        {garlandFaces.map((face, index) => (
          <div className="slot" key={face.src}>
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
            <div className="hanger" style={{ ["--rot" as string]: `${TILTS[index] ?? 0}deg`, ["--i" as string]: index }}>
              <span className="knot" />
              <FaceWithHat src={face.src} name={name} showHat={face.partyHat} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
