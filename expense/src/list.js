import { useEffect, useState } from "react";
import axios from "axios";
import './ExpenseList.css';

export default function ExpenseList() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: ""
  });

  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the expense being edited

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:4444/expense");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4444/expense/${id}`);
      fetchExpenses(); // Re-fetch expenses after deletion
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        // Update existing expense
        await axios.put(`http://localhost:4444/expense/${editingId}`, formData);
        setEditingId(null); // Clear editing mode
      } else {
        // Add new expense
        await axios.post("http://localhost:4444/expense", formData);
      }
      fetchExpenses(); // Re-fetch expenses after adding or updating
      setFormData({ amount: "", category: "", date: "" }); // Clear the form
      alert(editingId ? "Expense updated" : "Expense added");
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    });
    setEditingId(expense.id); // Set the editing ID to the selected expense
  };

  // Calculate total spent
  const totalSpent = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  return (
    <div className="container">
      <div className="sections">
        <div className="box">
          <h2>Total Spent: ₹{totalSpent.toFixed(2)}</h2> {/* Display total spent */}
          <h2>All Expenses</h2>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
                <div>
                  ₹{expense.amount} - {expense.category} on {expense.date}
                </div>
                <div>
                  <button onClick={() => handleEdit(expense)}>Edit</button>
                  <button onClick={() => handleDelete(expense.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
  
        <div className="box">
          <h3>{editingId ? "Edit Expense" : "Add Expense"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <button type="submit">{editingId ? "Update" : "Add"} Expense</button>
          </form>
        </div>
      </div>
    </div>
  );
}
