const express = require('express');
const axios = require('axios');

const app = express();

async function fetchLeetcodeBadges(username) {
    const graphqlQuery = {
        query: `
        query userBadges($username: String!) {
            matchedUser(username: $username) {
                badges {
                    id
                    name
                    shortName
                    displayName
                    icon
                    hoverText
                    medal {
                        slug
                        config {
                            iconGif
                            iconGifBackground
                        }
                    }
                    creationDate
                    category
                }
                upcomingBadges {
                    name
                    icon
                    progress
                }
            }
        } 
        `,
        variables: { username }
    };

    const api_url = 'https://leetcode.com/graphql';
    try {
        const response = await axios.post(api_url, graphqlQuery, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch LeetCode badges');
    }
}

async function fetchLeetcodeProfile(username) {
    const graphqlQuery = {
        query: `
        query userProblemsSolved($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                problemsSolvedBeatsStats {
                    difficulty
                    percentage
                }
                submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        } 
        `,
        variables: { username: username }
    };

    const api_url = 'https://leetcode.com/graphql';
    try {
        const response = await axios.post(api_url, graphqlQuery, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch LeetCode profile');
    }
}

function generateSvgContent(username, profileData) {
  const { matchedUser, allQuestionsCount } = profileData.data;
  const easySolved = matchedUser.submitStatsGlobal.acSubmissionNum.find(num => num.difficulty === 'Easy').count;
  const mediumSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find(num => num.difficulty === 'Medium').count;
  const hardSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find(num => num.difficulty === 'Hard').count;
  const totalSolved = easySolved + mediumSolved + hardSolved;

  const easyTotal = allQuestionsCount.find(q => q.difficulty === 'Easy').count;
  const mediumTotal = allQuestionsCount.find(q => q.difficulty === 'Medium').count;
  const hardTotal = allQuestionsCount.find(q => q.difficulty === 'Hard').count;
  const totalQuestions = easyTotal + mediumTotal + hardTotal;

  return `
  <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'
      style='isolation: isolate' viewBox='0 0 495 195' width='495px' height='195px' direction='ltr'>
      <style>
          @keyframes fadein {
              0% { opacity: 0; }
              100% { opacity: 1; }
          }
      </style>
      <defs>
          <clipPath id='outer_rectangle'>
              <rect width='495' height='195' rx='4.5'/>
          </clipPath>
      </defs>
      <g clip-path='url(#outer_rectangle)'>
          <rect stroke='#E4E2E2' fill='#050F2C' rx='4.5' x='0.5' y='0.5' width='494' height='194'/>
          <!-- Username -->
          <g transform='translate(247.5, 15)'>
              <a xlink:href='https://leetcode.com/${username}/' target='_blank'>
                  <text x='0' y='21' stroke-width='0' text-anchor='middle' fill='#FFFFFF' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='700' font-size='24px' font-style='normal'>
                      ${username}
                  </text>
              </a>
          </g>
          <g>
              <!-- Total Solved label -->
              <g transform='translate(82.5, 54)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#00AEFF' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='20px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.7s'>
                      Total Solved
                  </text>
              </g>

              <!-- Total Solved out of total questions -->
              <g transform='translate(82.5, 100)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#FFFFFF' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='20px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.8s'>
                      ${totalSolved} / ${totalQuestions}
                  </text>
              </g>
          </g>
          <g>
              <!-- Easy Solved -->
              <g transform='translate(330, 48)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#66ccff' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='700' font-size='28px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s'>
                      ${easySolved}
                  </text>
              </g>

              <!-- Easy label -->
              <g transform='translate(330, 84)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#66ccff' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='14px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.7s'>
                      Easy
                  </text>
              </g>

              <!-- Easy out of total easy questions -->
              <g transform='translate(330, 114)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#FFFFFF' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='12px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.8s'>
                      ${easySolved}/${easyTotal}
                  </text>
              </g>
          </g>
          <g>
              <!-- Medium Solved -->
              <g transform='translate(247.5, 48)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#ffcc00' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='700' font-size='28px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s'>
                      ${mediumSolved}
                  </text>
              </g>

              <!-- Medium label -->
              <g transform='translate(247.5, 84)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#ffcc00' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='14px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.7s'>
                      Medium
                  </text>
              </g>

              <!-- Medium out of total medium questions -->
              <g transform='translate(247.5, 114)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#FFFFFF' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='12px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.8s'>
                      ${mediumSolved}/${mediumTotal}
                  </text>
              </g>
          </g>
          <g>
              <!-- Hard Solved -->
              <g transform='translate(412.5, 48)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#ff6666' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='700' font-size='28px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s'>
                      ${hardSolved}
                  </text>
              </g>

              <!-- Hard label -->
              <g transform='translate(412.5, 84)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#ff6666' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='14px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.7s'>
                      Hard
                  </text>
              </g>

              <!-- Hard out of total hard questions -->
              <g transform='translate(412.5, 114)'>
                  <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#FFFFFF' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='12px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.8s'>
                      ${hardSolved}/${hardTotal}
                  </text>
              </g>
          </g>
      </g>
  </svg>
  `;
}

function generateSvgBadgeContent(badges) {
    const badgeSize = 100;
    const badgesPerRow = 5;

    const fixedUrl = (url) => {
        if (url.startsWith('/static')) {
            return `https://assets.leetcode.com/static_assets/public${url.replace('/static', '')}`;
        }
        return url;
    };

    const badgeElements = badges.map((badge, index) => {
        const x = (index % badgesPerRow) * (badgeSize + 30) + 10;
        const y = Math.floor(index / badgesPerRow) * (badgeSize + 40) + 10; // Increase the vertical spacing to 80
        return `
            <g>
                <rect x="${x}" y="${y}" width="${badgeSize+25}" height="${badgeSize+35}" fill="#050F2C" stroke="#E4E2E2" stroke-width="1" rx="4"/>
                <image href="${fixedUrl(badge.icon)}" x="${x + 10}" y="${y + 10}" height="${badgeSize}" width="${badgeSize}" title="${badge.name}" />
                <text x="${x + 10 + badgeSize / 2}" y="${y + badgeSize + 25}" text-anchor="middle" fill="#FFFFFF" font-family='"Segoe UI", Ubuntu, sans-serif' font-weight="400" font-size="10px" width="${badgeSize - 20}">
                    ${badge.shortName}
                </text>
            </g>
        `;
    }).join('');

    const svgHeight = Math.ceil(badges.length / badgesPerRow) * (badgeSize + 80) + 10; // Adjust the SVG height accordingly
    const svgWidth = badgesPerRow * (badgeSize + 30) + 10;

    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
        ${badgeElements}
    </svg>
    `;
}

app.get('/', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const profileData = await fetchLeetcodeProfile(username);
        const svgContent = generateSvgContent(username, profileData);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(200).send(svgContent);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/badges', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const badgesData = await fetchLeetcodeBadges(username);
        const badges = badgesData.data.matchedUser.badges
        const svgContent = generateSvgBadgeContent(badges);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(200).send(svgContent);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
