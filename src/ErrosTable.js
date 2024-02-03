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
  
  const [openDialog, setOpenDialog] = useState(false);
  const [respDb, setRespDb] = useState({})
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingModal, setLoadingModal] = useState(true);

  const [selectedHospede, setSelectedHospede] = useState({})
  const [selectedImovel, setSelectedImovel] = useState({})
  const [selectedMessage, setSelectedMessage] = useState({})
  const [selectedImovelDb, setSelectedImovelDb] = useState({})
  const [selectedReserva, setSelectedReserva] = useState({});
  useEffect(() => {
    // Utilize o método do Firebase para obter os dados desejados
    const fetchData = async () => {
      try {
        const data = await firebase.getImovel("");
        const dataMessage = await firebase.getMessage("")
        console.log("MESSAGES ->", dataMessage)
        
        const encontrarErros = (dados) => {
          const erros = [];
          let id = 0;
          // Itera sobre os níveis mais externos do objeto
          Object.keys(dados).forEach((chaveExterna) => {
            const dadosInternos = dados[chaveExterna];
            console.log("DADOS INTERNOS ->", dadosInternos)
            // Itera sobre os níveis internos do objeto
            Object.keys(dadosInternos).forEach((chaveInterna) => {
              const parametro = dadosInternos[chaveInterna];
              console.log("PARAMETROS ->", parametro)
              // Verifica se o status é "error"
              if (typeof parametro == "string" && parametro === "error") {
                console.log("ENCONTROU UM ERRO ->", chaveExterna, "////", chaveInterna)
                id++
                erros.push({
                  id,
                  chaveExterna,
                  chaveInterna: tratarStatus(chaveInterna),
                  telefone: "hospede",
                });
              }
              if (typeof parametro == "object") {
                Object.keys(parametro).forEach(telefone => {
                  console.log("PARAMETRO DO OBJ ->", telefone)
                  if(parametro[telefone].status == "error"){
                    id++
                    console.log("ENCONTROU UM ERRO ->", chaveExterna, "////", chaveInterna)
                    erros.push({
                      id,
                      chaveExterna,
                      chaveInterna: tratarStatus(chaveInterna),
                      messageId: parametro[telefone].messageId,
                      telefone,
                    });
                  }
                })

                
                
              }
            });
          });
        
          return erros;
        };
        
        const erros = encontrarErros(dataMessage);
        const errosFiltrado = erros.filter(objeto => objeto.chaveInterna != 'Dialogo de pós reserva');
        
        console.log("Parâmetros com erro:", erros);
        console.log("Parâmetros com erro filtrado:", errosFiltrado);

        setRespDb(errosFiltrado);
        setLoadingTable(false);
      } catch (error) {
        console.error('Erro ao obter dados do Firebase:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'chaveExterna', headerName: 'Reserva', width: 100 },
    { field: 'chaveInterna', headerName: 'Dialogo', width: 250 },
    { field: 'telefone', headerName: 'Telefone', width: 150 },
    {field: 'messageId', headerName: 'Motivo', width: 300 }
  ];

  const handleReservaButtonClick = async (idReserva) => {
    
    setOpenDialog(true)
    setLoadingModal(true)

    const dadosReserva = await Service.getReserva(idReserva)
    const dadosHospede = await Service.getClient(dadosReserva._idclient)
    const dadosImovel = await Service.getImovel(dadosReserva._idlisting)
    const dadosImovelDb = await firebase.getImovel(dadosImovel.id)
    const dadosMessage = await firebase.getMessage(dadosReserva.id)

    console.log("DADOS DA RESERVA -> ", dadosReserva)
    console.log("DADOS IMOVEL -> ", dadosImovel)
    console.log("DADOS IMOVEL DB -> ", dadosImovelDb)
    console.log("DADOS HOSPEDE -> ", dadosHospede)
    console.log("DADOS MESSAGE -> ", dadosMessage)

    setSelectedReserva(tratarReservasTabela(dadosReserva))
    setSelectedImovel(dadosImovel)
    setSelectedHospede(dadosHospede)
    setSelectedImovelDb(dadosImovelDb)
    setSelectedMessage(dadosMessage)

    setLoadingModal(false)
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
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
                        const telefoneISO = selectedHospede?.phones?.[0]?.iso;
                        const status = selectedMessage?.boasVindas?.[tratarTelefone(telefoneISO)]?.status ?? "";
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


  return (
    <div style={{ height: "100%", width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "72vh", width: 'min-content' }}>

        {loadingTable ? (
          <CircularProgress color="error" />
        ) : (
          <>
          <DataGrid
            rows={Object.values(respDb)}
            columns={columns}
            pageSizeOptions={[5, 10]}
            style={{ cursor: "pointer" }}
            onRowClick={(params) => handleReservaButtonClick(params.row.chaveExterna)}
          />
          </>
          
          
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
                    label="ID do imovel"
                    name="telefone"
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="standard" value={selectedImovel.id}
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
                            const telefoneISO = selectedHospede?.phones?.[0]?.iso;
                            const status = selectedMessage?.boasVindas?.[tratarTelefone(telefoneISO)]?.status ?? "";
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


function tratarStatus(stats){
  switch(stats) {
    case "boasVindas":
        return "Boas vindas"
        case "posReserva":
          return "Dialogo Pós boas vindas"
          case "posReserva2":
        return "Dialogo de pós reserva"
    default:
      return "nao encontrado"
}
}

function tratarTelefone(telefone) {
  const numeroLimpo = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (numeroLimpo.startsWith("55") && numeroLimpo.length === 13) {
    return numeroLimpo.slice(0, 4) + numeroLimpo.slice(5);
  }

  return numeroLimpo;
}


function tratarReservasTabela(originalObject) {



 
    
      const newReservation = {
        id: originalObject.id,
        creationDate: originalObject.creationDate,
        checkIn: formatarData(originalObject.checkInDate) + " às " + originalObject.checkInTime,
        checkOut: formatarData(originalObject.checkOutDate) + " às " + originalObject.checkOutTime,
        listingId: originalObject._idlisting,
        clientId: originalObject._idclient,
        type: originalObject.type,
        price: "R$ " + originalObject.price._f_total,
        totalPaid: "R$ " + originalObject.stats._f_totalPaid,
        restPaid: "R$ " + (originalObject.price._f_total - originalObject.stats._f_totalPaid),
        guests: originalObject.guests,
        guestsDetails: originalObject.guestsDetails,
        partner: {
          id: originalObject.partner._id,
          name: originalObject.partner.name
        },
        reservationUrl: originalObject.reservationUrl
      
      
    
  }

  return newReservation
}

function formatarData(data) {
  const partes = data.split('-');
  if (partes.length !== 3) return data; // Retorna a data original se não estiver no formato esperado

  const [ano, mes, dia] = partes;
  return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}

export default DataTable;