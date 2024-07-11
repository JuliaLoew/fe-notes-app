import { useState, useEffect } from "react";
import axios from "axios";
import CreateNote from "./CreateNote";

const NoteAPI = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState([]); // State für zusammeführen von Notes

  


  useEffect(() => {
    // Funktion zum Abrufen der Notizen
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_NOTES_API}/notes`);
        const allcontent = response.data.map((note, index) => `Notiz Nr. ${index + 1}: ${note.content}`).join(" ");
        setNotes(allcontent); // Setzen der abgerufenen Notizen im State
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes(); // Notizen beim Laden der Komponente abrufen
  }, []); //
  
  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendData();
  };


  const sendData = async () => {
    try {
       
      const response = await axios.post('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: "fasse die folgende Notiz zu einer kurzen Aussage zusammen. " + notes }]
      }, {
        headers: {
          'Authorization': 'nxsrsryjwzj3czt5xcszr9',
          'Content-Type': 'application/json',
          'provider': 'open-ai',
          'mode': 'production',
        }
      });

      setSummary(response.data.message.content); // Rückmeldung Daten aus message Feld Content
      console.log(response.data);
  
      
    } catch (error) {
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
        {/* <textarea
          className='textarea textarea-bordered'
          placeholder='Enter your note here...'
          value={inputText}
          onChange={handleChange}
        ></textarea> */}
        <button className='btn btn-primary mt-2 mb-4'>Summarize all notes</button>
        
        <p className='font-bold'>Summarize von Open AI </p>
        <p > {summary} </p>
        <br />
        <p className="font-bold">Content all notes</p>
        <p>{notes}</p>
      </form>
     
    </div>
  );
};

export default NoteAPI;
