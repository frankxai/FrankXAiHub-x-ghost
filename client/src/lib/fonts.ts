import localFont from 'next/font/local';

export const clashDisplay = localFont({
  src: 'https://cdn.jsdelivr.net/gh/Amy-Lynn/cdn/ClashDisplay-Variable.woff2',
  variable: '--font-clash',
  display: 'swap',
  weight: '200 700',
  style: 'normal',
});
