// Array of Object (List Mahasiswa)

let listMahasiswa = [
  {
    nim: "A11.2023.15341",
    nama: "Andika Apriyanto",
    status: true,
    matkul: [
      {
        matkulId: "MK001",
        nama: "Pemrograman Web",
        tugas: 80,
        uts: 75,
        uas: 85,
      },
      { matkulId: "MK002", nama: "Basis Data", tugas: 70, uts: 65, uas: 72 },
    ],
  },
  {
    nim: "A11.2023.15342",
    nama: "Budi Santoso",
    status: false,
    matkul: [
      {
        matkulId: "MK001",
        nama: "Pemrograman Web",
        tugas: 60,
        uts: 55,
        uas: 65,
      },
      { matkulId: "MK002", nama: "Basis Data", tugas: 50, uts: 60, uas: 58 },
    ],
  },
  {
    nim: "A11.2023.15340",
    nama: "Citra Dewi",
    status: true,
    matkul: [
      {
        matkulId: "MK001",
        nama: "Pemrograman Web",
        tugas: 90,
        uts: 88,
        uas: 92,
      },
      { matkulId: "MK002", nama: "Basis Data", tugas: 85, uts: 80, uas: 88 },
    ],
  },
];

// Objek Mahasiswa

const mahasiswa = {
  // show()
  show() {
    console.log("Data Mahasiswa");

    listMahasiswa.forEach((mhs) => {
      console.log(`NIM    : ${mhs.nim}`);
      console.log(`Nama   : ${mhs.nama}`);
      console.log(`Status : ${mhs.status ? "Aktif" : "Tidak Aktif"}`);

      mhs.matkul.forEach((mk) => {
        console.log(
          `${mk.nama} | Tugas:${mk.tugas} UTS:${mk.uts} UAS:${mk.uas}`,
        );
      });
    });
  },

  // add()
  add(dataBaru) {
    listMahasiswa.push(dataBaru);
    console.log("Mahasiswa berhasil ditambahkan");
  },

  // update()
  update(nim, dataUpdate) {
    let mhs = listMahasiswa.find((m) => m.nim === nim);

    if (mhs) {
      Object.assign(mhs, dataUpdate);
      console.log("Data berhasil diupdate");
    } else {
      console.log("Mahasiswa tidak ditemukan");
    }
  },

  // deleteById()
  deleteById(nim) {
    listMahasiswa = listMahasiswa.filter((m) => m.nim !== nim);

    console.log("Data berhasil dihapus");
  },

  // totalNilai()
  totalNilai(nim) {
    let mhs = listMahasiswa.find((m) => m.nim === nim);

    if (!mhs) {
      console.log("Mahasiswa tidak ditemukan");
      return;
    }

    let total = 0;

    mhs.matkul.forEach((mk) => {
      let nilai = mk.tugas * 0.3 + mk.uts * 0.3 + mk.uas * 0.4;

      total += nilai;
    });

    console.log("Total Nilai:", total);

    return total;
  },

  // kategoriNilai()
  kategoriNilai(nilai) {
    if (nilai >= 85) return "A";
    else if (nilai >= 75) return "B";
    else if (nilai >= 65) return "C";
    else if (nilai >= 50) return "D";
    else return "E";
  },

  // IPS()
  IPS(nim) {
    let mhs = listMahasiswa.find((m) => m.nim === nim);

    if (!mhs) {
      console.log("Mahasiswa tidak ditemukan");
      return;
    }

    let total = 0;

    mhs.matkul.forEach((mk) => {
      let nilai = mk.tugas * 0.3 + mk.uts * 0.3 + mk.uas * 0.4;

      total += nilai;
    });

    let rata = total / mhs.matkul.length;

    console.log("IPS:", rata.toFixed(2));

    return rata;
  },

  // clear()
  clear() {
    listMahasiswa = [];
    console.log("Semua data mahasiswa dihapus");
  },
};

// jumlahMahasiswa()
function jumlahMahasiswa() {
  console.log("Jumlah Mahasiswa:", listMahasiswa.length);

  return listMahasiswa.length;
}

// sortByNIM()
function sortByNIM() {
  listMahasiswa.sort((a, b) => a.nim.localeCompare(b.nim));

  console.log("Data diurutkan berdasarkan NIM");
}

// sortByStatus()
function sortByStatus() {
  listMahasiswa.sort((a, b) => b.status - a.status);

  console.log("Data diurutkan berdasarkan Status");
}

// jumlahAktifTidak()
function jumlahAktifTidak() {
  let aktif = 0;
  let tidak = 0;

  listMahasiswa.forEach((m) => {
    if (m.status) aktif++;
    else tidak++;
  });

  console.log("Aktif:", aktif);
  console.log("Tidak Aktif:", tidak);

  return { aktif, tidak };
}

// clearArray()
function clearArray() {
  listMahasiswa = [];
  console.log("Array mahasiswa dikosongkan");
}

// Pemanggilan

mahasiswa.show();

jumlahMahasiswa();

sortByNIM();

jumlahAktifTidak();

mahasiswa.totalNilai("A11.2023.15341");

mahasiswa.IPS("A11.2023.15341");
