import React from "react";
import styled from "styled-components";
import axios from "axios";
import { deleteOneCommunity } from "../utils/APIRoutes";
import {ToastContainer, toast} from "react-toastify";

export default function DeleteCommunity (chat) {

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleDelete = async () => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const response = await axios.post(deleteOneCommunity, {      
      id: chat,
    });
    toast.success('Comunidad borrada con éxito. Actualizando...', toastOptions);
    await delay(2000);
    if(response.status === 200){
      window.location.reload(false);
    }   
  };

  return (
    <>
      <Button onClick={handleDelete}>Borrar comunidad</Button>
      <ToastContainer />
    </>
    
  );
}

const Button = styled.button`
  padding: 0.6rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  font-size: 1rem; 
  background-color: #4e00ff;
  color: #d1d1d1;
  margin-left: auto;
  
  &:hover {
    background-color: #3400aa;
  }
`;

 