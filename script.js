const produtos=[
{n:"Calabresa",p:18},
{n:"Muçarela",p:18},
{n:"Presunto e Muçarela",p:18},
{n:"Frango Catupiry",p:18}
];

let pedido={};

const div=document.getElementById("produtos");

produtos.forEach(p=>{
pedido[p.n]=0;
div.innerHTML+=`
<div class="produto">
<span>${p.n}</span>
<button class="btn-qtd" onclick="m('${p.n}',-1)">-</button>
<span id="${p.n}">0</span>
<button class="btn-qtd" onclick="m('${p.n}',1)">+</button>
</div>`;
});

function m(n,v){
pedido[n]+=v;
if(pedido[n]<0)pedido[n]=0;
document.getElementById(n).innerText=pedido[n];
calc();
}

function calc(){
let t=0;
produtos.forEach(p=>t+=pedido[p.n]*p.p);
document.getElementById("total").innerText=t.toFixed(2);
}

function finalizar(){
alert("Pedido enviado (impressão aqui)");
location.reload();
}

function relatorio(){
alert("Relatório simples ativo");
}
