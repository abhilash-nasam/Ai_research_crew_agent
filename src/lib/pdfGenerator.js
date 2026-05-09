import jsPDF from 'jspdf';
import { base44 } from '@/api/base44Client';

const COLORS = {
  primary: [59, 130, 246],
  accent: [139, 92, 246],
  dark: [15, 23, 42],
  text: [30, 41, 59],
  lightText: [100, 116, 139],
  white: [255, 255, 255],
  border: [226, 232, 240],
};

function addGradientHeader(doc, y) {
  // Simulated gradient bar
  for (let i = 0; i < 180; i++) {
    const ratio = i / 180;
    const r = Math.round(COLORS.primary[0] * (1 - ratio) + COLORS.accent[0] * ratio);
    const g = Math.round(COLORS.primary[1] * (1 - ratio) + COLORS.accent[1] * ratio);
    const b = Math.round(COLORS.primary[2] * (1 - ratio) + COLORS.accent[2] * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(15 + i * 1, y, 1, 3, 'F');
  }
  return y + 8;
}

function addPageNumber(doc, pageNum) {
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.lightText);
  doc.text(`Page ${pageNum}`, 105, 290, { align: 'center' });
}

function wrapText(doc, text, x, y, maxWidth, lineHeight, maxY) {
  const lines = doc.splitTextToSize(text, maxWidth);
  let currentY = y;
  
  for (const line of lines) {
    if (currentY > maxY) return { y: currentY, overflow: true };
    doc.text(line, x, currentY);
    currentY += lineHeight;
  }
  return { y: currentY, overflow: false };
}

function addSection(doc, title, content, startY, pageNum) {
  let y = startY;
  const maxY = 275;
  const margin = 20;
  const contentWidth = 170;

  // Check if we need a new page
  if (y > maxY - 30) {
    addPageNumber(doc, pageNum);
    doc.addPage();
    pageNum++;
    y = 25;
  }

  // Section title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(title, margin, y);
  y += 3;

  // Underline
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 60, y);
  y += 8;

  // Content
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.text);

  // Split content by bullet points or paragraphs
  const paragraphs = content.split('\n').filter(p => p.trim());
  
  for (const para of paragraphs) {
    if (y > maxY) {
      addPageNumber(doc, pageNum);
      doc.addPage();
      pageNum++;
      y = 25;
    }

    const trimmed = para.trim();
    
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      // Bullet point
      doc.setFillColor(...COLORS.primary);
      doc.circle(margin + 2, y - 1.2, 1.2, 'F');
      const bulletText = trimmed.replace(/^[•\-*]\s*/, '');
      const result = wrapText(doc, bulletText, margin + 7, y, contentWidth - 7, 5, maxY);
      y = result.y + 2;
      if (result.overflow) {
        addPageNumber(doc, pageNum);
        doc.addPage();
        pageNum++;
        y = 25;
      }
    } else {
      // Regular paragraph
      const result = wrapText(doc, trimmed, margin, y, contentWidth, 5, maxY);
      y = result.y + 4;
      if (result.overflow) {
        addPageNumber(doc, pageNum);
        doc.addPage();
        pageNum++;
        y = 25;
      }
    }
  }

  return { y: y + 5, pageNum };
}

export function generatePDF(reportData) {
  const doc = new jsPDF();
  let pageNum = 1;

  // ====== TITLE PAGE ======
  // Background
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, 210, 297, 'F');

  // Gradient bar at top
  for (let i = 0; i < 210; i++) {
    const ratio = i / 210;
    const r = Math.round(COLORS.primary[0] * (1 - ratio) + COLORS.accent[0] * ratio);
    const g = Math.round(COLORS.primary[1] * (1 - ratio) + COLORS.accent[1] * ratio);
    const b = Math.round(COLORS.primary[2] * (1 - ratio) + COLORS.accent[2] * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(i, 0, 1, 5, 'F');
  }

  // Title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 160, 180);
  doc.text('AI RESEARCH CREW — AUTONOMOUS REPORT', 105, 90, { align: 'center' });

  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.white);
  const titleLines = doc.splitTextToSize(reportData.topic, 160);
  let titleY = 110;
  for (const line of titleLines) {
    doc.text(line, 105, titleY, { align: 'center' });
    titleY += 14;
  }

  // Divider
  for (let i = 0; i < 80; i++) {
    const ratio = i / 80;
    const r = Math.round(COLORS.primary[0] * (1 - ratio) + COLORS.accent[0] * ratio);
    const g = Math.round(COLORS.primary[1] * (1 - ratio) + COLORS.accent[1] * ratio);
    const b = Math.round(COLORS.primary[2] * (1 - ratio) + COLORS.accent[2] * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(65 + i * 1, titleY + 5, 1, 2, 'F');
  }

  // Date and metadata
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 160, 180);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, titleY + 25, { align: 'center' });
  doc.text(`Duration: ${reportData.duration_seconds || 0} seconds`, 105, titleY + 35, { align: 'center' });
  doc.text(`Sources: ${reportData.sources?.length || 0} references`, 105, titleY + 45, { align: 'center' });

  // Footer on title page
  doc.setFontSize(9);
  doc.setTextColor(100, 110, 130);
  doc.text('Generated by AI Research Crew Agent — Multi-Agent Autonomous System', 105, 270, { align: 'center' });
  
  // Bottom gradient bar
  for (let i = 0; i < 210; i++) {
    const ratio = i / 210;
    const r = Math.round(COLORS.accent[0] * (1 - ratio) + COLORS.primary[0] * ratio);
    const g = Math.round(COLORS.accent[1] * (1 - ratio) + COLORS.primary[1] * ratio);
    const b = Math.round(COLORS.accent[2] * (1 - ratio) + COLORS.primary[2] * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(i, 292, 1, 5, 'F');
  }

  // ====== CONTENT PAGES ======
  doc.addPage();
  pageNum++;
  let y = 20;

  // Gradient header on content page
  y = addGradientHeader(doc, y);

  // Executive Summary
  const sections = [
    { title: 'Executive Summary', content: reportData.executive_summary },
    { title: 'Key Findings', content: reportData.key_findings },
    { title: 'Current Trends', content: reportData.current_trends },
    { title: 'Opportunities', content: reportData.opportunities },
    { title: 'Risks & Challenges', content: reportData.risks_challenges },
    { title: 'Conclusion', content: reportData.conclusion },
  ];

  for (const section of sections) {
    if (section.content) {
      const result = addSection(doc, section.title, section.content, y, pageNum);
      y = result.y;
      pageNum = result.pageNum;
    }
  }

  // ====== REFERENCES PAGE ======
  if (reportData.sources && reportData.sources.length > 0) {
    if (y > 240) {
      addPageNumber(doc, pageNum);
      doc.addPage();
      pageNum++;
      y = 25;
    }

    y = Math.max(y, 25);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('References', 20, y);
    y += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    for (let i = 0; i < reportData.sources.length; i++) {
      if (y > 275) {
        addPageNumber(doc, pageNum);
        doc.addPage();
        pageNum++;
        y = 25;
      }
      const src = reportData.sources[i];
      doc.setTextColor(...COLORS.text);
      doc.text(`${i + 1}. ${src.title || 'Source'}`, 20, y);
      y += 4;
      if (src.url) {
        doc.setTextColor(...COLORS.primary);
        doc.text(src.url.substring(0, 80), 25, y);
        y += 6;
      }
    }
  }

  addPageNumber(doc, pageNum);

  return doc;
}

export async function generateAndUploadPDF(reportData) {
  const doc = generatePDF(reportData);
  const pdfBlob = doc.output('blob');
  const file = new File([pdfBlob], `research_report_${Date.now()}.pdf`, { type: 'application/pdf' });
  const { file_url } = await base44.integrations.Core.UploadFile({ file });
  return file_url;
}