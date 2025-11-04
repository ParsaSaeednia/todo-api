import express from "express";
import { connectDB } from "./database";
import todoRoutes from "./routes/todo";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger";
//----------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;
//----------------------------------------------------------
app.use(express.json());
//----------------------------------------------------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//----------------------------------------------------------
app.use("/api/todos", todoRoutes);
//----------------------------------------------------------
connectDB().then(()=> {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
});
