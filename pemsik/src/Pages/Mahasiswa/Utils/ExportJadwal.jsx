// src/Pages/Mahasiswa/Utils/ExportJadwal.jsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportJadwalPDF = (myKelas, mataKuliah, user, nim) => {
  const doc = new jsPDF("portrait", "mm", "a4");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("JADWAL KULIAH", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Nama: ${user?.name || "-"}`, 14, 30);
  doc.text(`NIM: ${nim || "-"}`, 14, 37);
  doc.text(`Semester: Genap 2025/2026`, 14, 44);

  const totalSks = myKelas
    .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
    .reduce((a, b) => a + b, 0);

  doc.text(`Total SKS: ${totalSks}`, 14, 51);
  doc.text(
    `Tanggal Cetak: ${new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    14,
    58,
  );

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
    ];
  });

  autoTable(doc, {
    startY: 66,
    head: [["No", "Hari", "Jam", "Mata Kuliah", "SKS", "Ruangan"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontSize: 9,
    },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: 35, halign: "center" },
      3: { cellWidth: 60 },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: 25, halign: "center" },
    },
    margin: { left: 14, right: 14 },
  });

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Dicetak dari Sistem Akademik - ${new Date().getFullYear()}`,
    14,
    doc.internal.pageSize.height - 10,
  );

  doc.save(`Jadwal_${user?.name || "Mahasiswa"}.pdf`);
};
