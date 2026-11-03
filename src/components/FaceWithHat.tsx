import { useState } from "react";
import { PartyHat } from "./PartyHat";

type FaceWithHatProps = {
  src: string;
  name: string;
  priority?: boolean;
};

export function FaceWithHat({ src, name, priority = false }: FaceWithHatProps) {
  const [failed, setFailed] = useState(false);
  const initial = [...name][0] ?? "?";

  return (
    <span className="face">
      <PartyHat />
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
