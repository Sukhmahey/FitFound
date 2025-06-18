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
        <div className="invitations-container">
            <ul className='invitationList'>
                {invitationArray.map((invitation) => (
            <li key={invitation.id}>
              {invitation.EName} is inviting you to connect
              <br></br>
              {invitation.CName} on {invitation.Date}

            </li>
          ))}
            </ul>
        </div>
    </div>
  )
}

export default InvitationsSection