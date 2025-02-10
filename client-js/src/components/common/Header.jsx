import { NavLink } from "react-router-dom";
import './Header.css'

export default function Header() {
  return (
    <header className="p-4 bg-blue-600 text-white">
      <nav>
        <NavLink to="/" className={({ isActive }) =>
          `mr-4${isActive ? ' active' : ''}`
        }>Home</NavLink>
        <NavLink to="/users" className={({ isActive }) =>
          `mr-4${isActive ? ' active' : ''}`
        }>Users</NavLink>
      </nav>
    </header>
  );
}