// Satu objek mahasiswa
const mahasiswa = {
    nim: "A11.2023.15341",
    nama: "Andika Apriyanto",
    status: true,  // true = aktif, false = tidak aktif
    matkul: [
        { matkulId: "MK001", nama: "Pemrograman Web", tugas: 80, uts: 75, uas: 85 },
        { matkulId: "MK002", nama: "Basis Data",      tugas: 70, uts: 65, uas: 72 }
    ]
};

// Array of objects (daftar mahasiswa)
const listMahasiswa = [
    {
        nim: "A11.2023.15341", nama: "Andika Apriyanto", status: true,
        matkul: [
            { matkulId: "MK001", nama: "Pemrograman Web", tugas: 80, uts: 75, uas: 85 },
            { matkulId: "MK002", nama: "Basis Data",      tugas: 70, uts: 65, uas: 72 }
        ]
    },
    {
        nim: "A11.2023.15342", nama: "Budi Santoso", status: false,
        matkul: [
            { matkulId: "MK001", nama: "Pemrograman Web", tugas: 60, uts: 55, uas: 65 },
            { matkulId: "MK002", nama: "Basis Data",      tugas: 50, uts: 60, uas: 58 }
        ]
    },
    {
        nim: "A11.2023.15340", nama: "Citra Dewi", status: true,
        matkul: [
            { matkulId: "MK001", nama: "Pemrograman Web", tugas: 90, uts: 88, uas: 92 },
            { matkulId: "MK002", nama: "Basis Data",      tugas: 85, uts: 80, uas: 88 }
        ]
    }
];



const mahasiswa2 = {
    nim: "A11.2023.15341",
    nama: "Andika Apriyanto",
    status: true,
    matkul: [
        { matkulId: "MK001", nama: "Pemrograman Web", tugas: 80, uts: 75, uas: 85 },
        { matkulId: "MK002", nama: "Basis Data",      tugas: 70, uts: 65, uas: 72 }
    ],

    show() {
        console.log("=== Data Mahasiswa ===");
        console.log(`NIM    : ${this.nim}`);
        console.log(`Nama   : ${this.nama}`);
        console.log(`Status : ${this.status ? "Aktif" : "Tidak Aktif"}`);
        console.log("Mata Kuliah:");
        this.matkul.forEach(mk => {
            console.log(`  - ${mk.nama} | Tugas: ${mk.tugas} | UTS: ${mk.uts} | UAS: ${mk.uas}`);
        });
    }
};

mahasiswa2.show();
