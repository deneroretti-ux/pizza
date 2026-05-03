const produtos = [
  { n: "Calabresa", p: 18 },
  { n: "Muçarela", p: 18 },
  { n: "Presunto e Muçarela", p: 18 },
  { n: "Frango Catupiry", p: 18 }
];

let pedido = {};
let num = Number(localStorage.getItem("n") || 1);

const div = document.getElementById("produtos");

produtos.forEach(p => {
  pedido[p.n] = 0;
  const item = document.createElement("div");
  item.className = "produto";
  item.innerHTML = `
    <div class="nome-produto">${p.n}</div>
    <button class="btn-qtd" onclick="m('${p.n}',-1)">−</button>
    <div class="qtd" id="${id(p.n)}">0</div>
    <button class="btn-qtd" onclick="m('${p.n}',1)">+</button>
  `;
  div.appendChild(item);
});

function id(txt) {
  return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_");
}

function m(n, v) {
  pedido[n] += v;
  if (pedido[n] < 0) pedido[n] = 0;
  document.getElementById(id(n)).innerText = pedido[n];
  calc();
}

function calc() {
  let t = 0;
  produtos.forEach(p => t += pedido[p.n] * p.p);
  document.getElementById("total").innerText = t;
}

function finalizar() {
  let total = document.getElementById("total").innerText;
  let status = document.querySelector('input[name="status"]:checked').value;
  let obs = document.getElementById("obs").value || "-";

  let temItem = produtos.some(p => pedido[p.n] > 0);
  if (!temItem) {
    alert("Selecione pelo menos uma pizza.");
    return;
  }

  let numero = String(num).padStart(3, "0");

  let cliente = `
FESTA FRANCISCANA
BARRACA DA PIZZA
------------------------
PEDIDO Nº ${numero}
------------------------
`;

  produtos.forEach(p => {
    if (pedido[p.n] > 0) cliente += `${pedido[p.n]}x ${p.n} - R$ ${pedido[p.n] * p.p}\n`;
  });

  cliente += `
------------------------
TOTAL: R$ ${total}
STATUS: ${status}
OBS: ${obs}
------------------------
VIA CLIENTE
`;

  let cozinha = `
COZINHA
------------------------
PEDIDO Nº ${numero}
------------------------
`;

  produtos.forEach(p => {
    if (pedido[p.n] > 0) cozinha += `${pedido[p.n]}x ${p.n}\n`;
  });

  cozinha += `
------------------------
OBS: ${obs}
------------------------
VIA COZINHA
`;

  imprimir(cliente, cozinha);

  num++;
  localStorage.setItem("n", num);
  setTimeout(() => location.reload(), 500);
}

function imprimir(cliente, cozinha) {
  let w = window.open("", "_blank");
  w.document.write(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Cupom</title>
        <style>
          @page { size: 80mm auto; margin: 4mm; }
          body { font-family: monospace; margin: 0; color: #000; }
          pre { font-size: 13px; white-space: pre-wrap; }
          .cupom { width: 72mm; page-break-after: always; }
          .pedido { font-size: 24px; font-weight: bold; text-align: center; }
        </style>
      </head>
      <body>
        <div class="cupom"><pre>${cliente}</pre></div>
        <div class="cupom"><pre>${cozinha}</pre></div>
        <script>window.onload = function(){ window.print(); }<\/script>
      </body>
    </html>
  `);
  w.document.close();
}
