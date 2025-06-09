import React from 'react'

function ProfileSetupOption({onManualClick,onUploadClick}) {
   
  return (
    <div>
      <h2>Get Started</h2>
      <p>Choose how you want to set up your profile:</p>

      <div >
        <button onClick={onManualClick}>
          Fill Details Manually
        </button>

        <button onClick={onUploadClick}>
          Upload Resume
        </button>
      </div>
    </div>
  )
};



export default ProfileSetupOption