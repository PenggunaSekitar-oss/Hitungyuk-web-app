import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { getCalculations, deleteCalculation, getProjects, deleteProject, deleteAllData } from "@/lib/storage";
import { formatCurrency, formatDate, createSalaryReport } from "@/lib/formatUtils";
import { exportAsPNG, shareViaWhatsApp, shareViaEmail } from "@/lib/exportUtils";
import { CalculationResult, Project } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type FilterType = "all" | "projects" | "workers" | "payments";

export default function DataCenter() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [calculations, setCalculations] = useState<CalculationResult[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedCalculations = getCalculations();
    const loadedProjects = getProjects();
    
    setCalculations(loadedCalculations);
    setProjects(loadedProjects);
  };

  const handleDeleteCalculation = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        deleteCalculation(id);
        setCalculations(calculations.filter(calc => calc.id !== id));
        toast({
          title: "Data berhasil dihapus",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Gagal menghapus data",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      try {
        deleteProject(id);
        setProjects(projects.filter(project => project.id !== id));
        setCalculations(calculations.filter(calc => calc.projectId !== id));
        toast({
          title: "Proyek berhasil dihapus",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Gagal menghapus proyek",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    }
  };

  const getFilteredData = () => {
    switch (filter) {
      case "projects":
        return projects.map(project => ({
          id: project.id,
          title: project.name,
          subtitle: project.address,
          date: project.createdAt,
          count: project.workers.length,
          total: project.workers.reduce((sum, worker) => sum + (worker.dailySalary * worker.workDays), 0),
          type: "project" as const
        }));
      case "workers":
        // Flatten all workers from all projects and show them individually
        return projects.flatMap(project => 
          project.workers.map(worker => ({
            id: worker.id,
            title: worker.name, // Show worker name as title
            subtitle: `${worker.position} - ${project.name}`,
            date: project.createdAt,
            count: worker.workDays,
            total: worker.dailySalary * worker.workDays,
            type: "worker" as const
          }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "payments":
        return calculations.map(calc => ({
          id: calc.id,
          title: calc.projectName,
          subtitle: formatDate(calc.date),
          date: calc.date,
          count: calc.workers.length,
          total: calc.totalSalary, // Already showing total payment
          type: "calculation" as const
        }));
      default:
        // Show only calculations for "all" view to prevent duplication
        // Previously this was combining both projects and calculations
        return calculations.map(calc => ({
          id: calc.id,
          title: calc.projectName,
          subtitle: calc.projectAddress || formatDate(calc.date),
          date: calc.date,
          count: calc.workers.length,
          total: calc.totalSalary,
          type: "calculation" as const
        })).sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleDeleteAllData = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus SEMUA data? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        deleteAllData();
        setProjects([]);
        setCalculations([]);
        toast({
          title: "Semua data berhasil dihapus",
          description: "Aplikasi telah dikembalikan ke kondisi awal",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Gagal menghapus semua data",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    }
  };

  const filteredData = getFilteredData();

  const getFilterColor = (filterType: FilterType) => {
    switch(filterType) {
      case "all": return "#6F00FF";
      case "projects": return "#00C853";
      case "workers": return "#FFCA28";
      case "payments": return "#FF5722";
      default: return "#6F00FF";
    }
  };

  return (
    <section className="px-4 py-6 max-w-md mx-auto">
      <h2 className="heading text-xl font-bold mb-4 border-b-2 border-black pb-2">Pusat Data</h2>
      
      <div className="flex mb-6 overflow-x-auto pb-2 space-x-3">
        <button 
          onClick={() => handleFilterChange("all")}
          className={`py-2 px-4 whitespace-nowrap border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            filter === "all" 
              ? "bg-primary text-white" 
              : "bg-white text-black hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          }`}
        >
          Semua
        </button>
        <button 
          onClick={() => handleFilterChange("projects")}
          className={`py-2 px-4 whitespace-nowrap border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            filter === "projects" 
              ? "bg-primary text-white" 
              : "bg-white text-black hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          }`}
        >
          Proyek
        </button>
        <button 
          onClick={() => handleFilterChange("workers")}
          className={`py-2 px-4 whitespace-nowrap border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            filter === "workers" 
              ? "bg-primary text-white" 
              : "bg-white text-black hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          }`}
        >
          Pekerja
        </button>
        <button 
          onClick={() => handleFilterChange("payments")}
          className={`py-2 px-4 whitespace-nowrap border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            filter === "payments" 
              ? "bg-primary text-white" 
              : "bg-white text-black hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          }`}
        >
          Pembayaran
        </button>
      </div>
      
      <div className="mb-6">
        <button 
          onClick={handleDeleteAllData}
          className="w-full py-2 px-4 border-2 border-black font-bold bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <i className="fa-solid fa-trash-can mr-2"></i>
          Delete All
        </button>
      </div>
      
      <div className="space-y-5">
        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <div 
              key={item.id} 
              className="neu-card p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="title font-bold">{item.title}</h3>
                  <p className="text-sm mt-1 font-medium">{item.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  {/* Edit button (only for projects) */}
                  {item.type === "project" && (
                    <button className="border-2 border-black bg-white p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  )}
                  <button 
                    className="border-2 border-black bg-white p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    onClick={() => item.type === "project" 
                      ? handleDeleteProject(item.id) 
                      : handleDeleteCalculation(item.id)
                    }
                  >
                    <i className="fa-solid fa-trash text-red-500"></i>
                  </button>
                </div>
              </div>
              <div className="flex justify-between mt-4 font-bold">
                <span className="bg-secondary text-white px-2 py-1 border-2 border-black">{item.count} Pekerja</span>
                <span className="bg-primary text-white px-2 py-1 border-2 border-black">{formatCurrency(item.total)}</span>
              </div>
              {item.type === "calculation" && filter === "all" && (
                <div className="mt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full py-2 px-4 border-2 border-black font-bold bg-blue-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                        Detail
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Rincian Gaji - {item.title}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        {calculations.find(calc => calc.id === item.id) && (
                          <>
                            <div 
                              id="salary-details" 
                              className="relative bg-gray-100 p-4 rounded-md overflow-auto max-h-[60vh]" 
                              style={{
                                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" opacity=\"0.1\"><text x=\"0\" y=\"100\" font-family=\"Arial\" font-size=\"20\" fill=\"%236F00FF\" transform=\"rotate(-45 100,100)\">HitungYuk HitungYuk HitungYuk</text></svg>')",
                                backgroundRepeat: "repeat",
                                border: "1px solid #000",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                padding: "20px"
                              }}
                              dangerouslySetInnerHTML={{ 
                                __html: createSalaryReport(calculations.find(calc => calc.id === item.id)!) 
                              }}
                            />
                            
                            <div className="mt-4 grid grid-cols-3 gap-3">
                              <button 
                                onClick={() => exportAsPNG("salary-details", `Gaji_${item.title.replace(/\s+/g, "_")}`)}
                                className="border-2 border-black bg-green-500 text-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                              >
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <i className="fa-solid fa-file-image text-lg"></i>
                                  <span className="text-xs font-bold">Unduh PNG</span>
                                </div>
                              </button>
                              
                              <button 
                                onClick={() => shareViaWhatsApp("salary-details", item.title)}
                                className="border-2 border-black bg-[#25D366] text-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                              >
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <i className="fa-brands fa-whatsapp text-lg"></i>
                                  <span className="text-xs font-bold">WhatsApp</span>
                                </div>
                              </button>
                              
                              <button 
                                onClick={() => shareViaEmail("salary-details", item.title)}
                                className="border-2 border-black bg-[#4285F4] text-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                              >
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <i className="fa-solid fa-envelope text-lg"></i>
                                  <span className="text-xs font-bold">Email</span>
                                </div>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-black">
            <p className="font-bold">Belum ada data tersimpan</p>
          </div>
        )}
      </div>
    </section>
  );
}
