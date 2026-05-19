import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="text-primary font-bold text-xl tracking-tight">
          conduit
        </Link>

        <ul className="flex items-center gap-1 text-sm">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? 'px-3 py-2 text-gray-800 font-medium border-b-2 border-primary' : 'px-3 py-2 text-gray-500 hover:text-gray-800'
              }
            >
              Home
            </NavLink>
          </li>

          {currentUser ? (
            <>
              <li>
                <NavLink
                  to="/editor"
                  className={({ isActive }) =>
                    isActive ? 'px-3 py-2 text-gray-800 font-medium border-b-2 border-primary' : 'px-3 py-2 text-gray-500 hover:text-gray-800'
                  }
                >
                  ✏️ New Article
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive ? 'px-3 py-2 text-gray-800 font-medium border-b-2 border-primary' : 'px-3 py-2 text-gray-500 hover:text-gray-800'
                  }
                >
                  ⚙️ Settings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/@${currentUser.username}`}
                  className={({ isActive }) =>
                    isActive ? 'px-3 py-2 text-gray-800 font-medium border-b-2 border-primary flex items-center gap-1' : 'px-3 py-2 text-gray-500 hover:text-gray-800 flex items-center gap-1'
                  }
                >
                  {currentUser.image && (
                    <img src={currentUser.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                  )}
                  {currentUser.username}
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-gray-500 hover:text-gray-800"
                >
                  Sign out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'px-3 py-2 text-gray-800 font-medium border-b-2 border-primary' : 'px-3 py-2 text-gray-500 hover:text-gray-800'
                  }
                >
                  Sign in
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? 'px-3 py-2 text-gray-800 font-medium border-b-2 border-primary' : 'px-3 py-2 text-gray-500 hover:text-gray-800'
                  }
                >
                  Sign up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
