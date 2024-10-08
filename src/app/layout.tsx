import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { Provider } from "@/app/theme-provider";
import "./globals.css";
import Header from "@/components/header/Header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider>
          <>
            <Header />
            {children}
          </>
        </Provider>
      </body>
    </html>
  );
}
