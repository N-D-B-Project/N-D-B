declare global {
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
      DATABASE_URL: string;
      DatabaseName: string;
      DatabasePassword: string;

      //# APIs
      TopGG_Token: string;

      //% Run Args
      isCompiled: string;
    }
  }
}
