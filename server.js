import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Laboratorio from "./src/model/laboratorio.js";
import checarDias from "./src/middleware/checardias.js";
import genLabPDF from "./src/utils/geradorpdf.js";
import jwt from "jsonwebtoken";
import User from "./src/model/User.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(checarDias);

// Rota para cadastrar usuário
app.post("/usuarios/cadastrar", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }
  
    try {
      // Verificar se o usuário já existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Usuário já cadastrado." });
      }
  
      // Criar novo usuário
      const newUser = await User.create({ email, password });
      res.status(201).json({ message: "Usuário cadastrado com sucesso.", newUser });
    } catch (error) {
      res.status(500).json({ message: "Erro ao cadastrar usuário.", error });
    }
  });
  
  
app.get("/",(req, res) => {
    res.send("Api está funcionando");
});

app.get("/laboratorio/relatorio", async (req, res) => {
    try {
      const laboratorios = await Laboratorio.find();
  
      if (!laboratorios || laboratorios.length === 0) {
        return res.status(404).json({ message: "Nenhum laboratório encontrado." });
      }
  
      const pdfStream = genLabPDF(laboratorios);
  
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=relatorio_laboratorios.pdf");
  
      pdfStream.pipe(res);
    } catch (error) {
      res.status(500).json({ message: "Erro ao gerar relatório.", error });
    }
  });

app.post("/laboratorio/novo", async (req, res) => {
    try{
        const {nome, descricao, capacidade, foto} = req.body;
        const newLab = await Laboratorio.create({
            nome,
            descricao,
            capacidade,
            foto,
        });
        res.status(201).json(newLab);
    }catch(error){
        res.status(500).json({message:"Erro ao criar laboratório", error});
    }

});

app.get("/laboratorios", async (req, res) => {
    try{
        const labs = await Laboratorio.find();
        res.status(200).json(labs);

    }catch(error){
        res.status(500).json({message:"Erro ao listar laboratórios", error});
    }
});

// Rota para login e geração de token
app.post("/logar", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Verificar se o usuário existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }
  
      // Comparar a senha
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }
  
      // Gerar o token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor.", error });
    }
  });


// Rota protegida como exemplo
app.get("/protegida", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acesso negado." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Acesso permitido.", userId: decoded.id });
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


