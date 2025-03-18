require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Contest = require('./models/Contest');
const contestRoutes = require('./routes/contestRoutes');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const fetchContests = async () => {
  const platforms = [
    { name: 'Codeforces', url: 'https://codeforces.com/api/contest.list' },
    { name: 'CodeChef', url: 'https://www.codechef.com/api/list/contests/all' },
    { name: 'LeetCode', url: 'https://www.leetcode.com/api/list/contests/all' },
  ];

  for (const platform of platforms) {
    try {
      const { data } = await axios.get(platform.url, { timeout: 10000 });
      console.log(`${platform.name} raw response:`, data); // Debug raw data
      let contests = [];

      if (platform.name === 'Codeforces' && data.status === 'OK') {
        contests = data.result.map((c) => ({
          title: c.name,
          platform: 'Codeforces',
          startTime: new Date(c.startTimeSeconds * 1000),
          endTime: new Date((c.startTimeSeconds + c.durationSeconds) * 1000),
          duration: c.durationSeconds,
        }));
      } else if (platform.name === 'CodeChef') {
        let contestData = data;
        if (typeof data === 'string' || !data) {
          throw new Error('CodeChef response is invalid (HTML or empty)');
        }
        if (!Array.isArray(data)) {
          if (data.contests) contestData = data.contests;
          else if (data.result) contestData = data.result;
          else throw new Error('CodeChef data format unrecognized');
        }
        if (!Array.isArray(contestData)) throw new Error('CodeChef parsed data is still not an array');
        contests = contestData.map((c) => ({
          title: c.name || c.title || 'Unnamed CodeChef Contest',
          platform: 'CodeChef',
          startTime: new Date(c.start_time || c.startTime),
          endTime: new Date(c.end_time || c.endTime),
          duration: Math.round((new Date(c.end_time || c.endTime) - new Date(c.start_time || c.startTime)) / 1000),
        }));
      } else if (platform.name === 'LeetCode') {
        let contestData = data;
        if (typeof data === 'string' || !data) {
          throw new Error('LeetCode response is invalid (HTML or empty)');
        }
        if (!Array.isArray(data)) {
          if (data.contests) contestData = data.contests;
          else if (data.result) contestData = data.result;
          else throw new Error('LeetCode data format unrecognized');
        }
        if (!Array.isArray(contestData)) throw new Error('LeetCode parsed data is still not an array');
        contests = contestData.map((c) => ({
          title: c.name || c.title || 'Unnamed LeetCode Contest',
          platform: 'LeetCode',
          startTime: new Date(c.start_time || c.startTime),
          endTime: new Date(c.end_time || c.endTime),
          duration: Math.round((new Date(c.end_time || c.endTime) - new Date(c.start_time || c.startTime)) / 1000),
        }));
      }

      await Promise.all(
        contests.map((contest) =>
          Contest.updateOne(
            { title: contest.title, platform: contest.platform },
            contest,
            { upsert: true }
          )
        )
      );
      console.log(`${platform.name} contests fetched and saved: ${contests.length}`);
    } catch (err) {
      console.error(`Error fetching ${platform.name}: ${err.message}`);
      console.error(`Falling back to test data for ${platform.name}`);
      let contests = [];
      if (platform.name === 'CodeChef') {
        contests = [
          {
            title: 'CodeChef Starters Test',
            platform: 'CodeChef',
            startTime: new Date('2025-03-20T10:00:00Z'),
            endTime: new Date('2025-03-20T12:00:00Z'),
            duration: 7200,
          },
          {
            title: 'CodeChef Lunchtime Test',
            platform: 'CodeChef',
            startTime: new Date('2025-03-22T14:00:00Z'),
            endTime: new Date('2025-03-22T17:00:00Z'),
            duration: 10800,
          },
        ];
      } else if (platform.name === 'LeetCode') {
        contests = [
          {
            title: 'LeetCode Weekly Contest Test',
            platform: 'LeetCode',
            startTime: new Date('2025-03-21T14:00:00Z'),
            endTime: new Date('2025-03-21T15:30:00Z'),
            duration: 5400,
          },
          {
            title: 'LeetCode Biweekly Contest Test',
            platform: 'LeetCode',
            startTime: new Date('2025-03-23T10:00:00Z'),
            endTime: new Date('2025-03-23T11:30:00Z'),
            duration: 5400,
          },
        ];
      }
      await Promise.all(
        contests.map((contest) =>
          Contest.updateOne(
            { title: contest.title, platform: contest.platform },
            contest,
            { upsert: true }
          )
        )
      );
      console.log(`${platform.name} fallback contests saved: ${contests.length}`);
    }
  }
};

app.use('/api', contestRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
  fetchContests();
  setInterval(fetchContests, 24 * 60 * 60 * 1000); // Daily refresh
});