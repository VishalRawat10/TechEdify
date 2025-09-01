import { ThemeProvider } from "./ThemeContext";
import { MessageProvider } from "./MessageContext";
import { UserProvider } from "./UserContext";

export default function AllContextProvider({ children }) {
  return (
    <ThemeProvider>
      <MessageProvider>
        <UserProvider>{children} </UserProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}
