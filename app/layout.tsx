import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Quote } from "@/components/Quote";
import { todayKey } from "@/lib/date";

export const metadata: Metadata = {
  title: "The Daily Code",
  description:
    "A stoic daily tracker for seven practices. No drama. Return to the code.",
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const today = todayKey();
  return (
    <html lang="en">
      <body className="min-h-screen font-sans text-ink">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 sm:px-8">
          <Header />
          <main className="flex-1 pb-24 pt-4">{children}</main>
          <footer className="border-t border-stone-200/70 py-8">
            <Quote dateKey={today} />
          </footer>
        </div>
      </body>
    </html>
  );
}
