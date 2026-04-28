import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Guessy Galaxy | Simple Guessing Games",
  description: "A friendly guessing game website with hints, levels, login, registration, and multiple games.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <footer className="footer">
          <div className="container">© 2026 Guessy Galaxy. Play kindly, guess boldly, and have fun.</div>
        </footer>
      </body>
    </html>
  );
}
