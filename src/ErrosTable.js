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
import firebase, { updateMessages } from './Firebase';
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
import { v4 as uuidv4 } from 'uuid';


function DataTable() {

  const [openDialog, setOpenDialog] = useState(false);
  const [respDb, setRespDb] = useState([])
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingModal, setLoadingModal] = useState(true);
  const [openSnack, setOpenSnack] = useState(false);
  const [selectedHospede, setSelectedHospede] = useState({})
  const [selectedImovel, setSelectedImovel] = useState({})
  const [selectedMessage, setSelectedMessage] = useState({})
  const [selectedImovelDb, setSelectedImovelDb] = useState({})
  const [selectedReserva, setSelectedReserva] = useState({});


  const encontrarErros = (dados) => {
    const novosErros = [];
    for (const idReserva in dados) {
      const dadosInternos = dados[idReserva];
      console.log("ANALISANDO - ", idReserva);
      for (const chaveInterna in dadosInternos) {
        const parametro = dadosInternos[chaveInterna];
        if (typeof parametro === "string" && parametro === "error" && chaveInterna !== "posReserva2") {
          console.log("Encontrou erro - ", idReserva, " - ", dadosInternos, " chave inter - ", chaveInterna);
          Service.getReserva(idReserva)
            // eslint-disable-next-line no-loop-func
            .then(dadosReserva => {
              if (!dadosReserva) {
                throw new Error("Reserva não encontrada");
              }
              return Service.getClient(dadosReserva._idclient)
                .then(dadosHospede => {
                  if (!dadosHospede) {
                    throw new Error("Hóspede não encontrado");
                  }
                  
                  const telefoneHospede = tratarTelefone(dadosHospede?.phones ? dadosHospede?.phones[0]?.iso : "0000000000000");
                  let novosErros = {
                    id: uuidv4(),
                    idReserva,
                    checkIn: formatarData(dadosReserva.checkInDate),
                    checkOut: formatarData(dadosReserva.checkOutDate),
                    chaveInterna: tratarStatus(chaveInterna),
                    telefone: telefoneHospede + " - hospede",
                    messageId: "Chat não existe com número informado. Lembre-se de informar o número completo com DDI+DDD+NUMERO"
                  };

                  if(Date.parse(dadosReserva.checkInDate) > Date.now()){
                    setRespDb(prevState => {
                      const isDuplicate = prevState.some(item => item.idReserva === idReserva && item.telefone === novosErros.telefone);
                    
                      if (!isDuplicate) {
                        return [...prevState, novosErros];
                      }
                      return prevState; 
                    });
                  }
                  
                });
            })
            .catch(error => {
              console.error("Erro ao buscar dados da reserva ou do hóspede:", error);
              // Trate o erro adequadamente, como exibir uma mensagem de erro ao usuário
            });

        }
        if (typeof parametro === "object" && chaveInterna !== "posReserva2") {
          for (const telefone in parametro) {
            if (parametro[telefone].status === "error") {
              Service.getReserva(idReserva)
                // eslint-disable-next-line no-loop-func
                .then(dadosReserva => {
                  if (!dadosReserva) {
                    throw new Error("Reserva não encontrada");
                  }
                  let novosErros = {
                    id: uuidv4(),
                    idReserva,
                    chaveInterna: tratarStatus(chaveInterna),
                    messageId: parametro[telefone].messageId ? parametro[telefone].messageId : parametro[telefone].chatId,
                    checkIn: formatarData(dadosReserva.checkInDate),
                    checkOut: formatarData(dadosReserva.checkOutDate),
                    telefone: telefone + " - imovel",
                  };
                  
                  console.log("CHEKCIN - ", Date.parse(dadosReserva.checkInDate), typeof dadosReserva.checkInDate, " // HOJE - ", Date.now(), " if - ", Date.parse(dadosReserva.checkInDate) > Date.now())

                  if(Date.parse(dadosReserva.checkInDate) > Date.now()){
                    setRespDb(prevState => {
                      const isDuplicate = prevState.some(item => item.idReserva === idReserva && item.telefone === novosErros.telefone);
                    
                      if (!isDuplicate) {
                        return [...prevState, novosErros];
                      }
                      return prevState; 
                    });
                  }
                  
             
                })
                .catch(error => {
                  console.error("Erro ao buscar dados da reserva:", error);
                  // Trate o erro adequadamente
                });
            }
          }
        }
      }
    }
    
    setLoadingTable(false)
    return
  };



  useEffect(() => {
    const fetchData = () => {

      firebase.getMessage("")
        .then(dataMessage => {
          encontrarErros(dataMessage)
        }).catch(error => {
          console.error('Erro ao obter dados do Firebase:', error);
        });
    };

    fetchData();
  }, []);



  const apagarErro = async (id, tipo, telefone) => {

    let dadosMessage = await firebase.getMessage(id)
    telefone = telefone.split(" -")[0]
    if (tipo == "Boas vindas") {
      dadosMessage.boasVindas[telefone].status = "sent"
      setRespDb(prevData => prevData.filter(item => item.idReserva !== id && item.telefone != telefone));
      firebase.updateMessages(id, dadosMessage)
      setOpenSnack(true)
    }
    if (tipo == "Pré checkout" || tipo == "Pré checkin" || tipo == "Dialogo Pós boas vindas") {
      dadosMessage.preCheckout = "success"
      setRespDb(prevData => prevData.filter(item => item.idReserva !== id && item.telefone != telefone));
      firebase.updateMessages(id, dadosMessage)
      setOpenSnack(true)
    }
  }



  const columns = [
    { field: 'idReserva', headerName: 'Reserva', width: 100 },
    { field: 'chaveInterna', headerName: 'Dialogo', width: 170 },
    { field: 'checkIn', headerName: 'Check in', width: 100 },
    { field: 'checkOut', headerName: 'Check out', width: 100 },
    { field: 'telefone', headerName: 'Telefone', width: 200 },
    { field: 'messageId', headerName: 'Motivo', width: 300 },
    {
      id: 'actions', label: 'Ações', width: 120, renderCell: (row) => (
        <Button variant="outlined" onClick={() => { apagarErro(row.row.idReserva, row.row.chaveInterna, row.row.telefone) }} color="error">
          Apagar
        </Button>
      )
    },
  ];

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };



  return (
    <div style={{ height: "100%", width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "72vh", width: 'min-content' }}>
        <Snackbar
          open={openSnack}
          autoHideDuration={2000}
          message={"Erro apagado com sucesso!"}
          onClose={handleCloseSnack}
        />
        {loadingTable ? (
          <CircularProgress color="error" />
        ) : (
          <>
            <DataGrid
              rows={Object.values(respDb)}
              columns={columns}
              pageSizeOptions={[5, 10]}
              style={{ cursor: "pointer" }}
            />
          </>


        )}



      </div>
    </div>
  );
}


function tratarStatus(stats) {
  switch (stats) {
    case "boasVindas":
      return "Boas vindas"
    case "posReserva":
      return "Dialogo Pós boas vindas"
    case "posReserva2":
      return "Dialogo de pós reserva"
    case "preCheckout":
      return "Pré checkout"
    case "preCheckin":
      return "Pré checkin"
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