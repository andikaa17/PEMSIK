import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportRencanaStudiPDF = (kelas, mahasiswa, dosen, mataKuliah) => {
  try {
    const doc = new jsPDF("landscape", "mm", "a4");

    // Header
    doc.setFillColor(200, 16, 46);
    doc.rect(0, 0, 297, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("LAPORAN RENCANA STUDI", 14, 16);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 23);

    doc.setTextColor(0, 0, 0);
    let y = 35;

    // Loop Kelas
    kelas.forEach((kls, index) => {
      const matkul = mataKuliah.find((m) => m.id === kls.matakuliah_id);
      const dosenPengampu = dosen.find((d) => d.id === kls.dosen_id);
      const mhsInClass = (kls.mahasiswa_ids || [])
        .map((id) => mahasiswa.find((m) => m.id === id))
        .filter(Boolean);

      // ========== HEADER KELAS ==========
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(200, 16, 46);
      doc.text(`${index + 1}. ${matkul?.nama || "-"}`, 14, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`Dosen: ${dosenPengampu?.nama || "-"}`, 14, y + 5);
      doc.text(
        `Kode: ${kls.kode || "-"} | SKS: ${matkul?.sks || 0} | Kapasitas: ${mhsInClass.length}/${kls.kapasitas || "∞"}`,
        14,
        y + 10,
      );

      y += 16;

      // ========== TABEL MAHASISWA ==========
      if (mhsInClass.length > 0) {
        // Hitung SKS per mahasiswa
        const tableData = mhsInClass.map((m, i) => {
          const totalSks = kelas
            .filter((k) => k.mahasiswa_ids?.includes(m.id))
            .map(
              (k) =>
                mataKuliah.find((mk) => mk.id === k.matakuliah_id)?.sks || 0,
            )
            .reduce((a, b) => a + b, 0);

          const maxSks = m?.max_sks || 0;
          const sisaSks = maxSks - totalSks;
          const isOver = sisaSks < 0;

          return [
            i + 1,
            m?.nama || "-",
            m?.nim || "-",
            maxSks,
            totalSks,
            isOver ? "OVER" : sisaSks,
          ];
        });

        autoTable(doc, {
          startY: y,
          head: [["No", "Nama", "NIM", "Max SKS", "SKS Diambil", "Sisa SKS"]],
          body: tableData,
          theme: "striped",
          headStyles: {
            fillColor: [200, 16, 46],
            textColor: [255, 255, 255],
            fontSize: 8,
          },
          styles: { fontSize: 7 },
          margin: { left: 14 },
          columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 50 },
            2: { cellWidth: 25, halign: "center" },
            3: { cellWidth: 20, halign: "center" },
            4: { cellWidth: 25, halign: "center" },
            5: { cellWidth: 25, halign: "center" },
          },
        });

        y = doc.lastAutoTable.finalY + 8;
      } else {
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("Belum ada mahasiswa", 14, y + 4);
        y += 14;
      }

      if (y > 190) {
        doc.addPage();
        y = 20;
      }
    });

    // Footer
    doc.setFillColor(200, 16, 46);
    doc.rect(0, 277, 297, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text(`Sistem Rencana Studi - ${new Date().getFullYear()}`, 14, 283);

    doc.save("Rencana_Studi.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Gagal generate PDF: " + error.message);
  }
};
