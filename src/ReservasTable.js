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
import LinearProgress from '@mui/material/LinearProgress';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';

function DataTable() {
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingModal, setLoadingModal] = useState(true);
  const [openSnack, setOpenSnack] = useState(false);

  const [allReservas, setAllReservas] = useState({})
  const [selectedHospede, setSelectedHospede] = useState({})
  const [selectedImovel, setSelectedImovel] = useState({})
  const [selectedMessage, setSelectedMessage] = useState({})
  const [selectedImovelDb, setSelectedImovelDb] = useState({})

  const [dataInicial, setDataInicial] = useState('2024-04-29')
  const [dataFinal, setDataFinal] = useState('2024-05-02')
  const [dataType, setDataType] = useState("arrival")

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allReservasFetch = await Service.getAllReservation("2024-04-29", "2024-05-02", "arrival")
        allReservasFetch = transformArrayToObject(allReservasFetch)
        let allReservasTratada = tratarReservasTabela(allReservasFetch)


        setAllReservas(allReservasTratada)
        setLoadingTable(false);

        let novoAllReservasTratada = { ...allReservasTratada }
        async function processarReservas() {
          for (const reserva of Object.values(novoAllReservasTratada)) {
            try {
              let imovelInfo = await Service.getImovel(reserva.listingId);
              let hospedeInfo = await Service.getClient(reserva.clientId);


              if (!novoAllReservasTratada[reserva.id].hasOwnProperty("idImovel") && !novoAllReservasTratada[reserva.id].hasOwnProperty("idHospede")) {
                novoAllReservasTratada[reserva.id] = {
                  ...novoAllReservasTratada[reserva.id],
                  idImovel: imovelInfo.id,
                  idHospede: hospedeInfo.name,
                };
                setAllReservas(novoAllReservasTratada);
              }


            } catch (error) {
              console.error("Erro ao processar reserva:", error);
              // Lida com o erro, se necessário
            }
          }
        }

        processarReservas();



      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchData();
  }, []);




  const columns = [
    { field: 'id', headerName: 'id reserva', width: 100 },
    {
      field: 'idImovel',
      headerName: 'id imovel',
      width: 70,
      renderCell: (params) => params.value ? params.value : <><Box sx={{ width: '100%' }}>
        <LinearProgress color="error" />
      </Box></>
    },
    {
      field: 'idHospede',
      headerName: 'nome hospede',
      width: 150,
      renderCell: (params) => params.value ? params.value : <><Box sx={{ width: '100%' }}>
        <LinearProgress color="error" />
      </Box></>
    },
    { field: 'checkIn', headerName: 'check-in', width: 250 },
    { field: 'checkOut', headerName: 'check-out', width: 250 },
    { field: 'price', headerName: 'valor total', width: 125 },
    { field: 'totalPaid', headerName: 'valor pago', width: 125 },
    { field: 'restPaid', headerName: 'valor restante', width: 125 },
  ];

  const handleReservaButtonClick = async (reservaId) => {
    setOpenDialog(true);
    setLoadingModal(true)

    console.log("RESERVA SELECIONADA -> ", reservaId)
    const reservaSelect = Object.values(allReservas).find((u) => u.id === reservaId);
    console.log("Dados da reserva selecionada ->", reservaSelect)

    setSelectedReserva(reservaSelect)

    const dadosReserva = reservaSelect
    const dadosHospede = await Service.getClient(dadosReserva.clientId)
    const dadosImovel = await Service.getImovel(dadosReserva.listingId)
    const dadosImovelDb = await firebase.getImovel(dadosImovel.id)
    const dadosMessage = await firebase.getMessage(dadosReserva.id)

    console.log("DADOS DA RESERVA -> ", dadosReserva)
    console.log("DADOS IMOVEL -> ", dadosImovel)
    console.log("DADOS IMOVEL DB -> ", dadosImovelDb)
    console.log("DADOS HOSPEDE -> ", dadosHospede)
    console.log("DADOS MESSAGE -> ", dadosMessage)


    setSelectedImovel(dadosImovel)
    setSelectedHospede(dadosHospede)
    setSelectedImovelDb(dadosImovelDb)
    setSelectedMessage(dadosMessage)
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

  const handleIdChange = (e) => {
    const { name, value } = e.target;
    setSelectedId(value);
  };

  const getRowId = (row) => row.idReserva;

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };


  const PhoneNumberAccordion = ({ phoneNumber, label }) => (
    <Accordion variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>{ }</p>

        <Grid container spacing={2}>
          <Grid item xs={2}>
            <TextField
              label="Número de Telefone"
              name="telefone"
              value={phoneNumber}
              InputProps={{
                readOnly: true,
              }}
              variant="standard"
              fullWidth
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
                        // let status = respDbFull[selectedReserva.idReserva].messages.boasVindas.imovel[tratarTelefone(phoneNumber)]?.status ? respDbFull[selectedReserva.idReserva].messages.boasVindas.imovel[tratarTelefone(phoneNumber)].status : " ";
                        const status = selectedMessage?.boasVindas[tratarTelefone(phoneNumber)]?.status
                        //const status = "error";
                        switch (status) {
                          case 'done':
                            return <>
                              <Chip label="Enviada" color="success" size="small" />

                            </>;
                          case 'sent':
                            return <>
                              <Chip label="Enviada" color="success" size="small" />

                            </>;
                          case 'fetched':
                            return <Chip label="Tentando enviar" color="warning" size="small" />;
                          case 'pending':
                            return <Chip label="Em análise" color="warning" size="small" />;
                          case 'error':
                            return <>

                              <Chip label="Erro de envio" color="error" size="small" />

                            </>

                          default:
                            return <>

                              <Chip label="Não enviada" color="default" size="small" />

                            </>

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
                    {selectedImovelDb.DIALOGO_PRE_CHECKIN}
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
                    {selectedImovelDb.DIALOGO_PRE_CHECKOUT}
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
    try {
      setLoadingModal(true)
      const response = await fetch('https://multi-temporada.glitch.me/api/resendMessage/' + idReserva);
      const dadosMessage = await firebase.getMessage(idReserva)

      if (!response.ok) {
        throw new Error('Erro ao reenviar mensagem');
      }
      setSelectedMessage(dadosMessage)
      setLoadingModal(false)
      const data = await response.json(); // ou response.text(), dependendo do tipo de resposta esperada
      console.log(data);
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  const handleChangeDataInicial = (newDate) => {
    console.log("NEW DATA ->", newDate.format("YYYY-MM-DD"))
    setDataInicial(newDate.format("YYYY-MM-DD"));
  };

  const handleChangeDataFinal = (newDate) => {
    setDataFinal(newDate.format("YYYY-MM-DD"));
  };

  const handleChangeDataType = (event) => {
    setDataType(event.target.value);
  };

  const searchNewReservation = async () => {
    setLoadingTable(true);

    try {
      let allReservasFetch = await Service.getAllReservation(dataInicial, dataFinal, dataType);
      allReservasFetch = transformArrayToObject(allReservasFetch);
      let allReservasTratada = tratarReservasTabela(allReservasFetch);

      setAllReservas(allReservasTratada);

      console.log("RESERVAS TRATADAS ->", allReservasTratada);

      // Verifica se o número de reservas tratadas é maior que 19
      if (Object.keys(allReservasTratada).length > 19) {
        console.log("BUSCAR NOVAS RESERVAS!!!!");
        await fetchNewReservations(20); // Inicia a busca com um limite de 20
      }
      await processarReservas();
    } catch (error) {
      console.error('Erro ao obter dados do Firebase:', error);
    } finally {
      setLoadingTable(false);
    }
  };
  const processarReservas = async () => {
    const novasReservas = {};
    console.log("ALL RESERVAS ->", allReservas)
    await Promise.all(
      Object.values(allReservas).map(async (reserva) => {
        console.log("PROCURANDO DADOS DA RESERVA ->", reserva);
        try {
          let imovelInfo = await Service.getImovel(reserva.listingId);
          let hospedeInfo = await Service.getClient(reserva.clientId);

          novasReservas[reserva.id] = {
            ...reserva,
            idImovel: imovelInfo.id,
            idHospede: hospedeInfo.name,
          };
        } catch (error) {
          console.error("Erro ao processar reserva:", error);
          // Lida com o erro, se necessário
        }
      })
    );

    setAllReservas((prevReservas) => ({ ...prevReservas, ...novasReservas }));
  }



  const fetchNewReservations = async (limit) => {
    try {
      let newReservasFetch = await Service.getAllReservation(dataInicial, dataFinal, dataType, limit);
      newReservasFetch = transformArrayToObject(newReservasFetch);
      let newReservasTratada = tratarReservasTabela(newReservasFetch);

      setAllReservas((prevAllReservas) => ({ ...prevAllReservas, ...newReservasTratada }));

      console.log("ALL RESERVAS ->", allReservas)
      console.log(`NOVAS RESERVAS TRATADAS (${limit}) ->`, newReservasTratada);

      // Verifica se o número de novas reservas tratadas é maior que 19
      if (Object.keys(newReservasTratada).length > 19) {
        // Se sim, chama recursivamente a função com um limite maior (dobrando o limite)
        await fetchNewReservations(limit * 2);
      }
    } catch (error) {
      console.error('Erro ao obter novas reservas do Firebase:', error);
    }
  };

  return (
    <div style={{ height: "100%", width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "74vh", width: "100%" }}>
        <Grid fullWidth container spacing={2} justifyContent="start" alignItems="center" style={{ marginBottom: "0.8vh" }}>
          <Grid item xs={2} justifyContent="start" alignItems="start">
            <LocalizationProvider size="small" dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{ textField: { size: 'small' } }}
                format="DD/MM/YYYY"
                label="Data inicial"
                defaultValue={dayjs(dataInicial)}
                onChange={handleChangeDataInicial}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={2} justifyContent="start" alignItems="start">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{ textField: { size: 'small' } }}
                format="DD/MM/YYYY"
                label="Data final"
                defaultValue={dayjs(dataFinal)}
                onChange={handleChangeDataFinal}
              />

            </LocalizationProvider>
          </Grid>
          <Grid item xs={2} justifyContent="start" alignItems="start">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dataType}
                defaultValue={"arrival"}
                label="Tipo"
                onChange={handleChangeDataType}
              >
                <MenuItem value={"arrival"}>Check-in</MenuItem>
                <MenuItem value={"departure"}>check-out</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} justifyContent="start" alignItems="start">
            <Button variant="outlined" onClick={searchNewReservation} color="error">
              Refiltrar tabela
            </Button>
          </Grid>
          <Grid item xs={2} justifyContent="start" alignItems="start">
            <TextField
              label="Pesquisar reserva"
              size="small"
              name="idReserva"
              value={selectedId}
              onChange={handleIdChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={2} justifyContent="start" alignItems="start">
            <Button variant="outlined" onClick={() => handleReservaButtonClick(selectedId)} color="error">
              Buscar reserva
            </Button>
          </Grid>
        </Grid>
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
            rows={Object.values(allReservas)}
            columns={columns}
            pageSizeOptions={[5, 10]}
            style={{ cursor: "pointer" }}
            onRowClick={(params) => handleReservaButtonClick(params.row.id)}

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
                        <Grid container spacing={6}>
                          <Grid item xs={6} lg={2.3}>
                            <TextField
                              label="check-in"
                              name="nome"
                              value={selectedReserva.checkIn}
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard"
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} lg={2.3}>
                            <TextField
                              label="checkout"
                              name="telefone"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedReserva.checkOut}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} lg={1.4}>
                            <TextField
                              label="valor total"
                              name="telefone"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedReserva.price}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} lg={1.4}>
                            <TextField
                              label="valor pago"
                              name="telefone"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedReserva.totalPaid}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={1.4}>
                          <Grid item xs={1.3}>
                            <TextField
                              label="id Reserva"
                              name="nome"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedReserva.id}
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
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedImovel._mstitle.pt_BR}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              label="nº de adultos"
                              name="nome"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedReserva.guestsDetails.adults}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              label="nº de crianças"
                              name="telefone"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedReserva.guestsDetails.children}
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

                        <Grid container spacing={4}>
                          <Grid item xs={3}>
                            <TextField
                              label="Nome"
                              name="nome"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedImovel.owner.name}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={2.3}>
                            <TextField
                              label="Whatsapp 1"
                              name="nome"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedImovelDb.N_WHATSAPP}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={2.3}>
                            <TextField
                              label="Whatsapp 2"
                              name="nome"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" defaultValue={selectedImovelDb.N_WHATSAPP2}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={2.3}>
                            <TextField
                              label="Funcionário"
                              name="nome"
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard" value={selectedImovelDb.N_FUNCIONARIO}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={0} direction="column">
                          <Grid item xs={12}>
                            {selectedImovelDb.N_WHATSAPP && (
                              <PhoneNumberAccordion phoneNumber={selectedImovelDb.N_WHATSAPP} label="whatsapp 1" />
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            {selectedImovelDb.N_WHATSAPP2 && (
                              <PhoneNumberAccordion phoneNumber={selectedImovelDb.N_WHATSAPP2} label="whatsapp 2" />
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            {selectedImovelDb.N_WHATSAPP3 && (
                              <PhoneNumberAccordion phoneNumber={selectedImovelDb.N_WHATSAPP3} label="whatsapp 3" />
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            {selectedImovelDb.N_FUNCIONARIO && (
                              <PhoneNumberAccordion phoneNumber={selectedImovelDb.N_FUNCIONARIO} label="funcionario" />
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            {selectedImovelDb.N_PARCEIRO && (
                              <PhoneNumberAccordion phoneNumber={selectedImovelDb.N_PARCEIRO} label="parceiro" />
                            )}
                          </Grid>
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
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard"
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              label="Telefone"
                              name="nome"
                              value={selectedHospede.phones[0].iso}
                              InputProps={{
                                readOnly: true,
                              }}
                              variant="standard"
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
                                      const status = selectedMessage?.boasVindas[tratarTelefone(selectedHospede.phones[0].iso)]?.status
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
                                          return <>

                                            <Chip label="Não enviada" color="default" size="small" />
                                            <Button size="small" color="error" onClick={() => { resendMessage(selectedReserva.id) }} >rechamar hospede</Button>
                                          </>

                                      }
                                    })()
                                  }

                                </Stack>
                              </Box>
                            </Card>

                          </Grid>
                          {selectedImovelDb.hasOwnProperty("DIALOGO_POS_RESERVA") && (
                            <Grid item xs={4}>

                              <Card variant="outlined">
                                <Box sx={{ p: 2 }}>
                                  <Typography color="text.primary" variant="body1">
                                    Pós reserva
                                  </Typography>
                                  <Typography color="text.secondary" variant="body2">
                                    id - {selectedImovelDb.DIALOGO_POS_RESERVA}
                                  </Typography>
                                </Box>
                                <Divider light />
                                <Box sx={{ p: 2 }}>

                                  <Stack direction="row" spacing={1}>

                                    {
                                      (() => {
                                        const status = selectedMessage?.posReserva2
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
                                            return <>

                                              <Chip label="Não enviada" color="default" size="small" />
                                              <Button size="small" color="error" onClick={() => { resendMessage(selectedReserva.id) }} >rechamar hospede</Button>
                                            </>

                                        }
                                      })()
                                    }

                                  </Stack>
                                </Box>
                              </Card>

                            </Grid>
                          )}

                          <Grid item xs={4}>

                            <Card variant="outlined">
                              <Box sx={{ p: 2 }}>
                                <Typography color="text.primary" variant="body1">
                                  Pré Check-In
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                  id - {selectedImovelDb.DIALOGO_PRE_CHECKIN}
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
                                  id - {selectedImovelDb.DIALOGO_PRE_CHECKOUT}
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
                        <Button size="small" color="error" href={"https://ssmt.stays.com.br/i/account-overview/" + selectedHospede._id} target="_blank">Ver perfil stays</Button>
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

function tratarReservasTabela(originalObject) {

  const transformedObject = {};

  for (const key in originalObject) {
    if (originalObject.hasOwnProperty(key)) {
      const reservation = originalObject[key];
      const newReservation = {
        id: reservation.id,
        creationDate: reservation.creationDate,
        checkIn: formatarData(reservation.checkInDate) + " às " + reservation.checkInTime,
        checkOut: formatarData(reservation.checkOutDate) + " às " + reservation.checkOutTime,
        listingId: reservation._idlisting,
        clientId: reservation._idclient,
        type: reservation.type,
        price: "R$ " + reservation.price._f_total,
        totalPaid: "R$ " + reservation.stats._f_totalPaid,
        restPaid: "R$ " + (reservation.price._f_total - reservation.stats._f_totalPaid),
        guests: reservation.guests,
        guestsDetails: reservation.guestsDetails,
        partner: {
          id: reservation.partner._id,
          name: reservation.partner.name
        },
        reservationUrl: reservation.reservationUrl
      };
      transformedObject[key] = newReservation;
    }
  }

  return transformedObject
}

function formatarData(data) {
  const partes = data.split('-');
  if (partes.length !== 3) return data; // Retorna a data original se não estiver no formato esperado

  const [ano, mes, dia] = partes;
  return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}

function tratarTelefone(telefone) {
  const numeroLimpo = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (numeroLimpo.startsWith("55") && numeroLimpo.length === 13) {
    return numeroLimpo.slice(0, 4) + numeroLimpo.slice(5);
  }

  return numeroLimpo;
}

export default DataTable;