export function hashTechHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return h;
}

export function techColor(name: string): string {
  return `hsl(${hashTechHue(name)}, 72%, 54%)`;
}

export function isHexColor(v?: string): v is string {
  return typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
}

export function contrastTextColor(hex: string): string {
  const num = parseInt(hex.slice(1), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#0b1220' : '#ffffff';
}
