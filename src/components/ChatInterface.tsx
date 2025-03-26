import React, { useState } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'හෙලෝ! මම Claude AI. කුමක් ගැන කතා කරන්න කැමතිද?' 
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [
      ...messages, 
      { role: 'user', content: input }
    ]

    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/chat', { messages: newMessages })
      
      const aiResponse: Message = {
        role: 'assistant',
        content: response.data.content[0].text
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg">
      <div className="p-4 bg-blue-500 text-white rounded-t-lg">
        Claude AI Chatbot
      </div>
      
      <div className="h-96 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`
              p-2 rounded-lg my-2 max-w-[80%]
              ${msg.role === 'user' 
                ? 'bg-blue-100 ml-auto text-right' 
                : 'bg-gray-100 mr-auto text-left'}
            `}
          >
            {msg.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="bg-gray-200 p-2 rounded-lg">
            Typing...
          </div>
        )}
      </div>
      
      <div className="p-4 border-t flex">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-grow p-2 border rounded-l-lg"
          placeholder="ඔයාගේ පණිවුඩය ලියන්න..."
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          යවන්න
        </button>
      </div>
    </div>
  )
}

