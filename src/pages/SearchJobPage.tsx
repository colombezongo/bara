import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Mic as MicIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  ArrowBack as ArrowBackIcon,
  Language as LanguageIcon,
  Translate as TranslateIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import { GeminiService } from '../services/geminiService';
import { VoiceRecognitionService } from '../services/voiceRecognitionService';
import type { VoiceRecognitionResult } from '../types/index';

// Types pour l'analyse de recherche
interface SearchAnalysis {
  keywords: string[]
  jobTypes: string[]
  locations: string[]
  skills: string[]
  workMode: string[]
  confidence: number
  originalLanguage: string
  translatedQuery: string
}



interface JobOffer {
  id: string;
  title: string;
  location: string;
  storeName?: string;
  country: string;
  workMode: string;
  requiredProfile: string;
  phone: string;
  whatsapp: string;
  isCertified: boolean;
  postedDate: string;
  translations?: {
    bambara: string;
    baoule: string;
  };
}

const SearchJobPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<JobOffer[]>([]);
  const [allJobs, setAllJobs] = useState<JobOffer[]>([]);
  const [selectedSector, setSelectedSector] = useState<'all' | 'verified' | 'unverified'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('fr-FR');
  const [translationInfo, setTranslationInfo] = useState<{originalLanguage?: string, translatedQuery?: string} | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Instances des services
  const geminiService = useMemo(() => new GeminiService(), []);
  const voiceRecognitionService = useMemo(() => new VoiceRecognitionService(), []);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Initialiser les données d'emploi
  useEffect(() => {
    // Forcer la réinitialisation pour s'assurer d'avoir toutes les offres
    localStorage.removeItem('informalJobs');
    
    const existingJobs = localStorage.getItem('informalJobs');
    if (!existingJobs) {
      // Créer des offres d'emploi d'exemple
      const sampleJobs: JobOffer[] = [
        {
          id: '9',
          title: 'TRAVAIL - Grande Entreprise de Cosmétique',
          location: 'Abidjan',
          storeName: 'Grande Entreprise de Cosmétique',
          country: 'Côte d\'Ivoire',
          workMode: 'Temps plein',
          requiredProfile: 'Jeunes filles et garçons pour des postes disponibles. Rien à payer. Possibilité logement. Transport et nourriture assurés.',
          phone: '+2250788615231',
          whatsapp: '+2250788615231',
          isCertified: false,
          postedDate: '2025-01-20',
          translations: {
            bambara: 'baarakɛla',
            baoule: 'wɛnwɛn'
          }
        },
        {
          id: '1',
          title: 'Servante',
          location: 'Abidjan, Cocody',
          storeName: 'Résidence Les Palmiers',
          country: 'Côte d\'Ivoire',
          workMode: 'Temps plein',
          requiredProfile: 'Femme expérimentée, ponctuelle, propre',
          phone: '+2250701234567',
          whatsapp: '+2250701234567',
          isCertified: true,
          postedDate: '2025-07-20',
          // Traductions en langues locales
          translations: {
            bambara: 'barakela',
            baoule: 'wɛnwɛn'
          }
        },
        {
          id: '2',
          title: 'Laveur de véhicules',
          location: 'Abidjan, Plateau',
          storeName: 'Station Total Plateau',
          country: 'Côte d\'Ivoire',
          workMode: '2 fois par semaine',
          requiredProfile: 'Homme jeune, dynamique, disponible',
          phone: '+2250702345678',
          whatsapp: '+2250702345678',
          isCertified: false,
          postedDate: '2024-01-14',
          translations: {
            bambara: 'mobilikɛla',
            baoule: 'mobilikɛla'
          }
        },
        {
          id: '3',
          title: 'Serveuse dans maquis',
          location: 'Abidjan, Yopougon',
          storeName: 'Maquis Chez Fatou',
          country: 'Côte d\'Ivoire',
          workMode: 'Temps plein',
          requiredProfile: 'Femme souriante, bonne présentation',
          phone: '+2250703456789',
          whatsapp: '+2250703456789',
          isCertified: false,
          postedDate: '2024-01-13',
          translations: {
            bambara: 'dumunikɛla',
            baoule: 'dumunikɛla'
          }
        },
        {
          id: '4',
          title: 'Gérant de magasin',
          location: 'Abidjan, Treichville',
          storeName: 'Boutique Mode Africaine',
          country: 'Côte d\'Ivoire',
          workMode: 'Temps plein',
          requiredProfile: 'Personne responsable, expérience en vente',
          phone: '+2250704567890',
          whatsapp: '+2250704567890',
          isCertified: false,
          postedDate: '2024-01-12',
          translations: {
            bambara: 'butikikɛla',
            baoule: 'butikikɛla'
          }
        },
        {
          id: '5',
          title: 'Cuisinier',
          location: 'Abidjan, Marcory',
          storeName: 'Restaurant Le Gourmet',
          country: 'Côte d\'Ivoire',
          workMode: 'Temps plein',
          requiredProfile: 'Cuisinier expérimenté, spécialité africaine',
          phone: '+2250705678901',
          whatsapp: '+2250705678901',
          isCertified: true,
          postedDate: '2024-01-11',
          translations: {
            bambara: 'dumunikɛla',
            baoule: 'dumunikɛla'
          }
        },
        {
          id: '6',
          title: 'Gardien',
          location: 'Abidjan, Riviera',
          storeName: 'Résidence Riviera 2',
          country: 'Côte d\'Ivoire',
          workMode: 'Temps plein',
          requiredProfile: 'Homme sérieux, disponible 24h/24',
          phone: '+2250706789012',
          whatsapp: '+2250706789012',
          isCertified: false,
          postedDate: '2024-01-10',
          translations: {
            bambara: 'sɔgɔsɔgɔkɛla',
            baoule: 'sɔgɔsɔgɔkɛla'
          }
        },
        {
          id: '7',
          title: 'Femme de ménage',
          location: 'Abidjan, Deux Plateaux',
          storeName: 'Villa Résidentielle',
          country: 'Côte d\'Ivoire',
          workMode: 'Temps partiel',
          requiredProfile: 'Femme propre, expérimentée en ménage',
          phone: '+2250707890123',
          whatsapp: '+2250707890123',
          isCertified: true,
          postedDate: '2024-01-09',
          translations: {
            bambara: 'soɔkɛla',
            baoule: 'soɔkɛla'
          }
        },
        {
          id: '8',
          title: 'Chauffeur',
          location: 'Abidjan, Zone 4',
          storeName: 'Entreprise de Transport',
          country: 'Côte d\'Ivoire',
          workMode: 'Temps plein',
          requiredProfile: 'Chauffeur expérimenté, permis B, ponctuel',
          phone: '+2250708901234',
          whatsapp: '+2250708901234',
          isCertified: false,
          postedDate: '2024-01-08',
          translations: {
            bambara: 'mobilikɛla',
            baoule: 'mobilikɛla'
          }
        },
        
      ];
      localStorage.setItem('informalJobs', JSON.stringify(sampleJobs));
      console.log('Chargement de', sampleJobs.length, 'offres d\'emploi');
      setAllJobs(sampleJobs);
      setFilteredJobs(sampleJobs);
    } else {
      const jobs = JSON.parse(existingJobs);
      console.log('Chargement de', jobs.length, 'offres d\'emploi depuis localStorage');
      setAllJobs(jobs);
      setFilteredJobs(jobs);
    }
  }, []);

  // Fonction utilitaire pour nettoyer la requête (supprimer la ponctuation en début/fin)
  function cleanQuery(text: string): string {
    return text.replace(/^[\s.,!?;:()\[\]{}"'`~@#$%^&*+=|\\<>/]+|[\s.,!?;:()\[\]{}"'`~@#$%^&*+=|\\<>/]+$/g, '').trim();
  }

  // Recherche et filtrage dynamique en temps réel avec IA automatique
  useEffect(() => {
    let filteredJobs = allJobs;

    // Debug: Afficher les données
    console.log('All jobs:', allJobs);
    console.log('Selected sector:', selectedSector);
    console.log('Search query:', searchQuery);

          // Si il y a une recherche, filtrer par mots-clés
      if (searchQuery.trim()) {
        const query = cleanQuery(searchQuery.toLowerCase().trim());
        console.log('Recherche pour:', query);
        
        filteredJobs = filteredJobs.filter((job: JobOffer) => {
          const jobText = [
            job.title,
            job.location,
            job.storeName || '',
            job.requiredProfile,
            job.workMode,
            job.country,
            // Inclure les traductions locales
            job.translations?.bambara || '',
            job.translations?.baoule || ''
          ].join(' ').toLowerCase();

          const hasMatch = jobText.includes(query);
          console.log(`Job "${job.title}": ${hasMatch ? 'MATCH' : 'NO MATCH'} pour "${query}"`);
          return hasMatch;
        });

      // Si aucun résultat avec la recherche simple, utiliser l'IA en arrière-plan
      if (filteredJobs.length === 0 && searchQuery.length > 3) {
        console.log('Aucun résultat simple, utilisation de l\'IA...');
        setIsLoading(true);
        
        // Délai pour éviter trop d'appels API
        const timeoutId = setTimeout(async () => {
          try {
            const analysis = await geminiService.analyzeSearchQuery(query, allJobs);
            console.log('Analyse IA:', analysis);

            // Sauvegarder les informations de traduction
            setTranslationInfo({
              originalLanguage: 'fr',
              translatedQuery: query
            });

            // Filtrer les emplois basé sur l'analyse
            const filteredJobs = geminiService.filterJobsByAnalysis(allJobs, analysis);
            setFilteredJobs(filteredJobs);
            // setSearchAnalysis(analysis); // This line was removed as per the new_code
            // setSearchPerformed(true); // This line was removed as per the new_code
          } catch (error) {
            console.error('Erreur analyse IA:', error);
            // Fallback vers la recherche simple
            const simpleFiltered = allJobs.filter(job =>
              job.title.toLowerCase().includes(query.toLowerCase()) ||
              job.location.toLowerCase().includes(query.toLowerCase()) ||
              job.requiredProfile.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredJobs(simpleFiltered);
            // setSearchPerformed(true); // This line was removed as per the new_code
          }
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }

    // Filtrage par vérification
    if (selectedSector !== 'all') {
      filteredJobs = filteredJobs.filter((job: JobOffer) => {
        const isVerified = selectedSector === 'verified' ? job.isCertified : !job.isCertified;
        console.log(`Job ${job.title}: isCertified=${job.isCertified}, selectedSector=${selectedSector}, isVerified=${isVerified}`);
        return isVerified;
      });
    }

    console.log('Filtered jobs:', filteredJobs);
    setFilteredJobs(filteredJobs);
  }, [selectedSector, allJobs, searchQuery, geminiService]);

  const handleWhatsApp = (phone: string) => {
    const message = encodeURIComponent('Bonjour, je suis intéressé par votre offre d\'emploi. Pouvez-vous me donner plus d\'informations ?');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  const getWorkModeColor = (mode: string) => {
    return mode.includes('Temps plein') ? 'success' : 'warning';
  };

  // Fonction pour démarrer la reconnaissance vocale
  const startVoiceRecognition = async () => {
    console.log('Tentative de démarrage de la reconnaissance vocale...');
    
    if (!voiceRecognitionService.isVoiceRecognitionSupported()) {
      setError('La reconnaissance vocale n\'est pas supportée par votre navigateur. Utilisez Chrome ou Edge.');
      return;
    }

    setIsListening(true);
    setVoiceTranscript('');
    setError(null);

    try {
      // Changer la langue de reconnaissance
      voiceRecognitionService.setLanguage(selectedLanguage);
      
      // Configurer la reconnaissance vocale avec détection automatique de fin
      voiceRecognitionService.setLanguage(selectedLanguage);
      
      const callbacks = {
        onResult: (result: VoiceRecognitionResult) => {
          console.log('Résultat reconnaissance vocale:', result);
          setVoiceTranscript(result.transcript);
          
          if (result.isFinal) {
            console.log('Reconnaissance vocale terminée - recherche automatique dans 5 secondes');
            
            // Démarrer la recherche automatiquement après 5 secondes de silence
            setTimeout(async () => {
              if (result.transcript.trim()) {
                try {
                  // Utiliser directement le transcript pour la recherche
                  console.log('Transcript vocal:', result.transcript); 
                  
                  // Effectuer la recherche avec le transcript
                  setSearchQuery(result.transcript);
                  setIsListening(false);
                  
                  // Déclencher la recherche
                  // handleSearch(result.transcript); // This line was removed as per the new_code
                  
                } catch (error) {
                  console.error('Erreur traitement vocal:', error);
                  setIsListening(false);
                }
              }
            }, 5000); // 5 secondes de délai
          }
        },
        onSilenceDetected: () => {
          console.log('Silence détecté - fin de parole');
          setIsListening(false);
        },
        onError: (error: string) => {
          console.error('Erreur reconnaissance vocale:', error);
          setError('Erreur lors de la reconnaissance vocale.');
          setIsListening(false);
        },
        onStart: () => {
          console.log('Reconnaissance vocale démarrée');
        },
        onEnd: () => {
          console.log('Reconnaissance vocale terminée');
          setIsListening(false);
        }
      };

      await voiceRecognitionService.startRecognition(callbacks);
    } catch (err) {
      console.error('Erreur reconnaissance vocale:', err);
      setError('Erreur lors de la reconnaissance vocale');
      setIsListening(false);
    }
  };

  // Fonction pour arrêter la reconnaissance vocale
  const stopVoiceRecognition = () => {
    voiceRecognitionService.stopRecognition();
    setIsListening(false);
    setVoiceTranscript('');
  };

  // Fonction pour changer la langue
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setLanguageMenuAnchor(null);
  };

  // Langues supportées limitées
  const supportedLanguages = [
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'bm-ML', name: 'Bambara', flag: '🇲🇱' },
    { code: 'bci-CI', name: 'Baoulé', flag: '🇨🇮' }
  ];

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredJobs(allJobs);
    setTranslationInfo(null);
    setError(null);
  };






  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        // CSS Animations inline
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' }
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.1 },
          '50%': { transform: 'scale(1.2)', opacity: 0.3 }
        },
        '@keyframes bounce': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        '@keyframes rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        '@keyframes slide': {
          '0%': { transform: 'translateX(0px) translateY(0px)' },
          '100%': { transform: 'translateX(-200px) translateY(-200px)' }
        },
        '@keyframes wave': {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateX(10px) translateY(-5px) rotate(90deg)' },
          '50%': { transform: 'translateX(0px) translateY(-10px) rotate(180deg)' },
          '75%': { transform: 'translateX(-10px) translateY(-5px) rotate(270deg)' }
        },
        '@keyframes sparkle': {
          '0%, 100%': { transform: 'scale(0) rotate(0deg)', opacity: 0 },
          '50%': { transform: 'scale(1) rotate(180deg)', opacity: 1 }
        },
        '@keyframes morph': {
          '0%, 100%': { borderRadius: '50%', transform: 'scale(1)' },
          '25%': { borderRadius: '25%', transform: 'scale(1.1)' },
          '50%': { borderRadius: '0%', transform: 'scale(0.9)' },
          '75%': { borderRadius: '25%', transform: 'scale(1.05)' }
        },
        '@keyframes zigzag': {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(20px) translateY(-10px)' },
          '50%': { transform: 'translateX(0px) translateY(-20px)' },
          '75%': { transform: 'translateX(-20px) translateY(-10px)' }
        },
        '@keyframes glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(52, 152, 219, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(52, 152, 219, 0.8)' }
        }
      }}
    >
      {/* Animated Background Elements - Optimisé pour mobile */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: isMobile ? '10%' : '20%',
            left: isMobile ? '5%' : '10%',
            width: isMobile ? '15px' : '20px',
            height: isMobile ? '15px' : '20px',
            borderRadius: '50%',
            background: 'rgba(52, 152, 219, 0.3)',
            animation: 'float 6s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: isMobile ? '70%' : '60%',
            right: isMobile ? '10%' : '15%',
            width: isMobile ? '12px' : '15px',
            height: isMobile ? '12px' : '15px',
            borderRadius: '50%',
            background: 'rgba(52, 152, 219, 0.2)',
            animation: 'float 8s ease-in-out infinite reverse',
          }
        }}
      />

      {/* Floating Circles - Optimisé pour mobile */}
      <Box
        sx={{
          position: 'absolute',
          top: isMobile ? '20%' : '30%',
          right: isMobile ? '15%' : '20%',
          width: isMobile ? '30px' : '40px',
          height: isMobile ? '30px' : '40px',
          borderRadius: '50%',
          background: 'rgba(52, 152, 219, 0.1)',
          animation: 'pulse 4s ease-in-out infinite',
          zIndex: 0
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: isMobile ? '15%' : '25%',
          left: isMobile ? '20%' : '25%',
          width: isMobile ? '25px' : '30px',
          height: isMobile ? '25px' : '30px',
          borderRadius: '50%',
          background: 'rgba(52, 152, 219, 0.15)',
          animation: 'bounce 5s ease-in-out infinite',
          zIndex: 0
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: isMobile ? '80%' : '70%',
          left: isMobile ? '50%' : '60%',
          width: isMobile ? '20px' : '25px',
          height: isMobile ? '20px' : '25px',
          borderRadius: '50%',
          background: 'rgba(52, 152, 219, 0.2)',
          animation: 'rotate 10s linear infinite',
          zIndex: 0
        }}
      />

      {/* Animated Dots Grid - Optimisé pour mobile */}
        <Box
          sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(52, 152, 219, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, rgba(52, 152, 219, 0.08) 1px, transparent 1px),
            radial-gradient(circle at 40% 70%, rgba(52, 152, 219, 0.12) 1.5px, transparent 1.5px),
            radial-gradient(circle at 90% 80%, rgba(52, 152, 219, 0.06) 1px, transparent 1px),
            radial-gradient(circle at 10% 90%, rgba(52, 152, 219, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: isMobile ? '150px 150px, 100px 100px, 120px 120px, 80px 80px, 100px 100px' : '200px 200px, 150px 150px, 180px 180px, 120px 120px, 160px 160px',
          animation: 'slide 20s linear infinite',
          zIndex: 0
        }}
      />

      {/* Contenu principal */}
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          py: isMobile ? 2 : 4
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%' }}
        >
          {/* Header avec bouton retour - Optimisé pour mobile */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: isMobile ? 2 : 3
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
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

          {/* Titre - Optimisé pour mobile */}
          <motion.div variants={itemVariants}>
          <Typography
              variant={isMobile ? "h5" : "h3"}
            component="h1"
            gutterBottom
            sx={{
              textAlign: 'center',
              color: '#2c3e50',
              fontWeight: 'bold',
                mb: isMobile ? 2 : 4,
                fontSize: isMobile ? '1.5rem' : '2.5rem'
            }}
          >
              🔍 Recherche d'Emploi
          </Typography>
          </motion.div>

          {/* Filtres par certification - Optimisé pour mobile */}
          <motion.div variants={itemVariants}>
          <Box
            sx={{
              display: 'flex',
                justifyContent: 'center',
                gap: isMobile ? 1 : 2,
                mb: isMobile ? 2 : 4,
                flexWrap: 'wrap',
                px: isMobile ? 1 : 0
              }}
            >
              <Button
                variant={selectedSector === 'all' ? 'contained' : 'outlined'}
                onClick={() => setSelectedSector('all')}
                sx={{
                  borderRadius: 2,
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 0.5 : 1,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  minWidth: isMobile ? 'auto' : '120px'
                }}
              >
                Tous
              </Button>
              <Button
                variant={selectedSector === 'verified' ? 'contained' : 'outlined'}
                onClick={() => setSelectedSector('verified')}
                sx={{
                  borderRadius: 2,
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 0.5 : 1,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  minWidth: isMobile ? 'auto' : '120px'
                }}
              >
                Vérifiés
              </Button>
              <Button
                variant={selectedSector === 'unverified' ? 'contained' : 'outlined'}
                onClick={() => setSelectedSector('unverified')}
                sx={{
                  borderRadius: 2,
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 0.5 : 1,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  minWidth: isMobile ? 'auto' : '120px'
                }}
              >
                Non vérifiés
              </Button>
            </Box>
          </motion.div>

          {/* Moteur de recherche - Optimisé pour mobile */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 3,
                p: isMobile ? 2 : 3,
                mb: isMobile ? 2 : 4,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Affichage des erreurs */}
              {error && (
                <Alert severity="warning" sx={{ mb: 2, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ 
                display: 'flex', 
                gap: isMobile ? 1 : 2, 
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
            <TextField
              fullWidth
              variant="outlined"
                  placeholder={isMobile ? "Tapez ou parlez votre recherche..." : "Ex: 'je cherche un travail de servante' ou parlez directement..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#3498db', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* Bouton de reconnaissance vocale */}
                          <Tooltip title={
                            !voiceRecognitionService.isVoiceRecognitionSupported() 
                              ? "Reconnaissance vocale non supportée" 
                              : isListening 
                                ? "Arrêter l'écoute" 
                                : "Recherche vocale"
                          }>
                            <IconButton
                              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                              disabled={!voiceRecognitionService.isVoiceRecognitionSupported()}
                              sx={{
                                color: !voiceRecognitionService.isVoiceRecognitionSupported() 
                                  ? '#bdc3c7' 
                                  : isListening 
                                    ? '#e74c3c' 
                                    : '#3498db',
                                '&:hover': {
                                  backgroundColor: !voiceRecognitionService.isVoiceRecognitionSupported()
                                    ? 'transparent'
                                    : isListening 
                                      ? 'rgba(231, 76, 60, 0.1)' 
                                      : 'rgba(52, 152, 219, 0.1)'
                                }
                              }}
                            >
                              {isListening ? <StopIcon /> : <MicIcon />}
                            </IconButton>
                          </Tooltip>
                          
                          {/* Bouton de sélection de langue */}
                          <Tooltip title="Changer la langue">
                            <IconButton
                              onClick={(e) => setLanguageMenuAnchor(e.currentTarget)}
                              sx={{
                                color: '#3498db',
                                '&:hover': {
                                  backgroundColor: 'rgba(52, 152, 219, 0.1)'
                                }
                              }}
                            >
                              <LanguageIcon />
                    </IconButton>
                          </Tooltip>
                        </Box>
                  </InputAdornment>
                )
              }}
            />
          </Box>

              {/* Affichage du transcript vocal en temps réel */}
              {isListening && (
                <Box sx={{ mt: 2, p: 2, background: 'rgba(52, 152, 219, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                    🎤 Écoute en cours...
                    {voiceTranscript && ` "${voiceTranscript}"`}
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', display: 'block', mt: 1 }}>
                    Langue: {supportedLanguages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage}
                  </Typography>
                </Box>
              )}

              {/* Affichage des informations de traduction */}
              {translationInfo && (translationInfo.originalLanguage !== 'fr' || translationInfo.translatedQuery !== searchQuery) && (
                <Box sx={{ mt: 2, p: 2, background: 'rgba(46, 204, 113, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                    <TranslateIcon sx={{ fontSize: '1rem', mr: 1, verticalAlign: 'middle' }} />
                    Traduit de {translationInfo.originalLanguage} vers français: "{translationInfo.translatedQuery}"
                  </Typography>
                </Box>
              )}

              {/* Bouton pour effacer la recherche */}
              {searchQuery.trim() && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearSearch}
                    sx={{
                      fontSize: isMobile ? '0.7rem' : '0.75rem',
                      color: '#e74c3c',
                      borderColor: '#e74c3c',
                      '&:hover': {
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderColor: '#c0392b'
                      }
                    }}
                  >
                    Effacer la recherche
                  </Button>
                </Box>
              )}

              {/* Statistiques et mots-clés détectés - Optimisé pour mobile */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
              {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
                  {selectedSector !== 'all' && ` (${selectedSector === 'verified' ? 'postes vérifiés' : 'postes non vérifiés'})`}
                  {!searchQuery && selectedSector === 'all' && ` (${allJobs.length} total)`}
                  {searchQuery && filteredJobs.length === 0 && ' - Aucun résultat trouvé'}
                </Typography>
                
                {/* Indicateur de recherche en temps réel */}
                {searchQuery && (
                  <Typography variant="caption" color="primary" sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', display: 'block', mt: 1 }}>
                    🔍 Recherche en temps réel active
                    {isLoading && ' - IA en cours d\'analyse...'}
                  </Typography>
                )}
                
                {/* Afficher les mots-clés détectés */}
                {searchQuery.trim() && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
                      Mots-clés: {searchQuery.split(' ').filter(word => word.length > 3).join(', ')}
            </Typography>
                  </Box>
                )}
          </Box>
        </Box>
          </motion.div>

          {/* Liste des offres d'emploi - Optimisé pour mobile */}
          <Grid container spacing={isMobile ? 2 : 3}>
            {filteredJobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  custom={index}
                >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                      overflow: 'visible',
                      cursor: 'pointer'
                }}
              >
                    {/* Étoile pour postes vérifiés - Optimisé pour mobile */}
                    {job.isCertified && (
                  <Box
                    sx={{
                      position: 'absolute',
                          top: isMobile ? 5 : 10,
                          right: isMobile ? 5 : 10,
                      zIndex: 1
                    }}
                  >
                        <StarIcon 
                      sx={{
                            color: '#e6c202', 
                            fontSize: isMobile ? '1.5rem' : '2rem',
                            marginTop: isMobile ? '15px' : '30px',
                            marginRight: isMobile ? '15px' : '30px'
                      }}
                    />
                  </Box>
                )}

                    <CardContent sx={{ flexGrow: 1, p: isMobile ? 2 : 3, pt: isMobile ? 4 : 6 }}>
                      {/* Titre du poste - Optimisé pour mobile */}
                  <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                    component="h2"
                    gutterBottom
                    sx={{
                          color: '#34495e',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                          gap: 1,
                          fontSize: isMobile ? '1rem' : '1.25rem'
                    }}
                  >
                        <WorkIcon sx={{ color: '#3498db', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                    {job.title}
                  </Typography>

                      {/* Informations principales - Optimisé pour mobile */}
                      <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon sx={{ color: '#e74c3c', mr: 1, fontSize: isMobile ? '0.875rem' : 'small' }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                        {job.location}
                      </Typography>
                    </Box>

                    {job.storeName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ color: '#9b59b6', mr: 1, fontSize: isMobile ? '0.875rem' : 'small' }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                          {job.storeName}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ScheduleIcon sx={{ color: '#f39c12', mr: 1, fontSize: isMobile ? '0.875rem' : 'small' }} />
                      <Chip
                        label={job.workMode}
                        size="small"
                        color={getWorkModeColor(job.workMode) as any}
                            sx={{ fontSize: isMobile ? '0.6rem' : '0.7rem' }}
                      />
                    </Box>
                  </Box>

                      {/* Profil recherché - Optimisé pour mobile */}
                      <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon sx={{ color: '#27ae60', mr: 1, fontSize: isMobile ? '0.875rem' : 'small' }} />
                          <Typography variant="body2" fontWeight="bold" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                        Profil recherché:
                      </Typography>
                    </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ pl: 2, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                      {job.requiredProfile}
                    </Typography>
                  </Box>

                      {/* Informations de contact - Optimisé pour mobile */}
                  <Box sx={{ mt: 'auto' }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}>
                          Posté le: {new Date(job.postedDate).toLocaleDateString()}
                    </Typography>

                        {/* Boutons d'action - Optimisé pour mobile */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                            mt: isMobile ? 1.5 : 2,
                            flexDirection: isMobile ? 'column' : 'row'
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => handleWhatsApp(job.whatsapp)}
                        sx={{
                          background: '#25d366',
                              fontSize: isMobile ? '0.7rem' : '0.875rem',
                          '&:hover': { background: '#128c7e' },
                          flex: 1
                        }}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PhoneIcon />}
                        onClick={() => handleCall(job.phone)}
                        sx={{
                          borderColor: '#3498db',
                          color: '#3498db',
                              fontSize: isMobile ? '0.7rem' : '0.875rem',
                          '&:hover': {
                            borderColor: '#2980b9',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)'
                          },
                          flex: 1
                        }}
                      >
                        Appeler
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
                </motion.div>
            </Grid>
          ))}
        </Grid>

          {/* Message si aucune offre trouvée - Optimisé pour mobile */}
          {filteredJobs.length === 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
          <Box
            sx={{
              textAlign: 'center',
                  mt: isMobile ? 2 : 4,
                  p: isMobile ? 2 : 4,
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 3
            }}
          >
                <Typography variant={isMobile ? "h6" : "h5"} color="text.secondary" gutterBottom>
                  Aucune offre trouvée
            </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  {searchQuery 
                    ? `Aucune offre trouvée pour "${searchQuery}"`
                    : 'Aucune offre disponible dans ce secteur'
                  }
            </Typography>
          </Box>
            </motion.div>
        )}
        </motion.div>
      </Container>

      {/* Menu de sélection de langue - Langues limitées */}
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={() => setLanguageMenuAnchor(null)}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        }}
      >
        {supportedLanguages.map((lang) => (
          <MenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText 
              primary={`${lang.flag} ${lang.name}`}
              secondary={selectedLanguage === lang.code ? 'Sélectionné' : ''}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SearchJobPage; 