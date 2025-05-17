import './globals.css'

export const metadata = {
  title: 'Binova AI',
  description: 'Detector de reciclaje inteligente',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head />
      <body>
        <div suppressHydrationWarning={true}>{children}</div>
      </body>
 </html>
)
}