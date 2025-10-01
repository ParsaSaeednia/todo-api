import { Sequelize } from "sequelize";
//----------------------------------------------------------
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
});
//----------------------------------------------------------
export async function connectDB(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync();
    console.log("Database synced.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
