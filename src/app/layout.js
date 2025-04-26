import "./globals.css";

export const metadata = {
  title: "GSAP Premium Plugins Clone",
  description: "Created by Melvin Prince - melvinprince.io",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
