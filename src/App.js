import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientesTable from './ClientsTable';
import ImoveisTable from "./ImoveisTable.js"
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
        <Route path="/clientes" element={<ClientesTable />} />
        <Route path="/" element={<ImoveisTable />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
