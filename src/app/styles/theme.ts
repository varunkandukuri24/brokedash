export const colors = {
  primary: '#FF2C00',
  lightAccent: '#FF7F59',
  softyellow: '#FFE66D',
  offwhite: '#F7FFF7',
  deepblue: '#1A5F7A',
  warmgray: '#8C7A6B'
} as const;

export type ColorKeys = keyof typeof colors;

