import { useState } from 'react';
import { IconButton } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import axios from 'axios';

const BookmarkButton = ({ contestId, bookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);

  const handleBookmark = async () => {
    try {
      await axios.put(`http://localhost:5000/api/contests/${contestId}/bookmark`, {
        bookmarked: !isBookmarked,
      });
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  return (
    <IconButton onClick={handleBookmark}>
      {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </IconButton>
  );
};

export default BookmarkButton;