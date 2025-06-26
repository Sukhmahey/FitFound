import React from 'react'
import { useEffect } from 'react';

function ProfileSummary({profileScore}) {

    // const [profileScore, setProfileScore] = React.useState(0);
    const [profileScoreRemark, setProfileScoreRemark] = React.useState('');
    const [appearanceScore, setAppearanceScore] = React.useState(85);
    const [invitationScore, setInvitationScore] = React.useState(10);



    useEffect(() => {
        if (profileScore >= 90) {
            setProfileScoreRemark('Exceptional!');
        } else if (profileScore >= 80) {
            setProfileScoreRemark('Excellent!');
        } else if (profileScore >= 60) {
            setProfileScoreRemark('Good!');
        } else if (profileScore >= 40) {
            setProfileScoreRemark('Lets Boost This!');
        } else {
            setProfileScoreRemark('Needs Improvement');
        }
    }, [profileScore]);


    return (
        <div className='cardsContainer' style={styles.cardsContainer}>
            <div className='card' style={styles.card}>
                <h4>Profile Completion</h4>
                <span className='roundBox' style={styles.roundBox}>{profileScore}%</span>
                <p>{profileScoreRemark}</p>
            </div>
            <div className='card' style={styles.card}>
                <h4>Appearance</h4>
                <span className='roundBox' style={styles.roundBox}>{appearanceScore}%</span>
                <p>In last 7 days</p>
            </div>
            <div className='card' style={styles.card}>
                <h4>Profile Completion</h4>
                <span className='roundBox' style={styles.roundBox}>{invitationScore}</span>
                <p>In last 7 days</p>
            </div>
        </div>
    )
}

export default ProfileSummary



const styles = {
    cardsContainer: {
        display: 'grid',

        justifyContent: 'space-between',
        padding: '20px',
        gridTemplateColumns: '1fr 1fr 1fr'
    },
    card: {

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',


        margin: '4rem',
        padding: '2rem',
        border: '1px solid black',
        borderRadius: '10px',
        backgroundColor: 'darkgray',

    },
    roundBox: {

        width: '5rem',
        height: '5rem',
        borderRadius: '50%',
        backgroundColor: 'white',
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    }
}