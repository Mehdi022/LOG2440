import StorageManager from "./storageManager.js";

/**
 * TODO
 * Popule l'élément 'dataList' avec des éléments <option> en fonction des noms des chansons en paramètre
 * @param {HTMLDataListElement} dataList élément HTML à qui ajouter des options
 * @param {Object} songs liste de chansons dont l'attribut 'name' est utilisé pour générer les éléments <option>
 */
function buildDataList (dataList, songs) {
  dataList.innerHTML = "";
  // TODO : extraire le nom des chansons et populer l'élément dataList avec des éléments <option>
  let songOptionTemp;
  for (const song of songs){
    songOptionTemp = buildSongOption(song);
    dataList.appendChild(songOptionTemp);
  };
  function buildSongOption(song){
    const songOption = document.createElement('option');
    songOption.setAttribute('value',song.name);
    return songOption;
  }
}

/**
 * Permet de mettre à jour la prévisualisation de l'image pour la playlist
 */
function updateImageDisplay () {
  const imagePreview = document.getElementById("image-preview");
  imagePreview.src = URL.createObjectURL(this.files[0]);
}

/**
 * TODO
 * Ajoute le code HTML pour pouvoir ajouter une chanson à la playlist
 * Le code contient les éléments <label>, <input> et <button> dans un parent <div>
 * Le bouton gère l'événement "click" et retire le <div> généré de son parent
 * @param {Event} e événement de clic
 */
function addItemSelect (e) {
  // TODO : prévenir le comportement par défaut du bouton pour empêcher la soumission du formulaire

  e.preventDefault();

  // TODO : construire les éléments HTML nécessaires pour l'ajout d'une nouvelle chanson
  const songContainer = document.getElementById("song-list");
  let counter = songContainer.children.length + 1;
  
  const div = document.createElement("div");

  const songLabel = document.createElement('label');
  const numberLabel = document.createTextNode('#'+counter+' ');

  const songNumber = 'song-' + counter;

  songLabel.setAttribute('for',songNumber);
  songLabel.appendChild(numberLabel);

  const songInput = document.createElement('input');
  songInput.classList.add('song-input');
  songInput.setAttribute('id',songNumber);
  songInput.setAttribute('type','select');
  songInput.setAttribute('list','song-dataList');


  const button = document.createElement('button');
  button.classList.add('fa', 'fa-minus');
  button.setAttribute('id','remove song');
  // TODO : gérér l'événement "click" qui retire l'élément <div> généré de son parent
  button.addEventListener('click', eventButtonMinus);
  function eventButtonMinus (e) {
    e.preventDefault();
    const buttonToRemove = e.target;
    let divToRemove = buttonToRemove.parentElement;
    divToRemove.remove();
  }
  div.appendChild(songLabel);
  div.appendChild(songInput);
  div.appendChild(button);
  songContainer.appendChild(div);
}

/**
 * TODO
 * Génère un objet Playlist avec les informations du formulaire et le sauvegarde dans le LocalStorage
 * @param {HTMLFormElement} form élément <form> à traiter pour obtenir les données
 * @param {StorageManager} storageManager permet la sauvegarde dans LocalStorage
 */
async function createPlaylist (form, storageManager) {
  // TODO : récupérer les informations du formulaire
  // Voir la propriété "elements" https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
  const elements = form.elements;
  const playlistsStorage = storageManager.getData(storageManager.STORAGE_KEY_PLAYLISTS);
  const playlistId = playlistsStorage.length;
  const playlistName = elements[1].value;
  const playlistDescription = elements[2].value;
  const playlistImage = await getImageInput(elements[3]);
  let playListSongs = [];
  for(let i = 6; i<elements.length;i++){
    if (elements[i].nodeName === "INPUT" && elements[i].type === "text") {
      if(storageManager.getIdFromName(storageManager.STORAGE_KEY_SONGS, elements[i].value) !=-1){
        playListSongs.push({ id : storageManager.getIdFromName(storageManager.STORAGE_KEY_SONGS, elements[i].value)});
      }
    }
  }

  const newPlaylist = {
    id: playlistId,
    name: playlistName,
    description: playlistDescription,
    thumbnail: playlistImage,
    songs: playListSongs
  };
  // TODO : créer un nouveau objet playlist et le sauvegarder dans LocalStorage
  storageManager.addItem(storageManager.STORAGE_KEY_PLAYLISTS,newPlaylist);
}

/**
 * Fonction qui permet d'extraire une image à partir d'un file input
 * @param {HTMLInputElement} input champ de saisie pour l'image
 * @returns image récupérée de la saisie
 */
async function getImageInput (input) {
  if (input && input.files && input.files[0]) {
    const image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);
      reader.readAsDataURL(input.files[0]);
    });
    return image;
  }
}

window.onload = () => {
  // TODO : récupérer les éléments du DOM
  const imageInput = document.getElementById("image");
  const form = document.getElementById("playlist-form");
  const dataList = document.getElementById("song-dataList");
  const buttonAddSong = document.getElementById("add-song-btn");

  const storageManager = new StorageManager();
  storageManager.loadAllData();
  const songs = storageManager.getData(storageManager.STORAGE_KEY_SONGS);

  // TODO : construire l'objet dataList
  buildDataList(dataList,songs);

  imageInput.addEventListener("change", updateImageDisplay);

  buttonAddSong.addEventListener("click", addItemSelect);
  // TODO : gérer l'événement "submit" du formulaire
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    createPlaylist(form,storageManager);
    location.href = 'index.html';
  });

};
