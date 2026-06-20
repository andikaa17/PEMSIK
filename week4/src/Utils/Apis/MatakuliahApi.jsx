// src/Utils/Apis/MataKuliahApi.js
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

const COLLECTION = "matakuliah";

// READ: Ambil semua matakuliah (dengan filter opsional)
export const getAllMatakuliah = async (params = {}) => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Support filter sederhana
  if (params.nama) {
    data = data.filter((item) =>
      item.nama?.toLowerCase().includes(params.nama.toLowerCase()),
    );
  }
  if (params.kode) {
    data = data.filter((item) =>
      item.kode?.toLowerCase().includes(params.kode.toLowerCase()),
    );
  }
  // Tambahkan filter lain sesuai kebutuhan

  return data;
};

// READ: Ambil 1 matakuliah berdasarkan id
export const getMatakuliah = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// CREATE: Tambah matakuliah baru
export const storeMatakuliah = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), data);
  return { id: docRef.id, ...data };
};

// UPDATE: Ubah data matakuliah
export const updateMatakuliah = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

// DELETE: Hapus matakuliah
export const deleteMatakuliah = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  return { id };
};
