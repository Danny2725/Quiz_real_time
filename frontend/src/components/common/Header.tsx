const Header: React.FC = () => {
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      // Xử lý logic sau khi đăng xuất thành công
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <nav>
        <a href="#" className="ml-4 text-gray-300 hover:text-white">Profile</a>
        <button onClick={handleLogout} className="ml-4 text-gray-300 hover:text-white">Logout</button>
      </nav>
    </header>
  );
};

export default Header;
