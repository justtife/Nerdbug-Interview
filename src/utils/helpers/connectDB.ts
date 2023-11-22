import { DB } from "../../config";
import { Logger } from "../../logger";
import { config } from "../../config";
class DatabaseManager {
  public readonly db;
  constructor() {
    this.db = DB({ ...config.DB });
  }
  public async createDatabaseConnection(): Promise<void> {
    const maxRetries = 5;
    const retryDelay = 5000;
    let retries = 0;
    while (retries < maxRetries) {
      try {
        await this.db.authenticate();
        Logger.info(
          "Connection to the database has been established successfully",
        );
        return; // Connection succeeded, exit the function
      } catch (error) {
        Logger.error(`Unable to connect to the database\n${error}`);
        retries++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
    process.exit(1);
  }
  public async closeDatabaseConnection() {
    try {
      await this.db.close();
      Logger.info("Database connection closed.");
    } catch (error) {
      Logger.error(`Error closing database connection: \n${error}`);
      process.exit(1);
    }
  }
}
let DbManager = new DatabaseManager()
export default DbManager;
