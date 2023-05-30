import React from "react";
import styled from "styled-components";
import Robot from "../assets/chatbot2.png";
import Logout from "./Logout";

export default function Welcome({ currentUser }) {
  
  return(
    <Container>
      <div className="button">
        <Logout />
      </div>            
      <img src={Robot} alt="Robot" />
      <h1>Bienvenido, <span>{currentUser.username}</span></h1>
      <h3>Por favor, selecciona un chat para comenzar</h3> 
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  color: white;
  img{
    height: 20rem;
  }
  span{
    color: #4e00ff;
  }
  .button{
    margin-left: auto;
    margin-top: 1rem;
    margin-bottom: 7rem;
  }
  h1 {
    margin-top: 1rem;
  }
`;