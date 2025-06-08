import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { AuthContext } from "./context/Auth";
import { apiUrl } from "./HTTP/http";
import bgImgLogin from "./assets/register-bg.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const resp = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await resp.json();

      if (result.status === 200) {
        const userInfo = {
          token: result.token,
          id:    result.id,
          name:  result.name,
          role:  result.role,
        };
        login(userInfo);

        switch (userInfo.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "recruiter":
            navigate("/recruiter/dashboard");
            break;
          case "candidate":
            navigate("/candidate/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 p-4">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-4xl">
        {/* En pantallas pequeñas (< md) será flex-col; a partir de md, flex-row */}
        <div className="flex flex-col md:flex-row h-full">
          {/* ─────────────── Imagen izquierda ─────────────── */}
          <div className="w-full md:w-1/2 h-48 md:h-auto">
            <img
              src={bgImgLogin}
              alt="Iniciar Sesión"
              className="object-cover w-full h-full"
            />
          </div>

          {/* ─────────────── Formulario derecha ─────────────── */}
          <div className="w-full md:w-1/2 bg-blue-100 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <input
                  {...register("email", {
                    required: "Es necesario introducir un email",
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

              {/* Contraseña */}
              <div>
                <input
                  {...register("password", {
                    required: "Es necesario introducir la contraseña",
                  })}
                  type="password"
                  placeholder="Contraseña"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : "border-blue-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Botón Entrar */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
              >
                Entrar
              </button>
            </form>

            {/* Link a registro */}
            <p className="mt-4 text-sm text-gray-600 text-center">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
