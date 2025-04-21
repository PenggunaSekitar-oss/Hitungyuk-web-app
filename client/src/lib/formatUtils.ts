/**
 * Format number as Indonesian currency (Rupiah)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('IDR', 'Rp');
};

/**
 * Format date as Indonesian format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  };
  
  return new Intl.DateTimeFormat('id-ID', options).format(date);
};

/**
 * Format time as hours:minutes:seconds
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

/**
 * Get short form of large numbers (for dashboard display)
 * e.g. 1500000 -> 1,5jt
 */
export const formatShortNumber = (amount: number): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}M`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}rb`;
  }
  return amount.toString();
};

/**
 * Create a formatted salary report text
 */
export const createSalaryReport = (
  calculation: {
    projectName: string;
    projectAddress: string;
    date: string; 
    workers: Array<{
      name: string;
      position: string;
      dailySalary: number;
      workDays: number;
    }>;
    positionSummaries: Array<{
      position: string;
      totalSalary: number;
    }>;
    totalSalary: number;
  }
): string => {
  const date = formatDate(calculation.date);
  const time = formatTime(calculation.date);
  
  // Group workers by position
  const workersByPosition: Record<string, Array<{ 
    name: string;
    position: string;
    dailySalary: number;
    workDays: number;
  }>> = {};
  
  calculation.workers.forEach(worker => {
    if (!workersByPosition[worker.position]) {
      workersByPosition[worker.position] = [];
    }
    workersByPosition[worker.position].push(worker);
  });
  
  // Build the report text with proper centering - using HTML for better mobile display
  let report = `<div style="text-align: center; width: 100%;">
  <div style="font-weight: bold; font-size: 1.2em; margin-bottom: 10px;">RINCIAN GAJI</div>
  <div>Tanggal: ${date}</div>
  <div>Lokasi: ${calculation.projectAddress}</div>
  <div>Waktu: ${time}</div>
</div>`;
  
  // Add workers by position
  Object.entries(workersByPosition).forEach(([position, workers]) => {
    report += `<div style="text-align: center; margin-top: 15px; font-weight: bold;">${position.toUpperCase()}:</div>`;
    
    workers.forEach(worker => {
      const salary = worker.dailySalary * worker.workDays;
      report += `<div style="text-align: center;">${worker.name} (${worker.position.toLowerCase()}): ${worker.workDays} hari = ${formatCurrency(salary)}</div>`;
    });
  });
  
  // Add summary
  report += `<div style="text-align: center; margin-top: 15px; font-weight: bold;">RINGKASAN:</div>`;
  calculation.positionSummaries.forEach(summary => {
    report += `<div style="text-align: center;">Total Gaji ${summary.position}: ${formatCurrency(summary.totalSalary)}</div>`;
  });
  
  // Emphasize total
  report += `<div style="text-align: center; margin-top: 10px; font-weight: bold; font-size: 1.1em;">Total Keseluruhan: ${formatCurrency(calculation.totalSalary)}</div>`;
  
  // Add emphasized footer
  report += `<div style="text-align: center; margin-top: 20px; font-weight: bold; font-style: italic; border-top: 1px dashed #000; padding-top: 10px;">dibuat dengan Hitungyuk.my.id</div>`;
  
  return report;
};
