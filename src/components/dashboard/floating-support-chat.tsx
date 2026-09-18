"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Bot, User, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

type Message = {
  id: string
  role: "bot" | "user"
  text: string
}

const FAQ_OPTIONS = [
  {
    id: "q1",
    question: "How do I create a new project?",
    answer: "To create a project, navigate to the Projects tab and click the 'New Project' button. You'll need to provide a name, an internal code, and assign a priority level."
  },
  {
    id: "q2",
    question: "How do I track my team's workload?",
    answer: "Check the Team Management tab! It shows a real-time count of active tasks and open issues assigned to each team member."
  },
  {
    id: "q3",
    question: "How do I report a new issue or bug?",
    answer: "To report an issue, go to the Issues tab and click 'Report Issue'. You can tag it with a severity level so your team knows what to prioritize."
  },
  {
    id: "q4",
    question: "How do I mark a task as completed?",
    answer: "You can easily update task statuses by dragging and dropping them on the Kanban board, or by clicking the quick-action checkmark in the Tasks list!"
  },
  {
    id: "q5",
    question: "What happens when I archive a project?",
    answer: "Archiving a project hides it from your active views but retains all its tasks for historical analytics. It will still count towards your team's completion metrics!"
  },
  {
    id: "q6",
    question: "How do I invite a new team member?",
    answer: "Head over to the Team Management page and click 'Invite User'. You can assign them a specific role and department right away."
  },
  {
    id: "q7",
    question: "Can I recover a deleted task?",
    answer: "Currently, deletions are permanent to keep our database highly optimized. Please be careful when clicking the delete button!"
  },
  {
    id: "q8",
    question: "How does the Analytics chart work?",
    answer: "The Task Completion Trend chart automatically groups your completed tasks and reported issues by month for the current calendar year. It's fully live!"
  }
]

export function FloatingSupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hi there! I'm the OpsForge Assistant. How can I help you today?"
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Listen for custom event from the Support Page
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true)
    window.addEventListener('open-support-chat', handleOpenChat)
    return () => window.removeEventListener('open-support-chat', handleOpenChat)
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping, isOpen])

  const handleQuestionClick = (faq: typeof FAQ_OPTIONS[0]) => {
    // Add user question
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: faq.question }])
    
    // Simulate bot thinking
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "bot", text: faq.answer }])
    }, 1000)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[350px] shadow-2xl transition-all duration-300 ease-in-out z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10 pointer-events-none'}`}>
        <Card className="border-slate-200 dark:border-slate-800 flex flex-col h-[500px] overflow-hidden">
          <CardHeader className="bg-[#0f172a] text-white p-4 flex flex-row items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-1.5 rounded-full">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">OpsForge Assistant</CardTitle>
                <p className="text-[10px] text-blue-200">Pre-defined FAQ Bot</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                  <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="bg-white dark:bg-slate-950 p-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <p className="text-xs text-muted-foreground font-medium w-full text-center mb-1">Choose a question:</p>
            <div className="flex flex-col gap-2 w-full max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
              {FAQ_OPTIONS.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleQuestionClick(faq)}
                  disabled={isTyping}
                  className="text-left text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
