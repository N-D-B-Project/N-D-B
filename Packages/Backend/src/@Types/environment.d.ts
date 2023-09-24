declare namespace NodeJS {
  export interface ProcessEnv {
    ENVIRONMENT: Environment;

    DATABASE_URL: string;

    PORT: number;
    COOKIE_SECRET: string;

    DClientID: number;
    DSecret: string;
    DToken: string;
    DCallbackURL: string;
  }

  export type Environment = "DEVELOPMENT" | "PRODUCTION";
}
