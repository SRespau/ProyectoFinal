import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo2.png";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { createCommunity } from "../utils/APIRoutes";


function NewCommunity () {
  const location = useLocation();  
  const { user } = location.state; 

  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    creator: user.currentUser._id,
    members: [user.currentUser._id],
    messages: [{
      user: "ChatBot",
      message: "La comunidad ha sido creada por el usuario " + user.currentUser.username,      
    }],
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };  

  const handleSubmit = async (event) => { 
    event.preventDefault();
      const { name, creator, members, messages } = values;
      const { data } = await axios.post(createCommunity, {
        name,
        creator,
        members,
        messages,
      });
      if(data.status === false){
        toast.error(data.msg, toastOptions);
      }
      
      if(data.status === true){
        navigate("/");
      }
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Adamas</h1>
          </div>
          <input type="text" placeholder="Nombre comunidad" name="name" onChange={(e) => handleChange(e)} />
          <button type="submit">Crear Comunidad</button>
          <Link to="/">Cancelar</Link>
        </form>
      </FormContainer>
      <ToastContainer />
    </>    
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand{
    display:flex;
    align-items: center;
    gap: 1rem;
    justify-content:center;
    img{
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input{
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color:white;
      width: 100%;
      font-size: 1rem;
      &.focus{
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button, a {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      text-decoration: none;
      text-align: center;
      &:hover{
        background-color: #4e0eff;
      }
    }
  }
`;

export default NewCommunity;