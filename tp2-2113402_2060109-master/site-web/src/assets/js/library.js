import StorageManager from "./storageManager.js";

class Library {
  constructor (storageManager) {
    this.storageManager = storageManager;
  }

  /**
   * TODO
   * Génère le code HTML pour l'affichage des playlists et chansons disponibles
   * @param {Object[]} playlists liste de playlists à afficher
   * @param {Object[]} songs liste de chansons à afficher
   */
  generateLists (playlists, songs) {
    const playlistContainer = document.getElementById("playlist-container");
    playlistContainer.innerHTML = ""; // vider la liste
    // TODO : générer le HTML pour les playlists
    for (const playlist of playlists){
      playlistContainer.appendChild(this.buildPlaylistItem(playlist));
    }

    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML = ""; // vider la liste
    // TODO : générer le HTML pour les chansons
    for (const song of songs){
      songContainer.appendChild(this.buildSongItem(song));
    }
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une playlist
   * @param {Object} playlist playlist à utiliser pour la génération du HTML
   * @returns {HTMLAnchorElement} élément <a> qui contient le HTML de l'affichage pour une playlist
   */
  buildPlaylistItem (playlist) {
    const playlistItem = document.createElement("a");
    playlistItem.classList.add('playlist-item', 'flex-column');
    const linkName = './playlist.html?id=' + playlist.id;
    playlistItem.setAttribute('href', linkName);

    const img = document.createElement('img');
    img.src = playlist.thumbnail;
    const i = document.createElement('i');
    i.classList.add('fa', 'fa-2x', 'fa-play-circle', 'hidden', 'playlist-play-icon');
    const div = document.createElement('div');
    div.classList.add('playlist-preview');
    div.appendChild(img);
    div.appendChild(i);
    playlistItem.appendChild(div)

    const name = document.createTextNode(playlist.name);
    const paraName = document.createElement('p');
    paraName.appendChild(name);
    playlistItem.appendChild(paraName);

    const description = document.createTextNode(playlist.description);
    const paraDescription = document.createElement('p');
    paraDescription.appendChild(description);
    playlistItem.appendChild(paraDescription);

    return playlistItem;
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une chansons
   * @param {Object} song chanson à utiliser pour la génération du HTML
   * @returns {HTMLDivElement} élément <div> qui contient le HTML de l'affichage pour une chanson
   */
  buildSongItem = function (song) {
    const songItem = document.createElement("div");
    songItem.classList.add('song-item', 'flex-row');

    const name = document.createTextNode(song.name);
    const paraName = document.createElement('p');
    paraName.appendChild(name);
    songItem.appendChild(paraName);

    const genre = document.createTextNode(song.genre);
    const paraGenre = document.createElement('p');
    paraGenre.appendChild(genre);
    songItem.appendChild(paraGenre);

    const artist = document.createTextNode(song.artist);
    const paraArtist = document.createElement('p');
    paraArtist.appendChild(artist);
    songItem.appendChild(paraArtist);

    const button = document.createElement('button');
    button.classList.add('fa-2x', 'fa-heart');
    if (song.liked === true) {
      button.classList.add('fa');
    }
    else {
      button.classList.add('fa-regular');
    }
    songItem.appendChild(button);

    // TODO : gérer l'événement "click". Modifier l'image du bouton et mettre à jour l'information dans LocalStorage
    songItem.addEventListener('click', () => { 
      song.liked = !song.liked;
      if (song.liked === true) {
        button.classList.replace('fa-regular', 'fa');
      }
      else {
        button.classList.replace('fa', 'fa-regular');
      } 
      storageManager.replaceItem(storageManager.STORAGE_KEY_SONGS, song); 
    });

    return songItem;
  };
}

window.onload = () => {
  const storageManager = new StorageManager();
  const library = new Library(storageManager);
  storageManager.loadAllData();
  // TODO : Récupérer les playlists et les chansons de LocalStorage et bâtir le HTML de la page
  const playlists = storageManager.getData("playlist");
  const songs = storageManager.getData("songs");
  library.generateLists(playlists, songs);
};
