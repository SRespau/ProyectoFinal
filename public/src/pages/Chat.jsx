import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

function Chat () {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Se puede hacer tantos useEffect como queramos, solo seguir el flujo
  // Se usa una vez el componente se ha creado. En este caso "chat"
  useEffect(() => {
    if(!localStorage.getItem("chat-app-user")){
      navigate("/login");
    } else{
      const execute = async () => {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
        setIsLoaded(true);
      }
      execute();
    }
  }, [navigate]);

  useEffect(() =>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  // Este useEffect lo que comprobará es primero si hay un usuario logeado
  // Si lo hay comprobará si el avatar lo tiene puesto o no. Si no lo tiene ira a la pagina SetAvatar
  // Si tiene la imagen puesta obtendrá todos los contactos y los metera en el state contacts
  // data.data -> 1º data es la función de axios, 2º data es la const data creada con los datos
  useEffect(() => {     
    if(currentUser){            
        if (currentUser.isAvatarImageSet){
          const execute = async () => { 
            try {
                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);
            } catch (error) {
                console.log(error);
            }
          }                     
          execute();
        } else{
          navigate("/setAvatar");
        }      
    } // Quizá tenga que quitar navigate si no funciona, era para que no saliera error
  }, [currentUser, navigate]); // Entre corchetes ponemos el Hook, las dependencias. 
  // Si pusieramos por ejemplo un state, useEffect se cargaria dos vees, cuando la pagina renderiza y cuando el state se actualiza
  
  
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}></Contacts>
        { isLoaded && currentChat === undefined ? ( // Si state currentChat es undefined que aparezca el componente Welcome. Sino que aparezca el contenedor chatContainer      
          <Welcome currentUser={ currentUser }/>
          ) : (                   
            <ChatContainer currentChat={ currentChat } currentUser={ currentUser } socket={socket}/>
          )
        }
      </div>      
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
export default Chat;