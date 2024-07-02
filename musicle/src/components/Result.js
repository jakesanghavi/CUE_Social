import { useEffect, useState } from 'react'

// The profile page for the user
const Result = ({ onLogout, loggedInUser, userStats }) => {
  

  return (
    <div>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="imageFile" />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};




export default Result;