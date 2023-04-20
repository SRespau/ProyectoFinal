import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";


function Login () {
  const navigate = useNavigate();
  
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // useEffect se realizará una vez el componente se ha cargado
  useEffect(() => {
    // Obtendrá el objeto "chat-app-user" del localStorage
    // En este caso si localiza el objeto significa que estamos logueados. Redirige a "/" de la web
    if(localStorage.getItem("chat-app-user")){
      navigate("/");
    }
  }, []); // Si dejamos la dependencia del hook vacia le decimos que solo lo ejecute 1 vez al renderizar la pagina o componente

  // async y await es similar que .then() pero con menos codigo. Se hace asincrona y espera que le llegue una respuesta
  // una vez le llega la respuesta hace el await. Con axios conectaremos con el servidor node.js y mandaremos datos por post
  const handleSubmit = async (event) => {
    event.preventDefault(); // Al hacer submit la pagina se refrescaría. Con esto evitamos que el navegador refresque la pestaña
    if(handleValidation()){
      const { password, username } = values; // Obtenemos password y username del state values
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      }); // Mandamos por post los datos a la ruta designada en APIRoutes.js
      // data en este caso será la respuesta que devuelva la conexión axios

      // Si los datos son erroneos que salga error
      // Si los datos son correctos que cree un archivo en local llamado "chat-app-user" y le pase un json con los datos del user
      // Luego que nos lleve a "/" de nuestra pagina
      if(data.status === false){
        toast.error(data.msg, toastOptions);
      }
      if(data.status === true){
        localStorage.setItem("chat-app-user", JSON.stringify(data.user)); //Que busque en json format
        navigate("/");
      }
    };
  };

  // Toast es de componente toastify para alertas. Entre llaves se le pasan opciones complementarias
  const handleValidation = () => {
    const { password, username} = values; 
    if (username.length === "") {
      toast.error("El usuario y la contraseña son requeridas.", toastOptions);
      return false;
    } else if (password === ""){      
      toast.error("El usuario y la contraseña son requeridas.", toastOptions);
      return false;
    }
    return true;    
  };
  // Aqui le decimos que el caracter que venga del evento lo escriba con setValues en el estado
  // En el setValues cogeremos todo en values (...values), cogeremos el name del evento (atributo name del input) y cogeremos el value del input
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Con "event" en onSubmit capturamos el evento de darle al boton de subir y lo tratamos, enviandolo como propiedad a "handleSubmit"
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input type="text" placeholder="Username" name="username" onChange={(e) => handleChange(e)} min="3" />
          <input type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)} />
          <button type="submit">Login</button>
          <span>¿No tienes cuenta? <Link to="/register">Registro</Link></span>
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
    align-items:center;
    gap: 1rem;
    justifi-content:center;
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
    button {
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
      &:hover{
        background-color: #4e0eff;
      }
    }
    span{
      color: white;
      text-transform: uppercase;
      a{
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Login