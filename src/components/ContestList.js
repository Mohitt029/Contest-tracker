import { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, Container, Card, CardContent, Box, keyframes } from '@mui/material';
import BookmarkButton from './BookmarkButton';
import FilterBar from './FilterBar';

// Animation keyframes
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const bounceIn = keyframes`
  0% { transform: scale(0.9); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
`;

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const url = filters.length > 0 
          ? `http://localhost:5000/api/contests?platforms=${filters.join(',')}`
          : 'http://localhost:5000/api/contests';
        const response = await axios.get(url);
        console.log('API Response:', response.data);
        setContests(response.data);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setContests([]);
      }
    };
    fetchContests();
  }, [filters]);

  const getTimeRemaining = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    if (diff <= 0) return 'Started';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  // Platform-specific colors
  const platformColors = {
    Codeforces: '#00BCD4', // Cyan
    CodeChef: '#FF9800',   // Deep Orange
    LeetCode: '#8BC34A',   // Light Green
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        background: 'linear-gradient(135deg, #FFEB3B, #F06292, #4FC3F7)',
        backgroundSize: '200% 200%',
        animation: `${gradientShift} 15s ease infinite`,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          background: 'linear-gradient(45deg, #FF4081, #3F51B5, #FFC107)',
          backgroundSize: '200% 200%',
          animation: `${gradientShift} 10s ease infinite`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        Contest Tracker
      </Typography>
      <FilterBar setFilters={setFilters} />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {contests.length > 0 ? (
          contests.map((contest, index) => {
            const now = new Date();
            const start = new Date(contest.startTime);
            const diff = start - now; // Define diff here for this contest
            return (
              <Grid item xs={12} sm={6} md={4} key={contest._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: `linear-gradient(135deg, ${platformColors[contest.platform]}22, #FFFFFF)`,
                    border: `2px solid ${platformColors[contest.platform] || '#757575'}`,
                    borderRadius: 2,
                    animation: `${bounceIn} 0.5s ease ${index * 0.1}s both`,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 10px 20px ${platformColors[contest.platform]}66`,
                      background: `linear-gradient(135deg, ${platformColors[contest.platform]}44, #FFFFFF)`,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: platformColors[contest.platform] || '#757575',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      {contest.title}
                    </Typography>
                    <Typography sx={{ color: '#212121', fontWeight: 'medium' }}>
                      Platform:{' '}
                      <span style={{ color: platformColors[contest.platform], fontWeight: 'bold' }}>
                        {contest.platform}
                      </span>
                    </Typography>
                    <Typography sx={{ color: '#212121' }}>
                      Start:{' '}
                      <span style={{ color: '#E91E63', fontWeight: 'medium' }}>
                        {new Date(contest.startTime).toLocaleString()}
                      </span>
                    </Typography>
                    <Typography sx={{ color: '#212121' }}>
                      Time Remaining:{' '}
                      <span
                        style={{
                          color: diff > 0 ? '#4CAF50' : '#F44336', // Use diff here
                          fontWeight: 'bold',
                        }}
                      >
                        {getTimeRemaining(contest.startTime)}
                      </span>
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, textAlign: 'right' }}>
                    <BookmarkButton contestId={contest._id} bookmarked={contest.bookmarked} />
                  </Box>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Typography
              align="center"
              sx={{
                color: '#FF5722',
                fontWeight: 'bold',
                background: 'rgba(255,255,255,0.8)',
                p: 1,
                borderRadius: 1,
              }}
            >
              No contests available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ContestList;