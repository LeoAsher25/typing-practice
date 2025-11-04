import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then((reg) => {
                      console.log('Service Worker registered:', reg);
                      // Show toast after SW activates
                      setTimeout(() => {
                        if (reg.active) {
                          console.log('Ứng dụng đã sẵn sàng hoạt động offline');
                        }
                      }, 1000);
                    })
                    .catch((err) => {
                      console.error('Service Worker registration failed:', err);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

