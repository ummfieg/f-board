export type WebFont = {
  url: string;
  weight: number;
};

export type Font = {
  id: number;
  name: string;
  webfonts: WebFont[];
};
