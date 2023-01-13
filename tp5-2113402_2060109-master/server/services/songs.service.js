const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
const DB_CONSTS = require("../utils/env");

const path = require("path");

class SongService {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
  }

  get collection () {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_SONGS);
  }

  /**
   * TODO : Implémenter la récupération de toutes les chansons
   *
   * Retourne la liste de toutes les chansons
   * @returns {Promise<Array>}
   */
  async getAllSongs () {
    const res = await this.collection.find({}).toArray();
    return res;
  }

  /**
   * TODO : Implémenter la récupération d'une chanson en fonction de son id
   *
   * Retourne une chanson en fonction de son id
   * @param {number} id identifiant de la chanson
   * @returns chanson correspondant à l'id
   */
  async getSongById (id) {
    const res = await this.collection.findOne({ id: parseInt(id) });
    return res;
  }

  /**
   * TODO : Implémenter l'inversement de l'état aimé d'une chanson
   *
   * Modifie l'état aimé d'une chanson par l'état inverse
   * @param {number} id identifiant de la chanson
   * @returns {boolean} le nouveau état aimé de la chanson
   */
  async updateSongLike (id) {
    const fieldToChange = await this.collection.findOne({ id: parseInt(id) });
    const likeState = !fieldToChange.liked;
    await this.collection.updateOne({id: parseInt(id)}, {"$set": {"liked":likeState}});
    return {"liked":likeState};
  }

  /**
   * TODO : Implémenter la recherche pour les 3 champs des chansons. Astuce : utilisez l'opérateur '$or' de MongoDB
   *
   * Cherche et retourne les chansons qui ont un mot clé spécifique dans leur description (name, artist, genre)
   * Si le paramètre 'exact' est TRUE, la recherche est sensible à la case
   * en utilisant l'option "i" dans la recherche par expression régulière
   * @param {string} substring mot clé à chercher
   * @param {boolean} exact si la recherche est sensible à la case
   * @returns toutes les chansons qui ont le mot clé cherché dans leur contenu (name, artist, genre)
   */
  async search (substring, exact) {
    if(exact){
      const filterNameSensitive = { name: { $regex: `${substring}`} };
      const filterArtistSensitive = { artist: { $regex: `${substring}`} };
      const filterGenreSensitive = { genre: { $regex: `${substring}`} };
      const songs = await this.collection.find({$or:[filterNameSensitive,filterArtistSensitive,filterGenreSensitive]}).toArray();
      return songs;
    }
    const filterNameSensitive = { name: { $regex: `${substring}`, $options: "i" } };
    const filterArtistSensitive = { artist: { description: { $regex: `${substring}`}, $options: "i" } };
    const filterGenreSensitive = { genre: { $regex: `${substring}` , $options: "i"} };
    const songs = await this.collection.find({$or:[filterNameSensitive,filterArtistSensitive,filterGenreSensitive]}).toArray();
    return songs;
  }

  async populateDb () {
    const songs = JSON.parse(await this.fileSystemManager.readFile(this.JSON_PATH)).songs;
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_SONGS, songs);
  }
}

module.exports = { SongService };
