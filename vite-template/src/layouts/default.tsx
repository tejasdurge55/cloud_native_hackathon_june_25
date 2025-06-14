import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f9] font-serif">
      {/* Header */}
      <header className="w-full bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-400 py-8 shadow-2xl relative z-10 overflow-hidden animate-fade-in">
        {/* Animated floating shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute left-10 top-4 w-20 h-20 bg-cyan-300 rounded-full opacity-40 animate-bounce-slow shadow-2xl blur-sm" />
          <div className="absolute right-16 top-12 w-28 h-28 bg-indigo-400 rounded-full opacity-30 animate-pulse-slow shadow-xl blur-md" />
          <div className="absolute left-1/2 bottom-0 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-float shadow-lg blur" />
          <div className="absolute right-1/3 top-1/2 w-16 h-16 bg-gradient-to-tr from-pink-400 via-cyan-200 to-blue-400 rounded-full opacity-30 animate-orbit" />
          <div className="absolute left-1/4 bottom-8 w-12 h-12 bg-gradient-to-br from-yellow-200 via-pink-300 to-indigo-200 rounded-full opacity-40 animate-orbit-rev" />
          <div className="absolute right-10 bottom-4 w-10 h-10 bg-white rounded-full opacity-20 animate-twinkle" />
        </div>
        <div className="container mx-auto flex items-center justify-between px-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-3 shadow-2xl animate-spin-slow border-4 border-cyan-200">
              <svg fill="none" height="40" viewBox="0 0 48 48" width="40">
                <defs>
                  <radialGradient cx="50%" cy="50%" id="logoGradient" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </radialGradient>
                </defs>
                <circle cx="24" cy="24" fill="url(#logoGradient)" r="22" />
                <path
                  d="M16 32l8-16 8 16"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
              </svg>
            </div>
            <span className="text-4xl font-extrabold text-white tracking-wider drop-shadow-xl animate-gradient-text bg-gradient-to-r from-cyan-200 via-white to-blue-300 bg-clip-text text-transparent">
              Team{" "}
              <span className="text-cyan-200 animate-pulse">Dev Killers</span>
            </span>
          </div>
          <Navbar />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-900 rounded-t-xl opacity-90 animate-slide-in" />
        {/* Animations */}
        <style>
          {`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(-30px);}
              to { opacity: 1; transform: translateY(0);}
            }
            .animate-fade-in {
              animation: fade-in 1.2s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes bounce-slow {
              0%, 100% { transform: translateY(0);}
              50% { transform: translateY(-30px);}
            }
            .animate-bounce-slow {
              animation: bounce-slow 3.5s infinite;
            }
            @keyframes pulse-slow {
              0%, 100% { opacity: 0.3;}
              50% { opacity: 0.7;}
            }
            .animate-pulse-slow {
              animation: pulse-slow 2.8s infinite;
            }
            @keyframes float {
              0%, 100% { transform: translateY(0);}
              50% { transform: translateY(25px);}
            }
            .animate-float {
              animation: float 4.5s ease-in-out infinite;
            }
            @keyframes spin-slow {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
            .animate-spin-slow {
              animation: spin-slow 7s linear infinite;
            }
            @keyframes slide-in {
              from { transform: translateY(30px); opacity: 0;}
              to { transform: translateY(0); opacity: 0.9;}
            }
            .animate-slide-in {
              animation: slide-in 1.3s cubic-bezier(0.4,0,0.2,1);
            }
            .animate-gradient-text {
              background-size: 200% 200%;
              animation: gradient-move 3.5s ease-in-out infinite;
            }
            @keyframes gradient-move {
              0%,100% { background-position: 0% 50%;}
              50% { background-position: 100% 50%;}
            }
            @keyframes orbit {
              0% { transform: rotate(0deg) translateX(0);}
              50% { transform: rotate(180deg) translateX(20px);}
              100% { transform: rotate(360deg) translateX(0);}
            }
            .animate-orbit {
              animation: orbit 6s linear infinite;
            }
            @keyframes orbit-rev {
              0% { transform: rotate(0deg) translateY(0);}
              50% { transform: rotate(-180deg) translateY(-20px);}
              100% { transform: rotate(-360deg) translateY(0);}
            }
            .animate-orbit-rev {
              animation: orbit-rev 7s linear infinite;
            }
            @keyframes twinkle {
              0%, 100% { opacity: 0.2; transform: scale(1);}
              50% { opacity: 0.7; transform: scale(1.3);}
            }
            .animate-twinkle {
              animation: twinkle 2.2s ease-in-out infinite;
            }
          `}
        </style>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 container mx-auto px-8 py-14 gap-12 relative">
        {/* Extra Decorative Animated Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Existing shapes */}
          <div className="absolute left-0 top-1/3 w-32 h-32 bg-gradient-to-br from-indigo-200 via-cyan-100 to-white rounded-full opacity-40 blur-2xl animate-float" />
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tr from-pink-200 via-yellow-100 to-blue-100 rounded-full opacity-30 blur-xl animate-orbit" />
          <div className="absolute left-1/2 top-0 w-16 h-16 bg-cyan-200 rounded-full opacity-20 blur animate-twinkle" />
          {/* New animated sparkles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 bg-gradient-to-tr from-cyan-300 via-white to-indigo-400 rounded-full opacity-70 animate-sparkle`}
              style={{
                left: `${Math.random() * 95}%`,
                top: `${Math.random() * 95}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          {/* Animated lines */}
          <svg
            className="absolute left-1/4 top-1/2 w-40 h-40 opacity-30 animate-spin-slow"
            fill="none"
            viewBox="0 0 160 160"
          >
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#lineGrad)"
              strokeDasharray="12 8"
              strokeWidth="2"
            />
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="lineGrad"
                x1="0"
                x2="160"
                y1="0"
                y2="160"
              >
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#a5b4fc" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Main Content */}
        <main className="flex-1 bg-white/90 rounded-3xl shadow-2xl p-12 min-h-[60vh] relative z-10 border border-cyan-100 backdrop-blur-lg transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] overflow-hidden">
          {/* Animated gradient bar */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full blur-sm opacity-70 animate-gradient-text" />
          {/* Floating confetti */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-80 animate-confetti"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${Math.random() * 90}%`,
                background: `linear-gradient(135deg, #f472b6, #38bdf8, #facc15)`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          {/* Glow border */}
          <div className="absolute inset-0 rounded-3xl border-2 border-cyan-200 opacity-30 pointer-events-none animate-glow" />
          {children}
        </main>
        {/* Stylish Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 w-80 bg-gradient-to-br from-white via-cyan-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100 relative z-10 overflow-hidden">
          {/* Animated avatar */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-300 via-indigo-200 to-blue-200 shadow-lg border-2 border-cyan-100 animate-spin-slow flex items-center justify-center">
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
                <circle cx="12" cy="12" fill="#38bdf8" opacity="0.7" r="10" />
                <path
                  d="M8 16c0-2 4-2 4 0"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <circle cx="10" cy="10" fill="#fff" r="1" />
                <circle cx="14" cy="10" fill="#fff" r="1" />
              </svg>
            </div>
            <div className="text-lg font-bold text-blue-900 tracking-wide animate-gradient-text">
              Welcome!
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            🚀 Explore, innovate, and collaborate.
            <br />
            <span className="font-semibold text-cyan-600">
              Cloud Native Hackathon
            </span>{" "}
            is your canvas for creativity!
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold animate-bounce-slow">
              #TeamDevKillers
            </span>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold animate-pulse-slow">
              #Hackathon2024
            </span>
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold animate-twinkle">
              #Innovation
            </span>
          </div>
          {/* Animated progress bar */}
            {/* Animated Aurora Achievement Wheel */}
            <div className="mt-6 w-full flex flex-col items-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Aurora Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-200 via-indigo-200 to-pink-200 blur-2xl opacity-60 animate-glow" />
              {/* Rotating Dots */}
              {[...Array(8)].map((_, i) => (
                <div
                key={i}
                className="absolute w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  left: `calc(50% - 1.5rem + ${80 * Math.cos((i * Math.PI) / 4)}px)`,
                  top: `calc(50% - 1.5rem + ${80 * Math.sin((i * Math.PI) / 4)}px)`,
                  animation: `orbit-dot 6s linear infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
                >
                <div
                  className={`w-5 h-5 rounded-full shadow-lg ${
                  i === 0
                    ? "bg-gradient-to-tr from-cyan-400 to-blue-400"
                    : i === 2
                    ? "bg-gradient-to-tr from-pink-400 to-yellow-300"
                    : i === 4
                    ? "bg-gradient-to-tr from-yellow-200 to-cyan-200"
                    : i === 6
                    ? "bg-gradient-to-tr from-pink-200 to-blue-100"
                    : "bg-white/80"
                  } border-2 border-white`}
                />
                </div>
              ))}
              {/* Center Trophy */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-300 to-indigo-400 flex items-center justify-center shadow-2xl border-4 border-white animate-spin-slow">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <circle cx="19" cy="19" r="17" fill="#fff" opacity="0.18" />
                <path
                  d="M13 25h12M19 25v-2M15 13h8v4a4 4 0 01-8 0v-4z"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                </svg>
              </div>
              {/* Animated Sparkles */}
              {[...Array(6)].map((_, i) => (
                <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-tr from-cyan-300 via-white to-indigo-400 opacity-80 animate-sparkle"
                style={{
                  left: `${50 + 40 * Math.cos((i * Math.PI) / 3)}%`,
                  top: `${50 + 40 * Math.sin((i * Math.PI) / 3)}%`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${i * 0.4}s`,
                }}
                />
              ))}
              {/* CSS for orbit-dot animation */}
              <style>
                {`
                @keyframes orbit-dot {
                0% { transform: rotate(0deg) translateY(0); }
                100% { transform: rotate(360deg) translateY(0); }
                }
                `}
              </style>
              </div>
              {/* Achievement Labels */}
              <div className="grid grid-cols-2 gap-3 mt-6 w-full">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-twinkle" />
                <span className="text-xs font-semibold text-cyan-700">Kickoff</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs font-semibold text-pink-700">Prototype</span>
                <span className="w-3 h-3 rounded-full bg-pink-400 animate-twinkle" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400 animate-twinkle" />
                <span className="text-xs font-semibold text-yellow-700">Collaboration</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs font-semibold text-indigo-700">Submission</span>
                <span className="w-3 h-3 rounded-full bg-indigo-400 animate-twinkle" />
              </div>
              </div>
              <div className="text-xs text-gray-500 mt-4 animate-fade-in">
              <span className="font-semibold text-cyan-600"> Achievements Unlocked!</span>
              </div>
            </div>
          {/* NEW: Team Members */}
          <div className="mt-8">
            <div className="text-base font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <svg
                className="inline-block"
                fill="none"
                height="18"
                viewBox="0 0 24 24"
                width="18"
              >
                <circle cx="12" cy="12" fill="#a5b4fc" r="10" />
                <path
                  d="M8 16c0-2 4-2 4 0"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <circle cx="10" cy="10" fill="#fff" r="1" />
                <circle cx="14" cy="10" fill="#fff" r="1" />
              </svg>
              Team Members
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-twinkle" />
                <span className="font-medium text-gray-800">Pratima</span>
                <span className="text-xs text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full ml-auto">
                  Frontend
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-twinkle" />
                <span className="font-medium text-gray-800">Shubham</span>
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-auto">
                  AI/ML
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-twinkle" />
                <span className="font-medium text-gray-800">Ajay</span>
                <span className="text-xs text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full ml-auto">
                  Backend
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-twinkle" />
                <span className="font-medium text-gray-800">Tejas</span>
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full ml-auto">
                  DevOps
                </span>
              </li>
            </ul>
          </div>

          {/* NEW: Spotlight Modal Trigger */}
          <div className="mt-8">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 animate-fade-in"
              onClick={() => {
                const modal = document.getElementById("spotlight-modal");
                if (modal) modal.showModal();
              }}
            >
              <svg
                className="inline-block"
                fill="none"
                height="20"
                viewBox="0 0 24 24"
                width="20"
              >
                <circle cx="12" cy="12" fill="#fff" opacity="0.2" r="10" />
                <path
                  d="M12 6v6l4 2"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
              Open Spotlight
            </button>
            {/* Modal */}
            <dialog
              id="spotlight-modal"
              className="rounded-2xl shadow-2xl p-0 border-0 max-w-md w-full bg-white/95 backdrop:bg-black/40 animate-fade-in"
            >
              <div className="p-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-300 to-indigo-400 flex items-center justify-center shadow-xl animate-spin-slow">
                  <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
                    <circle cx="16" cy="16" fill="#fff" opacity="0.2" r="14" />
                    <path
                      d="M16 8v8l6 3"
                      stroke="#6366f1"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-blue-900 text-center">
                  Spotlight Feature
                </h2>
                <p className="text-gray-700 text-sm text-center">
                  Discover quick links, team highlights, and hackathon resources
                  in one place!
                </p>
                <ul className="w-full text-sm space-y-2">
                  <li>
                    <a
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-50 transition"
                      href="https://cloud.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Cloud Docs
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
                      href="https://github.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      GitHub Repo
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-50 transition"
                      href="https://www.linkedin.com/company/cncg-pune/ "
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="w-2 h-2 rounded-full bg-pink-400" />
                      Hackathon Portal
                    </a>
                  </li>
                </ul>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-400 to-indigo-400 text-white rounded-lg font-semibold shadow hover:scale-105 transition-transform"
                  onClick={() => {
                    const modal = document.getElementById("spotlight-modal");
                    if (modal) modal.close();
                  }}
                >
                  Close
                </button>
              </div>
            </dialog>
          </div>
          {/* NEW: Fun Fact */}
          <div className="mt-8 bg-gradient-to-r from-cyan-100 via-blue-50 to-indigo-100 rounded-xl p-4 shadow-inner flex items-center gap-3 animate-fade-in">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
              <circle cx="12" cy="12" fill="#facc15" r="10" />
              <path
                d="M12 8v4l2 2"
                stroke="#fff"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-xs text-gray-700">
              <span className="font-semibold text-yellow-600">Fun Fact:</span>{" "}
              The word "hackathon" is a blend of "hack" and "marathon"!
            </span>
          </div>
          <div className="mt-auto text-xs text-gray-400 animate-gradient-text">
            Stay creative ✨
          </div>
        </aside>
        {/* Extra CSS for new animations */}
        <style>
          {`
        @keyframes sparkle {
          0%, 100% { opacity: 0.7; transform: scale(1);}
          50% { opacity: 1; transform: scale(1.7);}
        }
        .animate-sparkle {
          animation: sparkle 2.2s infinite;
        }
        @keyframes confetti {
          0% { opacity: 0; transform: translateY(-10px) scale(1);}
          10% { opacity: 1;}
          90% { opacity: 1;}
          100% { opacity: 0; transform: translateY(40px) scale(1.2);}
        }
        .animate-confetti {
          animation: confetti 3.5s linear infinite;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 24px 6px #38bdf8aa;}
          50% { box-shadow: 0 0 36px 12px #6366f1bb;}
        }
        .animate-glow {
          animation: glow 2.5s ease-in-out infinite;
        }
        @keyframes progress {
          0% { width: 0;}
          50% { width: 90%;}
          100% { width: 0;}
        }
        .animate-progress {
          animation: progress 3.5s cubic-bezier(0.4,0,0.2,1) infinite;
        }
          `}
        </style>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-600 text-sm border-t bg-white/90 mt-auto">
        © {new Date().getFullYear()} Cloud Native hackathon. Crafted with ♥
        by Pratima, Shubham, Ajay and Tejas
      </footer>
    </div>
  );
}
