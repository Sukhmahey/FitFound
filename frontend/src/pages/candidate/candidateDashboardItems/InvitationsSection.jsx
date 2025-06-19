import React from 'react'

function InvitationsSection() {

    const invitationArray = [
        {id: 1, EName: 'Manoj' , CName:'Deloitte', Date: '2022-01-01'},
        {id: 2, EName: 'Rahul' , CName:'Accenture' , Date: '2022-01-02'},
        {id: 3, EName: 'Rohan' , CName:'Infosys', Date: '2022-01-03'},
    ]

  return (
    <div>
        <h1>Invitations</h1>
        <div className="invitations-container" style={styles.invitationsContainer}>
            <ul className='invitationList' style={styles.invitationList}>
                {invitationArray.map((invitation) => (
            <li key={invitation.id} className='invitationItem' style={styles.ListItems}>
              <div className='invitationDetails' style={styles.invitationDetails}>
                  <span><strong>{invitation.EName}</strong> is inviting you to connect</span>
                  <span><strong>{invitation.CName}</strong> </span>
                  <span>{invitation.Date}</span>
              </div>
              <button className='listButton' style={styles.listButton}>Details</button>

            </li>
          ))}
            </ul>
        </div>
    </div>
  )
}

export default InvitationsSection

const styles = {
    invitationsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
    },
    invitationList:{
        listStyle: 'none',
        padding: '20px',
        margin: 'auto',
        width: '80%',
        display: 'flex',
        flexDirection: 'column'

    },
    ListItems:{

        backgroundColor: '#f0f0f0',
        padding: '2rem',
        margin: '10px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    invitationDetails:{
        display: 'flex',
        flexDirection: 'column',
    },
    listButton:{
        backgroundColor: 'white',
        color: 'black',
        padding: '0.5rem 2rem',
        border: 'none',
        borderRadius: '1rem',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        
    }


}