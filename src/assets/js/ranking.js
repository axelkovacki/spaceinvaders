const setRanking = async () => {
  let data = JSON.parse(await getToAPI('/ranking'));

  var ul = document.querySelector('#ranking');
  
  while(ul.firstChild){
    ul.removeChild(ul.firstChild);
  }

  for( var i = 0; i < data.length; i++ )
  { 
    let item = data[i];

    let text = `${ item.name }`
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(text));

    li.insertAdjacentHTML('afterbegin', `<label>${ i + 1 }º </label>`);
    li.insertAdjacentHTML('beforeend', `<span> ${ item.score }</span>`);

    ul.appendChild(li);     
  } 
}

setRanking();