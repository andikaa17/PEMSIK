// src/Utils/Apis/AuthApi.js
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const COLLECTION = "user";

// LOGIN: Cari user berdasarkan email & password
export const login = async (email, password) => {
  const q = query(
    collection(db, COLLECTION),
    where("email", "==", email),
    where("password", "==", password),
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Email atau password salah");
  }

  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data();
  const { password: _, ...userWithoutPassword } = userData;

  return { id: userDoc.id, ...userWithoutPassword };
};

// GET USER BY ID
export const getUserById = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};
