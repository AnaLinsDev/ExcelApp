const express = require("express");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Caminho do Excel
const excelPath = path.join(__dirname, "dados.xlsx");

// Ler Excel
function readExcel() {
  if (!fs.existsSync(excelPath)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Data", "Peso", "Preço"]]);
    XLSX.utils.book_append_sheet(wb, ws, "Dados");
    XLSX.writeFile(wb, excelPath);
  }
  const wb = XLSX.readFile(excelPath);
  const ws = wb.Sheets["Dados"];
  return XLSX.utils.sheet_to_json(ws, { defval: "" });
}

// Escrever no Excel
function writeExcel(newRow) {
  const wb = XLSX.readFile(excelPath);
  const ws = wb.Sheets["Dados"];
  const data = XLSX.utils.sheet_to_json(ws, { defval: "" });

  data.push(newRow);
  const newWs = XLSX.utils.json_to_sheet(data, { header: ["Data", "Peso", "Preço"] });
  wb.Sheets["Dados"] = newWs;
  XLSX.writeFile(wb, excelPath);
}

// Endpoint GET para carregar dados
app.get("/dados", (req, res) => {
  const data = readExcel();
  res.json(data);
});

// Endpoint POST para adicionar dados
app.post("/adicionar", (req, res) => {
  const { peso, preco } = req.body;
  const newRow = {
    Data: new Date().toLocaleDateString(),
    Peso: peso,
    Preço: preco
  };
  writeExcel(newRow);
  res.json({ sucesso: true, msg: "Linha adicionada com sucesso!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
