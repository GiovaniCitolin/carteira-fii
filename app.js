
let fundosCadastrados=JSON.parse(localStorage.getItem("fundosCadastrados"))||[];

function preencherSelect(id){
 const s=document.getElementById(id);
 if(!s) return;
 s.innerHTML='<option value="">Selecione...</option>';
 fundosCadastrados.sort().forEach(f=>{
   s.innerHTML+=`<option value="${f}">${f}</option>`;
 });
 s.innerHTML+='<option value="__NOVO__">➕ Novo FII...</option>';
 s.onchange=function(){
   const campo=document.getElementById(id==="fundo"?"novoFundo":"novoFundoRendimento");
   campo.style.display=this.value==="__NOVO__"?"block":"none";
 };
}
function inicializarFundos(){
 aportes.forEach(a=>{
   if(!fundosCadastrados.includes(a.fundo)) fundosCadastrados.push(a.fundo);
 });
 localStorage.setItem("fundosCadastrados",JSON.stringify(fundosCadastrados));
 preencherSelect("fundo");
 preencherSelect("fundoRendimento");
}
let aportes = JSON.parse(localStorage.getItem("aportes")) || [];
let rendimentos = JSON.parse(localStorage.getItem("rendimentos")) || [];

/* =========================
   SALVAR APORTE
========================= */

function salvarAporte(){

    let fundo=document.getElementById("fundo").value;
if(fundo==="__NOVO__"){fundo=document.getElementById("novoFundo").value.toUpperCase();}
else{fundo=fundo.toUpperCase();}

    const cotas =
    Number(document.getElementById("cotas").value);

    const valor =
    Number(document.getElementById("valor").value);

    const data =
    document.getElementById("data").value;

    if(!fundo || !cotas || !valor){

        alert("Preencha todos os campos.");
        return;
    }

    if(!fundosCadastrados.includes(fundo)){fundosCadastrados.push(fundo);localStorage.setItem("fundosCadastrados",JSON.stringify(fundosCadastrados));preencherSelect("fundo");preencherSelect("fundoRendimento");}
    aportes.push({
        fundo,
        cotas,
        valor,
        data
    });

    localStorage.setItem(
        "aportes",
        JSON.stringify(aportes)
    );

    location.reload();
}

/* =========================
   SALVAR RENDIMENTO
========================= */

function salvarRendimento(){

    let fundo=document.getElementById("fundoRendimento").value;
if(fundo==="__NOVO__"){fundo=document.getElementById("novoFundoRendimento").value.toUpperCase();}
else{fundo=fundo.toUpperCase();}

    const mes =
    document.getElementById("mes").value;

    const valor =
    Number(
        document.getElementById("rendimento")
        .value
    );

    if(!fundo || !mes || !valor){

        alert("Preencha todos os campos.");
        return;
    }

    if(!fundosCadastrados.includes(fundo)){fundosCadastrados.push(fundo);localStorage.setItem("fundosCadastrados",JSON.stringify(fundosCadastrados));}
    rendimentos.push({
        fundo,
        mes,
        valor
    });

    localStorage.setItem(
        "rendimentos",
        JSON.stringify(rendimentos)
    );

    location.reload();
}

/* =========================
   RESUMO
========================= */

function atualizarResumo(){

    const investido =
    aportes.reduce(
        (t,a)=>t+(a.cotas*a.valor),
        0
    );

    const rend =
    rendimentos.reduce(
        (t,r)=>t+r.valor,
        0
    );

    const inv =
    document.getElementById("totalInvestido");

    const ren =
    document.getElementById("totalRendimentos");

    if(inv){

        inv.innerHTML =
        "Investido: R$ " +
        investido.toFixed(2);

        ren.innerHTML =
        "Rendimentos: R$ " +
        rend.toFixed(2);
    }
}

/* =========================
   HISTÓRICO
========================= */

function carregarHistorico(){

    const div =
    document.getElementById("historico");

    if(!div) return;

    div.innerHTML = "";

    const fundos = {};

    aportes.forEach(a=>{

        if(!fundos[a.fundo]){

            fundos[a.fundo] = {

                cotas:0,
                investido:0,
                rendimento:0,
                aportes:[]
            };
        }

        fundos[a.fundo].cotas += a.cotas;

        fundos[a.fundo].investido +=
        a.cotas * a.valor;

        fundos[a.fundo].aportes.push(a);

    });

    rendimentos.forEach(r=>{

        if(!fundos[r.fundo]){

            fundos[r.fundo] = {

                cotas:0,
                investido:0,
                rendimento:0,
                aportes:[]
            };
        }

        fundos[r.fundo].rendimento +=
        r.valor;
    });

    let total = 0;

    for(let f in fundos){

        total += fundos[f].rendimento;

        let detalhes = "";

        fundos[f].aportes.forEach(a=>{

            detalhes += `
            <p>

            📅 ${a.data || "-"}

            <br>

            ${a.cotas} cotas

            <br>

            Investimento:
            R$ ${(a.cotas*a.valor).toFixed(2)}

            </p>
            `;
        });

        div.innerHTML += `

        <div class="item">

            <h2>${f}</h2>

            <p>
            Total de cotas:
            ${fundos[f].cotas}
            </p>

            <p>
            Total investido:
            R$ ${fundos[f].investido.toFixed(2)}
            </p>

            <p>
            Rendimentos:
            R$ ${fundos[f].rendimento.toFixed(2)}
            </p>

            ${detalhes}

        </div>
        `;
    }

    div.innerHTML += `

    <div class="item">

        <h2>
        Total Geral de Rendimentos
        </h2>

        <h1>
        R$ ${total.toFixed(2)}
        </h1>

    </div>
    `;
}

/* =========================
   FUNDOS CADASTRADOS
========================= */
function carregarListaFundos(){

    const lista =
    document.getElementById("listaFundos");

    if(!lista) return;

    lista.innerHTML="";

    const pesquisa =
    document
    .getElementById("pesquisa")
    ?.value
    .toUpperCase() || "";

    aportes
    .filter(a=>a.fundo.includes(pesquisa))

    .forEach((a,i)=>{

        const investido =
        a.cotas*a.valor;

        lista.innerHTML+=`

<div class="fundo-card">

<div class="fundo-topo">

<div class="fundo-nome">

📈 ${a.fundo}

</div>

<div class="menu">

⋮

</div>

</div>

<div class="info-grid">

<div class="info">

<small>Cotas</small>

<b>${a.cotas}</b>

</div>

<div class="info">

<small>Preço</small>

<b>R$ ${Number(a.valor).toFixed(2)}</b>

</div>

<div class="info">

<small>Investido</small>

<b>R$ ${investido.toFixed(2)}</b>

</div>

<div class="info">

<small>Data</small>

<b>${a.data || "-"}</b>

</div>

</div>

<div class="acoes">

<button
class="btn-edit"
onclick="editarFundo(${i})">

✏️ Editar

</button>

<button
class="btn-delete"
onclick="excluirFundo(${i})">

🗑 Excluir

</button>

</div>

</div>

`;

    });

}

/* =========================*
   RENDIMENTOS
========================= */

function carregarListaRendimentos(){

    const lista =
    document.getElementById(
        "listaRendimentos"
    );

    if(!lista) return;

    lista.innerHTML = "";

    rendimentos.forEach((r,i)=>{

        lista.innerHTML += `

        <div class="item">

            <b>${r.fundo}</b>

            <br>

            Mês:
            ${r.mes}

            <br>

            Valor:
            R$ ${Number(r.valor).toFixed(2)}

            <br><br>

            <button
            onclick="editarRendimento(${i})">

            ✏️ Editar

            </button>

            <button
            onclick="excluirRendimento(${i})"
            style="background:#dc2626">

            🗑️ Excluir

            </button>

        </div>
        `;
    });
}

function editarRendimento(i){

    const r = rendimentos[i];

    const fundo =
    prompt("Fundo",r.fundo);

    const mes =
    prompt(
        "Mês (AAAA-MM)",
        r.mes
    );

    const valor =
    prompt(
        "Valor recebido",
        r.valor
    );

    if(
        fundo===null ||
        mes===null ||
        valor===null
    ) return;

    r.fundo = fundo.toUpperCase();
    r.mes = mes;
    r.valor = Number(valor);

    localStorage.setItem(
        "rendimentos",
        JSON.stringify(rendimentos)
    );

    location.reload();
}

function excluirRendimento(i){

    if(
        !confirm(
            "Excluir este rendimento?"
        )
    ) return;

    rendimentos.splice(i,1);

    localStorage.setItem(
        "rendimentos",
        JSON.stringify(rendimentos)
    );

    location.reload();
}

/* ========================= */

atualizarResumo();


function editarFundo(i){

    const a = aportes[i];

    const fundo = prompt("Fundo", a.fundo);
    if(fundo === null) return;

    const cotas = prompt("Quantidade de cotas", a.cotas);
    if(cotas === null) return;

    const valor = prompt("Preço da cota", a.valor);
    if(valor === null) return;

    const data = prompt("Data (AAAA-MM-DD)", a.data || "");
    if(data === null) return;

    aportes[i] = {
        fundo: fundo.toUpperCase(),
        cotas: Number(cotas),
        valor: Number(valor),
        data: data
    };

    localStorage.setItem("aportes", JSON.stringify(aportes));
    location.reload();
}

function excluirFundo(i){

    if(!confirm("Deseja excluir este aporte?")) return;

    aportes.splice(i,1);

    localStorage.setItem("aportes", JSON.stringify(aportes));
    location.reload();
}
