import axios from "axios"

async function getReserva(idReserva) {
  const url = "https://multi-temporada.glitch.me/api/getReserva/" + idReserva;


  try {
    const response = await axios.get(url);
  
    return response.data
  } catch (error) {
    console.error('Erro:', error);
  }
}

async function getImovel(idListening) {
  const url = "https://multi-temporada.glitch.me/api/getImovel/" + idListening;


  try {
    const response = await axios.get(url);
  
    return response.data
  } catch (error) {
    console.error('Erro:', error);
  }
}

const Service = {
    getReserva,
    getImovel
};

export default Service;
