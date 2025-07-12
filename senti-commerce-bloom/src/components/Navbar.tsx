import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Kikuu
        </Link>

        {isAuthenticated && user ? (
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <User className="w-5 h-5" />
              <span>{user.username}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                {user.role === "seller" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Seller Dashboard
                  </Link>
                )}
                {user.role === "buyer" && (
                  <Link
                    to="/customer"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Buyer Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-gray-600 hover:text-blue-600 flex items-center gap-1"
          >
            <User className="w-5 h-5" />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
