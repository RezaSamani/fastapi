import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

// This component will wrap protected routes
const PrivateRoute = () => {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const token = localStorage.getItem("theToken");
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch("http://172.17.17.10:8000/accounts/refresh", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          // Update the tokens in localStorage
          localStorage.setItem("theToken", data.access_token);
          localStorage.setItem("refreshToken", data.refresh_token);
          return true;
        } else {
          console.error("Failed to refresh token", response.status, response.statusText);
          return false;
        }
      } catch (error) {
        console.error("Error refreshing token", error);
        return false;
      }
    };

    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        // Send the token to the /current_user endpoint for validation
        const response = await fetch("http://172.17.17.10:8000/accounts/current_user", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // If the token is valid, set isValidToken to true
          setIsValidToken(true);
        } else {
          // If the token is expired, try refreshing it
          const refreshSuccess = await refreshAccessToken();
          if (refreshSuccess) {
            setIsValidToken(true); // Token was successfully refreshed
          } else {
            setIsValidToken(false); // Failed to refresh token
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token, refreshToken]);

  if (isValidToken === null) {
    return <div>Loading...</div>; // Optionally, you can show a loading indicator
  }

  if (!isValidToken) {
    alert("Session expired. Please log in again.");
    return <Navigate to="/" />; // Redirect to login page if the token is invalid
  }

  return <Outlet />; // Render protected route if the token is valid
};

export default PrivateRoute;
