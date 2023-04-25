import React, { useState } from "react";
import styled from "styled-components";

const ContactButtons = ({ onClickUsers, onClickCommunities, onClickCreate }) => {
  const [activeButton, setActiveButton] = useState("users");

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  

  return (
    <ButtonContainer>
      <Button
        active={activeButton === "users"}
        onClick={onClickUsers}
      >
        Usuarios
      </Button>
      <Button
        active={activeButton === "communities"}
        onClick={onClickCommunities}
      >
        Comunidades
      </Button>
      <Button
        active={activeButton === "createCommunity"}
        onClick={onClickCreate}
      >
        +
      </Button>
    </ButtonContainer>
  );
};

export default ContactButtons;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;    
`;

const Button = styled.button`
  height: 2rem;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#007bff" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
  box-shadow: ${(props) =>
    props.active ? "0 0 0 2px #007bff" : "0 0 0 2px #ccc"};

  &:hover {
    background-color: #ccc;
  }
`;
