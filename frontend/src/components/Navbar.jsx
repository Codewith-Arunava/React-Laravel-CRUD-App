import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/posts" className="navbar-brand">
        <span className="navbar-brand-icon">📝</span>
        PostManager
      </Link>

      <div className="navbar-right">
        {user && (
          <>
            <span className="navbar-user">👤 {user.name}</span>
            <button
              id="btn-logout"
              className="btn btn-outline btn-sm"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
