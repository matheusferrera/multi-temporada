const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  update,
  child,
  get
} = require("firebase/database");



const { getFirestore } = require("firebase/firestore")
const { collection, getDocs, doc, setDoc, getDoc, updateDoc, where, deleteDoc, query } = require("firebase/firestore");


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
  apiKey: "AIzaSyCx2zHOu6W1iKfReB3gTae-3xZVVaiQBgE",
  authDomain: "multitemporada-db.firebaseapp.com",
  projectId: "multitemporada-db",
  storageBucket: "multitemporada-db.appspot.com",
  messagingSenderId: "35204927998",
  appId: "1:35204927998:web:3451bac508ee585b5770af",
  measurementId: "G-1YRBR74GYD"
};


// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const db2 = getFirestore(app);


async function updateMessages(id, newData) {
  try {
    const docRef = doc(db2, "Mensagens", id);

    // Verifica se o documento existe
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Atualiza o parâmetro específico no documento
      await updateDoc(docRef, newData);

    } else {
      const resp = await setDoc(docRef, newData);
      console.log(`[updateMessages] - Documento com ID '${id}' não encontrado. CRIANDO UMA REF NO DB`);
      
    }
  } catch (e) {
    console.error("Erro ao atualizar parâmetro:", e);
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

async function getMessage(id) {
  try {
    if (id == "") {
      let objResp = {}
      const querySnapshot = await getDocs(collection(db2, "Mensagens", id));
      querySnapshot.forEach((doc) => {
        objResp[doc.id] = doc.data()
      });
      return objResp
    }

    const docRef = doc(db2, "Mensagens", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
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







const firebase = {
  getImovel,
  updateImovel,
  getMessage,
  updateMessages
};

// async function limpaDB(){
//   // Query para buscar os documentos que atendam à condição
//   console.log("LIMPANDO O DB!")
//   const q = query(collection(db2, 'Mensagens'), where('preCheckout', '==', 'success'));

//   // Execute a consulta
//   const querySnapshot = await getDocs(q);
  
//   // Para cada documento retornado pela consulta, exclua-o
//   querySnapshot.forEach(async (doc) => {
//       // Exclua o documento
//       await deleteDoc(doc.ref);
//   });
// }

// limpaDB()


// const jsonData = JSON.parse(fs.readFileSync("./src/imoveisAtualizados.json", "utf8"));

//   async function testeDb2(id, newData) {
//   try{
//     console.log("TESTANDO!!!")
//     for (const idUnidade in jsonData.Imoveis) {
//       const docId = idUnidade;
//       const data = jsonData.Imoveis[idUnidade];
//       const docRef = doc(db2, 'Imoveis', docId);
//       const resp = await setDoc(docRef, data);
//       console.log("ID -> ", idUnidade, "obj -> ", jsonData.Imoveis[idUnidade], "RESP DB -> ", resp)
//     }
//     const querySnapshot = await getDocs(collection(db2, "mensagens"));
//     querySnapshot.forEach((doc) => {
//       console.log(doc.id, " --> ", doc.data());
//     });
    
//   }catch(e){
//     console.log("ERRO -> ", e)
//   }
//   }

//   testeDb2()

module.exports = firebase;