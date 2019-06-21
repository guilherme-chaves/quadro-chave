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
  // Criação do card
  var card = document.createElement("div");
  card.className = "flip-card";
  var inner = document.createElement("div");
  inner.className = "flip-card-inner";

  // Parte da frente do card
  var front = document.createElement("div");
  front.className = "flip-card-front"
  var img = document.createElement("img");
  img.className = "imgcard";
  img.setAttribute("src", "anim.jpeg");

  // Parte de trás do card
  var back = document.createElement("div");
  back.className = "flip-card-back";
  //Titulo
  var h3 = document.createElement("h3");
  var titulo = document.createTextNode(filme["name"]);
  h3.appendChild(titulo);
  // Avaliação
  var avaliacao = document.createElement("p");
  var sinopse = document.createTextNode(filme["sinopse"]);
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
  loadData.then(function(json) {
    filmes = json;
  })
  .then(function() {
    for(filme in filmes){
      var ul = document.getElementById("lista-filmes");
      var li = document.createElement("li");
      var txt = "";
      for (data in filmes[filme]){
        var txt = txt.concat(" / ", filmes[filme][data].toString());
      }
      var txt_node = document.createTextNode(txt);
      li.appendChild(txt_node);
      ul.appendChild(li);
    }
  });
}

function pesquisar(value, event) {
  event.preventDefault();
  var key = event.which || event.keyCode;
  if(key == 13){
    value = value.toString();
    value = value.replace("<", "");
    value = value.replace(">", "");
    sessionStorage.setItem("palavra", value);
    location.href = "./pesquisa.html";
  }
}

function filtrar(value, tipo, event) {
  event.preventDefault();
  value = value.toString();
  tipo = tipo.toString();
  sessionStorage.setItem("filtro", value);
  sessionStorage.setItem("tipo", tipo);
  location.href = "./filtro.html";
}

function loadPesquisa(){
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
      if(filmes[filme]["name"].includes(palavra)){
        resultados.push(filmes[filme]);
      }
    }
  })
  .then(function() {
    for (item in resultados) {
      container.appendChild(geraCard(resultados[item]));
    }
  });
}