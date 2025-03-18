import { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl } from '@mui/material';
import axios from 'axios';

const SolutionForm = () => {
  const [contests, setContests] = useState([]);
  const [contestId, setContestId] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/contests');
        setContests(data.filter((c) => new Date(c.endTime) < new Date()));
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchContests();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/solutions', { contestId, youtubeLink });
      setContestId('');
      setYoutubeLink('');
      alert('Solution link added!');
    } catch (err) {
      console.error('Error adding solution:', err);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <FormControl fullWidth>
        <Select
          value={contestId}
          onChange={(e) => setContestId(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>Select a contest</MenuItem>
          {contests.map((c) => (
            <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
          ))}
        </Select>
        <TextField
          label="YouTube Link"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </FormControl>
    </div>
  );
};

export default SolutionForm;