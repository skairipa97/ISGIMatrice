const Navbar = () => {
  return (
    <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Tableau de bord Admin</h1>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Déconnexion
      </button>
    </header>
  );
};