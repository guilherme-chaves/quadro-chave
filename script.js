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
    value = value.toString()
    value = value.replace("<", "");
    value = value.replace(">", "");
    sessionStorage.setItem("palavra", value);
    location.href = "./pesquisa.html";
  }
}

function loadPesquisa(){
  var filmes = {};
  var resultados = [];
  var palavra = sessionStorage.palavra;
  document.getElementById("palavra-pesquisa").innerHTML = palavra;

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
      var ul = document.getElementById("lista-filmes");
      var li = document.createElement("li");
      var txt = "";
      for (data in resultados[item]){
        var txt = txt.concat(" / ", resultados[item][data].toString());
      }
      var txt_node = document.createTextNode(txt);
      li.appendChild(txt_node);
      ul.appendChild(li);
    }
  });
}