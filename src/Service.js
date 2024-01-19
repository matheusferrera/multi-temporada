const axios = require('axios');

async function getAllClients() {
  const url = 'https://ssmt.stays.com.br/external/v1/booking/clients';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic NzgyODc2N2Q6NzVjNDg0N2I='
  };

  try {
    const response = await axios.get(url, { headers });
    console.log('Resposta get all clients:', response.data);
  } catch (error) {
    console.error('Erro:', error);
  }
}

getAllClients();
