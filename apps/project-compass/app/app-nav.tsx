import { NavLink } from 'react-router';

export function AppNav() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-800 text-white">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/about" end>
        About
      </NavLink>
      <NavLink to="/contact" end>
        Contact
      </NavLink>
    </nav>
  );
}
