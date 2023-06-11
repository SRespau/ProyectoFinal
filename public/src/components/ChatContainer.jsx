import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute, allCommunityMsg, sendCommunityMsg } from "../utils/APIRoutes";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import DeleteCommunity from "./DeleteCommunity";
import { v4 as uuidv4 } from "uuid";


export default function ChatCointainer({ currentChat, currentUser, isUser, socket }) {
  
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState();
  const [messagesReceived, setMessagesReceived] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {    
    const execute = async () => {
      if(currentChat){
        if(isUser){          
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
            });      
          setMessages(response.data); 
        } else{
          const response = await axios.post(allCommunityMsg, {
              from: currentChat._id,
            });        
          setMessagesReceived(response.data);
        }        
      }             
    };
   execute();
  }, [currentChat]);

  
  const handleSendMsg = async (msg) => {
    
    if(isUser){
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
      socket.current.emit("send-msg", {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
        time: new Date(),
      });  
      
      const msgs = [...messages];
      msgs.push({fromSelf: true, message: msg, time: new Date()});
      setMessages(msgs);

    } else {      
      await axios.post(sendCommunityMsg, {
        user: currentUser.username,
        chat: currentChat._id,
        message: msg,
      });
      socket.current.emit("send-msg-group", {
        user: currentUser.username,
        chat: currentChat.name,
        message: msg,
        time: new Date(),
      });
    }    
  };

  useEffect(() => {
    
    // COMPROBAR ESTA PARTE. MANDA MENSAJES AL USUARIO AUNQUE ESTE EN OTRO CHAT. COMPROBAR QUE SOLO ENVIE SI ESTÁ EN EL MISMO SOCKET ID
    if(socket.current){ 
      socket.current.off("msg-recieve");
      socket.current.off("receive_message");
      socket.current.on("msg-recieve", (msg) => {
        if (msg[2] === currentChat._id){
          console.log(currentChat);
          setArrivalMessage({fromSelf: false, message: msg[0], time: msg[1],});    
        }       
      });
      
      socket.current.on('receive_message', (data) => {
        setArrivalMessage({
            message: data.message,
            user: data.user,
            time: data.time,
          }          
        );               
      });      
    }
   
  }, [socket, currentChat]);


  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);    
  }, [arrivalMessage]);

  useEffect(() => {    
    arrivalMessage && setMessagesReceived((prev) => [...prev, arrivalMessage]);    
  }, [arrivalMessage]);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesReceived]);


  const dateHandler = stringDate => {
    const date = new Date(stringDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    let minutesFormat = minutes;
    if(minutesFormat < 10){
      minutesFormat = "0" + minutesFormat;
    }
    
    return day + "/" + month + "/" + year + "/ " + hour + ":" + minutesFormat;
    };
  
  
  return(
    <>
   { 
    currentChat && (
    <Container>
      <div className={isUser ? "chat-header" : "chat-header-group"}>
        {
          isUser ?
          <div className="user-details">
            <div className="avatar">
              {Object.hasOwn(currentChat, 'username') ? <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" /> : ""}
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
        : 
        <div className="community-details">
          <div className="community">
            <h3>{currentChat.name}</h3>
          </div>
        </div>
        }
        {
          !isUser && currentUser._id === currentChat.creator ? <DeleteCommunity chat={currentChat._id} /> : ""
        }
        <Logout />
      </div>
      <div className={`${isUser ? "chat-messages" : "chat-messages-group"}`}>
        {
        isUser ? 
        messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                <div className="content ">
                  <p className="date fullWidth">{dateHandler(message.time)}</p>
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })
        :
        messagesReceived.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div className="group">
                <div className={`${message.user === currentUser.username ? "self" : "content"}`}>
                  <p className="user">{message.user}</p>
                  {
                    message.user === "ChatBot" ? "" : <p className="date">{dateHandler(message.time)}</p>
                  }                  
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })
        }
      </div>
      <ChatInput handleSendMsg={handleSendMsg}/>
    </Container>
    )}
    </>
  );
}

const Container = styled.div`
padding-top: 1rem;
display: grid;
grid-template-rows: 10% 78% 12%;
gap: 0.1 rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem;
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar{
      img{
        height: 3rem;
      }
    }
    .username{
      h3{
        color: white;
      }
    }
  }
}
.chat-header-group{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem;
  .community-details {
    display: flex;
    align-items: center;
    gap: 1rem;    
    .community{
      h3{
        color: white;
        margin-left: 2rem;
      }
    }
  }
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  .message{
    display: flex;
    align-items: center;
    .content{
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
    }
  }
}
.chat-messages-group {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;  
    .content{
      max-width: 100%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.2rem;
      border-radius: 1rem;
      color: #d1d1d1;
    }
    .self{
      max-width: 100%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.2rem;
      border-radius: 1rem;
      background-color: #3E0068;
      color: #d1d1d1;
    }
  
}
.sended {
  justify-content: flex-end;
  .content {
    background-color: #4f04ff21;
  }
}
.recieved {
  justify-content: flex-start;
  .content {
    background-color: #9900ff20;
  }
}
.group {
  justify-content: flex-start;
  .content {
    background-color: #4f04ff21; 
    width: 100%;
  }
}
.user{
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #35A661;
  width: 45%;
  display: inline-block;
}

.date {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: #35A661;
  width 55%;
  display: inline-block;
  text-align: right;
}

.fullWidth {
  width: 100%;
}
`;
