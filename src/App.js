import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import StudyPlanner from './components/StudyPlanner';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" className="no-print">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">
              Planner
            </Button>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
          </Toolbar>
        </AppBar>

        <Container>
          <Routes>
            <Route path="/" element={<StudyPlanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App; 