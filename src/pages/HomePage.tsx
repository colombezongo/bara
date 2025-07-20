import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import ShareIcon from '@mui/icons-material/Share';
import baraLogo from '../assets/bara.png';
import ChatWidget from '../components/ChatWidget';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

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

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
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
      {/* Animated Background Elements */}
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
            top: '20%',
            left: '10%',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(52, 152, 219, 0.3)',
            animation: 'float 6s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            background: 'rgba(52, 152, 219, 0.2)',
            animation: 'float 8s ease-in-out infinite reverse',
          }
        }}
      />

      {/* Floating Circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(52, 152, 219, 0.1)',
          animation: 'pulse 4s ease-in-out infinite',
          zIndex: 0
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          left: '25%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'rgba(52, 152, 219, 0.15)',
          animation: 'bounce 5s ease-in-out infinite',
          zIndex: 0
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          left: '60%',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          background: 'rgba(52, 152, 219, 0.2)',
          animation: 'rotate 10s linear infinite',
          zIndex: 0
        }}
      />

      {/* NEW: Top Level Animations */}
      
      {/* Wave Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(52, 152, 219, 0.4), rgba(41, 128, 185, 0.2))',
          animation: 'wave 7s ease-in-out infinite',
          zIndex: 0
        }}
      />

      {/* Sparkle Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '30%',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(255, 193, 7, 0.8)',
          animation: 'sparkle 3s ease-in-out infinite',
          zIndex: 0
        }}
      />

      {/* Morphing Shape */}
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '70%',
          width: '35px',
          height: '35px',
          background: 'rgba(155, 89, 182, 0.3)',
          animation: 'morph 8s ease-in-out infinite',
          zIndex: 0
        }}
      />

      {/* Zigzag Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'rgba(46, 204, 113, 0.4)',
          animation: 'zigzag 6s ease-in-out infinite',
          zIndex: 0
        }}
      />

      {/* Glowing Element */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          background: 'rgba(231, 76, 60, 0.3)',
          animation: 'glow 4s ease-in-out infinite',
          zIndex: 0
        }}
      />

      {/* Star Shape */}
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          left: '15%',
          width: '0',
          height: '0',
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '30px solid rgba(52, 152, 219, 0.2)',
          animation: 'rotate 12s linear infinite',
          zIndex: 0
        }}
      />

      {/* Diamond Shape */}
      <Box
        sx={{
          position: 'absolute',
          top: '8%',
          left: '80%',
          width: '20px',
          height: '20px',
          background: 'rgba(52, 152, 219, 0.25)',
          transform: 'rotate(45deg)',
          animation: 'pulse 5s ease-in-out infinite',
          zIndex: 0
        }}
      />

      {/* Triangle Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: '0',
          height: '0',
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderBottom: '24px solid rgba(155, 89, 182, 0.3)',
          animation: 'bounce 7s ease-in-out infinite',
          zIndex: 0
        }}
      />

      {/* Animated Dots Grid */}
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
          backgroundSize: '200px 200px, 150px 150px, 180px 180px, 120px 120px, 160px 160px',
          animation: 'slide 20s linear infinite',
          zIndex: 0
        }}
      />

      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 0
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          py: 4
        }}
      >
              <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', textAlign: 'center' }}
        >
          {/* Logo */}
          <motion.div variants={logoVariants}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                mb: 6
                  }}
                >
                  <Box
                component="img"
                src={baraLogo}
                alt="Bara Logo"
                    sx={{
                  height: { xs: '180px', md: '180px' },
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))'
                  }
                }}
              />
                </Box>
              </motion.div>

          {/* Subtitle */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              sx={{
                color: '#7f8c8d',
                mb: 8,
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Trouvez votre opportunité professionnelle en Afrique
            </Typography>
          </motion.div>

          {/* Buttons Container */}
                <motion.div
            variants={itemVariants}
            style={{
                      display: 'flex',
                      flexDirection: 'column',
              gap: '2rem',
              alignItems: 'center',
              maxWidth: 500,
              margin: '0 auto'
            }}
          >
            
            {/* Chercher un emploi */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{ width: '100%' }}
            >
                  <Button
                    variant="contained"
                size="large"
                startIcon={<WorkIcon />}
                onClick={() => navigate('/chercher-emploi')}
                sx={{
                  width: '100%',
                  py: 2.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #3498db, #2980b9)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(52, 152, 219, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2980b9, #1f5f8b)',
                    boxShadow: '0 12px 40px rgba(52, 152, 219, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Je cherche de l'emploi
                  </Button>
            </motion.div>

            {/* Proposer une offre */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{ width: '100%' }}
            >
              <Button
                variant="outlined"
                size="large"
                startIcon={<BusinessIcon />}
                onClick={() => navigate('/proposer-offre')}
                sx={{
                  width: '100%',
                  py: 2.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  border: '2px solid #3498db',
                  borderRadius: '16px',
                  color: '#3498db',
                  background: 'rgba(52, 152, 219, 0.05)',
                  '&:hover': {
                    border: '2px solid #2980b9',
                    background: 'rgba(52, 152, 219, 0.1)',
                    color: '#2980b9',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Je propose une offre d'emploi
              </Button>
            </motion.div>


            
            {/* Partager un emploi */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{ width: '100%' }}
            >
              <Button
                variant="outlined"
                size="large"
                startIcon={<ShareIcon />}
                onClick={() => navigate('/partager-emploi')}
                sx={{
                  width: '100%',
                  py: 2.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  border: '2px solid #3498db',
                  borderRadius: '16px',
                  color: '#3498db',
                  background: 'rgba(52, 152, 219, 0.05)',
                  '&:hover': {
                    border: '2px solid #2980b9',
                    background: 'rgba(52, 152, 219, 0.1)',
                    color: '#2980b9',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Je partage un emploi
              </Button>
            </motion.div>
            
          </motion.div>
          </motion.div>
        </Container>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <Box
          sx={{
            py: 3,
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#7f8c8d',
              fontWeight: 400
            }}
          >
            © 2025 Bara par Wanda Labs. Tous droits réservés.
          </Typography>
      </Box>
      </motion.div>

      {/* Chat Widget */}
      <ChatWidget />
    </Box>
  );
};

export default HomePage; 