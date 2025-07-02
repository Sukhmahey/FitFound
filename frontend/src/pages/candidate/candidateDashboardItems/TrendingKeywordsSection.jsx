import React from 'react'
import { Box, Typography, Paper, Container,Divider } from '@mui/material';


function TrendingKeywordsSection({suggestedSkills=[], alreadySkills=[]}) {

    const [trendingKeywords, setTrendingKeywords] = React.useState([]);
    // console.log("Already",allreadySkills)

     const alreadySet = new Set(alreadySkills.map(s => s.toLowerCase()));




    // const keyWordsArray = [
    //     { id: 1, keyword: "Python" },
    //     { id: 2, keyword: "JavaScript" },
    //     { id: 3, keyword: "React" },
    //     { id: 4, keyword: "Angular" },
    //     { id: 5, keyword: "Vue" },
    //     { id: 6, keyword: "Node.js" },
    //     { id: 7, keyword: "Express" },
    //     { id: 8, keyword: "MongoDB" },
    //     { id: 9, keyword: "SQL" },
    //     { id: 10, keyword: "NoSQL" },
        
        
    // ]

  return (
    
    
     <Box>
      <Divider className=' mb-4'></Divider>
              <Typography variant="h4" gutterBottom>Trending Keywords</Typography>

       <Box my={4} p={1} border={1} borderColor="gray.200" rounded="md" shadow="lg" borderRadius={2}>
          <Box component="ul" sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 3, m: 0 }}>
            {suggestedSkills.map((item, indx) => {
              const isNew = !alreadySkills.some(skill => skill.toLowerCase() === item.toLowerCase());
              return (
                <Box
                  component="li"
                  key={indx}
                  sx={{
                    backgroundColor: isNew ? 'tomato' : 'darkgray',
                    color: 'white',
                    px: 2,
                    py: 1,
                    m: 0.5,
                    borderRadius: 2,
                    fontSize: 14
                  }}
                >
                  {item}
                </Box>
              );
            })}
          </Box>
        </Box>
     </Box>

  )
}

export default TrendingKeywordsSection


