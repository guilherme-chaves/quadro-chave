var loadData = new Promise(function (resolve, reject) {
  // Procura pelo arquivo JSON e o converte para um objeto JS (função assíncrona, por isso é uma Promise)
  var req = new XMLHttpRequest();
  req.open("GET", "filmes.json", true);
  req.overrideMimeType("application/json");
  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      var json = JSON.parse(req.responseText);
      resolve(json);
    }
  };
  req.send(null);
});

function geraCard(filme) {
  //Código para a função a ser chamada
  var onclick = "goToAnima('" + filme["nome"] + "', event)";

  // Criação do card
  var card = document.createElement("div");
  card.className = "flip-card";
  card.setAttribute("onclick", onclick);
  var inner = document.createElement("div");
  inner.className = "flip-card-inner";

  // Parte da frente do card
  var front = document.createElement("div");
  front.className = "flip-card-front"
  var img = document.createElement("img");
  img.className = "imgcard";
  img.setAttribute("src", filme["img_card"]);
  img.setAttribute("alt", filme["alt_imagem"]);

  // Parte de trás do card
  var back = document.createElement("div");
  back.className = "flip-card-back";
  //Titulo
  var h3 = document.createElement("h3");
  var titulo = document.createTextNode(filme["nome"]);
  h3.appendChild(titulo);
  // Resumo do filme
  var p = document.createElement("p");
  var descricao = document.createTextNode(filme["descricao"]);
  p.appendChild(descricao);
  // Ano de lançamento
  var ano = document.createElement("p");
  var txt_ano = document.createTextNode("("+filme["ano"]+")");
  ano.appendChild(txt_ano);

  back.appendChild(h3);
  back.appendChild(p);
  back.appendChild(ano);

  front.appendChild(img);

  inner.appendChild(front);
  inner.appendChild(back);

  card.appendChild(inner);

  return card;
}


function listaItens() {
  // Limpa os dados anteriores
  sessionStorage.clear();
  var filmes = {};
  var container = document.getElementById("card-cont");
  container.innerHTML = "";
  loadData.then(function(json) {
    filmes = json;
  })
  .then(function() {
    for (filme in filmes) {
      // Adiciona os cards ao container
      container.appendChild(geraCard(filmes[filme]));
    }
  })
}

function pesquisar(value, event) {
  event.preventDefault();
  var key = event.which || event.keyCode;
  if(key == 13){
    // Limpa o valor passado para evitar o uso de códigos
    value = value.toString();
    value = value.replace("<", "");
    value = value.replace(">", "");
    value.trim();
    // Salva o valor na sessão
    sessionStorage.setItem("palavra", value);
    location.href = "./pesquisa.html";
  }
}

function loadPesquisa(){
  if(sessionStorage.palavra == undefined || sessionStorage.palavra == "") {
    // Se o valor não estiver carregado, retorna para o index
    location.href = "./index.html";
  }
  var filmes = {};
  var resultados = [];
  var palavra = sessionStorage.palavra;
  document.getElementById("palavra-pesquisa").innerHTML = palavra;
  var container = document.getElementById("card-cont");

  loadData.then(function(json) {
    filmes = json;
  })
  .then(function() {
    // Procura filmes que incluam a palavra e os salva no array de resultado
    for (filme in filmes) {
      if(filmes[filme]["nome"].includes(palavra)){
        resultados.push(filmes[filme]);
      }
    }
  })
  .then(function() {
    console.log(resultados.length);
    if(resultados.length > 0){
      for (item in resultados) {
        // Adiciona os cards ao container
        container.appendChild(geraCard(resultados[item]));
      }
    } else {
      // Caso não haja filmes com a palavra
      var txt = document.createTextNode("Desculpa, mas não encontramos nenhum filme nessa categoria =/");
      var p = document.createElement("p");
      p.appendChild(txt);
      container.appendChild(p);
    }
  });
}

function filtrar(value, tipo, event) {
  event.preventDefault();
  // Limpa os valores passado para evitar o uso de códigos
  value = value.toString();
  value.trim();
  tipo = tipo.toString();
  tipo.trim();
  // Salva os valores na sessão
  sessionStorage.setItem("valor", value);
  sessionStorage.setItem("tipo", tipo);
  location.href = "./filtrar.html";
}

function loadFiltro() {
  if(sessionStorage.valor == undefined || sessionStorage.tipo == undefined) {
    // Se o valor não estiver carregado, retorna para o index
    location.href = "./index.html";
  }
  var filmes = {};
  var resultados = [];
  var valor = sessionStorage.valor;
  var tipo = sessionStorage.tipo;
  document.getElementById("filtro-pesquisa").innerHTML = valor;
  var container = document.getElementById("card-cont");
  loadData.then(function(json) {
    filmes = json;
  })
  .then(function(){
    // Procura por filmes com os valores passados, de acordo com o tipo de pesquisa
    for(filme in filmes) {
      if(tipo == "generos"){
        if(filmes[filme][tipo].toString().includes(valor)){
          resultados.push(filmes[filme]);
        }
      } else if (tipo == "ano"){
        var anos = valor.split("/");
        if(filmes[filme][tipo] < anos[0] && filmes[filme][tipo] > anos[1]){
          resultados.push(filmes[filme]);
        }
      }
      
    }
  })
  .then(function(){
    if(resultados.length > 0){
      // Adiciona os cards ao container
      for(item in resultados){
        container.appendChild(geraCard(resultados[item]));
      }
    } else {
      // Caso não sejam encontrados resultados
      var txt = document.createTextNode("Desculpa, mas não encontramos nenhum filme nessa categoria =/");
      var p = document.createElement("p");
      p.appendChild(txt);
      container.appendChild(p);
    }
  })
}

function goToAnima(nome, event){
  event.preventDefault();
  nome = nome.toString();
  nome.trim();
  // Salva o valor na sessão
  sessionStorage.setItem("animacao", nome);
  location.href = "./Anim1.html";
}

function loadAnima(){
  if(sessionStorage.animacao == undefined) {
    // Se o valor não estiver carregado, retorna para o index
    location.href = "./index.html";
  }
  var nome = sessionStorage.animacao;
  var filmes = {};
  var animacao = {};
  loadData.then(function(json) {
    filmes = json;
  })
  .then(function(){
    //Busca pelo filme com o nome selecionado
    for(filme in filmes) {
      if(nome == filmes[filme]["nome"]){
        animacao = filmes[filme];
      }
    }
    if(animacao == {}){
      // Se não encontrar a animação, retorna para o início
      location.href = "./index.html";
    }
  })
  .then(function(){
    // Pega o array de gêneros e converte para string, separando-as por vírgula
    var generos = animacao["generos"].toString();
    generos = generos.replace(/,/g, ", ");
    // Aplica os valores do filme aos campos na página
    document.getElementById("titulo-filme").innerHTML = animacao["nome"];
    document.getElementById("categorias-filme").innerHTML = generos;
    document.getElementById("nota-filme").innerHTML = animacao["nota"];
    document.getElementById("poster-filme").src = animacao["poster"];
    document.getElementById("duracao-filme").innerHTML = animacao["duracao"];
    document.getElementById("ano-filme").innerHTML = animacao["ano"];
    document.getElementById("pais-filme").innerHTML = animacao["pais"];
    document.getElementById("diretor-filme").innerHTML = animacao["Direção"];
    document.getElementById("sinopse-filme").innerHTML = animacao["sinopse"];
    document.getElementById("trailer-filme").src = animacao["url_video"];

    // Procura a lista de screenshots e cria uma imagem para cada, aplicando atributos
    var screen_s = document.getElementsByClassName("screenshots")[0];
    screen_s.innerHTML = "";
    for(scr_shots in animacao["screenshots"]){
      var img = document.createElement("img");
      img.setAttribute("src", animacao["screenshots"][scr_shots]);
      img.setAttribute("alt", "Screenshot de uma cena do filme");
      img.setAttribute("onclick", "showModal(event)");
      img.className = "img-responsive";
      screen_s.appendChild(img);
    }

    document.getElementById("review-filme").innerHTML = animacao["review"];
  })
}

// Função do modal
function showModal(event){
  // Pega a imagem selecionada e aplica no modal, o exibindo logo em seguida
  var img = event.target;
  var modal = document.getElementById("myModal");
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");
  modal.style.display = "block";
  modalImg.src = img.src;
  captionText.innerHTML = img.alt;

  //Fecha o modal ao clicar no botão de fechar
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }
}
