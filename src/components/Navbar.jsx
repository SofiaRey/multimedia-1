import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b fixed z-20 w-full bg-white border-stone-200 p-4 px-8 flex items-center ">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-teal-700 transition">
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/usuarios" className="hover:text-teal-700 transition">
            Usuarios
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
