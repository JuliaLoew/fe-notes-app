import { useEffect, useState } from "react";
import axios from "axios";

function NoteAPI() {
  const [messages, setMessages] = useState({
    message: '',
    stream: true
  });
  const [responses, setResponses] = useState([]);
  
  const API_TOKEN = "nxsrsryjwzj3czt5xcszr9";

    useEffect(() => {
        const sendData = async () => {
            try {
                const message = await axios.post('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', null, {
                    headers: {
                        'Authorization': 'Bearer ' + API_TOKEN,
                        'Content-Type': 'application/json',
                        'provider': 'open-ai',
                        'mode': 'development'
                    }
                });
                setMessages(messages.data);
            }
            
            catch (error) {
                console.error(error);
            }
        };
        sendData();
    });
    
    return (
        <div>
            <h1>Notes</h1>
            <p>{messages.message}</p>
        </div>
    )
