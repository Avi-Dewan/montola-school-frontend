// src/app/layout.tsx
import "./globals.css";
<<<<<<< HEAD
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
=======
>>>>>>> dev
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
<<<<<<< HEAD
=======
import AppChrome from "@/components/AppChrome";
>>>>>>> dev

export const metadata = {
  title: "Montola School",
  description: "Learning Platform",
};

export default function RootLayout({
   children,
 }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body>
          <AuthProvider>
              <I18nProvider>
<<<<<<< HEAD

                  <Navbar />
                  <main>{children}</main>
                  <Footer />
=======
                  <AppChrome>{children}</AppChrome>
>>>>>>> dev

                  <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                  />

              </I18nProvider>
          </AuthProvider>
      </body>
      </html>
  );
}