import "./globals.css";
export const metadata = {
  title: "Sistema de Seguros",
  description: "Sistema web de gestión de seguros de accidentes personales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}