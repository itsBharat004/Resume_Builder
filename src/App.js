import React,{useState} from "react";
import Body from "./components/Body/Body";
import AiBot from "./components/AiBot/AiBot";
import "./App.css";

function App() {
  const [showChatBot,setShowChatBot] = useState(false);
  const chatBoxHandler = () => {
    if(showChatBot){
      document.getElementById('chatBox').classList.toggle('slideChatBox')
      setTimeout(() => {
        setShowChatBot(!showChatBot);
      },300)
    }else{
      setShowChatBot(!showChatBot);
      setTimeout(() => {
        document.getElementById('chatBox').classList.toggle('slideChatBox')
      },5)
    }

  }
  return (
    <div className="App">
      {showChatBot ? <AiBot chatBoxHandler={chatBoxHandler}  /> : 
        <div className='bot-icon' onClick={chatBoxHandler}><i className="fa-sharp fa-regular fa-comment"></i></div>
      }
      <Body />
    </div>
  );
}

export default App;
