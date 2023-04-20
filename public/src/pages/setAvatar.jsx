import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

export default function SetAvatar() {

  // Pagina para generar avatares random
  const api = "https://api.multiavatar.com";
  
  const navigate = useNavigate();
  
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
 
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
    if(!localStorage.getItem("chat-app-user")){
      navigate("/login");
    }
  }, []);
  
  const setProfilePicture = async () => {
    if(selectedAvatar === undefined){
      toast.error("Por favor, selecciona un avatar.", toastOptions);
    } else{
      // Obtenemos el usuario del storage localhost una vez se ha registrado/logeado
      // Mandamos mediante axios a la ruta que hay en APIRoutes al servidor con la id del usuario obtenido del storage y el avatar seleccionado
      // Le metemos a avatars en array (por defecto esta establecida en array arriba) la imagen seleccionada que esta guardada en el state
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`,{
        image: avatars[selectedAvatar],
      });
      //Comprueba si data ha sido creado/establecido
      //Luego cambiamos valores del localStorage
      if(data.isSet){
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else{
        toast.error("Hubo un error estableciendo el Avatar. Intentelo de nuevo", toastOptions);
      }
    
    }
  };
  

  useEffect(() => {
    const data = [];
    
    const buscarAvatar = async () => {
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
        const buffer = new Buffer(image.data); // Coge el data de la imagen
        
        data.push(buffer.toString("base64")); // Almacena en la array el data de la imagen en base64
      }
      setAvatars(data); // Almacenamos en avatars el array generado con 4 avatares
      setIsLoading(false);
    }

    buscarAvatar().catch(console.error); // Tratamos posibles errores    
  }, []);

  return (
    <>
    { // isLoading: state que nos indica si estamos cargando o no. Esta enlacado con el useEffect de arriba. Hasta que no devuelva la pagina con axios las 4 imagenes no pondrá setIsLoading en false.
    // En este caso lo que hacemos es decirle que SI esta cargando (state true), nos muestre una imagen con un gif para la espera de la carga de avatares
    // Una vez termine de cargar (axios haya devuelto 4 imagenes con la iteración) ira al ":" de la condicional y cargará todo el bloque de avatares y botón
    
      isLoading ? <Container>
        <img src={loader} alt="loader" className="loader"/>
      </Container> : (

      <Container>
        <div className="title-container" >
          <h1>Elige un avatar como imagen de perfil</h1>
        </div>
        <div className="avatars">
          {avatars.map((avatar,index) => { // Recorremos el array de avatares y cogemos su index y el avatar
            return (
              <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" // Transformamos los datos del array en base64 para que sea legible en src
                  onClick={() => setSelectedAvatar(index)}
                />
              </div>
            );
          })}
        </div>
        <button onClick={setProfilePicture} className="submit-btn">
            Establecer como imagen de perfil
        </button>
      </Container>
      )
    }
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;  
  .loader{
    max-inline-size: 100%;
  }

  .title-container{
    h1{
      color: white;
    }
  }

  .avatars{
    display: flex;
    gap: 2rem;
    
    .avatar{
      border: 0.4rem solid transparent;
      padding: 0.4 rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img{
        height: 6rem;
      }
    }

    .selected{
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
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
`;