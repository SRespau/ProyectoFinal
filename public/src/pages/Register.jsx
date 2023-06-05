import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo2.png";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";


function Register () {
  const navigate = useNavigate(); // Utiliza una función para poder utilizar navigate en un useEffect y poder redireccionar

  // Los states digamos que son como un objeto. Contiene información que se puede guardar y modificar. Una vez cambia el state se vuelve a renderizar
  // En este caso estamos guardando un objeto con 4 propiedades en "values"
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    // Obtendrá el objeto "chat-app-user" del localStorage
    // En este caso si localiza el objeto significa que estamos logueados. Redirige a "/" de la web
    if(localStorage.getItem("chat-app-user")){
      navigate("/");
    }
  });

  // async y await es similar que .then() pero con menos codigo. Se hace asincrona y espera que le llegue una respuesta
  // una vez le llega la respuesta hace el await. Con axios conectaremos con el servidor node.js y mandaremos datos por post
  const handleSubmit = async (event) => { // Con "event" en onSubmit capturamos el evento de darle al boton de subir y lo tratamos
    event.preventDefault(); // Al hacer submit la pagina se refrescaría. Con esto evitamos que el navegador refresque la pestaña
    if(handleValidation()){
      const { password, username, email, nombre, apellidos, direccion, telefono } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
        nombre,
        apellidos,
        direccion,
        telefono,
      }); // Mandamos por post los datos a la ruta designada en APIRoutes.js

      // Si los datos son erroneos que salga error
      // Si los datos son correctos que cree un archivo en local llamado "chat-app-user" y le pase un json con los datos del user
      // Luego que nos lleve a "/" de nuestra pagina
      if(data.status === false){
        toast.error(data.msg, toastOptions);
      }
      if(data.status === true){
        localStorage.setItem("chat-app-user", JSON.stringify(data.user)); // Si es verdadero, creará en localStorage un objeto (cookie) y le pasara en JSON el data.user (convertira el objeto en JSON con stringify)
        navigate("/");
      }
    };
  };
  
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values; 
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    if (username.length < 3) {
      toast.error("El usuario debería ser superior a 3 caracteres", toastOptions);
      return false;
    } else if (email === ""){
      toast.error("El email es requerido", toastOptions);
      return false;
    } else if (!strongRegex.test(password)) {
      toast.error('La contraseña debería contener 1 minuscula, 1 mayuscula, 1 número, 1 caracter especial (!, @, #, $, %, ^, &, *) y ser mayor de 8 caracteres', toastOptions);
      return false;
    } else if (password !== confirmPassword){      
      toast.error("Ambas contraseñas deben coincidir", toastOptions);
      return false;
    }
    return true;    
  };

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
          <input className="user-info" type="text" placeholder="Usuario*" name="username" onChange={(e) => handleChange(e)} />
          <input className="user-info" type="email" placeholder="Email*" name="email" onChange={(e) => handleChange(e)} />

          <input className="user-info" type="text" placeholder="Nombre" name="nombre" onChange={(e) => handleChange(e)} />
          <input className="user-info" type="text" placeholder="Apellidos" name="apellidos" onChange={(e) => handleChange(e)} />
          <input className="user-info" type="text" placeholder="Dirección" name="direccion" onChange={(e) => handleChange(e)} />
          <input className="user-info" type="text" placeholder="Telefono" name="telefono" onChange={(e) => handleChange(e)} />

          <input className="user-info" type="password" placeholder="Contraseña*" name="password" onChange={(e) => handleChange(e)} />
          <input className="user-info" type="password" placeholder="Confirmar Contraseña*" name="confirmPassword" onChange={(e) => handleChange(e)} />
          <button className="create" type="submit">Crear Usuario</button>
          <Link to="/">Cancelar</Link>
          <span>Si ya tienes un usuario..... <Link to="/login">Login</Link></span>
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
    justify-content: center;
    width: 100%;
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
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    width: 60rem;
    .user-info{
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color:white;
      width: 100%;
      font-size: 1rem;
      width: 20rem;
      &:focus{
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    .last{
      width: 42rem;
      margin: 0rem 4rem;
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
    .create{
      margin: 0rem 1rem;
    }
    span{
      color: white;
      text-transform: uppercase;
      font-size: 1.2rem;
      a{
        color: #d1d1d1;
        text-decoration: none;
        font-weight: bold;
        margin-left: 1.2rem;
      }
    }    
  }
  a{
    color: #4e0eff;
    text-decoration: none;
    font-weight: bold;
  }
`;

export default Register;