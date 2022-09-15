/* eslint-disable prettier/prettier */
declare namespace NodeJS {
  export interface ProcessEnv {
    // Type
    ENVIRONMENT: Environment;
    // Project
    PORT?: string;
    SECRET?: string;
    // Database
    MongoURI?: string;
    // Discord
    ClientTOKEN?: string;
    ClientID?: string;
    ClientSecret?: string;
    CallbackURL?: string;
    // URLs
    Dashboard?: string;
  }
  export type Environment = 'DEVELOPMENT' | 'PRODUCTION' | 'TEST';
}
