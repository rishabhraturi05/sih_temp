// "use client"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { Poppins, Montserrat, Open_Sans, Nunito_Sans } from "next/font/google";
import { Navbar } from "./components/navbar";
import Footer from "./components/footer";
import PageTransition from "./components/pagetransition";

export const metadata = {
  title: "Evovia",
  description: "One Stop Solution for your Education",
};
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify the weights you need
  variable: '--font-poppins', // Optional: for using with CSS variables
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '900'],
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-open-sans',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nunito-sans',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load Font Awesome from CDN */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${poppins.variable} ${montserrat.variable} ${openSans.variable} ${nunitoSans.variable} flex flex-col min-h-screen text-white`}
      >
        <PageTransition>
          <Navbar />
          {children}
          <Analytics />
          <Footer />
        </PageTransition>
      </body>
    </html>
  );
}
