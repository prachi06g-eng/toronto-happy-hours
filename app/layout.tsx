import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toronto Happy Hour Finder",
  description: "Find the best happy hour deals in downtown Toronto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0d0d0d' }}>{children}</body>
    </html>
  );
}
