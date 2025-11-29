import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Home, PlusCircle, LogIn, UserPlus } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-60 h-screen bg-neutral-900 text-white p-4 flex flex-col gap-4">

      <h2 className="text-xl font-bold">My Store</h2>

      <Link className="flex items-center gap-2 hover:text-blue-400" to="/">
        <Home size={18} /> Products
      </Link>

      <Link className="flex items-center gap-2 hover:text-blue-400" to="/create-product">
        <PlusCircle size={18} /> Create Product
      </Link>

    <Link className="flex items-center gap-2 hover:text-blue-400" to="/Create">
  <UserPlus size={18} /> Create User
</Link>

      <Link className="flex items-center gap-2 hover:text-blue-400" to="/login">
        <LogIn size={18} /> Login
      </Link>

      


    </div>
  );
}
