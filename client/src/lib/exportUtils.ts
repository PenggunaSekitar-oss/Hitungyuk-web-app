import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { createSalaryReport } from './formatUtils';

// Share calculation result via WhatsApp
export const shareViaWhatsApp = async (elementId: string, projectName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, 'image/png', 0.8);
    });
    
    // On mobile devices, we can use the Web Share API if available
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], `Gaji_${projectName}.png`, { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Rincian Gaji',
            text: 'Rincian gaji yang dibuat Hitungyuk.my.id'
          });
          return;
        }
      } catch (shareError) {
        console.error('Error using Web Share API:', shareError);
      }
    }
    
    // Fallback for devices/browsers that don't support Web Share API with files
    // Save the image locally and then open WhatsApp with text
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Gaji_${projectName}.png`;
    link.click();
    
    // After downloading, open WhatsApp with text
    setTimeout(() => {
      const text = encodeURIComponent("Rincian gaji yang dibuat Hitungyuk.my.id");
      const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
      window.open(whatsappUrl, '_blank');
    }, 1000);
  } catch (error) {
    console.error('Error sharing via WhatsApp:', error);
    throw error;
  }
};

// Share calculation result via Email
export const shareViaEmail = async (elementId: string, projectName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, 'image/png', 0.8);
    });
    
    // On mobile devices, we can use the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rincian Gaji - ${projectName}`,
          text: 'Rincian gaji yang dibuat Hitungyuk.my.id',
        });
        return;
      } catch (shareError) {
        console.error('Error using Web Share API:', shareError);
      }
    }
    
    // Fallback for devices/browsers that don't support Web Share API
    // Save the image locally and then open email client
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Gaji_${projectName}.png`;
    link.click();
    
    // After downloading, open email client with subject and body
    setTimeout(() => {
      const subject = encodeURIComponent(`Rincian Gaji - ${projectName}`);
      const body = encodeURIComponent("Rincian gaji yang dibuat Hitungyuk.my.id\n\nSilakan lihat lampiran untuk detail rincian gaji.");
      const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
    }, 1000);
  } catch (error) {
    console.error('Error sharing via Email:', error);
    throw error;
  }
};

// Export calculation result as PNG
export const exportAsPNG = async (elementId: string, filename: string): Promise<string> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.png`;
    link.click();
    
    // Return the dataUrl for use in sharing functions
    return dataUrl;
  } catch (error) {
    console.error('Error exporting as PNG:', error);
    throw error;
  }
};

// Export calculation result as PDF
export const exportAsPDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting as PDF:', error);
    throw error;
  }
};

// Export calculation result as TXT
export const exportAsTXT = (calculation: any, filename: string): void => {
  try {
    const reportText = createSalaryReport(calculation);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${filename}.txt`);
  } catch (error) {
    console.error('Error exporting as TXT:', error);
    throw error;
  }
};

// Export calculation result as DOCX
export const exportAsDOCX = (calculation: any, filename: string): void => {
  try {
    // Create a simple HTML structure that mimics a DOCX document
    const reportText = createSalaryReport(calculation);
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>Laporan Gaji - ${calculation.projectName}</title>
        </head>
        <body>
          <pre style="font-family: 'Courier New', monospace; white-space: pre-wrap;">${reportText}</pre>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    saveAs(blob, `${filename}.doc`);
  } catch (error) {
    console.error('Error exporting as DOCX:', error);
    throw error;
  }
};
