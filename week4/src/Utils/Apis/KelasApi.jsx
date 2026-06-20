// src/Utils/Apis/KelasApi.jsx
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

const COLLECTION = "kelas";

// READ: Ambil semua kelas
export const getAllKelas = async (params = {}) => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Support filter sederhana (kalau ada params)
  if (params.nama) {
    data = data.filter((item) =>
      item.nama?.toLowerCase().includes(params.nama.toLowerCase()),
    );
  }
  // Tambahkan filter lain sesuai kebutuhan (tahun, semester, dll)

  return data;
};

// READ: Ambil 1 kelas berdasarkan id
export const getKelas = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// CREATE: Tambah kelas baru
export const storeKelas = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), data);
  return { id: docRef.id, ...data };
};

// UPDATE: Ubah data kelas
export const updateKelas = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

// DELETE: Hapus kelas
export const deleteKelas = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  return { id };
};
