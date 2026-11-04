import { useState } from "react";
import { PartyHat } from "./PartyHat";

type FaceWithHatProps = {
  src: string;
  name: string;
  priority?: boolean;
  showHat?: boolean;
};

export function FaceWithHat({ src, name, priority = false, showHat = true }: FaceWithHatProps) {
  const [failed, setFailed] = useState(false);
  const initial = [...name][0] ?? "?";

  return (
    <span className={showHat ? "face" : "face no-party-hat"}>
      {showHat ? <PartyHat /> : null}
      <span className="face-disc">
        {failed ? (
          <span className="face-fallback" aria-hidden="true">
            {initial}
          </span>
        ) : (
          <img
            src={src}
            alt=""
            width={800}
            height={842}
            draggable={false}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onError={() => setFailed(true)}
          />
        )}
      </span>
    </span>
  );
}
