import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
//----------------------------------------------------------
export class Todo extends Model {
  id!: number;
  title!: string;
  description!: string;
  completed!: boolean;
}
//----------------------------------------------------------
Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Todo",
    tableName: "Todos",
  }
);
