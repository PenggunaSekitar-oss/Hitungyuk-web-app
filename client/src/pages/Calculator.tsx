import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  getProjects, 
  getProject, 
  calculatePositionSummaries, 
  calculateTotalSalary,
  saveCalculation
} from "@/lib/storage";
import { 
  formatCurrency, 
  formatDate, 
  formatTime,
  createSalaryReport
} from "@/lib/formatUtils";
import { 
  exportAsPNG, 
  exportAsPDF, 
  exportAsTXT, 
  exportAsDOCX 
} from "@/lib/exportUtils";
import { Project, Worker, CalculationResult } from "@/lib/types";

export default function Calculator() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load projects for select dropdown
    const loadedProjects = getProjects();
    setProjects(loadedProjects);
  }, []);

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedProject(null);
    setCalculationResult(null);
    setIsSaved(false);
    
    // Load selected project details
    if (projectId) {
      const project = getProject(projectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  };

  const handleCalculate = () => {
    if (!selectedProject) {
      toast({
        title: "Pilih proyek terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (selectedProject.workers.length === 0) {
      toast({
        title: "Proyek tidak memiliki pekerja",
        variant: "destructive",
      });
      return;
    }

    // Calculate position summaries
    const positionSummaries = calculatePositionSummaries(selectedProject.workers);
    
    // Calculate total salary
    const totalSalary = calculateTotalSalary(selectedProject.workers);

    // Create calculation result
    const result: CalculationResult = {
      id: "", // Will be set when saved
      projectId: selectedProject.id,
      date: new Date().toISOString(),
      projectName: selectedProject.name,
      projectAddress: selectedProject.address,
      workers: selectedProject.workers,
      positionSummaries,
      totalSalary
    };

    setCalculationResult(result);
    setIsSaved(false);
  };

  const handleSaveCalculation = () => {
    if (!calculationResult) {
      toast({
        title: "Tidak ada hasil perhitungan untuk disimpan",
        variant: "destructive",
      });
      return;
    }

    try {
      saveCalculation(calculationResult);
      toast({
        title: "Perhitungan berhasil disimpan!",
        variant: "default",
      });
      setIsSaved(true);
    } catch (error) {
      toast({
        title: "Gagal menyimpan perhitungan",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: "pdf" | "png" | "txt" | "doc") => {
    if (!calculationResult) {
      toast({
        title: "Tidak ada hasil perhitungan untuk diekspor",
        variant: "destructive",
      });
      return;
    }

    const filename = `Gaji_${calculationResult.projectName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}`;

    try {
      switch (format) {
        case "pdf":
          await exportAsPDF("calculation-result", filename);
          break;
        case "png":
          await exportAsPNG("calculation-result", filename);
          break;
        case "txt":
          exportAsTXT(calculationResult, filename);
          break;
        case "doc":
          exportAsDOCX(calculationResult, filename);
          break;
      }

      toast({
        title: `Berhasil diekspor sebagai ${format.toUpperCase()}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: `Gagal mengekspor sebagai ${format.toUpperCase()}`,
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="px-4 py-6 max-w-md mx-auto">
      <h2 className="heading text-xl font-bold mb-4 border-b-2 border-black pb-2">Kalkulator Gaji</h2>
      
      <div className="neu-card mb-6">
        <div className="p-5">
          <div className="mb-6">
            <Label htmlFor="calc-project" className="mb-2 font-bold block">Pilih Proyek</Label>
            <Select value={selectedProjectId} onValueChange={handleProjectChange}>
              <SelectTrigger id="calc-project" className="neu-select p-3 font-medium">
                <SelectValue placeholder="Pilih proyek" />
              </SelectTrigger>
              <SelectContent>
                {projects.length > 0 ? (
                  projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>
                    Tidak ada proyek tersimpan
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {calculationResult && (
            <div 
              id="calculation-result" 
              className="mt-6 p-4 border-2 border-black bg-white font-mono text-sm whitespace-pre-line"
            >
              <div className="text-center mb-3 border-b-2 border-black pb-2">
                <div className="font-bold text-base">RINCIAN GAJI</div>
                <div>Tanggal: {formatDate(calculationResult.date)}</div>
                <div>Lokasi: {calculationResult.projectAddress}</div>
                <div>Waktu: {formatTime(calculationResult.date)}</div>
              </div>

              {/* Group workers by position */}
              {Object.entries(
                calculationResult.workers.reduce<Record<string, Worker[]>>((acc, worker) => {
                  if (!acc[worker.position]) acc[worker.position] = [];
                  acc[worker.position].push(worker);
                  return acc;
                }, {})
              ).map(([position, workers]) => (
                <div key={position} className="mb-3">
                  <div className="font-bold bg-primary text-white px-2 py-1 mb-1">{position.toUpperCase()}:</div>
                  {workers.map(worker => (
                    <div key={worker.id} className="px-2">
                      {worker.name} ({worker.position.toLowerCase()}): {worker.workDays} hari = <span className="font-bold">{formatCurrency(worker.dailySalary * worker.workDays)}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="mb-3 border-t-2 border-black pt-2">
                <div className="font-bold bg-secondary text-white px-2 py-1 mb-1">RINGKASAN:</div>
                {calculationResult.positionSummaries.map(summary => (
                  <div key={summary.position} className="px-2">
                    Total Gaji {summary.position}: <span className="font-bold">{formatCurrency(summary.totalSalary)}</span>
                  </div>
                ))}
              </div>

              <div className="font-bold mt-3 border-2 border-black py-2 px-2 bg-accent">
                Total Keseluruhan: {formatCurrency(calculationResult.totalSalary)}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button 
              id="calculate-btn"
              onClick={handleCalculate}
              disabled={!selectedProjectId}
              className={`neu-button-secondary py-3 font-bold ${!selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Hitung Gaji
            </button>
            <button 
              id="save-calculation"
              disabled={!calculationResult || isSaved}
              onClick={handleSaveCalculation}
              className={`neu-button py-3 font-bold ${!calculationResult || isSaved ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Simpan Hasil
            </button>
          </div>
          
          {calculationResult && (
            <div className="grid grid-cols-4 gap-3 mt-6">
              <button 
                onClick={() => handleExport("pdf")}
                className="border-2 border-black bg-blue-500 text-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <i className="fa-solid fa-file-pdf text-lg"></i>
                  <span className="text-xs font-bold">PDF</span>
                </div>
              </button>
              <button 
                onClick={() => handleExport("png")}
                className="border-2 border-black bg-green-500 text-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <i className="fa-solid fa-file-image text-lg"></i>
                  <span className="text-xs font-bold">PNG</span>
                </div>
              </button>
              <button 
                onClick={() => handleExport("txt")}
                className="border-2 border-black bg-yellow-500 text-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <i className="fa-solid fa-file-lines text-lg"></i>
                  <span className="text-xs font-bold">TXT</span>
                </div>
              </button>
              <button 
                onClick={() => handleExport("doc")}
                className="border-2 border-black bg-purple-500 text-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <i className="fa-solid fa-file-word text-lg"></i>
                  <span className="text-xs font-bold">DOC</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
