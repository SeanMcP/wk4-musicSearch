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
let searchForm = document.getElementById('searchForm');

let playPauseFlag = false;


function clearField(){
  resultsGrid.innerHTML = '';
}

function searchClick(){

  event.preventDefault();

  let query = searchBar.value;

  if(query){

    clearField();
    let altQuery = query.split(' ').join('+');

    fetch('https://itunes.apple.com/search?term=' + altQuery + '&limit=12')
      .then(function(response) {
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

              if (data.results[i].kind === "feature-movie") {
                result.innerHTML +=
                `
                <h2>${data.results[i].trackName} <span class="altType">Film</span></h2>
                <h3>${data.results[i].artistName}</h3>
                `
              } else if (data.results[i].wrapperType === "audiobook"){
                result.innerHTML +=
                `
                <h2>${data.results[i].trackName} <span class="altType">Audiobook</span></h2>
                <h3>${data.results[i].artistName}</h3>
                `
              } else {
                result.innerHTML +=
                `
                <h2>${data.results[i].trackName}</h2>
                <h3>${data.results[i].artistName}</h3>
                `
              }

              result.addEventListener('click', function(event){
                playMusic(event.target.id);
              });

              resultsGrid.appendChild(result);

            }
            function playMusic(indexStr){
              let player = document.getElementById('musicPlayer');
              if(playPauseFlag){
                player.pause();
                console.log('Pause');
                playPauseFlag = false;
              } else {
                let index = Number(indexStr);
                let musicUrl = data.results[index].previewUrl;
                player.setAttribute('src', musicUrl);
                player.play();
                console.log('');
                playPauseFlag = true;
              }
            }
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  }
}

searchButton.addEventListener('click', searchClick);
searchForm.addEventListener('submit', searchClick);
