const produtos = [
  { nome: "Calabresa", preco: 15 },
  { nome: "Muçarela", preco: 15 },
  { nome: "Presunto e Muçarela", preco: 15 },
  { nome: "Frango Catupiry", preco: 15 }
];

let pedido = {};
let numero = localStorage.getItem("numero") || 1;

const div = document.getElementById("produtos");

produtos.forEach(p => {
  pedido[p.nome] = 0;

  const el = document.createElement("div");
  el.className = "produto";
  el.innerHTML = `
    <span>${p.nome}</span>
    <div>
      <button onclick="alterar('${p.nome}', -1)">-</button>
      <span id="${p.nome}">0</span>
      <button onclick="alterar('${p.nome}', 1)">+</button>
    </div>
  `;
  div.appendChild(el);
});

function alterar(nome, val) {
  pedido[nome] += val;
  if (pedido[nome] < 0) pedido[nome] = 0;
  document.getElementById(nome).innerText = pedido[nome];
  calcular();
}

function calcular() {
  let total = 0;
  produtos.forEach(p => {
    total += pedido[p.nome] * p.preco;
  });
  document.getElementById("total").innerText = total;
}

function finalizar() {
  let total = document.getElementById("total").innerText;
  let status = document.querySelector('input[name="status"]:checked').value;
  let obs = document.getElementById("obs").value;

  let texto = `
Festa Franciscana
Barraca da Pizza
-----------------------
Pedido Nº ${numero}
-----------------------
`;

  produtos.forEach(p => {
    if (pedido[p.nome] > 0) {
      texto += `${pedido[p.nome]}x ${p.nome}\n`;
    }
  });

  texto += `
-----------------------
TOTAL: R$ ${total}
STATUS: ${status}
OBS: ${obs}
`;

  imprimir(texto);

  numero++;
  localStorage.setItem("numero", numero);

  location.reload();
}

function imprimir(texto) {
  let win = window.open("", "", "width=300,height=600");
  win.document.write("<pre>" + texto + "</pre>");
  win.print();
}

function relatorio() {
  alert("Relatório simples nesta versão.");
}
