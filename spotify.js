import SpotifyWebApi from "spotify-web-api-node";

//Spotify API request code here:

const spotifyApi = new SpotifyWebApi({
  clientId: "011f252bfe024ae0be4be2818d36fff4",
  clientSecret: "5d94b58fd38a4b16b27707106ae68afa",
});

//Things we need to add to the recommendation call
//Get seed genre
//Could pull from API or could store locally, might just be easier to store locally for now
//From this list of genres, which makes the most sense in this moment
//danceability
//energy

export async function getSong(songInfo) {
  const data = await spotifyApi.clientCredentialsGrant();
  let genre = "";
  spotifyApi.setAccessToken(data.body["access_token"]);
  const parsedSongInfo = JSON.parse(songInfo);
  console.log(parsedSongInfo);
  const BPM = parsedSongInfo.BPM;
  genre = parsedSongInfo.genre;
  console.log(typeof genre);
  if (typeof genre === "object" && genre !== null) {
    genre = genre.join(","); // Assuming it's an array of strings
  } else if (typeof genre !== "string") {
    throw new Error("Genre must be a string or an array of strings");
  }
  genre = genre
    .split(",")
    .map((s) => s.trim().replace(/\s+/g, "-"))
    .join(",");

  console.log(genre);

  // const genres = JSON.parse(songInfo).genre;
  // console.log(songInfo + " " + genres);
  // const genre_string = JSON.stringify(genres).replace(/[\[\]]/g, ""); // console.log("genres: " + genres.join(","));
  // console.log(genre_string);

  const recommendations = await spotifyApi.getRecommendations({
    seed_genres: genre + ",pop",
    target_tempo: BPM,
    limit: 1,
  });

  let song = recommendations.body.tracks[0];
  let songUrl = song.external_urls.spotify;
  console.log(songUrl);
  return songUrl;
}
