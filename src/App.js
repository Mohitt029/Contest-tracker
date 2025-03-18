import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { lightTheme, darkTheme } from './themes';
import ContestList from './components/ContestList';
import ThemeToggle from './components/ThemeToggle';
import SolutionForm from './components/SolutionForm';

function AppContent() {
  const { darkMode } = React.useContext(ThemeContext);
  return (
    <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <ThemeToggle />
        <Routes>
          <Route exact path="/" element={<ContestList />} />
          <Route path="/add-solution" element={<SolutionForm />} />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;