import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAznqxx2VFpeDyYM7a-yLGNpJelCsK_Tms",
  authDomain: "multimedia-1-26a77.firebaseapp.com",
  databaseURL: "https://multimedia-1-26a77-default-rtdb.firebaseio.com",
  projectId: "multimedia-1-26a77",
  storageBucket: "multimedia-1-26a77.appspot.com",
  messagingSenderId: "597292084204",
  appId: "1:597292084204:web:82217d0e5e52d27fae2ec9",
  measurementId: "G-6KE4FDFX03",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

export const fetchLogs = async () => {
  try {
    const logsRef = ref(database, "logs");
    const snapshot = await get(logsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No se encontraron usuarios.");
      return {};
    }
  } catch (error) {
    console.error("Error al obtener los logs:", error);
  }
};

export const fetchUsers = async () => {
  try {
    const db = getDatabase();
    const usersRef = ref(db, "users"); 
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No se encontraron usuarios.");
      return {};
    }
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return {};
  }
};

export const updateUserStatus = async (userId, isEnabled) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}`);
  try {
    await update(userRef, { enabled: isEnabled });
    console.log(
      `Usuario ${isEnabled ? "habilitado" : "inhabilitado"} con éxito.`
    );
  } catch (error) {
    console.error(
      `Error al ${isEnabled ? "habilitar" : "inhabilitar"} el usuario:`,
      error
    );
  }
};

export const deleteUser = async (userId) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}`);
  try {
    await remove(userRef);
    console.log("Usuario eliminado con éxito.");
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
  }
};

export const updateUserName = async (userId, newName) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}`);
  try {
    await update(userRef, { name: newName });
    console.log("Nombre de usuario actualizado con éxito.");
  } catch (error) {
    console.error("Error al actualizar el nombre del usuario:", error);
  }
};
