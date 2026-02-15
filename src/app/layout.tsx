import { ConfigProvider } from '@/context/ConfigContext';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}