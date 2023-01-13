import React, { useState, useContext } from "react";
import { ACTIONS } from "../reducers/reducer";

import PlaylistContext from "../contexts/PlaylistContext";

export default function Song({ song, index }) {
  const api = useContext(PlaylistContext).api;
  const { dispatch } = useContext(PlaylistContext);
  const [liked, setLiked] = useState(song.liked);
  // TODO : envoyer une demande de modification au serveur et mettre l'interface à jour.
  useContext(PlaylistContext).api;
  const toggleLike = () => {

    api.updateSong(song.id);
    setLiked(!liked);
    api.getAllSongs();
  };

  // TODO : envoyer une action PLAY avec le bon index au reducer.
  const playSong = () => {
    dispatch({ type: ACTIONS.PLAY, payload: { index: index-1 } });
  };
  return (
    <section
      className="song-item flex-row"
      onClick={() => {
        {/*TODO : joueur une chanson seulement si index existe */}
        if(index != null && index>=0){
          playSong();
        }
      }}
    >
      {index ? <span>{index}</span> : <></>}
      {/*TODO : ajouter les bonnes informations de la chanson */}
      <p>{song.name}</p>
      <p>{song.artist}</p>
      <p>{song.genre}</p>

      {/*TODO : modifier le statut aimé seulement si index n'existe pas */}
      <button
        className={`${liked ? "fa" : "fa-regular"} fa-2x fa-heart`}
        onClick={() => {
          if(index == null){
            toggleLike();
          }}
        }
      ></button>

    </section>
  );
}
