import express from "express";
import {
  getTaskByID,
  getTask,
  getSharedTaskByID,
  getUserByID,
  getUserByEmail,
  createTask,
  deleteTask,
  toggleCompleted,
  shareTask,
} from "./database.js";
import cors from "cors";

const corsOptions = {
  origin: "*",
  methods: ["POST", "GET"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get("/task/:id", async (req, res) => {
  const task = await getTaskByID(req.params.id);
  if (!task) return res.status(404).send("No such task");
  res.status(200).send(task);
});

app.get("/task/shared-task/:id", async (req, res) => {
  const task = await getSharedTaskByID(req.params.id);
  const author = await getUserByID(task.user_id);
  const shared_with = await getUserByID(task.shared_with_id);
  if (!author || !shared_with) {
    return res.status(404).send({ message: "Author or Shared with not found" });
  }
  res.status(200).send({ author, shared_with });
});

app.get("/user/:id", async (req, res) => {
  const user = await getUserByID(req.params.id);
  if (!user) return res.status(404).send("No such user");
  res.status(200).send(user);
});

app.put("/task/:id", async (req, res) => {
  const { value } = req.body;
  const task = await toggleCompleted(req.params.id, value);
  if (!task) return res.status(404).send("No such task");
  res.status(200).send(task);
});

app.delete("/task/:id", async (req, res) => {
  const deleted = await deleteTask(req.params.id);
  if (!deleted) return res.status(404).send("No such task");
  res.status(200).send({ message: "Task Deleted successfully!" });
});

app.post("/task/shared_task", async (req, res) => {
  // console.log(req.headers);
  // console.log(req.body);
  const { task_id, user_id, email } = req.body;
  let sharedTask;

  if (!task_id || !user_id || !email) {
    return res
      .status(400)
      .send({ error: "Missing or invalid data in the request." });
  }

  const userToShare = await getUserByEmail(email);

  if (userToShare) {
    sharedTask = await shareTask(task_id, user_id, userToShare.id);
  } else {
    console.log(userToShare);
    console.log("No user");
  }

  if (!sharedTask) {
    return res.status(500).send({ error: "Error sharing the task." });
  } else {
    return res.status(201).send({ message: "Successfully shared Task" });
  }
});

app.post("/task", async (req, res) => {
  const { user_id, title } = req.body;
  const task = await createTask(user_id, title);
  if (!task) return res.status(500).send("Failed to add new task");
  res.status(201).send(task);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

///configurar inicio de sesion
