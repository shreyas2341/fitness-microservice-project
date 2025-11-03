import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { setCredentials } from "./store/authSlice";
import ActivityDetail from "./components/ActivityDetail";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";

const ActivitiesPage = () => {
  // Use a refreshKey to trigger ActivityList re-fetch without a full page reload
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityAdded = () => {
    // bump the key to trigger children to refresh
    setRefreshKey((k) => k + 1);
  };

  return (
    <Box 
      component="section" 
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '20px',
        p: 4,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <ActivityForm onActivityAdded={handleActivityAdded} />
      <ActivityList refreshKey={refreshKey} />
    </Box>
  );
}

function App() {
  // HeaderControls must be rendered inside Router (so it can use useNavigate)
  const HeaderControls = () => {
    const navigate = useNavigate();
    return (
      <Box sx={{ position: 'absolute', left: 16, top: 18 }}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mr: 1, backgroundColor: 'rgba(255,255,255,0.9)', color: '#1976d2' }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/activities')}
          sx={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#1976d2' }}
        >
          Home
        </Button>
      </Box>
    );
  };
 const { token, tokenData, logIn, logOut, isAuthenticated} = useContext(AuthContext);
 const dispatch = useDispatch();
 const [authReady, setAuthReady] = useState(false);

 useEffect(() => {
  if(token) {
    dispatch(setCredentials({token, user: tokenData}));
    setAuthReady(true);
  }
 }, [token, tokenData, dispatch]);
  return (
    <Router>
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          position: 'relative'
        }}
      >
        {/* App Title - shown on all pages */}
        <Box 
          sx={{ 
            textAlign: 'center',
            pt: 3,
            pb: 2,
            color: 'white'
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              mb: 1
            }}
          >
            Fitness Tracker
          </Typography>
        </Box>

        {/* Header controls (Back / Home) - displayed on every page */}
        <HeaderControls />

        {!token ? (
          // Welcome/Login Page
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              px: 3
            }}
          >
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '20px',
                p: 4,
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px',
                width: '100%'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#1976d2',
                  mb: 3,
                  fontWeight: 600
                }}
              >
                Welcome!
              </Typography>
              <Typography 
                sx={{ 
                  mb: 4,
                  color: '#555'
                }}
              >
                Track your fitness journey with our comprehensive activity tracker. Login to get started!
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => {
                  // call logIn via wrapper to ensure it runs when clicked
                  try {
                    if (typeof logIn === 'function') logIn();
                    else console.warn('logIn is not a function', logIn);
                  } catch (e) {
                    console.error('logIn failed', e);
                  }
                }}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #0d47a1)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  }
                }}
              >
                Login to Continue
              </Button>
            </Box>
          </Box>
        ) : (
          <Box 
            component="section" 
            sx={{ 
              p: 3,
              mx: 'auto',
              maxWidth: '1200px'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                mb: 3
              }}
            >
              <Button 
                variant="contained" 
                onClick={logOut}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  }
                }}
              >
                Logout
              </Button>
            </Box>

            <Routes>
              <Route path="/activities" element={<ActivitiesPage/>}/>
              <Route path="/activities/:id" element={<ActivityDetail/>}/>
              <Route path="/" element={<Navigate to="/activities" replace/>}/>
              <Route path="*" element={<Navigate to="/activities" replace/>}/>
            </Routes>
          </Box>
        )}

        {/* Developer Signature - shown on all pages */}
        <Box 
          sx={{ 
            position: 'fixed',
            bottom: 0,
            width: '100%',
            textAlign: 'center',
            py: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <Typography 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem'
            }}
          >
            <b>Developed by - <a href="https://www.linkedin.com/in/a51778200/">Shreyas Nikam</a></b>
          </Typography>
        </Box>
      </Box>
    </Router>
  )
}

export default App
