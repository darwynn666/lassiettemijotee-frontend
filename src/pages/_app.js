import "@/styles/globals.css";

// redux
import { Provider } from "react-redux";
import { store } from "@/features/store/store";


export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
