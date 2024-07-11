import { useRef, useState } from 'react';
import axios from 'axios';
import { Charts } from '@/components/Diary';

const MoodAIAnalysis = ({ entries }) => {
  const modalRef = useRef();
  const [aiSummary, setAiSummary] = useState('');

  const sendQuestion = async (question, diaryText) => {
    try {
      const response = await axios.post('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', {
        model: 'gpt-4o',
        prompt: `Question: ${question}\nDiary Entry: ${diaryText}\nSentiment Analysis:`,
        message: [{ role: 'user', content: diaryText }]
              
      }, {
        headers: {
          'Authorization': 'Bearer nxsrsryjwzj3czt5xcszr9',
          'Content-Type': 'application/json',
          'provider': 'open-ai',
          'mode': 'development',
        }
      });

      const aiResponse = response.data.choices[0].text.trim();
      setAiSummary(aiResponse);
      console.log(aiResponse); // Hier können Sie die Antwort der KI-Analysis in der Konsole ausgeben
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleAISummary = async () => {
    // Beispiel: Frage festlegen und Tagebucheintrag als Text
    const question = "How would you describe the sentiment of this diary entry?";
    const diaryText = "Heute ist ein guter Tag"; // Hier müssten Sie den Tagebucheintrag übergeben

    await sendQuestion(question, diaryText);
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
              <Charts aiSummary={aiSummary} />
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
            >
              Gen AI mood analysis ✨
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MoodAIAnalysis;
