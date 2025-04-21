import { Link, useLocation } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/", icon: "fa-house", label: "Dashboard" },
    { path: "/custom", icon: "fa-plus", label: "Custom" },
    { path: "/calculator", icon: "fa-calculator", label: "Kalkulator" },
    { path: "/data-center", icon: "fa-database", label: "Pusat Data" },
    { path: "/profile", icon: "fa-user", label: "Profil" }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t-2 border-black py-2 z-10">
      <div className="max-w-md mx-auto px-8 flex justify-between">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className={`flex flex-col items-center ${
              isActive(item.path) 
                ? 'text-white bg-primary border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'text-black bg-white'
              } px-2 py-1 transition-all`}>
              <i className={`fa-solid ${item.icon} ${isActive(item.path) ? 'text-white' : 'text-black'} text-lg`}></i>
              <span className={`text-xs font-medium mt-1 ${isActive(item.path) ? 'text-white' : 'text-black'}`}>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
