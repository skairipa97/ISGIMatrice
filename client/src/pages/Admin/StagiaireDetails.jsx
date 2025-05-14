import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StagiaireDetails = () => {
  const { id } = useParams();
  const [stagiaire, setStagiaire] = useState(null);

  useEffect(() => {
    fetch(`/api/stagiaires/${id}`)
      .then(res => res.json())
      .then(data => setStagiaire(data));
  }, [id]);

  if (!stagiaire) return <div>Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Détails du stagiaire : {stagiaire.nom}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Email</h3>
          <p>{stagiaire.email}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Nombre d'absences</h3>
          <p>{stagiaire.absences.length}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Liste des absences</h3>
        <ul className="list-disc pl-5">
          {stagiaire.absences.map((abs, i) => (
            <li key={i}>{abs.date} - {abs.justification ? "Justifiée" : "Non justifiée"} ({abs.penalty})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StagiaireDetails;