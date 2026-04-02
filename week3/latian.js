//variable, menampung 1 data
const nim = "A11.2023.15341";


//variable array, menampung multiple data tapi 1 tipe data 
const list_nim = ["12342","93212","08321"];


//object, menamoung multiple data dan multiple tipe data
const mahasiswa = {
    //key : value
    //key nya ada nim dan status
    //key punya value masing masing

    nim: "15341",
    nama: "Andika Apriyanto ",
    status: true,
    matkul: [
            {
                matkulId: "MK001",
                nilai: 89
            },
            {
                matkulId: "MK002",
                nilai: 70 
            }
    ]
};



console.log(mahasiswa);

//array of object
const list_mahasiswa = [
    {
        nama: "mahasiswa 1",
        nim: "A11.2023.15341",
        umur: 17
    },
    {
        nama: "mahasiswa 2",
        nim: "A11.2023.15342",
        umur: 18
    }

];

console.log(list_mahasiswa);

//destructuring object
const mahasiswa2 = {
nim: "15341",
nama: "Andika Apriyanto ",
umur: 21,
status: true,
};
// const umur = mahasiswa2.umur;
// console.log(umur);
// if(umur > 21){
//     console.log("yes tuaa");  
// }else{
//     console.log("umur tidak pantas");
// }

//lanjutkan untuk ambil data nim, nama dan statusnya
//buat tampilan output diodata diri

// const nama = mahasiswa.nama;
// const nim = mahasiswa.nim;
// const status = mahasiswa.status;

const {nama, umur, status} = mahasiswa2;
console.log("Nama: " +nama+",umur : "+umur);

//literal output, konsep penggabungan variabel dengan string
console.log(`Nama: ${nama}, umur: ${umur}`);

//destructuring array of objects
const listMahasiswa = [
    {nim: "123", nama: "jhon ", umur:"18", status:true},
    {nim: "432", nama: "yanti ", umur:"19", status:false},
    {nim: "1231", nama: "Pantasts ", umur:"21", status:true},
];

//spread, nambah data
const mhs3 = {nim: "22121", nama: "yuhuuu", umur: 28, status:true};

//spread ke array tambahkan data ke array
const new_listmahasiswa =[
    ...listMahasiswa,
    mhs3
];

//data before 3, data after 4
console.log(new_listmahasiswa);

const ipk=3.7;

// spread ke object
const new_mhs3 ={
    ...mhs3,
    ipk
};
console.log(new_mhs3);


