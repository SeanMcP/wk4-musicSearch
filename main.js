/*
  Here is a rough idea for the steps you could take:
*/

// 1. First select and store the elements you'll be working with
// 2. Create your `submit` event for getting the user's search term
// 3. Create your `fetch` request that is called after a submission
// 4. Create a way to append the fetch results to your page
// 5. Create a way to listen for a click that will play the song in the audio play

let resultsGrid = document.createElement('resultsGrid');
let searchBar = document.getElementById('searchBar');
let searchButton = document.getElementById('searchButton');


function clearField(){
  resultsGrid.innerHTML = '';
}

function searchClick(){

  clearField();

  let query = searchBar.value;
  let altQuery = query.split(' ').join('+');

  fetch('https://itunes.apple.com/search?term=' + altQuery + '&limit=16')
    // Data is fetched and we get a promise.
    .then(
      // The promise returns a response from the server.
      function(response) {
        // We process the response accordingly.
        if (response.status !== 200) {
          console.log(response.status);
          return;
        }
        response.json().then(function(data) {
          console.log('Here is the data:', data);

          document.getElementById('searchForm').style.marginTop = '40px';

          resultsGrid.id = 'resultsGrid';

          document.getElementById('container').appendChild(resultsGrid);

          let resultHead = document.createElement('h1');
          resultHead.id = 'resultHead';
          resultHead.textContent = 'Results for: ' + query;

          resultsGrid.appendChild(resultHead);

          for(var i = 0; i < data.results.length; i++) {

            let result = document.createElement('article');
            result.setAttribute('class', 'resultItem');
            result.id = i;

            let bgImg = data.results[i].artworkUrl100;

            result.style.backgroundImage = 'url(' + bgImg + ')';

            result.innerHTML +=
            `
            <h2>${data.results[i].trackName}</h2>
            <h3>${data.results[i].artistName}</h3>
            `

            result.addEventListener('click', function(event){
              playMusic(event.target.id);
            });

            resultsGrid.appendChild(result);

          }
          function playMusic(indexStr){
            let index = Number(indexStr);
            let player = document.getElementById('musicPlayer');
            let musicUrl = data.results[index].previewUrl;
            player.setAttribute('src', musicUrl);
            console.log(player);
            player.play();
          }
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

searchButton.addEventListener('click', searchClick);
