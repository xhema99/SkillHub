import React, { useEffect, useState, useContext } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaPlusCircle,
  FaClipboardList,
  FaBriefcase,
  FaSignOutAlt,
  FaEnvelope,
  FaUser,
  FaDownload,
  FaTag,
} from "react-icons/fa";
import { AuthContext } from "../context/Auth";
import { apiUrl } from "../HTTP/http";

import recruiterMale from "../assets/recruiter_male.png";
import recruiterFemale from "../assets/recruiter_female.png";

export default function DashboardRecruiter() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      
      <SidebarRecruiter
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
      />

      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeaderRecruiter onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<OfferList />} />
            <Route path="create" element={<CreateOffer />} />
            <Route path="inbox" element={<Inbox />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function MobileHeaderRecruiter({ onMenuClick }) {
  return (
    <header className="md:hidden bg-gray-800 text-white flex items-center justify-between px-4 py-3">
      <button onClick={onMenuClick} className="text-2xl">
        <FaBars />
      </button>
      <span className="text-lg font-semibold">Reclutador</span>
      {/* 
        Espacio de ancho fijo para centrar el título
      */}
      <div style={{ width: "1.5rem" }} />
    </header>
  );
}


// Sidebar 

function SidebarRecruiter({ sidebarOpen, setSidebarOpen, onLogout }) {
  const [avatar, setAvatar] = useState("male");
  const [menuOpen, setMenuOpen] = useState(false);

  const currentAvatar = avatar === "male" ? recruiterMale : recruiterFemale;

  const linkStyler = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded transition-colors text-gray-100 ${
      isActive ? "bg-gray-700" : "hover:bg-gray-700"
    }`;

  const handleOverlayClick = () => setSidebarOpen(false);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30 transform bg-gray-800 flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-full           /* sm: ancho completo */
          md:w-48          /* ≥md: 192px */
          lg:w-64          /* ≥lg: 256px */
          md:translate-x-0 /* ≥md: siempre visible */
          md:static        /* ≥md: deja de ser fixed */
        `}
      >
        <div className="relative p-4 flex flex-col items-center border-b border-gray-700">
          <img
            src={currentAvatar}
            alt="Avatar Recruiter"
            className="w-20 h-20 rounded-full border-2 border-white object-cover cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <span className="mt-2 text-2xl font-bold text-white hidden md:block">
            Reclutador
          </span>

          {menuOpen && (
            <div className="absolute top-24 bg-white text-gray-800 rounded-lg shadow-lg w-44 z-10">
              <button
                onClick={() => {
                  setAvatar("male");
                  setMenuOpen(false);
                }}
                className="flex items-center px-4 py-3 hover:bg-gray-100 w-full"
              >
                <img
                  src={recruiterMale}
                  alt="Hombre Recruiter"
                  className="w-8 h-8 rounded-full object-cover mr-3"
                />
                <span className="text-sm">Hombre</span>
              </button>
              <button
                onClick={() => {
                  setAvatar("female");
                  setMenuOpen(false);
                }}
                className="flex items-center px-4 py-3 hover:bg-gray-100 w-full"
              >
                <img
                  src={recruiterFemale}
                  alt="Mujer Recruiter"
                  className="w-8 h-8 rounded-full object-cover mr-3"
                />
                <span className="text-sm">Mujer</span>
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 flex flex-col overflow-auto py-4 space-y-1">
          <NavLink
            to="/recruiter/dashboard"
            end
            className={linkStyler}
            onClick={() => setSidebarOpen(false)}
          >
            <FaClipboardList className="text-xl md:text-lg" />
            <span className="ml-3 hidden md:inline-block">Ofertas</span>
          </NavLink>

          <NavLink
            to="/recruiter/dashboard/create"
            className={linkStyler}
            onClick={() => setSidebarOpen(false)}
          >
            <FaPlusCircle className="text-xl md:text-lg" />
            <span className="ml-3 hidden md:inline-block">Crear oferta</span>
          </NavLink>

          <NavLink
            to="/recruiter/dashboard/inbox"
            className={linkStyler}
            onClick={() => setSidebarOpen(false)}
          >
            <FaEnvelope className="text-xl md:text-lg" />
            <span className="ml-3 hidden md:inline-block">Bandeja</span>
          </NavLink>
        </nav>

        <button
          onClick={() => {
            onLogout();
            setSidebarOpen(false);
          }}
          className="flex items-center px-4 py-2 mb-4 hover:bg-gray-700 transition-colors text-gray-100"
        >
          <FaSignOutAlt className="text-xl md:text-lg" />
          <span className="ml-3 hidden md:inline-block">Logout</span>
        </button>
      </aside>
    </>
  );
}

function getToken() {
  const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return info.token || "";
}


// Ofertas del Reclutador

function OfferList() {
  const [offers, setOffers] = useState([]);
  const [apps, setApps] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetch(`${apiUrl}/recruiter/offers`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then(setOffers)
      .catch(console.error);
  }, []);

  const loadApplications = (offerId) => {
    fetch(`${apiUrl}/recruiter/offers/${offerId}/applications`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setApps(data);
        setSelectedOffer(offerId);
      })
      .catch(console.error);
  };

  const handleDownload = (applicationId) => {
    fetch(
      `${apiUrl}/candidate/applications/${applicationId}/download`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    )
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `CV_${applicationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(() => alert("No se pudo descargar el CV."));
  };

  const sendMessage = (applicationId) => {
    const bodyText = messages[applicationId]?.trim();
    if (!bodyText) return alert("Escribe un mensaje.");

    fetch(`${apiUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        application_id: applicationId,
        body: bodyText,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setMessages((prev) => ({
            ...prev,
            [applicationId]: "",
          }));
        } else {
          res.json().then((e) =>
            alert(e.message || "Error al enviar")
          );
        }
      })
      .catch((e) => alert(e.message));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis Ofertas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((o) => (
          <div
            key={o.id}
            onClick={() => loadApplications(o.id)}
            className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
              <FaBriefcase className="text-indigo-600 text-xl" />
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {o.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {o.applications_count}{" "}
                {o.applications_count === 1
                  ? "candidato"
                  : "candidatos"}
              </p>
            </div>
            <div>
              <svg
                className={`w-5 h-5 text-gray-400 transform ${
                  selectedOffer === o.id ? "rotate-180" : ""
                } transition-transform`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {selectedOffer && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-bold text-gray-800">
            Candidatos para oferta #{selectedOffer}
          </h3>

          {apps.length ? (
            <ul className="space-y-4">
              {apps.map((a) => (
                <li
                  key={a.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <FaUser className="text-gray-500 text-2xl" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {a.candidate.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Email: {a.candidate.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto">
                    <button
                      onClick={() => handleDownload(a.id)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      title="Descargar CV"
                    >
                      <FaDownload className="text-xl" />
                    </button>

                    <textarea
                      rows={2}
                      className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-400 focus:border-indigo-400 w-full md:w-64"
                      placeholder="Mensaje al candidato"
                      value={messages[a.id] || ""}
                      onChange={(e) =>
                        setMessages((prev) => ({
                          ...prev,
                          [a.id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      onClick={() => sendMessage(a.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Enviar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No hay candidaturas para esta oferta.
            </p>
          )}
        </div>
      )}
    </div>
  );
}


// Bandeja de Mensajes 

function Inbox() {
  const [threads, setThreads] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [messages, setMessages] = useState([]);
  const [bodyText, setBodyText] = useState("");

  useEffect(() => {
    fetch(`${apiUrl}/recruiter/messages`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(async (res) => {
        if (!res.ok) return [];
        return await res.json();
      })
      .then(setThreads)
      .catch(() => setThreads([]));
  }, []);

  const loadThread = (applicationId) => {
    fetch(`${apiUrl}/applications/${applicationId}/messages`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(async (res) => {
        if (!res.ok) return [];
        return await res.json();
      })
      .then((msgs) => {
        setMessages(msgs);
        setSelectedApp(applicationId);
        setBodyText("");
      })
      .catch(() => setMessages([]));
  };

  const sendThreadMessage = () => {
    if (!bodyText.trim()) return;
    fetch(`${apiUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        application_id: selectedApp,
        body: bodyText,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          await res.json().catch(() => {});
          return null;
        }
        return await res.json();
      })
      .then((msg) => {
        if (msg) {
          setMessages((prev) => [...prev, msg]);
          setBodyText("");
        }
      })
      .catch(console.error);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bandeja de Mensajes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          {threads.length ? (
            threads.map((t) => (
              <div
                key={t.application_id}
                onClick={() => loadThread(t.application_id)}
                className={`flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedApp === t.application_id
                    ? "border-2 border-indigo-500"
                    : ""
                }`}
              >
                <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
                  <FaUser className="text-gray-500 text-2xl" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-gray-800">
                    {t.candidate.name}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    {t.last_message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tienes mensajes.</p>
          )}
        </div>

        {selectedApp && (
          <div className="col-span-2 bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4">
              Chat con{" "}
              {threads.find((t) => t.application_id === selectedApp)
                ?.candidate.name}
            </h2>
            <div className="flex-1 overflow-auto space-y-3 mb-4">
              {messages.map((m) => {
                const isRecruiter = m.sender.role === "recruiter";
                return (
                  <div
                    key={m.id}
                    className={`flex ${
                      isRecruiter ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        isRecruiter
                          ? "bg-green-100 text-gray-800 rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">
                        <strong>{m.sender.name}:</strong> {m.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex">
              <textarea
                rows={2}
                className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Escribe un mensaje..."
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
              />
              <button
                onClick={sendThreadMessage}
                className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Crear Oferta

function CreateOffer() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handle = (e) => {
    e.preventDefault();
    fetch(`${apiUrl}/recruiter/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ title, description: desc }),
    })
      .then((r) => r.json())
      .then(() => window.location.reload())
      .catch(() => alert("Error creando la oferta."));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Oferta</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handle} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título de la oferta<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTag className="text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Escribe el título aquí"
                className="block w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción de la oferta<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-2 left-0 pl-3 flex items-start pointer-events-none">
                <FaBriefcase className="text-gray-400 mt-2" />
              </div>
              <textarea
                id="description"
                rows={6}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe los requisitos, funciones, beneficios..."
                className="block w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 resize-none"
                required
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
