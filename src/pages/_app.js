import "../../styles/globals.css";
import "tailwindcss/tailwind.css";
import "../../styles/globals.css";
import { AuthProvider } from "../fb/auth";
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
