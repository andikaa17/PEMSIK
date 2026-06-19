// src/Pages/Dosen/Utils/ExportJadwalDosen.jsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllDosen } from "@/Utils/Apis/DosenApi";

export const exportJadwalDosenPDF = async (myKelas, mataKuliah, user) => {
  let nidn = user?.nidn || "-";

  if (!nidn || nidn === "-") {
    try {
      const res = await getAllDosen();
      const dosenList = res.data || [];
      const dosenData = dosenList.find((d) => d.id === user?.id);
      if (dosenData) {
        nidn = dosenData.nidn || "-";
      }
    } catch (error) {
      console.error("Error fetching dosen data:", error);
    }
  }

  const doc = new jsPDF("landscape", "mm", "a4");
  const margin = 14;
  const pageW = 297;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("JADWAL MENGAJAR DOSEN", pageW / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Nama Dosen  : ${user?.name || "-"}`, margin, 30);
  doc.text(`NIDN        : ${nidn}`, margin, 37);
  doc.text(
    `Tanggal Cetak : ${new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    margin,
    44,
  );

  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.line(margin, 48, pageW - margin, 48);

  let y = 55;

  const totalSks = myKelas
    .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
    .reduce((a, b) => a + b, 0);
  const totalMahasiswa = myKelas.reduce(
    (sum, k) => sum + (k.mahasiswa_ids || []).length,
    0,
  );

  doc.setFontSize(9);
  doc.text(`Total Kelas: ${myKelas.length}`, margin, y);
  doc.text(`Total SKS: ${totalSks}`, 80, y);
  doc.text(`Total Mahasiswa: ${totalMahasiswa}`, 150, y);

  y += 8;

  const hariOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const sortedKelas = [...myKelas].sort((a, b) => {
    const hariA = hariOrder.indexOf(a.hari);
    const hariB = hariOrder.indexOf(b.hari);
    if (hariA !== hariB) return hariA - hariB;
    return (a.jam_mulai || "").localeCompare(b.jam_mulai || "");
  });

  const tableData = sortedKelas.map((k, i) => {
    const matkul = mataKuliah.find((m) => m.id === k.matakuliah_id);
    return [
      i + 1,
      k.hari || "-",
      k.jam_mulai && k.jam_selesai ? `${k.jam_mulai} - ${k.jam_selesai}` : "-",
      matkul?.nama || "-",
      matkul?.sks || 0,
      k.ruangan || "-",
      (k.mahasiswa_ids || []).length,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [["No", "Hari", "Jam", "Mata Kuliah", "SKS", "Ruangan", "Mhs"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontSize: 9,
      fontStyle: "bold",
      halign: "center",
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: 35, halign: "center" },
      3: { cellWidth: 60 },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: 25, halign: "center" },
      6: { cellWidth: 15, halign: "center" },
    },
    margin: { left: margin, right: margin },
    tableWidth: "auto",
  });

  const footerY = 190;
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageW - margin, footerY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Dicetak dari Sistem Akademik - ${new Date().getFullYear()}`,
    margin,
    footerY + 5,
  );

  doc.save(`Jadwal_Mengajar_${user?.name || "Dosen"}.pdf`);
};
