import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ContactButtons = ({tabState, currentUser}) => {

  const [communityClicked, setCommunityClicked] = useState(false);

  function communityOpenHandler (){
    tabState("communities");
    setCommunityClicked(true);
  }

  function communityCloseHandler (){
    tabState("users");
    setCommunityClicked(false);
  }

  return (
    <ButtonContainer>
      <Button
        onClick = {communityCloseHandler}
      >
        Usuarios
      </Button>
      <Button
        onClick = {communityOpenHandler}
      >
        Comunidades
      </Button>
      {
        communityClicked ? 
        <Button >
          <Link to="/createCommunity" state={{ user: {currentUser} }}>Crear comunidad</Link>
        </Button> 
      : ""
      }
           
    </ButtonContainer>
  );
};

export default ContactButtons;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; 
  flex-wrap: wrap;   
`;

const Button = styled.button`
  height: 2rem;
  margin: 0 0.5rem;
  padding: 0.5rem 0.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #4e00ff;
  color: #d1d1d1;
  
  &:hover {
    background-color: #3400aa;
  }
  a {
    text-decoration: none;
    color: #d1d1d1;
  }
`;
