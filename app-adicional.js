
function carregarListaFundos(){
 const lista=document.getElementById('listaFundos');
 if(!lista)return;
 lista.innerHTML='';
 aportes.forEach((a,i)=>{
  lista.innerHTML += `<div class="item">
  <b>${a.fundo}</b><br>
  ${a.cotas} cotas<br>
  R$ ${Number(a.valor).toFixed(2)}
  <br><br>
  <button onclick="editarFundo(${i})">Editar</button>
  <button onclick="excluirFundo(${i})" style="background:#dc2626;margin-top:10px;">Excluir</button>
  </div>`;
 });
}
function editarFundo(i){
 const a=aportes[i];
 const cotas=prompt('Quantidade de cotas',a.cotas);
 const valor=prompt('Valor da cota',a.valor);
 if(cotas===null||valor===null)return;
 a.cotas=Number(cotas);
 a.valor=Number(valor);
 localStorage.setItem('aportes',JSON.stringify(aportes));
 location.reload();
}
function excluirFundo(i){
 if(!confirm('Excluir este cadastro?')) return;
 aportes.splice(i,1);
 localStorage.setItem('aportes',JSON.stringify(aportes));
 location.reload();
}
