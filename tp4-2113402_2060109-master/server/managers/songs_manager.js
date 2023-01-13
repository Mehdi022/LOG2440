const { FileSystemManager } = require("./file_system_manager");
const path = require("path");

class SongsManager {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
  }

  /**
   * Retourne la liste de toutes les chansons
   * @returns {Promise<Array>}
   */
  async getAllSongs () {
    const fileBuffer = await this.fileSystemManager.readFile(this.JSON_PATH);
    return JSON.parse(fileBuffer).songs;
  }

  /**
   * TODO : Implémenter la récupération d'une chanson en fonction de son id
   * Retourne une chanson en fonction de son id
   * @param {number} id identifiant de la chanson
   * @returns chanson correspondant à l'id
   */
  async getSongById (id) {
    const allSongs = await this.getAllSongs();
    const songResearshed = allSongs.find(elem=>elem.id === id);
    if (songResearshed){
      return songResearshed;
    }
    return;
  }

  /**
   * TODO : Implémenter l'inversement de l'état aimé d'une chanson
   * Modifie l'état aimé d'une chanson par l'état inverse
   * @param {number} id identifiant de la chanson
   * @returns {boolean} le nouveau état aimé de la chanson
   */
  async updateSongLike (id) {
    let songResearshed = await this.getAllSongs();
    const tempLike = songResearshed[id].liked;
    songResearshed[id].liked = !tempLike;
    let isSuccessfull = await this.fileSystemManager.writeToJsonFile(this.JSON_PATH,JSON.stringify({"songs" : songResearshed}));
    return {liked : songResearshed[id].liked};

  }
}

module.exports = { SongsManager };
