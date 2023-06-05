import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo2.png";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { userEditRoute, getUserRoute } from "../utils/APIRoutes";


function UserEdit () {

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  
  const navigate = useNavigate();
  const location = useLocation();  
  const { user } = location.state; 
    

  const [changePassword, setChangePassword] = useState(false);
  const [values, setValues] = useState({
    username: "",
    nombre: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  useEffect(() => {     
    const execute = async () => { 
      try {
          const data = await axios.get(`${getUserRoute}/${user.currentUser._id}`);
          
          setValues({ 
            username: data.data[0].username, 
            email: data.data[0].email,
            nombre: data.data[0].nombre,
            apellidos: data.data[0].apellidos,
            direccion: data.data[0].direccion,
            telefono: data.data[0].telefono, 
            password: "",
          });
      } catch (error) {
          console.log(error);
      }
    }                     
    execute();
  }, [user.currentUser._id]);
             

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    if(handleValidation()){
      const { password, username, email, nombre, apellidos, direccion, telefono } = values;
      const id = user.currentUser._id;
      const { data } = await axios.post(userEditRoute, {
        id,
        username,
        nombre,
        apellidos,
        direccion,
        telefono,
        email,
        password,
      });
      
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

  // Toast es de componente toastify para alertas. Entre llaves se le pasan opciones complementarias
  const handleValidation = () => {
    const { password, confirmPassword, username, email} = values; 
    if (username.length < 3) {
      toast.error("El usuario debería ser superior a 3 caracteres", toastOptions);
      return false;
    } else if (email === ""){
      toast.error("El email es requerido", toastOptions);
      return false;
    } else if (changePassword && password.length < 8) {
      toast.error("La contraseña debería ser superior a 8 caracteres", toastOptions);
      return false;
    } else if (changePassword && password !== confirmPassword){      
      toast.error("Ambas contraseñas deben coincidir", toastOptions);
      return false;
    }
    return true;    
  };
  // Aqui le decimos que el caracter que venga del evento lo escriba con setValues en el estado
  // En el setValues cogeremos todo en values (...values), cogeremos el name del evento (atributo name del input) y cogeremos el value del input
  // El nombre del input coincide con el nombre de la propiedad en el state, por lo que podemos usar esta forma para que se añada automaticamente.
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleChangePassword = () => {
    setChangePassword(changePassword => setChangePassword(!changePassword));
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Adamas</h1>
          </div>
          <input className="user-info" type="text" value={values.nombre} placeholder="Nombre" name="nombre" onChange={(e) => handleChange(e)} />
          <input className="user-info" type="text" value={values.apellidos} placeholder="Apellidos" name="apellidos" onChange={(e) => handleChange(e)} />
          <input className="user-info" type="email" value={values.email} placeholder="Email*" name="email" onChange={(e) => handleChange(e)} />
          <input className="user-info" type="text" value={values.telefono} placeholder="Telefono" name="telefono" onChange={(e) => handleChange(e)} />
          <input className="user-info last" type="text" value={values.direccion} placeholder="Dirección" name="diireccion" onChange={(e) => handleChange(e)} />
          
          {changePassword && <>          
            <input className="user-info" type="password" placeholder="Contraseña" name="password" onChange={(e) => handleChange(e)} />
            <input className="user-info" type="password" placeholder="Confirmar Contraseña" name="confirmPassword" onChange={(e) => handleChange(e)} />
          </>}

          <button type="button" onClick={handleChangePassword}>Cambiar Contraseña</button>
          <button type="submit">Editar Usuario</button>
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
      color: white;
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
    .cancel {
      margin: 0px 16rem;
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

export default UserEdit;