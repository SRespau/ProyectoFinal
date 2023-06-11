import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, allCommunities, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

function Chat () {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isUser, setIsUser] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  
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
      if(!socket.current) {
        socket.current = io(host);       
      }      
      socket.current.emit("add-user", currentUser._id);
    }
    
    if(currentChat !== undefined && currentChat.hasOwnProperty("name")){      
      socket.current.emit('join_room', { currentUser, currentChat });        
      };      
  }, [currentUser, currentChat]);
  
  useEffect(() => {     
    if(currentUser){            
        if (currentUser.isAvatarImageSet){
          const execute = async () => { 
            try {
                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);
                
                const communitiesData = await axios.get(allCommunities);
                setCommunities(communitiesData.data);                            
                              
            } catch (error) {
                console.log(error);
            }
          }                     
          execute();
        } else{
          navigate("/setAvatar");
        }      
    } 
  }, [currentUser, navigate]);
  
  
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleIsUser = (type) => {
    setIsUser(type);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} communities={communities} changeIsUser={handleIsUser}></Contacts>
        { isLoaded && currentChat === undefined ? (
          <Welcome currentUser={ currentUser }/>
          ) : (                   
            <ChatContainer currentChat={ currentChat } currentUser={ currentUser } socket={socket} isUser={ isUser }/>
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