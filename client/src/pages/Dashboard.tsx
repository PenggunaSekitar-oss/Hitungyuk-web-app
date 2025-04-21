import { useState, useEffect } from "react";
import { Link } from "wouter";
import { getDashboardSummary, getProjects } from "@/lib/storage";
import { formatCurrency, formatShortNumber } from "@/lib/formatUtils";
import { Project } from "@/lib/types";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    workerCount: 0,
    workDaysCount: 0,
    projectCount: 0,
    totalSalary: 0
  });
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Load dashboard data
    setSummary(getDashboardSummary());
    
    // Get projects and sort by createdAt (newest first)
    const projects = getProjects().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setActiveProjects(projects.slice(0, 3)); // Show only the latest 3 projects
  }, []);

  const dashboardCards = [
    {
      title: "Jumlah Pekerja",
      value: summary.workerCount,
      trend: "+2 dari minggu lalu",
      icon: "fa-arrow-up",
      color: "#6F00FF" // Purple color
    },
    {
      title: "Jumlah Hari Kerja",
      value: summary.workDaysCount,
      trend: "+8 dari minggu lalu",
      icon: "fa-arrow-up",
      color: "#FFCA28" // Yellow color
    },
    {
      title: "Jumlah Proyek",
      value: summary.projectCount,
      trend: "+1 dari minggu lalu",
      icon: "fa-arrow-up",
      color: "#00C853" // Green color
    },
    {
      title: "Total Gaji",
      value: `Rp ${formatShortNumber(summary.totalSalary)}`,
      trend: "+2,3jt dari minggu lalu",
      icon: "fa-arrow-up",
      color: "#6F00FF" // Purple color
    }
  ];

  return (
    <section className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {dashboardCards.map((card, index) => (
          <div 
            key={index} 
            className="p-4 flex flex-col border-4 border-black"
            style={{ backgroundColor: card.color }}
          >
            <p className="text-sm text-white font-bold">{card.title}</p>
            <p className="text-2xl font-bold mt-1 text-white">{card.value}</p>
            <div className="mt-2 flex items-center bg-white px-2 py-1 self-start">
              <span className="text-xs font-medium text-black">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-4 border-black p-4 mb-6 bg-white">
        <h3 className="text-lg font-semibold mb-4 border-b-2 border-black pb-2">Proyek Aktif</h3>
        {activeProjects.length > 0 ? (
          <div className="space-y-4">
            {activeProjects.map(project => {
              const totalSalary = project.workers.reduce((sum, worker) => 
                sum + (worker.dailySalary * worker.workDays), 0
              );
              
              return (
                <div key={project.id} className="border-b-2 border-black pb-3">
                  <div className="flex justify-between">
                    <h4 className="font-bold">{project.name}</h4>
                    <span className="bg-purple-600 text-white px-2 py-1 text-xs">Aktif</span>
                  </div>
                  <p className="text-sm mt-1 font-medium">{project.address}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-bold bg-yellow-400 text-black px-2">{project.workers.length} Pekerja</span>
                    <span className="text-sm font-bold bg-purple-600 text-white px-2">{formatCurrency(totalSalary)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-black">
            <p className="font-bold">Belum ada proyek tersimpan</p>
            <Link href="/custom">
              <a className="mt-4 inline-block py-2 px-4 bg-purple-600 text-white border-2 border-black font-bold">
                + Tambah Proyek Baru
              </a>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
