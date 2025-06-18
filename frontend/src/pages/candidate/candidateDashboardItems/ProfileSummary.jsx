import React from 'react'

function ProfileSummary() {
  return (
    <div className='cardsContainer' style={styles.cardsContainer}>
          <div className='card' style={styles.card}>
            <h4>Profile Completion</h4>
            <span className='roundBox' style={styles.roundBox}>70%</span>
            <p>Awesome</p>
          </div>
          <div className='card' style={styles.card}>
            <h4>Appearance</h4>
            <span className='roundBox' style={styles.roundBox}>70%</span>
            <p>In last 7 days</p>
          </div>
          <div className='card' style={styles.card}>
            <h4>Profile Completion</h4>
            <span className='roundBox' style={styles.roundBox}>70%</span>
            <p>In last 7 days</p>
          </div>
      </div>
  )
}

export default ProfileSummary

const styles = {
    cardsContainer :{
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection : 'row',
    justifyContent: 'space-between',
    padding: '20px',
  },
  card : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    width: '200px',
    // height: '150px',
    margin: '4rem',
    padding: '2rem',
    border: '1px solid black',
    borderRadius: '10px',
    backgroundColor: 'darkgray',
    
  },
  roundBox:{

    // width: '5rem',
    // height: '5rem',
    
    padding: '2rem',
    borderRadius: '50%',
    backgroundColor: 'white',
    color: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  }
}