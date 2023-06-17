import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGmjG8b9Oa3kerSj-QK3uJq_BMNnnIrBI",
  authDomain: "register-f5713.firebaseapp.com",
  projectId: "register-f5713",
  storageBucket: "register-f5713.appspot.com",
  messagingSenderId: "1019599092410",
  appId: "1:1019599092410:web:d180b338bb95ebcfc4a083"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore();

export const saveTask = (
  nombre,
  apellido,
  nit,
  direccion,
  ciudad,
  telefono,
  cupoDisponible,
  estado,
  cupoTotal,
  diasGracia
) => addDoc(collection(db, 'task'), {
  nombre,
  apellido,
  nit,
  direccion,
  ciudad,
  telefono,
  cupoDisponible,
  estado,
  cupoTotal,
  diasGracia
});

export const getTasks = () => getDocs(collection(db, 'task'));

export const onGetTasks = (callback) => onSnapshot(collection(db, 'task'), callback);

export const deleteTask = (id) => deleteDoc(doc(db, 'task', id));

export const updateTask = (id) => getDoc(doc(db, 'task', id));

export const updateTaskFinal = (id, nuevosCampos) =>
  updateDoc(doc(db, 'task', id), nuevosCampos);