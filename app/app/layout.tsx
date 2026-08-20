import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reedstar",
  description: "Verifiable internet intelligence."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
