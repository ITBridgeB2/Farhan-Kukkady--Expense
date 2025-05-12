import cors from 'cors';
import express from 'express'
import mysql from 'mysql2/promise'
//const mysql = require("mysql2/promise");
var userapp = express();
userapp.use(express.json());
userapp.use(express.urlencoded());
userapp.use(cors())
const db = {
    host: "localhost",
    user: "root",
    password: 'root',
    database: 'expenseTracker'
};
//get user and validate
//http://localhost:4444/expense
userapp.get("/expense", async (req, res) => {
    try {
      const connection = await mysql.createConnection(db);
  
      const [rows] = await connection.execute('SELECT * FROM expenses');
  
      await connection.close();
  
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching Expenses:", error);
      res.status(500).json({ error: "Failed to fetch Expenses" });
    }
  });
  
  userapp.post("/expense", async function (req, res) {
    try {
      const connection = await mysql.createConnection(db);
  
      const { amount, category, date } = req.body; // ✅ correct fields
  
      const [result] = await connection.execute(
        'INSERT INTO expenses (amount, category, date) VALUES (?, ?, ?)',
        [amount, category, date]
      );
  
      await connection.close();
  
      res.status(201).json({
        message: "Expense inserted successfully", // ✅ clearer message
        expenseId: result.insertId
      });
  
    } catch (error) {
      console.error("Error inserting expense:", error);
      res.status(500).json({ error: "Failed to insert expense" });
    }
  });
  // DELETE
userapp.delete("/expense/:id", async (req, res) => {
    const connection = await mysql.createConnection(db);
    await connection.execute("DELETE FROM expenses WHERE id = ?", [req.params.id]);
    await connection.close();
    res.sendStatus(200);
  });
  
  // PUT
  userapp.put("/expense/:id", async (req, res) => {
    const { amount, category, date } = req.body;
    const connection = await mysql.createConnection(db);
    await connection.execute(
      "UPDATE expenses SET amount = ?, category = ?, date = ? WHERE id = ?",
      [amount, category, date, req.params.id]
    );
    await connection.close();
    res.sendStatus(200);
  });
  
  


userapp.listen(4444)
console.log("Server started on port 4444")


