import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f9] font-serif">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 py-5 shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-8">
          <span className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
            Team - Dev Killers
          </span>
          <Navbar />
        </div>
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
