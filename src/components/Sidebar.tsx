import { Link } from "react-router-dom";
import { Home, PlusCircle, LogIn, UserPlus } from "lucide-react";
import { ModeToggle } from "./mode-toggle";


export default function Sidebar() {
  return (

    <div className="w-60 h-screen 
     bg-white text-black 
     dark:bg-neutral-900 dark:text-white
     p-4 flex flex-col gap-4 transition-colors border-r-1">
      
      <div className="flex row justify-between">
        <h2 className="text-xl font-bold">My Store</h2> <ModeToggle />
      </div>
      <Link className="flex items-center gap-2 hover:text-blue-400" to="/">
        <Home size={18} /> Products
      </Link>

      {/* Create Product page removed — creation now available from Products page via modal */}

      <Link className="flex items-center gap-2 hover:text-blue-400" to="/Create">
        <UserPlus size={18} /> Create User
      </Link>

      <Link className="flex items-center gap-2 hover:text-blue-400" to="/login">
        <LogIn size={18} /> Login
      </Link>





    </div>
  );
}
