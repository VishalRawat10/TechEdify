import { ThemeProvider } from "./ThemeContext";
import { MessageProvider } from "./MessageContext";

export default function AllContextProvider({ children }) {
  return (
    <ThemeProvider>
      <MessageProvider>{children}</MessageProvider>
    </ThemeProvider>
  );
}
