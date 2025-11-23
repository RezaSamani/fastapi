import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import Creat from "@/pages/create";
import Login from "./pages/Login";
function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <Creat/>
      <Login/>
    </ThemeProvider>
  );
}

export default App;
