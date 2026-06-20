// src/Utils/Apis/DosenApi.jsx
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

const COLLECTION = "dosen";

// READ: Ambil semua dosen
export const getAllDosen = async (params = {}) => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Support filter sederhana (kalau ada params)
  if (params.nama) {
    data = data.filter((item) =>
      item.nama?.toLowerCase().includes(params.nama.toLowerCase()),
    );
  }
  // Tambahkan filter lain sesuai kebutuhan

  return data;
};

// READ: Ambil 1 dosen berdasarkan id
export const getDosen = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// CREATE: Tambah dosen baru
export const storeDosen = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), data);
  return { id: docRef.id, ...data };
};

// UPDATE: Ubah data dosen
export const updateDosen = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

// DELETE: Hapus dosen
export const deleteDosen = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  return { id };
};
