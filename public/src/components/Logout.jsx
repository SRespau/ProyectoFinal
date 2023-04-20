import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiPowerOff } from "react-icons/bi"; // Iconos react. Dependencia instalada

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    localStorage.clear(); // Limpiara el localStorage para quitar el usuario
    navigate("/login");
  }

  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg{
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;