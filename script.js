const produtos = [
  { n: "Calabresa", p: 18 },
  { n: "Muçarela", p: 18 },
  { n: "Presunto e Muçarela", p: 18 },
  { n: "Frango Catupiry", p: 18 }
];

let pedido = {};
let numeroAtual = Number(localStorage.getItem("numero_pedido_pizza") || 1);

const divProdutos = document.getElementById("produtos");
document.getElementById("numeroPedido").innerText = formatarNumero(numeroAtual);

produtos.forEach(produto => {
  pedido[produto.n] = 0;

  const item = document.createElement("div");
  item.className = "produto";
  item.innerHTML = `
    <div class="nome-produto">
      ${produto.n}
      <span class="preco">R$ ${dinheiro(produto.p)}</span>
    </div>
    <button class="btn-qtd" onclick="alterarQuantidade('${produto.n}', -1)">−</button>
    <div class="qtd" id="${id(produto.n)}">0</div>
    <button class="btn-qtd" onclick="alterarQuantidade('${produto.n}', 1)">+</button>
  `;
  divProdutos.appendChild(item);
});

function id(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_");
}

function dinheiro(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatarNumero(numero) {
  return String(numero).padStart(3, "0");
}

function alterarQuantidade(nome, valor) {
  pedido[nome] += valor;
  if (pedido[nome] < 0) pedido[nome] = 0;
  document.getElementById(id(nome)).innerText = pedido[nome];
  calcularTotal();
}

function calcularTotal() {
  let total = 0;
  produtos.forEach(produto => {
    total += pedido[produto.n] * produto.p;
  });
  document.getElementById("total").innerText = dinheiro(total);
  return total;
}

function getPedidos() {
  return JSON.parse(localStorage.getItem("relatorio_pedidos_pizza") || "[]");
}

function setPedidos(lista) {
  localStorage.setItem("relatorio_pedidos_pizza", JSON.stringify(lista));
}

function finalizarPedido() {
  const itens = [];

  produtos.forEach(produto => {
    if (pedido[produto.n] > 0) {
      itens.push({
        nome: produto.n,
        qtd: pedido[produto.n],
        preco: produto.p,
        subtotal: pedido[produto.n] * produto.p
      });
    }
  });

  if (itens.length === 0) {
    alert("Selecione pelo menos uma pizza.");
    return;
  }

  const numero = formatarNumero(numeroAtual);
  const total = calcularTotal();
  const status = document.querySelector('input[name="status"]:checked').value;
  const obs = document.getElementById("obs").value.trim() || "-";

  const pedidoFinal = {
    numero,
    data: new Date().toISOString(),
    itens,
    total,
    status,
    obs
  };

  const lista = getPedidos();
  lista.push(pedidoFinal);
  setPedidos(lista);

  imprimirCupons(pedidoFinal);

  numeroAtual++;
  localStorage.setItem("numero_pedido_pizza", numeroAtual);

  setTimeout(() => location.reload(), 500);
}

function montarItensCliente(pedidoFinal) {
  return pedidoFinal.itens.map(item =>
    `${item.qtd}x ${item.nome} - R$ ${dinheiro(item.subtotal)}`
  ).join("\n");
}

function montarItensCozinha(pedidoFinal) {
  return pedidoFinal.itens.map(item =>
    `${item.qtd}x ${item.nome}`
  ).join("\n");
}

function imprimirCupons(pedidoFinal) {
  const cliente = `
FESTA FRANCISCANA 2025
BARRACA DA PIZZA
------------------------------
PEDIDO Nº ${pedidoFinal.numero}
------------------------------
${montarItensCliente(pedidoFinal)}
------------------------------
TOTAL: R$ ${dinheiro(pedidoFinal.total)}
STATUS: ${pedidoFinal.status}
OBS: ${pedidoFinal.obs}
------------------------------
VIA CLIENTE
`;

  const cozinha = `
COZINHA
------------------------------
PEDIDO Nº ${pedidoFinal.numero}
------------------------------
${montarItensCozinha(pedidoFinal)}
------------------------------
OBS: ${pedidoFinal.obs}
------------------------------
VIA COZINHA
`;

  const janela = window.open("", "_blank");
  janela.document.write(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Pedido ${pedidoFinal.numero}</title>
        <style>
          @page { size: 80mm auto; margin: 4mm; }
          body { font-family: monospace; margin: 0; color: #000; }
          .cupom { width: 72mm; page-break-after: always; }
          pre { font-size: 13px; white-space: pre-wrap; margin: 0; }
        </style>
      </head>
      <body>
        <div class="cupom"><pre>${cliente}</pre></div>
        <div class="cupom"><pre>${cozinha}</pre></div>
        <script>window.onload = function(){ window.print(); }<\/script>
      </body>
    </html>
  `);
  janela.document.close();
}

function abrirRelatorio() {
  const lista = getPedidos();
  let totalPedidos = lista.length;
  let totalPizzas = 0;
  let totalVendido = 0;
  let totalPago = 0;
  let totalPendente = 0;
  const porSabor = {};

  produtos.forEach(produto => porSabor[produto.n] = 0);

  lista.forEach(pedido => {
    totalVendido += pedido.total;
    if (pedido.status === "PAGO") totalPago += pedido.total;
    if (pedido.status === "PENDENTE") totalPendente += pedido.total;

    pedido.itens.forEach(item => {
      totalPizzas += item.qtd;
      porSabor[item.nome] = (porSabor[item.nome] || 0) + item.qtd;
    });
  });

  let html = `
    <div class="rel-linha"><span>Total de pedidos</span><strong>${totalPedidos}</strong></div>
    <div class="rel-linha"><span>Total de pizzas</span><strong>${totalPizzas}</strong></div>
    <div class="rel-linha"><span>Total vendido</span><strong>R$ ${dinheiro(totalVendido)}</strong></div>
    <div class="rel-linha"><span>Total pago</span><strong>R$ ${dinheiro(totalPago)}</strong></div>
    <div class="rel-linha"><span>Total pendente</span><strong>R$ ${dinheiro(totalPendente)}</strong></div>
    <div class="rel-titulo">Quantidade por sabor</div>
  `;

  Object.keys(porSabor).forEach(nome => {
    html += `<div class="rel-linha"><span>${nome}</span><strong>${porSabor[nome]}</strong></div>`;
  });

  document.getElementById("relatorioConteudo").innerHTML = html;
  document.getElementById("modalRelatorio").classList.remove("oculto");
}

function fecharRelatorio() {
  document.getElementById("modalRelatorio").classList.add("oculto");
}

function imprimirRelatorio() {
  const conteudo = document.getElementById("relatorioConteudo").innerHTML;
  const janela = window.open("", "_blank");
  janela.document.write(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório</title>
        <style>
          body { font-family: Arial; padding: 12px; color: #000; }
          h2 { text-align: center; }
          .rel-linha { display: flex; justify-content: space-between; border-bottom: 1px dashed #000; padding: 8px 0; }
          .rel-titulo { margin-top: 14px; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <h2>Festa Franciscana 2025<br>Barraca da Pizza</h2>
        <h3>Relatório do Dia</h3>
        ${conteudo}
        <script>window.onload = function(){ window.print(); }<\/script>
      </body>
    </html>
  `);
  janela.document.close();
}

function zerarRelatorio() {
  if (confirm("Tem certeza que deseja zerar o relatório e reiniciar os pedidos?")) {
    localStorage.removeItem("relatorio_pedidos_pizza");
    localStorage.removeItem("numero_pedido_pizza");
    location.reload();
  }
}

calcularTotal();
