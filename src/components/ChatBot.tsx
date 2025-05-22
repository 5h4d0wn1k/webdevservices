import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Paperclip, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const defaultMessages: Message[] = [
  {
    id: '1',
    content: "Hi there! I'm the shadownik (Shadownik(Swnk)) assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }
];

// Pre-defined bot responses based on user input
const botResponses: Record<string, string[]> = {
  pricing: [
    "Our pricing is customized based on your project requirements. We offer packages starting from $2,500 for simple websites, while complex web applications or e-commerce solutions typically range from $5,000 to $20,000+.",
    "Would you like to schedule a free consultation to discuss your project in detail?"
  ],
  contact: [
    "You can reach our team at support@shadownik.online or call us at +91 9165644843.",
    "Alternatively, you can fill out the contact form on our website and we'll get back to you within 24 hours."
  ],
  services: [
    "We offer a wide range of services including web development, mobile app development, e-commerce solutions, UI/UX design, custom software development, and digital marketing.",
    "Is there a specific service you're interested in learning more about?"
  ],
  timeline: [
    "Project timelines vary based on complexity and scope. Simple websites typically take 2-4 weeks, while more complex web applications may take 2-3 months or more.",
    "We can provide a more accurate timeline after understanding your specific requirements."
  ],
  portfolio: [
    "You can view our portfolio on our website to see examples of our previous work across various industries.",
    "Would you like me to highlight some of our case studies in a particular industry?"
  ],
  process: [
    "Our development process includes discovery, planning, design, development, testing, and deployment phases.",
    "We follow agile methodologies with regular client check-ins to ensure your project stays on track and meets your expectations."
  ],
  technologies: [
    "We work with modern technologies including React, Angular, Vue.js, Node.js, Python, PHP, WordPress, Shopify, and many others.",
    "Our team is skilled in both frontend and backend development, ensuring we can handle all aspects of your project."
  ],
  seo: [
    "Yes, we provide SEO services including on-page optimization, technical SEO audits, content strategy, and ongoing SEO maintenance.",
    "Our SEO approach focuses on sustainable, long-term results rather than quick fixes."
  ],
  hosting: [
    "We offer hosting solutions for our clients, with packages that include maintenance, security updates, and performance monitoring.",
    "We can also help you set up hosting with providers like AWS, Google Cloud, or DigitalOcean if you prefer."
  ],
  support: [
    "We provide ongoing support and maintenance for all our projects. Our standard support packages include regular updates, security patches, and technical assistance.",
    "We also offer custom support plans tailored to your specific needs."
  ]
};

// Function to generate a bot response based on user input
const generateBotResponse = (userMessage: string): Promise<string[]> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      const lowercaseMessage = userMessage.toLowerCase();
      
      // Check for keywords in the user message
      for (const [keyword, responses] of Object.entries(botResponses)) {
        if (lowercaseMessage.includes(keyword)) {
          resolve(responses);
          return;
        }
      }
      
      // Default response if no keywords match
      resolve([
        "Thank you for your message. I'd be happy to help with that.",
        "Could you please provide more details or specify what information you're looking for about our web development services?"
      ]);
    }, 1000);
  });
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Generate bot response
    const botResponses = await generateBotResponse(newMessage);
    
    // Add bot responses with a slight delay between each
    for (let i = 0; i < botResponses.length; i++) {
      // Wait a moment before showing the next message
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const botMessage: Message = {
        id: `bot-${Date.now()}-${i}`,
        content: botResponses[i],
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }
    
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed z-40 bottom-8 right-8 sm:bottom-8 sm:right-8 p-4 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 ${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 bottom-4 right-4 sm:bottom-8 sm:right-8 w-full sm:w-96 h-[600px] max-h-[80vh] flex flex-col bg-gray-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden"
          >
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-accent text-white">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">shadownik (Shadownik(Swnk)) Assistant</h3>
                  <p className="text-xs opacity-80">Online | Typically replies instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Messages container */}
            <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-xs sm:max-w-sm ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' ? 'bg-accent/20 ml-2' : 'bg-primary/20 mr-2'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User size={14} className="text-accent" />
                      ) : (
                        <Bot size={14} className="text-primary" />
                      )}
                    </div>
                    <div 
                      className={`p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-accent text-white rounded-tr-none' 
                          : 'bg-white/10 text-gray-200 rounded-tl-none'
                      }`}
                    >
                      {message.content}
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Bot typing indicator */}
              {isTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="flex items-start max-w-xs sm:max-w-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Bot size={14} className="text-primary" />
                    </div>
                    <div className="p-3 rounded-lg bg-white/10 text-gray-200 rounded-tl-none">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="p-3 bg-black/30 border-t border-white/10">
              <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-0 focus:ring-0 outline-none resize-none text-white placeholder-gray-500 py-1 px-2"
                  rows={1}
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className={`p-2 rounded-full ${
                    !newMessage.trim() || isTyping
                      ? 'text-gray-600'
                      : 'text-primary hover:bg-primary/10'
                  } transition-colors`}
                  aria-label="Send message"
                >
                  {isTyping ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
              <div className="mt-2 text-center text-xs text-gray-500">
                Powered by shadownik (Shadownik(Swnk)) AI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot; 