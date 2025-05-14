import React from 'react';

const Adashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bienvenue sur votre Tableau de bord</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Absences</h3>
          <p className="text-3xl mt-2">18</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Justifications reçues</h3>
          <p className="text-3xl mt-2">12</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Pénalités appliquées</h3>
          <p className="text-3xl mt-2">6</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Dernières absences</h3>
        {/* Ici tu peux afficher une liste d'absences */}
      </div>
    </div>
  );
};

export default Adashboard;