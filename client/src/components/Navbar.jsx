import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
            <Heart className="fill-green-600 text-green-600" size={21} />
          </div>

          <span className="text-xl font-bold text-green-800">
            Healthora
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="font-medium text-green-700">
            Home
          </a>

          <a href="#explore" className="text-gray-600 hover:text-green-700">
            Explore
          </a>

          <a href="#about" className="text-gray-600 hover:text-green-700">
            About
          </a>
        </nav>

        {/* Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="rounded-xl px-5 py-2.5 font-semibold text-green-700 hover:bg-green-50">
            Login
          </button>

          <button className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-green-100 bg-white px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">

            <a href="#home" onClick={() => setOpen(false)}>
              Home
            </a>

            <a href="#explore" onClick={() => setOpen(false)}>
              Explore
            </a>

            <a href="#about" onClick={() => setOpen(false)}>
              About
            </a>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 rounded-xl border border-green-200 py-2.5 text-green-700">
                Login
              </button>

              <button className="flex-1 rounded-xl bg-green-600 py-2.5 text-white">
                Sign Up
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;