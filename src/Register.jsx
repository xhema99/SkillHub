import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { AuthContext } from "./context/Auth";
import { apiUrl } from "./HTTP/http";
import bgImgRegister from "./assets/register-bg.png";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const resp = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await resp.json();

      if (resp.ok && result.status === 201) {
        const userInfo = {
          token: result.token,
          id:    result.id,
          name:  result.name,
          role:  result.role,
        };
        login(userInfo);

        if (userInfo.role === "candidate") {
          navigate("/candidate/dashboard");
        } else if (userInfo.role === "recruiter") {
          navigate("/recruiter/dashboard");
        } else {
          navigate("/");
        }
      } else {
        if (result.errors) {
          Object.values(result.errors)
            .flat()
            .forEach((msg) => toast.error(msg));
        } else {
          toast.error(result.message || "Error en el registro");
        }
      }
    } catch {
      toast.error("Fallo al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 p-4">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-4xl">
        {/* En mobile: columna; en ≥md fila */}
        <div className="flex flex-col md:flex-row h-full">
          {/* ─────────────── Imagen izquierda ─────────────── */}
          <div className="w-full md:w-1/2 h-48 md:h-auto">
            <img
              src={bgImgRegister}
              alt="Registro"
              className="object-cover w-full h-full"
            />
          </div>

          {/* ──────────── Formulario derecha ──────────── */}
          <div className="w-full md:w-1/2 bg-blue-100 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Crea tu cuenta
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nombre completo */}
              <div>
                <input
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  type="text"
                  placeholder="Nombre completo"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-blue-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Formato de email inválido",
                    },
                  })}
                  type="email"
                  placeholder="Email"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-blue-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Tipo de cuenta (role) */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Tipo de cuenta
                </label>
                <select
                  {...register("role", {
                    required: "Debes seleccionar un tipo de cuenta",
                  })}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.role ? "border-red-500" : "border-blue-300"
                  }`}
                >
                  <option value="">— Selecciona —</option>
                  <option value="candidate">Candidato</option>
                  <option value="recruiter">Reclutador</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <input
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "Mínimo 6 caracteres",
                    },
                  })}
                  type="password"
                  placeholder="Contraseña"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : "border-blue-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div>
                <input
                  {...register("password_confirmation", {
                    required: "Confirma tu contraseña",
                    validate: (val, ctx) =>
                      val === ctx.password || "Las contraseñas no coinciden",
                  })}
                  type="password"
                  placeholder="Repite la contraseña"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password_confirmation
                      ? "border-red-500"
                      : "border-blue-300"
                  }`}
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {/* Botón Crear cuenta */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
              >
                Crear cuenta
              </button>
            </form>

            {/* Link a login */}
            <p className="mt-4 text-sm text-gray-600 text-center">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
