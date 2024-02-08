const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  update,
  child,
  get
} = require("firebase/database");
const json = require("./users.json")

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBEaOUZRRdJgPT7T7gTjKYecBnDHubcCY4",
    authDomain: "multitemporada-backend.firebaseapp.com",
    projectId: "multitemporada-backend",
    storageBucket: "multitemporada-backend.appspot.com",
    messagingSenderId: "697309256251",
    appId: "1:697309256251:web:d2cdb2294de3c90a34da1e"
  };

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// const createDB = async function () {
//     let dataRef = ref(db, "Imoveis");
//     for (const item of json.users) {
//         const whatsappId = String(item.IDUNIDADE);
//         try {
//             await update(dataRef, { [whatsappId]: item }); 
//             console.error("======> [DB/createDB] INSERIU: " + whatsappId);
//         } catch (errorObject) {
//             console.error("======> [DB/createDB] ERRO de acesso: " + errorObject);
//             return errorObject;
//         }
//     }
//     console.error("<===== TODOS OS DADOS INSERIDOS =====>");
//     return 0
// };


async function getImovel(id) {
  
    // Referência ao nó específico no Realtime Database
    const dataRef = ref(db, "Imoveis/" + id);
  
    try {
      // Utiliza await para esperar a conclusão da operação get
      const snapshot = await get(dataRef);
  
      if (snapshot.exists()) {
        // Se o documento existir, snapshot.val() conterá os dados
        const data = snapshot.val();
        return data
        console.log("Dados encontrados para ID", id, ":", data);
      } else {
        console.log("Nenhum dado encontrado para ID", id);
      }
    } catch (error) {
      console.error("Erro ao obter dados para ID", id, ":", error);
    }
  }


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

  async function getReserva(id) {
  
    // Referência ao nó específico no Realtime Database
    const dataRef = ref(db, "Reservas/" + id);
  
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
  
  async function updateImovel(id, newData) {
    // Inicializar o Firebase

  
    // Referência ao nó específico no Realtime Database
    const dataRef = ref(db, "Imoveis/" + id);
  
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
  
  
const firebase = {
    getImovel,
    updateImovel,
    getReserva,
    getMessage,
    updateMessages
};

module.exports = firebase;