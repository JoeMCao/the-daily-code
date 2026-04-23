import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "The Daily Code",
  description:
    "A stoic daily tracker for seven practices. No drama. Return to the code.",
};

export const viewport: Viewport = {
  themeColor: "#f5f5f4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans text-ink">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 sm:px-8">
          <Header />
          <main className="flex min-h-0 flex-1 flex-col pb-24 pt-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
