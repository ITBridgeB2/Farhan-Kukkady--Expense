import {Route, Routes } from "react-router-dom";
import ExpenseList from "./list";

export default function App(){
  return(<Routes>
    <Route path="/*" element={<ExpenseList></ExpenseList>}></Route>
  </Routes>)
}