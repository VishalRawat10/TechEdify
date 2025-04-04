import { ThemeProvider } from "./ThemeContext";
import { MessageProvider } from "./MessageContext";
import { UserProvider } from "./UserContext";
import { CoursesProvider } from "./CoursesContext";

export default function AllContextProvider({ children }) {
  return (
    <ThemeProvider>
      <MessageProvider>
        <CoursesProvider>
          <UserProvider>{children} </UserProvider>
        </CoursesProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}
