import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../HTTP/http";
import { FaBriefcase, FaArrowLeft, FaPaperPlane } from "react-icons/fa";

export default function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/offers/${id}`)
      .then((res) => res.json())
      .then(setOffer)
      .catch(console.error);
  }, [id]);

  const getToken = () =>
    JSON.parse(localStorage.getItem("userInfo") || "{}").token;

  const handleApply = () => {
    if (!cvFile) {
      alert("Selecciona tu CV antes de enviar.");
      return;
    }

    const token = getToken();
    const formData = new FormData();
    formData.append("offer_id", id);
    formData.append("cv", cvFile);

    fetch(`${apiUrl}/candidate/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((err) => {
          throw new Error(err.message || "Error al enviar CV");
        });
      })
      .then(() => {
        alert("Tu CV ha sido enviado correctamente.");
        setCvFile(null);
      })
      .catch((err) => {
        console.error(err);
        alert("Error al enviar CV: " + err.message);
      });
  };

  if (!offer) {
    return (
      <div className="text-center py-8 text-gray-600">
        Cargando oferta…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2" /> Volver
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex items-center bg-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
            <FaBriefcase className="text-indigo-600 text-2xl" />
          </div>
          <h1 className="ml-4 text-2xl font-semibold text-gray-800">
            {offer.title}
          </h1>
        </div>

        <div className="px-6 py-6">
          <p className="text-gray-700 whitespace-pre-wrap">
            {offer.description}
          </p>
        </div>

        <div className="px-6 pt-0 pb-6 border-t border-gray-200">
          <label className="block mb-2 font-medium text-gray-700">
            Adjunta tu CV para postularte:
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files[0])}
              className="block w-full sm:w-auto text-gray-700
                         bg-gray-100 border border-gray-300 rounded-lg
                         px-3 py-2 focus:outline-none focus:ring-2
                         focus:ring-indigo-400"
            />
            <button
              onClick={handleApply}
              className="mt-2 sm:mt-0 px-6 py-2 bg-green-600 text-white rounded-lg
                         hover:bg-green-700 transition-colors flex items-center"
            >
              <FaPaperPlane className="mr-2 text-lg" /> Enviar CV
            </button>
          </div>
          {cvFile && (
            <p className="mt-2 text-sm text-gray-600">
              Archivo seleccionado: <span className="font-medium">{cvFile.name}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
