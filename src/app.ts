import express from "express";
import { connectDB } from "./database";
import todoRoutes from "./routes/todo";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
//----------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;
//----------------------------------------------------------
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Todo API",
    version: "1.0.0",
    description: "A simple Todo API",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};
//----------------------------------------------------------
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};
//----------------------------------------------------------
const specs = swaggerJsdoc(options);
//----------------------------------------------------------
app.use(express.json());
//----------------------------------------------------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
//----------------------------------------------------------
app.use("/api/todos", todoRoutes);
//----------------------------------------------------------
connectDB().then(()=> {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
});
