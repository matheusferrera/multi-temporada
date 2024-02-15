const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  update,
  child,
  get
} = require("firebase/database");

const { getFirestore } = require("firebase/firestore")
const { collection, getDocs, doc, setDoc, getDoc, updateDoc } = require("firebase/firestore");


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBEaOUZRRdJgPT7T7gTjKYecBnDHubcCY4",
//     authDomain: "multitemporada-backend.firebaseapp.com",
//     projectId: "multitemporada-backend",
//     storageBucket: "multitemporada-backend.appspot.com",
//     messagingSenderId: "697309256251",
//     appId: "1:697309256251:web:d2cdb2294de3c90a34da1e"
//   };

const firebaseConfig = {
  apiKey: "AIzaSyDF9AyJH_TIweKlyRG8uMf8dS3_QKiCAxU",
  authDomain: "multitemporada-api.firebaseapp.com",
  databaseURL: "https://multitemporada-api-default-rtdb.firebaseio.com",
  projectId: "multitemporada-api",
  storageBucket: "multitemporada-api.appspot.com",
  messagingSenderId: "17067214021",
  appId: "1:17067214021:web:6bf8a328f9c834bd3f5cac",
  measurementId: "G-6DXKVNK2KJ"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const db2 = getFirestore(app);


// async function getImovel(id) {

//     // Referência ao nó específico no Realtime Database
//     const dataRef = ref(db, "Imoveis/" + id);

//     try {
//       // Utiliza await para esperar a conclusão da operação get
//       const snapshot = await get(dataRef);

//       if (snapshot.exists()) {
//         // Se o documento existir, snapshot.val() conterá os dados
//         const data = snapshot.val();
//         console.log("Dados encontrados para ID", id, ":", data);
//         return data

//       } else {
//         console.log("Nenhum dado encontrado para ID", id);
//       }
//     } catch (error) {
//       console.error("Erro ao obter dados para ID", id, ":", error);
//     }
//   }


async function getMessage(id) {

  // Referência ao nó específico no Realtime Database
  const dataRef = ref(db, "Mensagens/" + id);

  try {
    // Utiliza await para esperar a conclusão da operação get
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      // Se o documento existir, snapshot.val() conterá os dados
      const data = snapshot.val();
      console.log("Dados encontrados para ID", id, ":", data);
      return data

    } else {
      console.log("Nenhum dado encontrado para ID", id);
    }
  } catch (error) {
    console.error("Erro ao obter dados para ID", id, ":", error);
  }
}


// async function updateImovel(id, newData) {
//   // Inicializar o Firebase


//   // Referência ao nó específico no Realtime Database
//   const dataRef = ref(db, "Imoveis/" + id);

//   try {
//     // Utiliza await para esperar a conclusão da operação update
//     const getRef = await get(dataRef)
//     const newObjt = {
//       ...getRef.val(),
//       ...newData
//     }
//     console.log("NEWOBJT ->", newObjt)
//     await update(dataRef, newObjt);

//     console.log("Dados para ID", id, "atualizados com sucesso:", newData);
//     return 0
//   } catch (error) {
//     console.error("Erro ao atualizar dados para ID", id, ":", error);
//   }
// }

async function updateMessages(id, newData) {
  // Inicializar o Firebase


  // Referência ao nó específico no Realtime Database
  const dataRef = ref(db, "Mensagens/" + id);

  try {
    // Utiliza await para esperar a conclusão da operação update
    const getRef = await get(dataRef)
    const newObjt = {
      ...getRef.val(),
      ...newData
    }
    console.log("NEWOBJT ->", newObjt)
    await update(dataRef, newObjt);

    console.log("Dados para ID", id, "atualizados com sucesso:", newData);
    return 0
  } catch (error) {
    console.error("Erro ao atualizar dados para ID", id, ":", error);
  }
}



async function getImovel(id) {
  try {

    if (id == "") {
      let objResp = {}
      const querySnapshot = await getDocs(collection(db2, "Imoveis", id));
      querySnapshot.forEach((doc) => {
        objResp[doc.id] = doc.data()
      });
      return objResp
    }

    const docRef = doc(db2, "Imoveis", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()

  } catch (e) {
    console.log("[FIREBASE/GETIMOVEL]-> ", e)
  }
}

async function getMessage2(id) {
  try {
    let objResp = {}

    const querySnapshot = await getDocs(collection(db2, "Mensagens", id));
    querySnapshot.forEach((doc) => {
      objResp[doc.id] = doc.data()

    });
    console.log("OBJ  --> ", objResp);
    return objResp
  } catch (e) {
    console.log("ERRO -> ", e)
  }
}

async function updateImovel(id, newData) {
  try {
    const docRef = doc(db2, "Imoveis", id);

    // Verifica se o documento existe
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Atualiza o parâmetro específico no documento
      await updateDoc(docRef, newData);

    } else {
      console.log(`Documento com ID '${id}' não encontrado.`);
    }
  } catch (e) {
    console.error("Erro ao atualizar parâmetro:", e);
  }
}


getMessage2("")



const firebase = {
  getImovel,
  updateImovel,
  getMessage,
  updateMessages
};

module.exports = firebase;