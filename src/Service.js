async function getAllClients() {
    const url = 'https://ssmt.stays.com.br/external/v1/booking/clients';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic NzgyODc2N2Q6NzVjNDg0N2I='
    };
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic NzgyODc2N2Q6NzVjNDg0N2I='
          },
      });
  
      if (!response.ok) {
        throw new Error(`Erro de rede - ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Resposta get all clients:', responseData);
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  
  getAllClients();
  