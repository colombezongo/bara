import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  TextField, 
  IconButton, 
  Paper,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

const ChercherEmploiPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simuler une recherche
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          title: 'Développeur Full Stack',
          company: 'Tech Solutions Africa',
          location: 'Lagos, Nigeria',
          type: 'Temps plein',
          salary: '2,500,000 - 3,500,000 NGN',
          description: 'Nous recherchons un développeur Full Stack expérimenté...'
        },
        {
          id: 2,
          title: 'Data Scientist',
          company: 'Innovation Hub',
          location: 'Nairobi, Kenya',
          type: 'Temps plein',
          salary: '150,000 - 200,000 KES',
          description: 'Rejoignez notre équipe de data science...'
        },
        {
          id: 3,
          title: 'Product Manager',
          company: 'Digital Ventures',
          location: 'Accra, Ghana',
          type: 'Temps plein',
          salary: '8,000 - 12,000 GHS',
          description: 'Gérez nos produits numériques innovants...'
        }
      ]);
      setIsSearching(false);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <IconButton
                onClick={() => navigate('/')}
                sx={{
                  mr: 2,
                  color: '#2c3e50',
                  '&:hover': { background: 'rgba(44, 62, 80, 0.1)' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#2c3e50',
                  background: 'linear-gradient(45deg, #2c3e50, #34495e)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Recherche d'emploi
              </Typography>
            </Box>
          </motion.div>

          {/* Search Section */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: '#2c3e50',
                  fontWeight: 600
                }}
              >
                Décrivez votre recherche d'emploi
              </Typography>
              
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ex: Je cherche un poste de développeur React à Lagos avec un salaire de 3M NGN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3498db'
                        }
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3498db',
                          borderWidth: '2px'
                        }
                      }
                    }
                  }}
                />
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      color: '#7f8c8d',
                      '&:hover': { color: '#3498db' }
                    }}
                  >
                    <MicIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: '#7f8c8d',
                      '&:hover': { color: '#3498db' }
                    }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    sx={{
                      color: 'white',
                      background: 'linear-gradient(45deg, #3498db, #2980b9)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2980b9, #1f5f8b)'
                      },
                      '&:disabled': {
                        background: '#bdc3c7',
                        color: '#7f8c8d'
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          {/* Results */}
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: '#7f8c8d' }}>
                  Recherche en cours...
                </Typography>
              </Box>
            </motion.div>
          )}

          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Grid container spacing={3}>
                {searchResults.map((job, index) => (
                  <Grid item xs={12} md={6} lg={4} key={job.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: '16px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 40px rgba(52, 152, 219, 0.15)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: '#3498db',
                                mr: 2
                              }}
                            >
                              <WorkIcon />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: '#2c3e50',
                                  mb: 0.5
                                }}
                              >
                                {job.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: '#7f8c8d' }}
                              >
                                {job.company}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocationOnIcon sx={{ color: '#7f8c8d', mr: 1, fontSize: 16 }} />
                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                              {job.location}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip
                              label={job.type}
                              size="small"
                              sx={{
                                background: 'rgba(52, 152, 219, 0.1)',
                                color: '#3498db',
                                fontWeight: 500
                              }}
                            />
                            <Chip
                              label={job.salary}
                              size="small"
                              sx={{
                                background: 'rgba(46, 204, 113, 0.1)',
                                color: '#27ae60',
                                fontWeight: 500
                              }}
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              color: '#7f8c8d',
                              mb: 2,
                              lineHeight: 1.5
                            }}
                          >
                            {job.description}
                          </Typography>

                          <Button
                            variant="contained"
                            fullWidth
                            sx={{
                              background: 'linear-gradient(45deg, #3498db, #2980b9)',
                              borderRadius: '12px',
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': {
                                background: 'linear-gradient(45deg, #2980b9, #1f5f8b)'
                              }
                            }}
                          >
                            Postuler
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default ChercherEmploiPage; 