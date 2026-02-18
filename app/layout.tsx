import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/web/theme-provider";
import { ConvexClientProvider } from "@/components/web/ConvexClientProvider";
import { getToken } from "@/lib/auth-server";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuardProvider } from "@/components/web/auth/AuthGuardProvider";
import { AuthRequiredModal } from "@/components/web/auth/AuthRequiredModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your habits",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider initialToken={token}>
            <AuthGuardProvider>
              {children}
              <AuthRequiredModal />
            </AuthGuardProvider>
          </ConvexClientProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
