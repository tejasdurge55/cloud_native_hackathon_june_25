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
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                <defs>
                  <radialGradient id="logoGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </radialGradient>
                </defs>
                <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" />
                <path
                  d="M16 32l8-16 8 16"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
      <div className="flex flex-1 container mx-auto px-8 py-10 gap-10">
        {/* Main Content */}
        <main className="flex-1 bg-white rounded-2xl shadow-xl p-10 min-h-[60vh]">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-600 text-sm border-t bg-white/90 mt-auto">
        © {new Date().getFullYear()} Cloud innovate hackathon. Crafted with ♥
        by Pratima, Shubham, Ajay and Tejas
      </footer>
    </div>
  );
}
