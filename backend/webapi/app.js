const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const port = 3000;

app.use(require("cors")());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Função para conectar ao banco de dados
async function connect() {
  if (global.db) return global.db;

  try {
    const conn = await MongoClient.connect(
      "mongodb+srv://igorigfotos:betano@cluster0.yzcxzi9.mongodb.net/"
    );
    global.db = conn.db("cadastro");
    return global.db;
  } catch (ex) {
    console.log(ex);
    throw new Error("Falha ao conectar ao banco de dados");
  }
}

// Definindo as rotas
const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Funcionando!" }));

// Rota de login de cliente
router.post("/cliente/login", async function (req, res) {
  try {
    const { email, senha } = req.body;
    const db = await connect();
    const cliente = await db.collection("cliente").findOne({ email, senha });

    if (cliente) {
      res.json({ mensagem: "Login efetuado com sucesso!" });
    } else {
      res.status(401).json({ mensagem: "Credenciais inválidas" });
    }
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ erro: "Ocorreu um erro ao efetuar o login" });
  }
});

// Rotas CRUD para cliente
router.get("/", async function (req, res) {
  try {
    const db = await connect();
    res.json(await db.collection("cliente").find().toArray());
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const db = await connect();
    res.json(
      await db
        .collection("cliente")
        .findOne({ _id: new ObjectId(req.params.id) })
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

router.post("/", async function (req, res) {
  try {
    const cliente = req.body;
    const db = await connect();
    res.json(await db.collection("cliente").insertOne(cliente));
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

router.put("/:id", async function (req, res) {
  try {
    const cliente = req.body;
    const db = await connect();
    res.json(
      await db
        .collection("cliente")
        .updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: cliente }
        )
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const db = await connect();
    res.json(
      await db
        .collection("cliente")
        .deleteOne({ _id: new ObjectId(req.params.id) })
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

app.use("/cliente", router);

// Inicia o servidor
app.listen(port, () => {
  console.log("API funcionando!");
});
