import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Sidebar2 from "@/components/Sidebar2";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Intellect AI",
  description: "A content creation buddy for creators.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="dark  absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
    >
      <body className="">
        <Providers>
          <div className="main-div flex w-full">
            <div className="left">
              <div className="web-sidebar hidden sm:block">
                <Sidebar />
              </div>
              <div className="mob-sidebar block sm:hidden">
                <Sidebar2 />
              </div>
            </div>
            <div className="right w-full">
              <div className="right-content">
                <div className="top bg-[#120f0fd1] backdrop-blur-sm z-[4] fixed w-full">
                  <Navbar />
                </div>
                <div className="bottom w-full">
                  <div className="data relative top-[90px] w-full">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
