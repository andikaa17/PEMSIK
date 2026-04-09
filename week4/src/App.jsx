// 1 file, 1 function utama
// 1 function, 1 return
// 1 return, 1 Element

// Setiap nama function dimulai huruf gede
function Contoh(){
    return <h1> Info Mangan </h1>
}

//Contoh Multiple elemnt\
function Contoh2(){
    return <div>
        <h1> Judul Berita</h1>
        <p>Isi berita yang Panjang</p>
    </div>
}

//function utama difile ini
// function App(){
//     //cara panggil function
// return <Contoh2 />
// }


function Nama({ nama }) {
    return <h3> Nama:  {nama}</h3>
}

function Nim({ nim }) {
    return <h3> Nim:  {nim} </h3>
}

function Mhs() {
   const mahasiswa= [
    {
    nama : "Andika Apriyanto",
    nim  : "A11.2023.15341"
   },
   {
    nama : "Andika Apriyanto",
    nim  : "A11.2023.15341"
   },
   {
    nama : "Andika Apriyanto",
    nim  : "A11.2023.15341"
   }
]
   return (
        <div>
            {mahasiswa.map((item, index) => (
                <div key={index}>
                    <Nama nama={item.nama} />
                    <Nim nim={item.nim} />
                    <hr />
                </div>
            ))}
        </div>
    )
}

//function utama difile ini
function App() {
    return (
        <div>
            <Mhs />
        </div>
    )
}

export default App;

