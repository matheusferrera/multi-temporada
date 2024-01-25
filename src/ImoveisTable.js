import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PersonIcon from '@mui/icons-material/Person';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Snackbar } from '@mui/material';
import { pink } from '@mui/material/colors';
import firebase from './Firebase';
import CircularProgress from '@mui/material/CircularProgress';




function DataTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [respDb, setRespDb] = useState({})
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    // Utilize o método do Firebase para obter os dados desejados
    const fetchData = async () => {
      try {
        const data = await firebase.getImovel("");
        console.log("IMOVEIS ->", data)
        setRespDb(data);
        setLoadingTable(false);
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'IDUNIDADE', headerName: 'ID', width: 100 },
    { field: 'PROPIETARIO', headerName: 'Nome do proprietario', width: 250 },
    { field: 'NOME_COMERCIAL', headerName: 'Nome imovel', width: 250 },
    { field: 'N_WHATSAPP', headerName: 'Whatsapp', width: 150 },
    { field: 'N_WHATSAPP2', headerName: 'Whatsapp 2', width: 150 },
    { field: 'N_WHATSAPP3', headerName: 'Whatsapp 3', width: 150 },
    { field: 'N_FUNCIONARIO', headerName: 'Funcionario', width: 150 },
    { field: 'N_FUNCIONARIO2', headerName: 'Funcionario 2', width: 150 },
    { field: 'N_PARCEIRO', headerName: 'Parceiro', width: 150 },
    { field: 'DIALOGO_PRE_CHECKOUT', headerName: 'pre-checkout', width: 200 },
    { field: 'DIALOGO_PRE_CHECKIN', headerName: 'pre-checkin', width: 200 },
  ];

  const handleUserButtonClick = (userId) => {
    const user = Object.values(respDb).find((u) => u.IDUNIDADE === userId);
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateUser = async () => {
    // Lógica para atualizar os dados do usuário
    console.log('Dados atualizados:', selectedUser);
    setLoadingModal(true)
    await firebase.updateImovel(selectedUser.IDUNIDADE, selectedUser)
    setLoadingModal(false)
    setOpenDialog(false);
    setOpenSnack(true)
    // Atualiza o estado respDb com os novos dados
    setRespDb((prevRespDb) => {
      const updatedRespDb = { ...prevRespDb, [selectedUser.IDUNIDADE]: selectedUser };
      return updatedRespDb;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const getRowId = (row) => row.IDUNIDADE;

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  return (
    <div style={{ height: "100%", width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "74vh", width: 'min-content' }}>

        <Snackbar
          open={openSnack}
          autoHideDuration={2000}
          onClose={handleCloseSnack}
          message={"As informacoes do imovel foram alteradas com sucesso"}
        />

        {loadingTable ? (
          <CircularProgress color="error" />
        ) : (
          <DataGrid
            rows={Object.values(respDb)}
            columns={columns}
            pageSizeOptions={[5, 10]}
            style={{ cursor: "pointer" }}
            onRowClick={(params) => handleUserButtonClick(params.row.IDUNIDADE)}
            getRowId={getRowId}
          />
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>



          {selectedUser && (
            <div>



              <DialogTitle>Editar Dados do Imovel - {selectedUser.IDUNIDADE}</DialogTitle>
              <DialogContent>
                {loadingModal ? (
                  <div style={{ widht: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
                    <CircularProgress color="error" />
                  </div>
                ) : (
                  <div>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Nome do Proprietário"
                          name="PROPIETARIO"
                          value={selectedUser.PROPIETARIO}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Nome do imóvel"
                          name="NOME_COMERCIAL"
                          value={selectedUser.NOME_COMERCIAL}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          disabled
                          label="Dialogo de check-in"
                          name="DIALOGO_PRE_CHECKIN"
                          value={selectedUser.DIALOGO_PRE_CHECKIN}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          disabled
                          label="Dialogo de check-out"
                          name="DIALOGO_PRE_CHECKOUT"
                          value={selectedUser.DIALOGO_PRE_CHECKOUT}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <TextField
                          label="whatsapp"
                          name="N_WHATSAPP"
                          value={selectedUser.N_WHATSAPP}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="whatsapp 2"
                          name="N_WHATSAPP2"
                          value={selectedUser.N_WHATSAPP2}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="whatsapp 3"
                          name="N_WHATSAPP3"
                          value={selectedUser.N_WHATSAPP3}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <TextField
                          label="funcionario"
                          name="N_FUNCIONARIO"
                          value={selectedUser.N_FUNCIONARIO}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="funcionario 2"
                          name="N_FUNCIONARIO2"
                          value={selectedUser.N_FUNCIONARIO2}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="parceiro"
                          name="N_PARCEIRO"
                          value={selectedUser.N_PARCEIRO}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </div>)}
                {/* Adicione mais campos conforme necessário */}
              </DialogContent>
            </div>
          )}

          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">Fechar</Button>
            <Button onClick={handleUpdateUser} variant="contained" color="error">
              Atualizar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default DataTable;