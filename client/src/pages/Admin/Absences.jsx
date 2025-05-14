import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Absences = () => {
  const [absences, setAbsences] = useState([]);

  useEffect(() => {
    // Remplacer par ton endpoint
    axios.get('/api/absences')
      .then(res => setAbsences(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleApplyPenalty = (id) => {
    axios.patch(`/api/absences/${id}/penalty`, { penalty: -0.25 })
      .then(() => setAbsences(absences.map(a => a.id === id ? { ...a, penalty: -0.25 } : a)));
  };

  const handleRemovePenalty = (id) => {
    axios.patch(`/api/absences/${id}/penalty`, { penalty: 0 })
      .then(() => setAbsences(absences.map(a => a.id === id ? { ...a, penalty: 0 } : a)));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des absences</h2>
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Nom</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Justification</th>
            <th className="py-2 px-4 border">Pénalité</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {absences.map((abs) => (
            <tr key={abs.id}>
              <td className="py-2 px-4 border">{abs.stagiaire}</td>
              <td className="py-2 px-4 border">{abs.date}</td>
              <td className="py-2 px-4 border">{abs.justification ? 'Oui' : 'Non'}</td>
              <td className="py-2 px-4 border">{abs.penalty || 0}</td>
              <td className="py-2 px-4 border">
                {!abs.justification && (
                  <button onClick={() => handleApplyPenalty(abs.id)} className="text-red-500 mr-2">
                    Appliquer -0.25
                  </button>
                )}
                {abs.justification && abs.penalty !== 0 && (
                  <button onClick={() => handleRemovePenalty(abs.id)} className="text-green-500">
                    Retirer pénalité
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Absences;