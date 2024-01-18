import axios from 'axios';

export default async function getAllClients() {
  const url = 'https://ssmt.stays.com.br/external/v1/booking/clients';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ZWV0MHNxcGQ2cDg6dmwzbXBpOG5oc28='
  };

  try {
    const response = await axios.get(url, {}, { headers });
    console.log("RESPONSE ->", response)
    console.log('Resposta:', response.data);
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

getAllClients();
