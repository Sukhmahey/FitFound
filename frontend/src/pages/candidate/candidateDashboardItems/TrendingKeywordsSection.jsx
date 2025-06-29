import React from 'react'

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
    <div>
      <h2>Trending Keywords</h2>
      <ul className='keywordsContainer' style={styles.keywordsContainer}>
        {suggestedSkills.map((item, indx) => {
          const isNew = !alreadySet.has(item.toLowerCase());
          return (
            <li
              key={indx}
              className='listItems'
              style={{
                ...styles.listItems,
                backgroundColor: isNew ? 'tomato' : 'darkgray',
                color: 'white',
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default TrendingKeywordsSection

const styles = {
    keywordsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: '2rem',
        gap: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #ccc',
        padding: '2rem'
    },
    listItems:{
        backgroundColor: 'darkgray',
        padding: '1rem',

    }
}
