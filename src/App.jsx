import './App.css';
import React, { useRef, useState, useEffect } from 'react';
import franceFlag from './assets/fr-flag.png'
import japanFlag from './assets/jpn-flag.png'
import spanishFlag from './assets/sp-flag.png'
import inputBtnImg from './assets/send-btn.svg'
import parrotImg from './assets/parrot.png'
import OpenAI from 'openai';

export default function App() {
  const [chatMessages, setChatMessages] = useState([])
  const [language, setLanguage] = useState('French')
  
  const inputRef = useRef()
  const messagesEndRef = useRef(null)

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  function changeToFrench() {
    setLanguage('French')
  }

  function changeToJapanese() {
    setLanguage('Japanese')
  }

  function changeToSpanish() {
    setLanguage('Spanish')
  }

  function handleSubmit() {
    let input = inputRef.current.value
    if (!input.trim()) return
    inputRef.current.value = ''
    setChatMessages([...chatMessages, { type: 'human', text: input }])

    translate(input)
  }

  async function translate(input) {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0301",
      messages: [
        {
          "role": "user",
          "content": `Translate this string ${input} into ${language}.`
        },
      ],
      temperature: 0.9,
      max_tokens: 128,
    });
    setChatMessages(chatMessages => [...chatMessages, { type: 'ai', text: response.choices[0].message.content }])
  }

  return (
    <main>
      <header className="header">
        <img className="logo" src={parrotImg} />
        <div className="header-text">
          <h1>PollyGlot</h1>
          <h2>Perfect Translation Every Time</h2>
        </div>
      </header>
      <section className="chat-container">
        <div className="messages-container">
          <div className="ai chat-box">
          Select the language you want me to translate into, type your text, and hit send!
          </div>
          {chatMessages.map((message, index) => (
            <div key={index} className={`${message.type} chat-box`}>
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-field">
          <input ref={inputRef} type="text"></input>
          <button onClick={handleSubmit}><img src={inputBtnImg}/></button>
        </div>
        <div className="flags">
        <button onClick={changeToFrench}>
          <img 
            src={franceFlag} 
            className={`flag ${language === 'French' ? 'flag-enlarged' : ''}`} 
            alt="French Flag"
          />
        </button>
        <button onClick={changeToJapanese}>
          <img 
            src={japanFlag} 
            className={`flag ${language === 'Japanese' ? 'flag-enlarged' : ''}`} 
            alt="Japanese Flag"
          />
        </button>
        <button onClick={changeToSpanish}>
          <img 
            src={spanishFlag} 
            className={`flag ${language === 'Spanish' ? 'flag-enlarged' : ''}`} 
            alt="Spanish Flag"
          />
        </button>
      </div>
      </section>
    </main>
  )
}
