import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import Sidebar from "@/components/Sidebar";
import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import ProductsList from "@/pages/Getproducts";
import Creat from "./pages/Create";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex">

        {/* Left menu */}
        <Sidebar />

        {/* Page content */}
        <div className="flex-1 p-4">
          

          <Routes>
            <Route path="/" element={<ProductsList />} />
            <Route path="/Create" element={<Creat />} />
            <Route path="/login" element={<Login />} />
            {/* Note: the dedicated create-product page was removed — creating is done via modal on the Products page */}
          </Routes>
        </div>

      </div>
    </ThemeProvider>
  );
}

export default App;
