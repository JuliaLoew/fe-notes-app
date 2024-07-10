import { useEffect, useState } from "react";
import axios from "axios";

const NoteAPI = () => {
  const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
  
  const handleChange = (event) => {
    setInputText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        sendData();
    };
   
    

    const sendData = async () => {
        try {
            const response = await axios.post('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', {
                text: inputText 
            }, {
                headers: {
                    'Authorization': 'Bearer nxsrsryjwzj3czt5xcszr9',
                    'Content-Type': 'application/json',
                    'provider': 'open-ai',
                    'mode': 'development'
                }
            });
            setSummary(response.data.summary); 
            console.log(response.data);
        }
        
        catch (error) {
            if (error.response) {
                // Der Request wurde ausgeführt und der Server hat mit einem Statuscode geantwortet, der außerhalb des Bereichs von 2xx liegt
                console.error(`Error: ${error.response.status}, ${error.response.data}`);
            } else if (error.request) {
                // Der Request wurde gesendet, aber keine Antwort erhalten
                console.error(error.request);
            } else {
                // Ein Fehler beim Aufbau des Requests
                console.error('Error', error.message);
            }
        }
};

return (
    <div className='p-5'>
        <form onSubmit={handleSubmit}>
            <textarea
                className='textarea textarea-bordered'
                placeholder='Enter your note here...'
                value={inputText}
                onChange={handleChange}
            ></textarea>
            <button className='btn btn-primary mt-2'>Summarize</button>
        </form>
        <p className='p-5'>{summary}</p>
    </div>
);    
};

    export default NoteAPI;
