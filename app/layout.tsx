import "./globals.css";

export const metadata = {
  title: "Senpai AI Tutor",
  description: "AI tutor for Indian students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
