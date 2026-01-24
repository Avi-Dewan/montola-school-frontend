// src/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppChrome from "@/components/AppChrome";

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
                  <AppChrome>{children}</AppChrome>

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