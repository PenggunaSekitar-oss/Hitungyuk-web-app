import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { getProfile, updateProfile } from "@/lib/storage";
import { UserProfile } from "@/lib/types";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    bio: "",
    photoUrl: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const profileData = getProfile();
    setProfile(profileData);
  }, []);

  const handlePhotoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile({
            ...profile,
            photoUrl: event.target.result as string,
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updateProfile(profile);
      toast({
        title: "Profil berhasil disimpan!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan profil",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="px-4 py-6 max-w-md mx-auto">
      <h2 className="heading text-xl font-bold mb-4 border-b-2 border-black pb-2">Profil Saya</h2>
      
      <div className="neu-card mb-6">
        <div className="p-5">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="h-32 w-32 bg-gray-200 flex items-center justify-center overflow-hidden mb-2 border-2 border-black">
                {profile.photoUrl ? (
                  <img 
                    src={profile.photoUrl} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <i className="fa-solid fa-user text-gray-700 text-4xl"></i>
                )}
              </div>
              <button 
                onClick={handlePhotoUpload}
                className="absolute bottom-0 right-0 bg-primary text-white w-10 h-10 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <i className="fa-solid fa-camera text-base"></i>
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-lg font-bold mt-4 bg-accent px-4 py-1 border-2 border-black">
              {profile.username || "Pengguna"}
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <Label htmlFor="username" className="font-bold mb-2 block">Nama Pengguna</Label>
              <input
                id="username"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
                placeholder="Masukkan nama pengguna"
                className="neu-input w-full p-3 font-medium"
              />
            </div>
            
            <div className="mb-5">
              <Label htmlFor="email" className="font-bold mb-2 block">Email</Label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                placeholder="Masukkan email"
                className="neu-input w-full p-3 font-medium"
              />
            </div>
            
            <div className="mb-5">
              <Label htmlFor="bio" className="font-bold mb-2 block">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={profile.bio}
                onChange={handleInputChange}
                placeholder="Ceritakan tentang diri Anda"
                className="neu-input w-full p-3 font-medium"
              />
            </div>
            
            <button 
              type="submit" 
              className="neu-button-secondary w-full py-4 text-lg"
            >
              Simpan Profil
            </button>
          </form>
        </div>
      </div>
      
      <div className="neu-card overflow-hidden">
        <div className="border-b-2 border-black">
          <button className="w-full py-4 px-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
            <span className="font-bold">Notifikasi</span>
            <div className="bg-primary w-8 h-8 flex items-center justify-center border-2 border-black">
              <i className="fa-solid fa-chevron-right text-white"></i>
            </div>
          </button>
        </div>
        <div className="border-b-2 border-black">
          <button className="w-full py-4 px-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
            <span className="font-bold">Bantuan & Dukungan</span>
            <div className="bg-primary w-8 h-8 flex items-center justify-center border-2 border-black">
              <i className="fa-solid fa-chevron-right text-white"></i>
            </div>
          </button>
        </div>
        <div>
          <button className="w-full py-4 px-5 flex justify-between items-center hover:bg-red-50 transition-colors">
            <span className="font-bold text-red-500">Keluar</span>
            <div className="bg-red-500 w-8 h-8 flex items-center justify-center border-2 border-black">
              <i className="fa-solid fa-arrow-right-from-bracket text-white"></i>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
