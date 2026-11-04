export type Keepsake = {
  id: string;
  kind: string;
  title: string;
  when: string;
  href: string;
  label: string;
  external: boolean;
};

/** Earlier celebrations that live on their own sites, shown as little letters. */
export const keepsakes: Keepsake[] = [
  {
    id: "baby-shower",
    kind: "Baby shower",
    title: "It's a girl",
    when: "September 6, 2025",
    href: "https://babysilva.com",
    label: "babysilva.com",
    external: true,
  },
];
