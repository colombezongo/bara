import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Chip,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatService, ChatMessage } from '../services/chatService';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = useRef(new ChatService());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: chatService.current.generateId(),
        text: "👋 Salut ! Je suis ton assistant entrepreneuriat africain ! 💼\n\nJe peux t'aider avec :\n• 💡 Démarrer ton activité\n• 💰 Gérer ton argent\n• 👥 Attirer des clients\n• 📈 Développer ton business\n\nPose-moi tes questions ! 🚀",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: chatService.current.generateId(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.current.sendMessage(inputValue.trim());
      const botMessage: ChatMessage = {
        id: chatService.current.generateId(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: chatService.current.generateId(),
        text: "😔 Désolé, j'ai un petit problème technique. Réessaye dans quelques minutes !",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "💡 Comment démarrer mon petit commerce ?",
    "💰 Comment gérer mon argent ?",
    "👥 Comment attirer plus de clients ?",
    "📱 Comment utiliser WhatsApp pour vendre ?"
  ];

  const formatMessage = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => (
        <Typography 
          key={index} 
          variant="body2" 
          sx={{ 
            whiteSpace: 'pre-wrap',
            mb: index < text.split('\n').length - 1 ? 1 : 0,
            lineHeight: 1.6,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          {line}
        </Typography>
      ));
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: isMobile ? 16 : 20,
          left: isMobile ? 16 : 20,
          zIndex: 1000
        }}
      >
        <Fab
          color="primary"
          onClick={() => setIsOpen(true)}
          sx={{
            backgroundColor: '#3498db',
            '&:hover': {
              backgroundColor: '#2980b9',
              transform: 'scale(1.05)'
            },
            width: isMobile ? 56 : 64,
            height: isMobile ? 56 : 64,
            boxShadow: '0 4px 20px rgba(52, 152, 219, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          <ChatIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
        </Fab>
      </motion.div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: isMobile ? '90vh' : '80vh',
            maxHeight: isMobile ? '600px' : '700px',
            borderRadius: isMobile ? 2 : 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: isMobile ? 1.5 : 2,
            px: isMobile ? 2 : 3
          }}
        >
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
            <LightbulbIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            Assistant Entrepreneuriat
          </Typography>
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{ 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: isMobile ? 1.5 : 2,
              backgroundColor: '#f8f9fa',
              backgroundImage: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ marginBottom: 16 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Paper
                      sx={{
                        p: isMobile ? 1.5 : 2,
                        maxWidth: '85%',
                        backgroundColor: message.isUser ? '#3498db' : 'white',
                        color: message.isUser ? 'white' : 'text.primary',
                        borderRadius: isMobile ? 2 : 3,
                        boxShadow: message.isUser 
                          ? '0 4px 12px rgba(52, 152, 219, 0.3)' 
                          : '0 2px 8px rgba(0,0,0,0.1)',
                        border: message.isUser ? 'none' : '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      {formatMessage(message.text)}
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          display: 'block',
                          mt: 1,
                          textAlign: message.isUser ? 'right' : 'left',
                          fontSize: '0.7rem'
                        }}
                      >
                        {message.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Paper>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Paper
                  sx={{
                    p: isMobile ? 1.5 : 2,
                    backgroundColor: 'white',
                    borderRadius: isMobile ? 2 : 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} color="primary" />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Je réfléchis... 🤔
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {messages.length === 1 && (
            <Box sx={{ 
              p: isMobile ? 1.5 : 2, 
              backgroundColor: 'white', 
              borderTop: '1px solid #e0e0e0',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                💡 Questions populaires :
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestedQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    size="small"
                    onClick={() => setInputValue(question.replace(/^[^\s]+\s/, ''))}
                    sx={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      '&:hover': {
                        backgroundColor: '#bbdefb',
                        transform: 'scale(1.02)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ 
            p: isMobile ? 1.5 : 2, 
            backgroundColor: 'white', 
            borderTop: '1px solid #e0e0e0',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                placeholder="Pose ta question ici... 💬"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
                size="small"
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3498db'
                      }
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                sx={{
                  minWidth: isMobile ? 44 : 48,
                  height: isMobile ? 40 : 44,
                  borderRadius: 3,
                  backgroundColor: '#3498db',
                  '&:hover': {
                    backgroundColor: '#2980b9',
                    transform: 'scale(1.05)'
                  },
                  '&:disabled': {
                    backgroundColor: '#bdc3c7'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <SendIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatWidget; 