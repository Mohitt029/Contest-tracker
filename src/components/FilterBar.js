import { useState } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

const FilterBar = ({ setFilters }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const handleChange = (event) => {
    const platform = event.target.value;
    setSelectedPlatform(platform);
    setFilters(platform ? [platform] : []);
  };

  const platforms = ['Codeforces', 'CodeChef', 'LeetCode'];

  return (
    <FormControl component="fieldset" style={{ padding: '16px' }}>
      <RadioGroup row value={selectedPlatform} onChange={handleChange}>
        {platforms.map((platform) => (
          <FormControlLabel
            key={platform}
            value={platform}
            control={<Radio />}
            label={platform}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default FilterBar;