// src/Utils/Apis/MahasiswaApi.jsx
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const COLLECTION = "mahasiswa";

// READ: Ambil semua mahasiswa (dengan filter opsional)
export const getAllMahasiswa = async (params = {}) => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Support filter sederhana
  if (params.nama) {
    data = data.filter((item) =>
      item.nama?.toLowerCase().includes(params.nama.toLowerCase()),
    );
  }
  if (params.nim) {
    data = data.filter((item) =>
      item.nim?.toLowerCase().includes(params.nim.toLowerCase()),
    );
  }
  // Tambahkan filter lain sesuai kebutuhan

  return data;
};

// READ: Ambil 1 mahasiswa berdasarkan id
export const getMahasiswa = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// CREATE: Tambah mahasiswa baru
export const storeMahasiswa = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), data);
  return { id: docRef.id, ...data };
};

// UPDATE: Ubah data mahasiswa
export const updateMahasiswa = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

// DELETE: Hapus mahasiswa
export const deleteMahasiswa = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  return { id };
};
