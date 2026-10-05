// Makes public/favicon.ico (16×16 and 32×32 PNGs inside an ICO) from public/favicon.svg.
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
const sizes = [16, 32];
const pngs = await Promise.all(sizes.map((s) => sharp('public/favicon.svg', { density: 300 }).resize(s, s).png().toBuffer()));
const head = Buffer.alloc(6 + 16 * sizes.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
let offset = head.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
  head.writeUInt32LE(pngs[i].length, e + 8); head.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync('public/favicon.ico', Buffer.concat([head, ...pngs]));
