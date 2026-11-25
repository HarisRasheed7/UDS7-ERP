import '../styles/globals.css';

export const metadata = {
  title: 'Multi-Organization ERP & Business Management Platform',
  description: 'Professional Multi-Organization, Multi-Industry ERP & Business Management Platform'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="ocean-blue">
      <body>{children}</body>
    </html>
  );
}
