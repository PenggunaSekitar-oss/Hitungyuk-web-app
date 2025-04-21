import { useState, useEffect } from "react";
import { getProfile } from "@/lib/storage";

export default function Header() {
  const [profile, setProfile] = useState<{ username: string; photoUrl: string }>({
    username: "",
    photoUrl: "",
  });

  useEffect(() => {
    const profileData = getProfile();
    setProfile(profileData);
  }, []);

  return (
    <header className="bg-white border-b-2 border-black fixed top-0 w-full z-10">
      <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="title text-2xl font-bold text-black">
            <span className="bg-primary text-white px-2 py-1 border-2 border-black">Hitung</span>
            <span className="bg-accent text-black px-2 py-1 border-2 border-black">Yuk</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 border-2 border-black bg-white">
            <i className="fa-solid fa-bell text-black"></i>
          </button>
          <div className="h-10 w-10 bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-black">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <i className="fa-solid fa-user text-gray-700"></i>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
