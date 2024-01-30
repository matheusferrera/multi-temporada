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

async function getClient(idClient) {
  const url = "https://multi-temporada.glitch.me/api/getClient/" + idClient;


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

async function getAllReservation(checkin, checkout, dateType, skip) {
  
  if(skip == null){
    skip = 0
  }
  
  let url = "https://multi-temporada.glitch.me/api/getAllReservas/"+checkin+"/"+checkout+"/"+dateType+"/"+skip
  

  try {
    const response = await axios.get(url);
  
    return response.data
  } catch (error) {
    console.error('Erro:', error);
  }
}



const Service = {
    getReserva,
    getImovel,
    getClient,
    getAllReservation
};

export default Service;
