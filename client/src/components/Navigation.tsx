import React from 'react';
import { NavLink } from 'react-router-dom';
import { RiRobotLine, RiCodeBoxLine } from 'react-icons/ri';

const Navigation = () => {
  const getNavLinkClass = (isActive) => (isActive ? 'active' : '');

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => getNavLinkClass(isActive)}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/ai-personas" className={({ isActive }) => getNavLinkClass(isActive)}>
            <RiRobotLine className="mr-2" /> AI Personas
          </NavLink>
        </li>
        <li>
          <NavLink to="/framework-agents" className={({ isActive }) => getNavLinkClass(isActive)}>
            <RiCodeBoxLine className="mr-2" /> Framework Specialists
          </NavLink>
        </li>
        {/* Add more navigation items as needed */}
      </ul>
    </nav>
  );
};

export default Navigation;