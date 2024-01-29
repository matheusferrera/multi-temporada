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
import Service from './Service';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



function DataTable() {
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [respDb, setRespDb] = useState({})
  const [respDbFull, setRespDbFull] = useState({})
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);

  const [allReservas, setAllReservas] = useState({})
  const [selectedHospede, setSelectedHospede] = useState({})
  const [selectedImovel, setSelectedImovel] = useState({})
  const [selectedMessage, setSelectedMessage] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await firebase.getReserva("");
        const allReservas = await Service.getAllReservation("2024-01-29", "2024-01-30", "arrival")

        console.log("allReservas --->", transformArrayToObject(allReservas))
        setAllReservas(transformArrayToObject(allReservas))
        setRespDbFull(data);

        const reservasId = Object.keys(data)

        let objReservas = {};
        let reservaFiltrada = {};
        for (let i = 0; i < reservasId.length; i += 5) {
          const batchReservas = reservasId.slice(i, i + 5);
          const promises = batchReservas.map(async (reservaId) => {
            const reservaInfo = await Service.getReserva(reservaId);
            objReservas = {
              ...objReservas,
              [reservaId]: reservaInfo
            };
          });

          await Promise.all(promises);

          // Atualizar o estado após processar cada lote
          const partialReservas = Object.values(objReservas);

          for (const reserva of partialReservas) {

            let bodyObj = {};
            bodyObj[reserva.id] = {
              idReserva: reserva.id,
              idImovel: data[reserva.id].idImovel,
              idHospede: "0",
              checkIn: reserva.checkInDate + " às " + reserva.checkInTime,
              checkOut: reserva.checkOutDate + " às " + reserva.checkOutTime,
              preco: "R$ " + reserva.price.hostingDetails._f_total,
              precoPago: "R$ " + reserva.stats._f_totalPaid,
              precoRestante: "R$ " + (Number(reserva.price.hostingDetails._f_total) - Number(reserva.stats._f_totalPaid)),
            };

            reservaFiltrada = {
              ...reservaFiltrada,
              ...bodyObj
            };
          }
        }
        console.log("RESERVA FILTRADA -> ", reservaFiltrada)
        setLoadingTable(false);
        setRespDb(reservaFiltrada);

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
    { field: 'preco', headerName: 'valor total', width: 125 },
    { field: 'precoPago', headerName: 'valor pago', width: 125 },
    { field: 'precoRestante', headerName: 'valor restante', width: 125 },
  ];

  const handleReservaButtonClick = async (reservaId) => {
    setLoadingModal(true)
    setOpenDialog(true);
    const reservaSelect = Object.values(respDb).find((u) => u.idReserva === reservaId);
    const dadosReserva = await Service.getReserva(reservaSelect.idReserva)
    const dadosHospede = await Service.getClient(dadosReserva._idclient)
    const dadosImovel = await Service.getImovel(dadosReserva._idlisting)
    const dadosMessages = await firebase.getImovel(dadosImovel.id)

    console.log("DADOS DA RESERVA -> ", dadosReserva)
    console.log("DADOS IMOVEL -> ", dadosImovel)
    console.log("DADOS MESSAGE -> ", dadosMessages)
    console.log("DADOS HOSPEDE -> ", dadosHospede)

    setSelectedReserva(dadosReserva)
    setSelectedImovel(dadosImovel)
    setSelectedHospede(dadosHospede)
    setSelectedMessage(dadosMessages)
    setLoadingModal(false)
    // setSelectedReserva(reserva);
    
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


  const PhoneNumberAccordion = ({ phoneNumber, label }) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>{ }</p>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              label="Número de Telefone"
              name="telefone"
              value={phoneNumber}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={4}>

              <Card variant="outlined">
                <Box sx={{ p: 2 }}>
                  <Typography color="text.primary" variant="body1">
                    Confirmação de reserva
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    <br />
                  </Typography>
                </Box>
                <Divider light />
                <Box sx={{ p: 2 }} id="boxMessage">
                  <Stack direction="row" spacing={1}>

                    {
                      (() => {
                        let status = respDbFull[selectedReserva.idReserva].messages.boasVindas.imovel[tratarTelefone(phoneNumber)]?.status ? respDbFull[selectedReserva.idReserva].messages.boasVindas.imovel[tratarTelefone(phoneNumber)].status : " ";

                        switch (status) {
                          case 'done':
                            return <Chip color="success" label="Enviada" size="small" />;
                          case 'sent':
                            return <Chip color="success" label="Enviada" size="small" />;
                          case 'fetched':
                            return <Chip label="Em análise" color="warning" size="small" />;
                          case 'pending':
                            return <Chip label="Em análise" color="warning" size="small" />;
                          case 'error':
                            return <Chip label="Erro de envio" color="error" size="small" />;
                          default:
                            return <Chip label="caso desconhecido" color="error" size="small" />;;
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
          {/* Adicione mais campos conforme necessário */}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const resendMessage = async function (idReserva) {
    console.log("RESEND MESSAGE!!!")
    const url = 'https://multi-temporada.glitch.me/api/resendMessage/HK13I';

    try {
      // Fazendo a solicitação GET usando fetch e esperando pela resposta
      const response = await fetch(url);

      //Rechamando os dados do DB
      const data = await firebase.getReserva(idReserva);


      setRespDbFull({
        ...respDbFull,
        [idReserva]: {
          ...respDbFull[idReserva],
          messages: {
            ...respDbFull[idReserva].messages,
            boasVindas: {
              ...respDbFull[idReserva].messages.boasVindas,
              hospede: data.messages.boasVindas.hospede,
            },
          },
        },
      });

      return response

    } catch (error) {
      // Lidando com erros durante a solicitação
      console.error('Erro durante a solicitação:', error);
    }
  }


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
            onRowClick={(params) => handleReservaButtonClick(params.row.idReserva)}
            // onRowClick={(params) =>  console.log("params ->> ",  params.row)}
            getRowId={getRowId}
          />
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="lg">



          {selectedReserva && (
            <div>



              <DialogTitle>Dados da reserva - {selectedReserva.id}</DialogTitle>
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
                              value={selectedReserva.checkInDate}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} lg={3}>
                            <TextField
                              label="checkout"
                              name="telefone"
                              value={selectedReserva.checkOutDate}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} lg={2}>
                            <TextField
                              label="valor total"
                              name="telefone"
                              value={selectedReserva.price._f_total}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} lg={2}>
                            <TextField
                              label="valor pago"
                              name="telefone"
                              value={selectedReserva.stats._f_totalPaid}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={2}>
                            <TextField
                              label="id Reserva"
                              name="nome"
                              value={selectedReserva.id}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="nome do imovel"
                              name="telefone"
                              value={selectedImovel._mstitle.pt_BR}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              label="nº de adultos"
                              name="nome"
                              value={selectedReserva.guestsDetails.adults}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              label="nº de crianças"
                              name="telefone"
                              value={selectedReserva.guestsDetails.children}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                        <CardActions>
                          <Button size="small" color="error" href={"https://www.multitemporada.com/i/reservation/" + selectedReserva.id} target="_blank">Ver detalhes da reserva</Button>
                        </CardActions>
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
                              value={selectedImovel.owner.name}
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
                              value={selectedMessage.N_WHATSAPP}
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
                              defaultValue={selectedMessage.N_WHATSAPP2}
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
                              value={selectedMessage.N_FUNCIONARIO}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={0} direction="column">
                          {/* <Grid item xs={12}>
                            {respDbFull[selectedReserva.idReserva].imovelInfo.N_WHATSAPP && (
                              <PhoneNumberAccordion phoneNumber={respDbFull[selectedReserva.idReserva].imovelInfo.N_WHATSAPP} label="whatsapp 1" />
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            {respDbFull[selectedReserva.idReserva].imovelInfo.N_WHATSAPP2 && (
                              <PhoneNumberAccordion phoneNumber={respDbFull[selectedReserva.idReserva].imovelInfo.N_WHATSAPP2} label="whatsapp 2" />
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            {respDbFull[selectedReserva.idReserva].imovelInfo.N_WHATSAPP3 && (
                              <PhoneNumberAccordion phoneNumber={respDbFull[selectedReserva.idReserva].imovelInfo.N_WHATSAPP3} label="whatsapp 3" />
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            {respDbFull[selectedReserva.idReserva].imovelInfo.N_FUNCIONARIO && (
                              <PhoneNumberAccordion phoneNumber={respDbFull[selectedReserva.idReserva].imovelInfo.N_FUNCIONARIO} label="funcionario" />
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            {respDbFull[selectedReserva.idReserva].imovelInfo.N_PARCEIRO && (
                              <PhoneNumberAccordion phoneNumber={respDbFull[selectedReserva.idReserva].imovelInfo.N_PARCEIRO} label="parceiro" />
                            )}
                          </Grid> */}
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="error" href={"https://www.multitemporada.com/pt/apartment/" + selectedImovel.id} target="_blank">Ver detalhes do imovel</Button>
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
                              value={selectedHospede.name}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Telefone"
                              name="nome"
                              value={selectedHospede.phones[0].iso}
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
                                  Confirmação de reserva
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                  <br />
                                </Typography>
                              </Box>
                              <Divider light />
                              <Box sx={{ p: 2 }}>
                                <Stack direction="row" spacing={1}>

                                  {
                                    (() => {
                                      const status = "done"
                                      //const status = "error";
                                      switch (status) {
                                        case 'done':
                                          return <>
                                            <Chip label="Enviada" color="success" size="small" />
                                            <Button size="small" color="error" onClick={() => { resendMessage(selectedReserva.id) }} >rechamar hospede</Button>
                                          </>;
                                        case 'sent':
                                          return <>
                                            <Chip label="Enviada" color="success" size="small" />
                                            <Button size="small" color="error" onClick={() => { resendMessage(selectedReserva.id) }} >rechamar hospede</Button>
                                          </>;
                                        case 'fetched':
                                          return <Chip label="Em análise" color="warning" size="small" />;
                                        case 'pending':
                                          return <Chip label="Em análise" color="warning" size="small" />;
                                        case 'error':
                                          return <>
                                            <Chip label="Erro de envio" color="error" size="small" />
                                            <Button size="small" color="error" onClick={() => { resendMessage(selectedReserva.id) }} >rechamar hospede</Button>
                                          </>

                                        default:
                                          return <Chip label="caso desconhecido" color="error" size="small" />;;
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
                                  {selectedMessage.DIALOGO_PRE_CHECKIN}
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
                                  {selectedMessage.DIALOGO_PRE_CHECKOUT}
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
                        <Button size="small" color="error" href={"https://ssmt.stays.com.br/i/account-overview/" + selectedHospede.id} target="_blank">Ver perfil stays</Button>
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

function transformArrayToObject(array) {
  const transformedObject = {};
  array.forEach(item => {
      transformedObject[item.id] = item;
  });
  return transformedObject;
}

function tratarTelefone(telefone) {
  const numeroLimpo = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (numeroLimpo.startsWith("55") && numeroLimpo.length === 13) {
    return numeroLimpo.slice(0, 4) + numeroLimpo.slice(5);
  }

  return numeroLimpo;
}

export default DataTable;