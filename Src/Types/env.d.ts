declare namespace NodeJS {
  interface ProcessEnv {
    //! Discord API
    Token: string;
    DevToken: string;
    Secret: string;
    ID: string;
    Name: string;
    Icon: string;

    //@ Database
    MongoURI: string;
    MongoURILocalHost: string;

    //# Lavalink / Music
    LavalinkHOST: string;
    LavalinkPORT: string;
    LavalinkPassword: string;
    SpotifyID: string;
    SpotifySecret: string;

    //% Top.gg API
    TopGGToken: string;
  }
}
