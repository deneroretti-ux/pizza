const produtos=[{n:"Calabresa",p:15},{n:"Muçarela",p:15},{n:"Presunto e Muçarela",p:15},{n:"Frango Catupiry",p:15}];
let pedido={};let num=localStorage.getItem("n")||1;

const div=document.getElementById("produtos");

produtos.forEach(p=>{
pedido[p.n]=0;
div.innerHTML+=`<div class="produto"><span>${p.n}</span>
<button onclick="m('${p.n}',-1)">-</button>
<span id="${p.n}">0</span>
<button onclick="m('${p.n}',1)">+</button></div>`;
});

function m(n,v){
pedido[n]+=v;if(pedido[n]<0)pedido[n]=0;
document.getElementById(n).innerText=pedido[n];
calc();
}

function calc(){
let t=0;produtos.forEach(p=>t+=pedido[p.n]*p.p);
document.getElementById("total").innerText=t;
}

function finalizar(){
let t=document.getElementById("total").innerText;
let s=document.querySelector('input[name="status"]:checked').value;
let o=document.getElementById("obs").value;

let txt=`Pedido ${num}\n`;
produtos.forEach(p=>{if(pedido[p.n]>0)txt+=pedido[p.n]+"x "+p.n+"\n"});
txt+=`Total: ${t}\n${s}\nObs:${o}`;

let w=window.open("");
w.document.write("<pre>"+txt+"</pre>");
w.print();

num++;localStorage.setItem("n",num);
location.reload();
}