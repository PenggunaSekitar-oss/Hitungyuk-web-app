import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { saveProject, addWorkerToProject } from "@/lib/storage";
import { Label } from "@/components/ui/label";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";

interface WorkerForm {
  id: string;
  name: string;
  position: string;
  dailySalary: string;
  workDays: string;
}

export default function Custom() {
  const [projectName, setProjectName] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [savedWorkers, setSavedWorkers] = useState<string[]>([]);
  const [currentWorker, setCurrentWorker] = useState<WorkerForm>({
    id: uuidv4(),
    name: "",
    position: "Tukang",
    dailySalary: "",
    workDays: "",
  });
  const [customPosition, setCustomPosition] = useState("");

  const resetWorkerForm = () => {
    setCurrentWorker({
      id: uuidv4(),
      name: "",
      position: "Tukang",
      dailySalary: "",
      workDays: "",
    });
    setCustomPosition("");
  };

  const handleWorkerChange = (field: keyof WorkerForm, value: string) => {
    setCurrentWorker({
      ...currentWorker,
      [field]: value
    });
  };

  const handleAddWorker = () => {
    // Validate worker form
    if (!currentWorker.name.trim()) {
      toast({
        title: "Nama pekerja wajib diisi",
        variant: "destructive",
      });
      return;
    }

    if (!currentWorker.dailySalary || parseInt(currentWorker.dailySalary) <= 0) {
      toast({
        title: "Gaji harian harus lebih dari 0",
        variant: "destructive",
      });
      return;
    }

    if (!currentWorker.workDays || parseInt(currentWorker.workDays) <= 0) {
      toast({
        title: "Jumlah hari kerja harus lebih dari 0",
        variant: "destructive",
      });
      return;
    }

    try {
      // If project not created yet, create it first
      if (!projectCreated) {
        // Validate project info
        if (!projectName.trim()) {
          toast({
            title: "Nama proyek wajib diisi",
            variant: "destructive",
          });
          return;
        }

        if (!projectAddress.trim()) {
          toast({
            title: "Alamat proyek wajib diisi",
            variant: "destructive",
          });
          return;
        }

        // Save project
        const newProject = saveProject({
          name: projectName,
          address: projectAddress,
        });

        setProjectId(newProject.id);
        setProjectCreated(true);
      }

      // Add worker to the project
      const worker = addWorkerToProject(projectId, {
        name: currentWorker.name,
        position: currentWorker.position,
        dailySalary: parseInt(currentWorker.dailySalary),
        workDays: parseInt(currentWorker.workDays),
      });

      // Add to saved workers list
      setSavedWorkers([...savedWorkers, worker.name]);

      toast({
        title: "Pekerja berhasil ditambahkan!",
        description: `${worker.name} telah ditambahkan ke proyek`,
        variant: "default",
      });

      // Reset worker form for next input
      resetWorkerForm();
    } catch (error) {
      toast({
        title: "Gagal menambahkan pekerja",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleSaveProject = () => {
    // Validate project info
    if (!projectName.trim()) {
      toast({
        title: "Nama proyek wajib diisi",
        variant: "destructive",
      });
      return;
    }

    if (!projectAddress.trim()) {
      toast({
        title: "Alamat proyek wajib diisi",
        variant: "destructive",
      });
      return;
    }

    if (projectCreated) {
      toast({
        title: "Proyek sudah disimpan",
        description: "Proyek ini sudah dibuat sebelumnya",
        variant: "default",
      });
      return;
    }

    try {
      // Save project
      const newProject = saveProject({
        name: projectName,
        address: projectAddress,
      });

      setProjectId(newProject.id);
      setProjectCreated(true);

      toast({
        title: "Proyek berhasil disimpan!",
        description: `Proyek "${projectName}" telah dibuat`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan proyek",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleSaveWorker = () => {
    // Validate worker form
    if (!currentWorker.name.trim()) {
      toast({
        title: "Nama pekerja wajib diisi",
        variant: "destructive",
      });
      return;
    }

    if (!currentWorker.dailySalary || parseInt(currentWorker.dailySalary) <= 0) {
      toast({
        title: "Gaji harian harus lebih dari 0",
        variant: "destructive",
      });
      return;
    }

    if (!currentWorker.workDays || parseInt(currentWorker.workDays) <= 0) {
      toast({
        title: "Jumlah hari kerja harus lebih dari 0",
        variant: "destructive",
      });
      return;
    }

    // If project not created yet, create it first
    if (!projectCreated) {
      handleSaveProject();
      if (!projectCreated) return; // If project creation failed, stop here
    }

    try {
      // Add worker to the project with custom position if selected
      const finalPosition = currentWorker.position === "Lainnya" && customPosition.trim() 
        ? customPosition.trim() 
        : currentWorker.position;
        
      const worker = addWorkerToProject(projectId, {
        name: currentWorker.name,
        position: finalPosition,
        dailySalary: parseInt(currentWorker.dailySalary),
        workDays: parseInt(currentWorker.workDays),
      });

      // Add to saved workers list
      setSavedWorkers([...savedWorkers, worker.name]);

      toast({
        title: "Pekerja berhasil ditambahkan!",
        description: `${worker.name} telah ditambahkan ke proyek`,
        variant: "default",
      });

      // Reset worker form for next input
      resetWorkerForm();
    } catch (error) {
      toast({
        title: "Gagal menambahkan pekerja",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If no workers have been added yet
    if (!projectCreated) {
      handleSaveProject();
      return;
    }

    // If there's data in the current worker form, add it first
    if (currentWorker.name.trim() || currentWorker.dailySalary || currentWorker.workDays) {
      handleSaveWorker();
    }

    toast({
      title: "Semua data berhasil disimpan!",
      description: `Proyek dengan ${savedWorkers.length} pekerja telah disimpan`,
      variant: "default",
    });

    // Reset all forms
    setProjectName("");
    setProjectAddress("");
    setProjectCreated(false);
    setProjectId("");
    setSavedWorkers([]);
    resetWorkerForm();
  };

  return (
    <section className="px-4 py-6 max-w-md mx-auto">
      <h2 className="heading text-xl font-bold mb-4 border-b-2 border-black pb-2">Input Data Proyek</h2>

      <div className="neu-card mb-6">
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <Label htmlFor="project-name" className="mb-2 font-bold block">Nama Proyek</Label>
              <input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Masukkan nama proyek"
                className="neu-input w-full p-3 font-medium"
                disabled={projectCreated}
              />
            </div>

            <div className="mb-5">
              <Label htmlFor="project-address" className="mb-2 font-bold block">Alamat Proyek</Label>
              <input
                id="project-address"
                value={projectAddress}
                onChange={(e) => setProjectAddress(e.target.value)}
                placeholder="Masukkan alamat proyek"
                className="neu-input w-full p-3 font-medium"
                disabled={projectCreated}
              />
            </div>
            
            <button
              type="button"
              className="neu-button w-full py-3 mb-4"
              onClick={handleSaveProject}
              disabled={projectCreated}
            >
              Simpan Proyek
            </button>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <Label className="font-bold text-lg">Pekerja</Label>
                {savedWorkers.length > 0 && (
                  <div className="text-sm font-medium bg-secondary px-2 py-1 rounded">
                    {savedWorkers.length} pekerja ditambahkan
                  </div>
                )}
              </div>

              {/* Single worker form that resets after each submission */}
              <div className="p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative mb-4">
                <div className="mb-4">
                  <Label className="font-bold mb-2 block">Nama Pekerja</Label>
                  <input
                    className="neu-input w-full p-3 font-medium"
                    value={currentWorker.name}
                    onChange={(e) => handleWorkerChange("name", e.target.value)}
                    placeholder="Nama pekerja"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="font-bold mb-2 block">Posisi</Label>
                    <Select
                      value={currentWorker.position}
                      onValueChange={(value) => {
                        handleWorkerChange("position", value);
                        if (value !== "Lainnya") {
                          setCustomPosition("");
                        }
                      }}
                    >
                      <SelectTrigger className="neu-select p-3 font-medium">
                        <SelectValue placeholder="Pilih posisi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tukang">Tukang</SelectItem>
                        <SelectItem value="Buruh">Buruh</SelectItem>
                        <SelectItem value="Mandor">Mandor</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    {currentWorker.position === "Lainnya" && (
                      <div className="mt-2">
                        <input
                          className="neu-input w-full p-3 font-medium"
                          value={customPosition}
                          onChange={(e) => {
                            setCustomPosition(e.target.value);
                          }}
                          placeholder="Masukkan posisi custom"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="font-bold mb-2 block">Gaji Harian (Rp)</Label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="neu-input w-full p-3 font-medium"
                      value={currentWorker.dailySalary ? parseInt(currentWorker.dailySalary).toLocaleString('id-ID') : ''}
                      onChange={(e) => {
                        // Remove non-numeric characters
                        const numericValue = e.target.value.replace(/\D/g, '');
                        handleWorkerChange("dailySalary", numericValue);
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-bold mb-2 block">Jumlah Hari Kerja</Label>
                  <input
                    type="number"
                    className="neu-input w-full p-3 font-medium"
                    value={currentWorker.workDays}
                    onChange={(e) => handleWorkerChange("workDays", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                type="button"
                className="neu-button w-full py-3 mb-4"
                onClick={handleSaveWorker}
              >
                Simpan Pekerja
              </button>

              {savedWorkers.length > 0 && (
                <div className="mb-4 p-3 border-2 border-dashed border-black">
                  <h3 className="font-bold mb-2">Pekerja yang sudah ditambahkan:</h3>
                  <ul className="list-disc pl-5">
                    {savedWorkers.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="neu-button-secondary w-full py-4 text-lg"
            >
              Simpan Semua Data
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
