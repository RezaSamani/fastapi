import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { Button } from "./components/ui/button"
function App() {
  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     <ModeToggle></ModeToggle>
    </ThemeProvider>
    <Button>salam</Button>
    </>
  )
}

export default App