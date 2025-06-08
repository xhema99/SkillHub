import React, { useState, useEffect, useContext } from "react";
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FaBars,
  FaSearch,
  FaFolderOpen,
  FaEnvelope,
  FaSignOutAlt,
  FaUserCircle,
  FaDownload,
  FaBriefcase,
} from "react-icons/fa";
import { AuthContext } from "../context/Auth";
import { apiUrl } from "../HTTP/http";
import OfferDetail from "./OfferDetail";

import candidateMale from "../assets/candidate_male.png";
import candidateFemale from "../assets/candidate_female.png";

export default function DashboardCandidate() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarCandidate
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeaderCandidate onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<JobSearch />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="offers/:id" element={<OfferDetail />} />
            <Route path="inbox" element={<Inbox />} />
            <Route
              path="inbox/:applicationId"
              element={<ChatThread />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}


function MobileHeaderCandidate({ onMenuClick }) {
  return (
    <header className="md:hidden bg-gray-800 text-white flex items-center justify-between px-4 py-3">
      <button onClick={onMenuClick} className="text-2xl">
        <FaBars />
      </button>
      <span className="text-lg font-semibold">Candidate</span>
      <div style={{ width: "1.5rem" }} />
    </header>
  );
}


// Sidebar 

function SidebarCandidate({ sidebarOpen, setSidebarOpen, onLogout }) {
  const [avatar, setAvatar] = useState("male");
  const [menuOpen, setMenuOpen] = useState(false);

  const currentAvatar =
    avatar === "male" ? candidateMale : candidateFemale;

  const linkStyler = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded transition-colors text-gray-100 ${
      isActive ? "bg-gray-700" : "hover:bg-gray-700"
    }`;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
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
            alt="Avatar Candidate"
            className="w-20 h-20 rounded-full border-2 border-white object-cover cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <span className="mt-2 text-2xl font-bold text-white hidden md:block lg:block">
            Candidate
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
                  src={candidateMale}
                  alt="Hombre Candidate"
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
                  src={candidateFemale}
                  alt="Mujer Candidate"
                  className="w-8 h-8 rounded-full object-cover mr-3"
                />
                <span className="text-sm">Mujer</span>
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 flex flex-col overflow-auto py-4 space-y-1">
          <NavLink
            to="/candidate/dashboard"
            end
            className={linkStyler}
            onClick={closeSidebar}
          >
            <FaSearch className="text-xl md:text-lg" />
            <span className="ml-3 hidden md:inline-block lg:inline-block">
              Buscar empleos
            </span>
          </NavLink>

          <NavLink
            to="/candidate/dashboard/applications"
            className={linkStyler}
            onClick={closeSidebar}
          >
            <FaFolderOpen className="text-xl md:text-lg" />
            <span className="ml-3 hidden md:inline-block lg:inline-block">
              Mis candidaturas
            </span>
          </NavLink>

          <NavLink
            to="/candidate/dashboard/inbox"
            className={linkStyler}
            onClick={closeSidebar}
          >
            <FaEnvelope className="text-xl md:text-lg" />
            <span className="ml-3 hidden md:inline-block lg:inline-block">
              Bandeja
            </span>
          </NavLink>
        </nav>

        <button
          onClick={() => {
            onLogout();
            closeSidebar();
          }}
          className="flex items-center px-4 py-2 mb-4 hover:bg-gray-700 transition-colors text-gray-100"
        >
          <FaSignOutAlt className="text-xl md:text-lg" />
          <span className="ml-3 hidden md:inline-block lg:inline-block">
            Logout
          </span>
        </button>
      </aside>
    </>
  );
}

function getToken() {
  const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return info.token || "";
}

// 1) Buscador de Empleo

function JobSearch() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/offers?search=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then(setJobs)
      .catch(console.error);
  }, [query]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Buscar Empleos</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Palabras clave..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={() => {}}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          <FaSearch />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() =>
              navigate(`/candidate/dashboard/offers/${job.id}`)
            }
          >
            <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
              <FaBriefcase className="text-indigo-600 text-xl" />
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {job.title}
              </h2>
              <p className="text-gray-600 text-sm">{job.company}</p>
            </div>
            <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              Ver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3) Candidaturas Activas

function MyApplications() {
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/candidate/applications`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then(setApps)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis Candidaturas</h1>

      {apps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((a) => (
            <div
              key={a.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <div className="flex justify-center mt-6">
                <FaUserCircle className="text-gray-400 text-6xl" />
              </div>

              <div className="mt-4 px-4 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {a.offer.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  Estado: {a.status}
                </p>
              </div>

              <div className="flex-1 px-4 pb-4">
                <button
                  onClick={() =>
                    navigate(`/candidate/dashboard/inbox/${a.id}`)
                  }
                  className="mt-2 w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Mensajes
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aún no has aplicado a ninguna oferta.</p>
      )}
    </div>
  );
}

// 3) Bandeja de Entrada
function Inbox() {
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/candidate/messages`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then(setThreads)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bandeja de Mensajes</h1>

      {threads.length > 0 ? (
        <div className="space-y-4">
          {threads.map((t) => (
            <div
              key={t.application_id}
              className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
                <FaUserCircle className="text-gray-500 text-2xl" />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-800">
                  {t.recruiter.name}
                </p>
                <p className="text-gray-500 text-sm truncate">
                  {t.last_message}
                </p>
              </div>
              <button
                onClick={() =>
                  navigate(`/candidate/dashboard/inbox/${t.application_id}`)
                }
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Abrir
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tienes mensajes.</p>
      )}
    </div>
  );
}


// 4) Chat

function ChatThread() {
  const { applicationId } = useParams();
  const [msgs, setMsgs] = useState([]);
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/applications/${applicationId}/messages`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then(setMsgs)
      .catch(console.error);
  }, [applicationId]);

  const send = () => {
    if (!body.trim()) return;
    fetch(`${apiUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ application_id: applicationId, body }),
    })
      .then((res) => res.json())
      .then((msg) => {
        setMsgs((prev) => [...prev, msg]);
        setBody("");
      })
      .catch(console.error);
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        &larr; Volver
      </button>
      <h2 className="text-xl font-bold mb-4">
        Chat {applicationId}
      </h2>
      <div className="bg-white p-4 rounded shadow max-h-64 overflow-auto mb-4 space-y-3">
        {msgs.map((m) => {
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
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          onClick={send}
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

