declare namespace NodeJS {
    interface ProcessEnv {
      MONGO_DB_URI: string;
      MONGO_DB_NAME: string;
    }
  }