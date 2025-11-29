import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import Sidebar from "@/components/Sidebar";
import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import CreateProduct from "@/pages/CreatProducts";
import ProductsList from "@/pages/Getproducts";
import Creat from "./pages/Create";
import Ar from "./pages/A";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex">

        {/* Left menu */}
        <Sidebar />

        {/* Page content */}
        <div className="flex-1 p-4">
          <ModeToggle />

          <Routes>
            <Route path="/" element={<ProductsList />} />
            <Route path="/Create" element={<Creat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-product" element={<CreateProduct />} />
          </Routes>
        </div>

      </div>
    </ThemeProvider>
  );
}

export default App;
