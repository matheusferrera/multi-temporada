import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReservasTable from './ReservasTable.js';
import ImoveisTable from "./ImoveisTable.js"
import ErrosTable from "./ErrosTable.js"
import json from "./users.json"
import firebase from "./Firebase.js"

//getAllClients()


console.log("JSON DOS CLIENTES -> ", json)

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        {/* Rota específica para /clientes */}
        <Route path="/reservas" element={<ReservasTable />} />
        <Route path="/erros" element={<ErrosTable />} />
        <Route path="/" element={<ImoveisTable />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
