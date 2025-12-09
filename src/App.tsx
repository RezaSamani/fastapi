import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/Sidebar";
import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import ProductsList from "@/pages/Getproducts";
import Creat from "./pages/Create";
import PrivateRoute from "./components/PrivateRoute";

function App() {
const refresh_token = async () => {
  // Retrieve the current refresh token from localStorage
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.error("No refresh token found");
    return;
  }

  try {
    const response = await fetch("http://172.17.17.10:8000/accounts/refresh", {
      method: "POST", // Use POST to send the refresh_token
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }), // Send the refresh token in the body
    });

    // Check if the response is successful
    if (response.ok) {
      const data = await response.json();

      // Save the new tokens in localStorage
      localStorage.setItem("theToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);

      console.log("Tokens refreshed successfully");
    } else {
      console.error("Failed to refresh tokens", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error during token refresh", error);
  }
};


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex">
        {/* Left menu */}
        <Sidebar />

        {/* Page content */}
        <div className="flex-1 p-4">
          <button onClick={()=>{refresh_token()}}>
            refreshh
          </button>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<Login />} />
            <Route path="/Create" element={<Creat />} />
            {/* Private route, only accessible if the user is logged in */}
            <Route element={<PrivateRoute />}>
              <Route path="/products" element={<ProductsList />} />

            </Route>
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
