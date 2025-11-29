import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import Creat from "@/pages/Create";
import Login from "@/pages/Login";
import Create_Product from "@/pages/CreatProducts";
import ProductsList from "./pages/Getproducts";
function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <Creat/>
      <Login />
      <Create_Product/>
      <ProductsList />
    </ThemeProvider>
  );
}

export default App;
