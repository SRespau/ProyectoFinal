import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/setAvatar"
import CreateCommunity from "./pages/CreateCommunity";
import UserEdit from "./pages/UserEdit";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/setAvatar" element={<SetAvatar />}/>
        <Route path="/" element={<Chat />}/>
        <Route path="/createCommunity" element={<CreateCommunity />} />
        <Route path="/userEdit" element={<UserEdit />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
      </Routes>
  </BrowserRouter>
  )  
}