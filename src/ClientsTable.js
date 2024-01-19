import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PersonIcon from '@mui/icons-material/Person';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Service from "./Service.js"

const resp = [
  {
    "id": "65a8fe3493fc2d9d19d5af05",
    "kind": "person",
    "fName": "CHRISTOPHER",
    "lName": "DE SOUZA",
    "name": "CHRISTOPHER DE SOUZA",
    "email": "csouza.397335@guest.booking.com",
    "isUser": true,
    "creationDate": "2024-01-18",
    "nationality": "BR",
    "clientSource": "bookingcom"
  },
  {
    "id": "65a88ca85898637b8c221ba2",
    "kind": "person",
    "fName": "maria victoria",
    "lName": "zagalia",
    "name": "maria victoria zagalia",
    "email": "mzagal.770329@guest.booking.com",
    "isUser": true,
    "creationDate": "2024-01-17",
    "nationality": "AR",
    "clientSource": "bookingcom"
  },
  {
    "id": "65a8824c5898637b8c2007ef",
    "kind": "person",
    "fName": "Laura",
    "lName": "Jouglard",
    "name": "Laura Jouglard",
    "email": "ljougl.867004@guest.booking.com",
    "isUser": true,
    "creationDate": "2024-01-17",
    "nationality": "BR",
    "clientSource": "bookingcom"
  },
  {
    "id": "65a87cd4b9b38988f54a3762",
    "kind": "person",
    "fName": "Agustina",
    "lName": "Gallo",
    "name": "Agustina Gallo",
    "email": "agallo.871872@guest.booking.com",
    "isUser": true,
    "creationDate": "2024-01-17",
    "nationality": "AR",
    "clientSource": "bookingcom"
  }
]




function DataTable() {

  const [selectedUser, setSelectedUser] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [varTest, setVarTest] = React.useState(false);

  
  React.useEffect(() => {
    // Utilize o método do Firebase para obter os dados desejados
    const fetchData = async () => {
      try {
        const data = await Service.getAllClients()
        console.log("GET ALL CLIENTS SATYS APIS ->", data)
        setVarTest(data);
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      field: 'userButton',
      headerName: ' ',
      width: 70,
      renderCell: (params) => (
        <button
          onClick={() => handleUserButtonClick(params.row.id)} // Substitua pela lógica desejada
          style={{ color: 'white', border: '1px solid grey', padding: '3px', borderRadius: '8px', cursor: 'pointer' }}
        >
          <PersonIcon sx={{ color: "black" }}></PersonIcon>
        </button>
      ),
    },
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Nome completo', width: 300 },
    { field: 'email', headerName: 'Last name', width: 300 },
    { field: 'clientSource', headerName: 'Origem', width: 300 },
  ];

  const handleUserButtonClick = (userId) => {
    const user = resp.find((u) => u.id === userId);
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateUser = () => {
    // Lógica para atualizar os dados do usuário
    console.log('Dados atualizados:', selectedUser);
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div style={{ height: "100%", width: '100%', display: "flex" , justifyContent: "center", alignItems: "center"}}>
      <p>VAR TEST - </p>
      <p>{varTest}</p>
      <div style={{ height: 400, width: 'min-content'}}>
        <DataGrid
          rows={resp}
          columns={columns}
          pageSizeOptions={[5, 10]}
          onRowClick={(params) => handleUserButtonClick(params.row.id)}
        />

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Editar Dados do Cliente</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <div>
                <TextField
                  label="Nome Completo"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                {/* Adicione mais campos conforme necessário */}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Fechar</Button>
            <Button onClick={handleUpdateUser} variant="contained" color="primary">
              Atualizar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default DataTable;