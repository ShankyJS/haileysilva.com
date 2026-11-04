export type GarlandFace = {
  src: string;
  /** False when the cutout already wears a hat. */
  partyHat: boolean;
};

/** Expressions from the face sheet, left to right and top to bottom. */
export const garlandFaces: GarlandFace[] = [
  { src: "/parties/1/garland/01-strawberry.webp", partyHat: false },
  { src: "/parties/1/garland/02-bow.webp", partyHat: true },
  { src: "/parties/1/garland/03-tongue.webp", partyHat: true },
  { src: "/parties/1/garland/04-crying.webp", partyHat: true },
  { src: "/parties/1/garland/05-beanie.webp", partyHat: false },
  { src: "/parties/1/garland/06-stare.webp", partyHat: true },
  { src: "/parties/1/garland/07-smirk.webp", partyHat: true },
  { src: "/parties/1/garland/08-smile.webp", partyHat: true },
  { src: "/parties/1/garland/09-sunglasses.webp", partyHat: true },
  { src: "/parties/1/garland/10-pigtails.webp", partyHat: true },
];
