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
import { Divider, Snackbar } from '@mui/material';
import { pink } from '@mui/material/colors';
import firebase from './Firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';




function DataTable() {
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [respDb, setRespDb] = useState({})
  const [respDbFull, setRespDbFull] = useState({})
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    // Utilize o método do Firebase para obter os dados desejados
    const fetchData = async () => {

      try {
        const data = await firebase.getReserva("");
        console.log("Reservas GET DB ->", data)
        setRespDbFull(data)
        const reservas = Object.values(data);
        let reservaFiltrada = {}
        reservas.forEach((reserva) => {


          let bodyObj = {}
          bodyObj[reserva.idReserva] = {
            idReserva: reserva.idReserva,
            idImovel: reserva.idImovel,
            idHospede: reserva.hospedeInfo.fName,
            checkIn: reserva.checkInDate + " às " + reserva.checkInTime,
            checkOut: reserva.checkOutDate + " às " + reserva.checkOutTime,
            preco: "R$ " + reserva.price,
            precoPago: "R$ " + reserva.paid,
            precoRestante: "R$ " + (Number(reserva.price) - Number(reserva.paid)),
          }


          reservaFiltrada = {
            ...reservaFiltrada,
            ...bodyObj
          }
        })

        console.log("RESERVA FILTRADA -> ", reservaFiltrada)
        setRespDb(reservaFiltrada);
        // setRespDb(data);
        setLoadingTable(false);
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchData();
  }, []);



  const columns = [
    { field: 'idReserva', headerName: 'id reserva', width: 100 },
    { field: 'idImovel', headerName: 'id imovel', width: 100 },
    { field: 'idHospede', headerName: 'nome do hospede', width: 100 },
    { field: 'checkIn', headerName: 'check-in', width: 250 },
    { field: 'checkOut', headerName: 'check-out', width: 250 },
    { field: 'preco', headerName: 'valor total', width: 200 },
    { field: 'precoPago', headerName: 'valor pago', width: 200 },
    { field: 'precoRestante', headerName: 'valor restante', width: 200 },
  ];

  const handleUserButtonClick = (userId) => {
    const user = Object.values(respDb).find((u) => u.IDUNIDADE === userId);
    setSelectedReserva(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateUser = async () => {
    // Lógica para atualizar os dados do usuário

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedReserva((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const getRowId = (row) => row.idReserva;

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  console.log("DB -> ", respDbFull)

  return (
    <div style={{ height: "100%", width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "74vh", width: 'min-content' }}>

        <Snackbar
          open={openSnack}
          autoHideDuration={2000}
          onClose={handleCloseSnack}
          message={"As informacoes do imovel foram alteradas"}
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

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="lg">



          {selectedReserva && (
            <div>



              <DialogTitle>Dados da reserva - {selectedReserva.idReserva}</DialogTitle>
              <DialogContent>
                {loadingModal ? (
                  <div style={{ widht: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
                    <CircularProgress color="error" />
                  </div>
                ) : (
                  <div>
                    <Card fullWidth variant="outlined">
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          Dados gerais da reserva
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} lg={3}>
                            <TextField
                              label="check-in"
                              name="nome"
                              value={selectedReserva.checkIn}
                              fullWidth
                              margin="normal"

                            />
                          </Grid>
                          <Grid item xs={6} lg={3}>
                            <TextField
                              label="checkout"
                              name="telefone"
                              value={selectedReserva.checkOut}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={6} lg={2}>
                            <TextField
                              label="valor total"
                              name="telefone"
                              value={selectedReserva.preco}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={6} lg={2}>
                            <TextField
                              label="valor pago"
                              name="telefone"
                              value={selectedReserva.precoPago}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={2}>
                            <TextField
                              label="id Imovel"
                              name="nome"
                              value={selectedReserva.idImovel}
                              fullWidth
                              margin="normal"

                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="nome do imovel"
                              name="telefone"
                              value={respDbFull[selectedReserva.idReserva].imovelInfo.NOME_COMERCIAL}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              label="nº de adultos"
                              name="nome"
                              value={respDbFull[selectedReserva.idReserva].adults}
                              fullWidth
                              margin="normal"

                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              label="nº de crianças"
                              name="telefone"
                              value={respDbFull[selectedReserva.idReserva].childs}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                        </Grid>

                      </CardContent>
                    </Card>
                    <Divider sx={{ margin: "30px" }}></Divider>
                    <Card fullWidth variant="outlined" >
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          Dados gerais do proprietario
                        </Typography>
                        <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                              label="Nome"
                              name="nome"
                              value={respDbFull[selectedReserva.idReserva].imovelInfo.PROPIETARIO}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Telefone"
                              name="nome"
                              value={respDbFull[selectedReserva.idReserva].imovelInfo.N_WHATSAPP}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Telefone 2"
                              name="nome"
                              defaultValue={respDbFull[selectedReserva.idReserva].imovelInfo.N_WHATSAPP2}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Funcionário"
                              name="nome"
                              value={respDbFull[selectedReserva.idReserva].imovelInfo.N_FUNCIONARIO}
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

                            <Card variant="outlined">
                              <Box sx={{ p: 2 }}>
                                <Typography color="text.primary" variant="body1">
                                  Welcome
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                  .
                                </Typography>
                              </Box>
                              <Divider light />
                              <Box sx={{ p: 2 }}>
                                <Stack direction="row" spacing={1}>

                                  {
                                    (() => {
                                      const status = Object.values(respDbFull[selectedReserva.idReserva].messages.boasVindas)[0].status;

                                      switch (status) {
                                        case 'done':
                                          return <Chip color="success" label="Enviada" size="small" />;
                                        case 'Em analise':
                                          return <Chip label="Em análise" color="warning" size="small" />;
                                        case 'error':
                                          return <Chip label="Erro de envio" color="error" size="small" />;
                                        default:
                                          return null;
                                      }
                                    })()
                                  }

                                </Stack>
                              </Box>
                            </Card>

                          </Grid>
                          <Grid item xs={4}>

                            <Card variant="outlined">
                              <Box sx={{ p: 2 }}>
                                <Typography color="text.primary" variant="body1">
                                  Pré Check-In
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                  {respDbFull[selectedReserva.idReserva].imovelInfo.DIALOGO_PRE_CHECKIN}
                                </Typography>
                              </Box>
                              <Divider light />
                              <Box sx={{ p: 2 }}>
                                <Stack direction="row" spacing={1}>
                                  {/* <Chip color="success" label="Enviada" size="small" /> */}
                                  {/* <Chip label="Em analise" color="warning" size="small" /> */}
                                  {/* <Chip label="Erro de envio" color="error" size="small" /> */}
                                  <Chip label="Aguardando" size="small" />
                                </Stack>
                              </Box>
                            </Card>

                          </Grid>
                          <Grid item xs={4}>

                            <Card variant="outlined">
                              <Box sx={{ p: 2 }}>
                                <Typography color="text.primary" variant="body1">
                                  Pré Check-Out
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                  {respDbFull[selectedReserva.idReserva].imovelInfo.DIALOGO_PRE_CHECKOUT}
                                </Typography>
                              </Box>
                              <Divider light />
                              <Box sx={{ p: 2 }}>
                                <Stack direction="row" spacing={1}>
                                  {/* <Chip color="success" label="Enviada" size="small" /> */}
                                  {/* <Chip label="Em analise" color="warning" size="small" /> */}
                                  {/* <Chip label="Erro de envio" color="error" size="small" /> */}
                                  <Chip label="Aguardando" size="small" />
                                </Stack>
                              </Box>
                            </Card>

                          </Grid>
                        </Grid>

                      </CardContent>
                      <CardActions>
                        <Button size="small" color="error" href={"https://ssmt.stays.com.br/i/account-overview/" + respDbFull[selectedReserva.idReserva].idHospede} target="_blank">Ver perfil stays</Button>
                      </CardActions>
                    </Card>
                    <Divider sx={{ margin: "30px" }}></Divider>
                    <Card fullWidth variant="outlined" >
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          Dados gerais do hospede
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <TextField
                              label="Nome do hospede"
                              name="nome"
                              value={respDbFull[selectedReserva.idReserva].hospedeInfo.name}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Telefone"
                              name="nome"
                              value={respDbFull[selectedReserva.idReserva].hospedeInfo.phones[0].iso}
                              fullWidth
                              margin="normal"

                            />
                          </Grid>
                         
   
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>

                            <Card variant="outlined">
                              <Box sx={{ p: 2 }}>
                                <Typography color="text.primary" variant="body1">
                                  Welcome
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                  .
                                </Typography>
                              </Box>
                              <Divider light />
                              <Box sx={{ p: 2 }}>
                                <Stack direction="row" spacing={1}>

                                  {
                                    (() => {
                                      const status = Object.values(respDbFull[selectedReserva.idReserva].messages.boasVindas)[0].status;

                                      switch (status) {
                                        case 'done':
                                          return <Chip color="success" label="Enviada" size="small" />;
                                        case 'Em analise':
                                          return <Chip label="Em análise" color="warning" size="small" />;
                                        case 'error':
                                          return <Chip label="Erro de envio" color="error" size="small" />;
                                        default:
                                          return null;
                                      }
                                    })()
                                  }

                                </Stack>
                              </Box>
                            </Card>

                          </Grid>
                          <Grid item xs={4}>

                            <Card variant="outlined">
                              <Box sx={{ p: 2 }}>
                                <Typography color="text.primary" variant="body1">
                                  Pré Check-In
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                  {respDbFull[selectedReserva.idReserva].imovelInfo.DIALOGO_PRE_CHECKIN}
                                </Typography>
                              </Box>
                              <Divider light />
                              <Box sx={{ p: 2 }}>
                                <Stack direction="row" spacing={1}>
                                  {/* <Chip color="success" label="Enviada" size="small" /> */}
                                  {/* <Chip label="Em analise" color="warning" size="small" /> */}
                                  {/* <Chip label="Erro de envio" color="error" size="small" /> */}
                                  <Chip label="Aguardando" size="small" />
                                </Stack>
                              </Box>
                            </Card>

                          </Grid>
                          <Grid item xs={4}>

                            <Card variant="outlined">
                              <Box sx={{ p: 2 }}>
                                <Typography color="text.primary" variant="body1">
                                  Pré Check-Out
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                  {respDbFull[selectedReserva.idReserva].imovelInfo.DIALOGO_PRE_CHECKOUT}
                                </Typography>
                              </Box>
                              <Divider light />
                              <Box sx={{ p: 2 }}>
                                <Stack direction="row" spacing={1}>
                                  {/* <Chip color="success" label="Enviada" size="small" /> */}
                                  {/* <Chip label="Em analise" color="warning" size="small" /> */}
                                  {/* <Chip label="Erro de envio" color="error" size="small" /> */}
                                  <Chip label="Aguardando" size="small" />
                                </Stack>
                              </Box>
                            </Card>

                          </Grid>
                        </Grid>

                      </CardContent>
                      <CardActions>
                        <Button size="small" color="error" href={"https://ssmt.stays.com.br/i/account-overview/" + respDbFull[selectedReserva.idReserva].idHospede} target="_blank">Ver perfil stays</Button>
                      </CardActions>
                    </Card>

                  </div>)}
                {/* Adicione mais campos conforme necessário */}
              </DialogContent>
            </div>
          )}

          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">Fechar</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default DataTable;