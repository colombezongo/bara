import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { CameraAlt, Upload, CheckCircle, Error, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LightPDFOCRService, OCRResult } from '../services/lightPDFOCRService';

export default function PartagerEmploiPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [employerInfo, setEmployerInfo] = useState({
    nom: '',
    prenom: '',
    cni: '',
    telephone: '',
    email: ''
  });
  const [cniImage, setCniImage] = useState<File | null>(null);
  const [cniPreview, setCniPreview] = useState<string>('');
  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [isProcessingCNI, setIsProcessingCNI] = useState(false);
  const [isProcessingPoster, setIsProcessingPoster] = useState(false);
  const [cniResult, setCniResult] = useState<OCRResult | null>(null);
  const [posterAnalysis, setPosterAnalysis] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'cni' | 'poster') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'cni') {
        setCniImage(file);
        setCniPreview(URL.createObjectURL(file));
        setCniResult(null);
      } else {
        setPosterImage(file);
        setPosterPreview(URL.createObjectURL(file));
        setPosterAnalysis('');
      }
    }
  };

  const handleCameraCapture = async (type: 'cni' | 'poster') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Attendre que la vidéo soit prête
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      // Capturer l'image
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      // Convertir en blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${type}_capture.jpg`, { type: 'image/jpeg' });
          if (type === 'cni') {
            setCniImage(file);
            setCniPreview(URL.createObjectURL(file));
            setCniResult(null);
          } else {
            setPosterImage(file);
            setPosterPreview(URL.createObjectURL(file));
            setPosterAnalysis('');
          }
        }
      }, 'image/jpeg');

      // Arrêter la caméra
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Erreur lors de la capture:', error);
    }
  };

  const processCNIImage = async () => {
    if (!cniImage) return;

    setIsProcessingCNI(true);
    try {
      const result = await LightPDFOCRService.extractCNIInfo(cniImage);
      setCniResult(result);
      
      if (result.success) {
        setEmployerInfo(prev => ({
          ...prev,
          nom: result.nom,
          prenom: result.prenom,
          cni: result.cni
        }));
      }
    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      setCniResult({
        cni: '',
        nom: '',
        prenom: '',
        success: false,
        error: 'Erreur lors du traitement de l\'image'
      });
    } finally {
      setIsProcessingCNI(false);
    }
  };

  const analyzePosterImage = async () => {
    if (!posterImage) return;

    setIsProcessingPoster(true);
    try {
      // Simulation d'analyse IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPosterAnalysis('Analyse terminée : Image de poster d\'emploi détectée et validée.');
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setPosterAnalysis('Erreur lors de l\'analyse de l\'image');
    } finally {
      setIsProcessingPoster(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Logique de soumission
    console.log('Soumission des données:', { employerInfo, posterImage });
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
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 2 : 4 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{
                  color: '#3498db',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  '&:hover': {
                    backgroundColor: 'rgba(52, 152, 219, 0.1)'
                  }
                }}
              >
                Retour
              </Button>
            </Box>
          </motion.div>

          {/* Titre */}
          <motion.div variants={itemVariants}>
            <Typography
              variant={isMobile ? "h5" : "h3"}
              component="h1"
              gutterBottom
              align="center"
              sx={{
                color: '#2c3e50',
                fontWeight: 'bold',
                mb: isMobile ? 2 : 4,
                fontSize: isMobile ? '1.5rem' : '2.5rem'
              }}
            >
              Je Partage un Emploi
            </Typography>
          </motion.div>

          {/* Contenu principal */}
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={3} 
              sx={{ 
                mt: isMobile ? 2 : 3,
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: isMobile ? 2 : 3 }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  gutterBottom 
                  sx={{ 
                    color: '#2c3e50',
                    fontWeight: 600,
                    mb: isMobile ? 2 : 3
                  }}
                >
                  Poster d'Emploi
                </Typography>

                <Grid container spacing={isMobile ? 2 : 3}>
                  {/* Section Upload d'image */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          📸 Image du Poster
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="poster-upload"
                            type="file"
                            onChange={(e) => handleImageUpload(e, 'poster')}
                          />
                          <label htmlFor="poster-upload">
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<Upload />}
                              fullWidth
                              sx={{ mb: 1 }}
                            >
                              Choisir une image
                            </Button>
                          </label>
                          
                          <Button
                            variant="outlined"
                            startIcon={<CameraAlt />}
                            onClick={() => handleCameraCapture('poster')}
                            fullWidth
                          >
                            Prendre une photo
                          </Button>
                        </Box>

                        {posterPreview && (
                          <Box sx={{ mt: 2 }}>
                            <img 
                              src={posterPreview} 
                              alt="Aperçu poster" 
                              style={{ 
                                width: '100%', 
                                maxHeight: '200px', 
                                objectFit: 'contain',
                                borderRadius: '8px'
                              }} 
                            />
                          </Box>
                        )}

                        {posterImage && (
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="contained"
                              onClick={analyzePosterImage}
                              disabled={isProcessingPoster}
                              startIcon={isProcessingPoster ? <CircularProgress size={20} /> : <CheckCircle />}
                              fullWidth
                            >
                              {isProcessingPoster ? 'Analyse en cours...' : 'Analyser l\'image'}
                            </Button>
                          </Box>
                        )}

                        {posterAnalysis && (
                          <Alert 
                            severity={posterAnalysis.includes('Erreur') ? 'error' : 'success'}
                            sx={{ mt: 2 }}
                          >
                            {posterAnalysis}
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Section Informations employeur */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Informations Employeur
                        </Typography>
                        
                        <TextField
                          fullWidth
                          label="Nom *"
                          value={employerInfo.nom}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, nom: e.target.value }))}
                          margin="normal"
                          required
                          size={isMobile ? "small" : "medium"}
                        />
                        
                        <TextField
                          fullWidth
                          label="Prénom *"
                          value={employerInfo.prenom}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, prenom: e.target.value }))}
                          margin="normal"
                          required
                          size={isMobile ? "small" : "medium"}
                        />
                        
                        <TextField
                          fullWidth
                          label="Téléphone *"
                          value={employerInfo.telephone}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, telephone: e.target.value }))}
                          margin="normal"
                          required
                          size={isMobile ? "small" : "medium"}
                        />
                        
                        <TextField
                          fullWidth
                          label="Email"
                          value={employerInfo.email}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, email: e.target.value }))}
                          margin="normal"
                          type="email"
                          size={isMobile ? "small" : "medium"}
                        />

                        <Divider sx={{ my: 2 }} />

                        {/* Section CNI */}
                        <Typography variant="subtitle1" gutterBottom>
                          Carte Nationale d'Identité
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="cni-upload"
                            type="file"
                            onChange={(e) => handleImageUpload(e, 'cni')}
                          />
                          <label htmlFor="cni-upload">
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<Upload />}
                              fullWidth
                              size={isMobile ? "small" : "medium"}
                              sx={{ mb: 1 }}
                            >
                              Choisir CNI
                            </Button>
                          </label>
                          
                          <Button
                            variant="outlined"
                            startIcon={<CameraAlt />}
                            onClick={() => handleCameraCapture('cni')}
                            fullWidth
                            size={isMobile ? "small" : "medium"}
                          >
                            Photographier CNI
                          </Button>
                        </Box>

                        {cniPreview && (
                          <Box sx={{ mt: 2 }}>
                            <img 
                              src={cniPreview} 
                              alt="Aperçu CNI" 
                              style={{ 
                                width: '100%', 
                                maxHeight: '150px', 
                                objectFit: 'contain',
                                borderRadius: '8px'
                              }} 
                            />
                          </Box>
                        )}

                        {cniImage && (
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="contained"
                              onClick={processCNIImage}
                              disabled={isProcessingCNI}
                              startIcon={isProcessingCNI ? <CircularProgress size={20} /> : <CheckCircle />}
                              fullWidth
                              size={isMobile ? "small" : "medium"}
                            >
                              {isProcessingCNI ? 'Traitement...' : 'Extraire les informations'}
                            </Button>
                          </Box>
                        )}

                        {cniResult && (
                          <Alert 
                            severity={cniResult.success ? 'success' : 'error'}
                            sx={{ mt: 2 }}
                          >
                            {cniResult.success 
                              ? `Informations extraites : ${cniResult.nom} ${cniResult.prenom}`
                              : cniResult.error
                            }
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Bouton de soumission */}
                <Box sx={{ mt: isMobile ? 2 : 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    sx={{
                      background: 'linear-gradient(45deg, #3498db, #2980b9)',
                      px: isMobile ? 3 : 4,
                      py: isMobile ? 1 : 1.5,
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2980b9, #1f5f8b)'
                      }
                    }}
                  >
                    Publier l'Offre d'Emploi
                  </Button>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
} 