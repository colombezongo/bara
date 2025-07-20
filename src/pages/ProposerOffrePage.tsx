import React, { useState } from 'react';
import {
  Container,
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import { 
  CameraAlt, 
  Upload, 
  CheckCircle, 
  Error, 
  ArrowBack,
  Person,
  Work,
  LocationOn,
  Phone,
  WhatsApp,
  Email,
  Home
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LightPDFOCRService, OCRResult } from '../services/lightPDFOCRService';

interface EmployerInfo {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  whatsapp: string;
  adresse: string;
}

interface JobInfo {
  titre: string;
  profilRecherche: string;
  salaire: string;
  lieuTravail: string;
}

export default function ProposerOffrePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [employerInfo, setEmployerInfo] = useState<EmployerInfo>({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    whatsapp: '',
    adresse: ''
  });
  const [jobInfo, setJobInfo] = useState<JobInfo>({
    titre: '',
    profilRecherche: '',
    salaire: '',
    lieuTravail: ''
  });
  const [cniImage, setCniImage] = useState<File | null>(null);
  const [cniPreview, setCniPreview] = useState<string>('');
  const [isProcessingCNI, setIsProcessingCNI] = useState(false);
  const [cniResult, setCniResult] = useState<OCRResult | null>(null);
  const [cniDetected, setCniDetected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const steps = [
    {
      label: 'Informations Employeur',
      description: 'Renseignez vos informations personnelles et téléchargez votre CNI'
    },
    {
      label: 'Informations Emploi',
      description: 'Décrivez le poste à pourvoir'
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCniImage(file);
      setCniPreview(URL.createObjectURL(file));
      setCniResult(null);
      setCniDetected(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cni_capture.jpg', { type: 'image/jpeg' });
          setCniImage(file);
          setCniPreview(URL.createObjectURL(file));
          setCniResult(null);
          setCniDetected(false);
        }
      }, 'image/jpeg');

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Erreur lors de la capture:', error);
      setError('Impossible d\'accéder à la caméra');
    }
  };

  const processCNIImage = async () => {
    if (!cniImage) return;

    setIsProcessingCNI(true);
    setError(null);
    
    try {
      const result = await LightPDFOCRService.extractCNIInfo(cniImage);
      setCniResult(result);
      
      if (result.success) {
        setCniDetected(true);
        setEmployerInfo(prev => ({
          ...prev,
          nom: result.nom,
          prenom: result.prenom
        }));
        setSuccess('CNI détectée avec succès ! Vous pouvez passer à l\'étape suivante.');
      } else {
        setCniDetected(false);
        setError('CNI non détectée. Voulez-vous réessayer ou passer en mode partage non vérifié ?');
      }
    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      setCniDetected(false);
      setError('Erreur lors du traitement de l\'image. Voulez-vous réessayer ?');
    } finally {
      setIsProcessingCNI(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulation de sauvegarde en base de données
      const jobData = {
        ...employerInfo,
        ...jobInfo,
        isVerified: cniDetected,
        postedDate: new Date().toISOString(),
        id: Date.now().toString()
      };

      // Sauvegarder dans localStorage (simulation de base de données)
      const existingJobs = JSON.parse(localStorage.getItem('informalJobs') || '[]');
      existingJobs.push(jobData);
      localStorage.setItem('informalJobs', JSON.stringify(existingJobs));

      setSuccess('Offre d\'emploi publiée avec succès !');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError('Erreur lors de la publication de l\'offre');
    } finally {
      setIsSubmitting(false);
    }
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
      <Container maxWidth="lg" sx={{ py: isMobile ? 1 : 4, px: isMobile ? 1 : 3 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1.5 : 4 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{
                  color: '#3498db',
                  fontSize: isMobile ? '0.75rem' : '1rem',
                  px: isMobile ? 1 : 2,
                  py: isMobile ? 0.5 : 1,
                  '&:hover': {
                    backgroundColor: 'rgba(52, 152, 219, 0.1)'
                  }
                }}
              >
                {isMobile ? 'Retour' : 'Retour'}
              </Button>
            </Box>
          </motion.div>

          {/* Titre */}
          <motion.div variants={itemVariants}>
            <Typography
              variant={isMobile ? "h6" : "h3"}
              component="h1"
              gutterBottom
              align="center"
              sx={{
                color: '#2c3e50',
                fontWeight: 'bold',
                mb: isMobile ? 1.5 : 4,
                fontSize: isMobile ? '1.25rem' : '2.5rem',
                lineHeight: isMobile ? 1.3 : 1.2
              }}
            >
              Proposer une Offre
            </Typography>
          </motion.div>

          {/* Messages d'état */}
          {error && (
            <motion.div variants={itemVariants}>
              <Alert severity="error" sx={{ mb: 2, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                {error}
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div variants={itemVariants}>
              <Alert severity="success" sx={{ mb: 2, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                {success}
              </Alert>
            </motion.div>
          )}

          {/* Stepper */}
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              mb: isMobile ? 2 : 3, 
              borderRadius: isMobile ? 2 : 3,
              boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.1)' : '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ p: isMobile ? 1.5 : 3 }}>
                <Stepper 
                  activeStep={activeStep} 
                  orientation="horizontal"
                  sx={{
                    '& .MuiStepLabel-root': {
                      padding: isMobile ? '8px 0' : '16px 0'
                    }
                  }}
                >
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel>
                        <Typography 
                          variant={isMobile ? "subtitle2" : "h6"} 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: isMobile ? '0.875rem' : '1rem',
                            color: activeStep === index ? '#3498db' : '#2c3e50'
                          }}
                        >
                          
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: isMobile ? '0.7rem' : '0.875rem',
                            display: 'block',
                            mt: isMobile ? 0.5 : 1
                          }}
                        >
                          
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contenu des étapes */}
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              borderRadius: isMobile ? 2 : 3,
              boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.1)' : '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                {/* Étape 1: Informations Employeur */}
                {activeStep === 0 && (
                  <Box>
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      gutterBottom 
                      sx={{ 
                        mb: isMobile ? 2 : 3, 
                        color: '#2c3e50',
                        fontWeight: 600,
                        fontSize: isMobile ? '1rem' : '1.25rem'
                      }}
                    >
                      Informations Personnelles
                    </Typography>

                    <Grid container spacing={isMobile ? 1.5 : 3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nom"
                          value={employerInfo.nom}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, nom: e.target.value }))}
                          required
                          size="small"
                          sx={{ 
                            mb: isMobile ? 1.5 : 2,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Prénom"
                          value={employerInfo.prenom}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, prenom: e.target.value }))}
                          required
                          size="small"
                          sx={{ 
                            mb: isMobile ? 1.5 : 2,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Téléphone"
                          value={employerInfo.telephone}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, telephone: e.target.value }))}
                          required
                          size="small"
                          sx={{ 
                            mb: isMobile ? 1.5 : 2,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="WhatsApp (facultatif)"
                          value={employerInfo.whatsapp}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, whatsapp: e.target.value }))}
                          size="small"
                          sx={{ 
                            mb: isMobile ? 1.5 : 2,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email (facultatif)"
                          value={employerInfo.email}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, email: e.target.value }))}
                          type="email"
                          size="small"
                          sx={{ 
                            mb: isMobile ? 1.5 : 2,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Adresse"
                          value={employerInfo.adresse}
                          onChange={(e) => setEmployerInfo(prev => ({ ...prev, adresse: e.target.value }))}
                          required
                          multiline
                          rows={isMobile ? 2 : 3}
                          size="small"
                          sx={{ 
                            mb: isMobile ? 2 : 3,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: isMobile ? 2 : 3 }} />

                    {/* Section CNI */}
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      gutterBottom 
                      sx={{ 
                        mb: isMobile ? 2 : 3, 
                        color: '#2c3e50',
                        fontWeight: 600,
                        fontSize: isMobile ? '1rem' : '1.25rem'
                      }}
                    >
                      Carte Nationale d'Identité
                    </Typography>

                    <Grid container spacing={isMobile ? 1.5 : 3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="cni-upload"
                            type="file"
                            onChange={handleImageUpload}
                          />
                          <label htmlFor="cni-upload">
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<Upload />}
                              fullWidth
                              size="small"
                              sx={{ 
                                mb: 1,
                                fontSize: isMobile ? '0.75rem' : '0.875rem',
                                py: isMobile ? 0.75 : 1
                              }}
                            >
                              Choisir CNI
                            </Button>
                          </label>
                          
                          <Button
                            variant="outlined"
                            startIcon={<CameraAlt />}
                            onClick={handleCameraCapture}
                            fullWidth
                            size="small"
                            sx={{ 
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              py: isMobile ? 0.75 : 1
                            }}
                          >
                            Photographier CNI
                          </Button>
                        </Box>

                        {cniImage && (
                          <Button
                            variant="contained"
                            onClick={processCNIImage}
                            disabled={isProcessingCNI}
                            startIcon={isProcessingCNI ? <CircularProgress size={16} /> : <CheckCircle />}
                            fullWidth
                            size="small"
                            sx={{ 
                              mb: 2,
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              py: isMobile ? 0.75 : 1
                            }}
                          >
                            {isProcessingCNI ? 'Analyse...' : 'Analyser la CNI'}
                          </Button>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        {cniPreview && (
                          <Box>
                            <img 
                              src={cniPreview} 
                              alt="Aperçu CNI" 
                              style={{ 
                                width: '100%', 
                                maxHeight: isMobile ? '150px' : '200px', 
                                objectFit: 'contain',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0'
                              }} 
                            />
                          </Box>
                        )}
                      </Grid>
                    </Grid>

                    {cniResult && (
                      <Alert 
                        severity={cniDetected ? 'success' : 'warning'}
                        sx={{ 
                          mt: 2,
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}
                      >
                        {cniDetected 
                          ? `CNI détectée : ${cniResult.nom} ${cniResult.prenom}`
                          : 'CNI non détectée. Voulez-vous réessayer ou continuer en mode non vérifié ?'
                        }
                      </Alert>
                    )}

                    <Box sx={{ 
                      mt: isMobile ? 2 : 3, 
                      display: 'flex', 
                      gap: isMobile ? 1 : 2, 
                      justifyContent: 'flex-end',
                      flexDirection: isMobile ? 'column' : 'row'
                    }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/partager-emploi')}
                        size="small"
                        sx={{ 
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          py: isMobile ? 0.75 : 1,
                          px: isMobile ? 2 : 3
                        }}
                      >
                        Partager plutot une affiche
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!employerInfo.nom || !employerInfo.prenom || !employerInfo.telephone || !employerInfo.adresse}
                        size="small"
                        sx={{ 
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          py: isMobile ? 0.75 : 1,
                          px: isMobile ? 2 : 3
                        }}
                      >
                        Suivant
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Étape 2: Informations Emploi */}
                {activeStep === 1 && (
                  <Box>
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      gutterBottom 
                      sx={{ 
                        mb: isMobile ? 2 : 3, 
                        color: '#2c3e50',
                        fontWeight: 600,
                        fontSize: isMobile ? '1rem' : '1.25rem'
                      }}
                    >
                      Informations de l'Emploi
                    </Typography>

                    <Grid container spacing={isMobile ? 1.5 : 3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Titre du poste"
                          value={jobInfo.titre}
                          onChange={(e) => setJobInfo(prev => ({ ...prev, titre: e.target.value }))}
                          required
                          size="small"
                          sx={{ 
                            mb: isMobile ? 1.5 : 2,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Profil recherché"
                          value={jobInfo.profilRecherche}
                          onChange={(e) => setJobInfo(prev => ({ ...prev, profilRecherche: e.target.value }))}
                          required
                          multiline
                          rows={isMobile ? 3 : 4}
                          size="small"
                          sx={{ 
                            mb: isMobile ? 1.5 : 2,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Lieu de travail"
                          value={jobInfo.lieuTravail}
                          onChange={(e) => setJobInfo(prev => ({ ...prev, lieuTravail: e.target.value }))}
                          required
                          size="small"
                          sx={{ 
                            mb: isMobile ? 1.5 : 2,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Salaire (facultatif)"
                          value={jobInfo.salaire}
                          onChange={(e) => setJobInfo(prev => ({ ...prev, salaire: e.target.value }))}
                          size="small"
                          sx={{ 
                            mb: isMobile ? 1.5 : 2,
                            '& .MuiOutlinedInput-root': {
                              fontSize: isMobile ? '0.875rem' : '1rem'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ 
                      mt: isMobile ? 2 : 3, 
                      display: 'flex', 
                      gap: isMobile ? 1 : 2, 
                      justifyContent: 'space-between',
                      flexDirection: isMobile ? 'column' : 'row'
                    }}>
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        size="small"
                        sx={{ 
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          py: isMobile ? 0.75 : 1,
                          px: isMobile ? 2 : 3
                        }}
                      >
                        Retour
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !jobInfo.titre || !jobInfo.profilRecherche || !jobInfo.lieuTravail}
                        startIcon={isSubmitting ? <CircularProgress size={16} /> : <CheckCircle />}
                        size="small"
                        sx={{ 
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          py: isMobile ? 0.75 : 1,
                          px: isMobile ? 2 : 3
                        }}
                      >
                        {isSubmitting ? 'Publication...' : 'Publier l\'Offre'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
} 