// latian soal
// 1. buat 1 object mahasiswa terdiri dari :
//     - nama
//     - nim
// 2. buat array object, tiap object terdiri dari :
//     - matkulId 
//     - nilai
//     - matkulNama
// 3. spread listMatkul ke dalam object  mahasiswa
// 4. tampilkan dengan literal, output biodata mahasiswa dan matkul yang di ambil 



// 1. 1 object
const mahasiswa = {
nim: "15341",
nama: "Andika Apriyanto ",
};

console.log(mahasiswa);

//2. array object
const list_matkul = [
    {   matkulId: "MK001",
        nilai:  80,
        matkulNama: "PEMSIK"
    },
    {   matkulId: "MK002",
        nilai:  90,
        matkulNama: "PSS"
    },
];

console.log(list_matkul);

list_matkul

//3. spreadd 

const new_mahasiswa = {
    ...mahasiswa,
    list_matkul
};

console.log(new_mahasiswa)


