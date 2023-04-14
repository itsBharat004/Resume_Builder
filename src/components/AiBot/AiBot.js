import React,{ useState }  from 'react'
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator } from '@chatscope/chat-ui-kit-react';
import './AiBot.css'

const AiBot = (props) => {
    const [typing,setTyping] = useState(false);
    const [messages,setMessages] = useState([
      {
        message : "Hello,I am Jimmy.",
        sender : "ChatGPT",
        sentTime: "just now",
      }
    ]) // []
  
    const handleSend = async (message) => {
      const newMessage = {
        message : message,
        sender : "user",
        direction : "outgoing"
      }
  
      const newMessages = [...messages,newMessage];
      // Add message
      setMessages(newMessages);
      // Set chatGPT is typing
      //process message to chatAPT (send it over and see the response)
      setTyping(true);
      await processMessageToChatGPT(newMessages);
    }
  
    async function processMessageToChatGPT(chatMessage) {
      // chatMessages { sender : "user" or "chatGPT", message : "The message content here"}
      // api Messages { role : "user" or "assistant" , content : "The message content here"}
      let apiMessages = chatMessage.map((message) => {
        let role = "";
        if(message.sender === "ChatGPT"){
          role = "assistant"
        }else{
          role = "user"
        }
        return {role : role,content : message.message}
      });
      // role : "user" -> a message from the user, "assistant" -> a response from the chat gpt
      // "systemt" -> generally one initial message defining How we want chatgpt to talk
      const systemMessage = {
        role : "system",
        content : "Only answer questions related to resume building" // speak like a pirate, etc
      }
      const apiRequestBody = {
        "model":"gpt-3.5-turbo",
        "messages" : [
          systemMessage,
          ...apiMessages // [message1,message2,message3,.......]
        ]
      }
      await fetch("https://api.openai.com/v1/chat/completions", {
        method : "POST",
        headers : {
          "Authorization" : "Bearer " + process.env.REACT_APP_API_KEY ,
          "Content-type"  : "application/json"
        },
        body : JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        setMessages([...chatMessage,{
          message : data.choices[0].message.content,
          sender : "ChatGPT",
        }])
        setTyping(false);
      }).catch((err) => {
        console.log(err);
        setTyping(false);
      })
    }
  return (
    <div id="chatBox" className='chatBox'>
    <div className='cross-btn' onClick={props.chatBoxHandler} ><i className="fa-solid fa-xmark"></i></div>
    <div className='chatbox-inner' style={{ position: "relative",width:"350px", height: "400px" }}>
    <MainContainer>
      <ChatContainer>
        <MessageList
        scrollBehavior='smooth'
          typingIndicator={typing ? <TypingIndicator content="Jimmy is typing" /> : null}
        >
          {messages.map((message,i) => {
            return <Message key={i} model={message} />
          })}
        </MessageList>
        <MessageInput placeholder="Type message here" onSend={handleSend}/>
      </ChatContainer>
    </MainContainer>
  </div>
  </div>
  )
}

export default AiBot