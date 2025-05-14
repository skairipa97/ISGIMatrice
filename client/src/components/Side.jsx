const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 text-xl font-bold">Admin Absences</div>
      <nav className="mt-4">
        <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Dashboard</a>
        <a href="/absences" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Absences</a>
      </nav>
    </aside>
  );
};