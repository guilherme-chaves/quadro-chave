var loadData = new Promise(function (resolve, reject) {
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
  var generos = filme["generos"].toString();
  generos = generos.replace(/,/g, ", ");
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
  img.setAttribute("src", filme["screenshots"][0]);

  // Parte de trás do card
  var back = document.createElement("div");
  back.className = "flip-card-back";
  //Titulo
  var h3 = document.createElement("h3");
  var titulo = document.createTextNode(filme["nome"]);
  h3.appendChild(titulo);
  // Avaliação
  var avaliacao = document.createElement("p");
  var sinopse = document.createTextNode("Nota: "+filme["nota"]+"/10");
  avaliacao.appendChild(sinopse);
  // Gêneros
  var genero = document.createElement("p");
  var txt_genero = document.createTextNode(generos);
  genero.appendChild(txt_genero);

  back.appendChild(h3);
  back.appendChild(avaliacao);
  back.appendChild(genero);

  front.appendChild(img);

  inner.appendChild(front);
  inner.appendChild(back);

  card.appendChild(inner);

  return card;
}


function listaItens() {
  sessionStorage.clear();
  var filmes = {};
  var container = document.getElementById("card-cont");
  container.innerHTML = "";
  loadData.then(function(json) {
    filmes = json;
  })
  .then(function() {
    for (filme in filmes) {
      container.appendChild(geraCard(filmes[filme]));
    }
  })
}

function pesquisar(value, event) {
  event.preventDefault();
  var key = event.which || event.keyCode;
  if(key == 13){
    value = value.toString();
    value = value.replace("<", "");
    value = value.replace(">", "");
    value.trim();
    sessionStorage.setItem("palavra", value);
    location.href = "./pesquisa.html";
  }
}

function loadPesquisa(){
  if(sessionStorage.palavra == undefined || sessionStorage.palavra == "") {
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
        container.appendChild(geraCard(resultados[item]));
      }
    } else {
      var txt = document.createTextNode("Desculpa, mas não encontramos nenhum filme nessa categoria =/");
      var p = document.createElement("p");
      p.appendChild(txt);
      container.appendChild(p);
    }
  });
}

function filtrar(value, tipo, event) {
  event.preventDefault();
  value = value.toString();
  value.trim();
  tipo = tipo.toString();
  tipo.trim();
  sessionStorage.setItem("valor", value);
  sessionStorage.setItem("tipo", tipo);
  location.href = "./filtrar.html";
}

function loadFiltro() {
  if(sessionStorage.valor == undefined || sessionStorage.tipo == undefined) {
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
    console.log(resultados);
  })
  .then(function(){
    if(resultados.length > 0){
      for(item in resultados){
        container.appendChild(geraCard(resultados[item]));
      }
    } else {
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
  sessionStorage.setItem("animacao", nome);
  location.href = "./Anim1.html";
}

function loadAnima(){
  if(sessionStorage.animacao == undefined) {
    //location.href = "./index.html";
  }

  var nome = sessionStorage.animacao;
  var filmes = {};
  var animacao = {};
  loadData.then(function(json) {
    filmes = json;
  })
  .then(function(){
    for(filme in filmes) {
      if(nome == filmes[filme]["nome"]){
        animacao = filmes[filme];
      }
    }
  })
  .then(function(){
    var generos = animacao["generos"].toString();
    generos = generos.replace(/,/g, ", ");
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

    var screen_s = document.getElementsByClassName("screenshots")[0];
    screen_s.innerHTML = "";
    for(scr_shots in animacao["screenshots"]){
      var img = document.createElement("img");
      img.setAttribute("src", animacao["screenshots"][scr_shots]);
      screen_s.appendChild(img);
    }

    document.getElementById("review-filme").innerHTML = animacao["review"];
  })
}