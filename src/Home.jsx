import React from 'react'
import { Link } from 'react-router-dom'
import logo from './assets/logo.png'
import { FaArrowCircleRight, FaUser, FaStar } from 'react-icons/fa'
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

const features = [
  {
    icon: <FaArrowCircleRight className="text-3xl mb-4" />,
    title: 'Impulsa tu trayectoria profesional',
    desc: 'Mantén tu perfil actualizado, sigue el estado de tus candidaturas y recibe recomendaciones de empleo personalizadas.',
  },
  {
    icon: <FaUser className="text-3xl mb-4" />,
    title: 'Optimiza tu proceso de selección',
    desc: 'Publica ofertas fácilmente, encuentra a los mejores candidatos y mejora tu estrategia de contratación.',
  },
  {
    icon: <FaStar className="text-3xl mb-4" />,
    title: 'Refuerza la supervisión de tu plataforma',
    desc: 'Accede a análisis detallados, gestiona cuentas de usuarios y garantiza operaciones eficientes.',
  }
]

const faqs = [
  {
    title: 'Cómo crear una oferta de empleo',
    desc: 'Publica ofertas de forma sencilla siguiendo nuestra guía intuitiva en el panel de reclutador.',
  },
  {
    title: 'Seguimiento de candidaturas',
    desc: 'Supervisa tus candidaturas y recibe actualizaciones desde tu panel.',
  },
  {
    title: 'Funciones para reclutadores',
    desc: 'Accede a herramientas de búsqueda de candidatos, publicación de empleos y comunicación.',
  },
  {
    title: 'Gestión de perfil',
    desc: 'Actualiza tu perfil, sube tu currículum y configura tus preferencias fácilmente.',
  },
  {
    title: 'Emparejamiento de empleo con IA',
    desc: 'Descubre roles personalizados con nuestras sugerencias impulsadas por IA.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-20 w-auto" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Unirse
            </Link>
          </div>
        </div>
      </header>

      <main className="bg-blue-50 flex items-center justify-center py-32">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold mb-4">
            Tu futuro trabajo, más cerca de lo que crees
          </h1>
          <p className="text-lg mb-6">
            Únete a la plataforma más avanzada de búsqueda de empleo.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </main>

      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Descubre un mundo de oportunidades</h2>
            <p className="mt-4 text-gray-400">
              Conecta con las mejores empresas y agiliza tu búsqueda de empleo en nuestra plataforma fácil de usar.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition"
              >
                <div className="flex justify-center text-blue-400">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-semibold text-center">{feat.title}</h3>
                <p className="mt-3 text-gray-300 text-center">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-900 text-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-medium text-blue-400 uppercase mb-2">
            Preguntas frecuentes
          </h2>
          <h3 className="text-3xl font-bold">
            Explora nuestro portal de empleo
          </h3>
          <p className="mt-4 text-gray-400">
            Descubre cómo sacar el máximo provecho de nuestra plataforma con estos consejos.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {faqs.map((item, idx) => (
            <div key={idx} className="border-l border-gray-700 pl-6">
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <footer className="relative bg-gradient-to-b from-blue-500 to-gray-800 pt-16 text-white">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 text-gray-900">
        <svg className="relative block w-[calc(100%+1.3px)] h-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M0,0V46.29c47.08,22,98.34,29,146.19,19.07C259.29,48.42,314.68,0,375.81,0s116.52,48.42,229.62,65.37c49.85,9.91,99.11,2.92,146.19-19.07A600.13,600.13,0,0,1,1200,0V120H0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 flex flex-col items-center">
        <img src={logo} alt="SkillHub Logo" className="h-20 mb-6 filter  invert" />

        <div className="flex space-x-6 mb-6">
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="h-6 w-6 hover:text-blue-300 transition" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="h-6 w-6 hover:text-blue-300 transition" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="h-6 w-6 hover:text-blue-300 transition" />
          </a>
        </div>

        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SkillHub_AI. Todos los derechos reservados.
        </p>
      </div>
    </footer>
    </div>
  )
}
