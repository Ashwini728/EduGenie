import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TopicInput = ({ setTopic, setNotes, setQuiz }) => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
 const { transcript, listening, resetTranscript } = useSpeechRecognition();


  const handleSubmit = async () => {
    const finalTopic = input.trim() || transcript.trim();
    if (!finalTopic) 
      return;

    setTopic(finalTopic);
    resetTranscript();

    try {
      const res = await axios.post('https://6f20-35-194-182-89.ngrok-free.app/generate-notes', {
        topic: finalTopic,
      });
      setNotes(res.data.notes);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const handleGenerate = async () => {
    if (!input && !transcript) return;

    const topicToGenerate = input || transcript;
    setTopic(topicToGenerate);

    try {
      const res = await axios.post('http://localhost:5000/api/generate', { topic: topicToGenerate });
      setQuiz(res.data.quiz);
    } catch (err) {
      console.error('API error:', err);
    }
  };

  const handleQuiz = async () => {
    await handleGenerate();
    navigate('/quiz');
  };
  const handleVoiceInput = () => {
    resetTranscript(); // Reset before fresh listening
    SpeechRecognition.startListening();
  };
  return (
    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <input
        type="text"
        placeholder="Enter or speak topic..."
        value={input || transcript}
        onChange={(e) => setInput(e.target.value)}
        style={{
          marginRight:'320px',
          padding: '0.9rem 1rem',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '1rem',
          marginBottom: '1rem'
        }}
      />
     <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleSubmit}
           className="button-custom"
        >
          Generate Notes
        </button>
        <button
          onClick={handleVoiceInput}
          className="button-custom"
        >
          🎙 Speak
        </button>
      </div>
      {listening && <p style={{ color: '#f57c00', marginTop: '1rem' }}>Listening...</p>}
    </div>
  );
};
const buttonStyle = {
  padding: '12px 18px',
  fontSize: '1rem',
  border: '2px solid #d32f2f',
  borderRadius: '10px',
  cursor: 'pointer',
  background: 'transparent',
  color: '#d32f2f',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'background 0.3s ease, color 0.3s ease',
};


export default TopicInput;
