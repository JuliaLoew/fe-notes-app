import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Charts } from '@/components/Diary';
import { LineChart, PieChart } from 'react-chartkick'
import 'chartkick/chart.js'

const MoodAIAnalysis = ({ entries }) => {
  const modalRef = useRef();
  const [aiSummary, setAiSummary] = useState('');
  const [diary, setdiary] = useState([]); // State für zusammeführen von Diary Einträgen
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Funktion zum Abrufen der Diary Einträge
    const fetchDiary = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_NOTES_API}/entries`);
        const allcontent = response.data.map((entries, index) => `Diary Nr. ${index + 1}: ${entries.content}`).join(" ");
        setdiary(allcontent); // Setzen der abgerufenen Notizen im State
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchDiary(); // Notizen beim Laden der Komponente abrufen
  }, []); //

  console.log(diary);
  console.log(aiSummary);

  const sendQuestion = async (diary) => {
    try {
      const response = await axios.post('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: "wie ist die Stimmung in den folgendem Texten. Gibt mir für jeden Text einen Wert auf einer Scala von 1-10 zurück. Wenn du keine Stimmung ermitteln kann gibt eine Zufallszahl zurück " + diary }]
              
      }, {
        headers: {
          'Authorization': 'nxsrsryjwzj3czt5xcszr9',
          'Content-Type': 'application/json',
          'provider': 'open-ai',
          'mode': 'production',
        }
      });

      const aiResponse = response.data.message.content.trim();
      setAiSummary(aiResponse);

   // Extrahieren der Zahlen und Formatieren für das Chart
   const lines = aiResponse.split('\n');
   const data = {};
   lines.forEach(line => {
     const match = line.match(/Diary Nr\.\s*\d+:\s*(\d+)/);
     if (match) {
       const diaryNumber = match[0];
       const moodValue = parseInt(match[1], 10);
       data[diaryNumber] = moodValue;
     }
   });

   console.log(chartData);

   setChartData(data);

      console.log(aiResponse); // Hier können Sie die Antwort der KI-Analysis in der Konsole ausgeben
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleAISummary = async () => {
 
        // const diaryText = "Heute ist ein guter Tag"; // Hier müssten Sie den Tagebucheintrag übergeben

    await sendQuestion(diary);
  };

  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0 w-11/12 max-w-5xl'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get your AI Gen Mood Analysis</h1>
            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex items-center gap-3'>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              {aiSummary || "AI SUMMARY GOES HERE..."}
              <div>
        
              </div>
            </div>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
            <LineChart data={chartData} />
              {/* <Charts aiSummary={aiSummary} /> */}
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
            >
              Gen AI mood analysis ✨
            </button>
              <div>{diary}</div>
              
           
            
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MoodAIAnalysis;
