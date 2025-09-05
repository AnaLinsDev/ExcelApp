async function carregarTabela() {
  const res = await fetch("/dados");
  const dados = await res.json();
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  dados.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.Data}</td><td>${row.Peso}</td><td>${row.Preço}</td>`;
    tbody.appendChild(tr);
  });
}

document.querySelector("#adicionarBtn").addEventListener("click", async () => {
  const peso = document.querySelector("#peso").value;
  const preco = document.querySelector("#preco").value;

  if (!peso || !preco) {
    alert("Preencha todos os campos!");
    return;
  }

  await fetch("/adicionar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ peso, preco })
  });

  document.querySelector("#peso").value = "";
  document.querySelector("#preco").value = "";
  carregarTabela();
});

// Carregar dados ao abrir
carregarTabela();
