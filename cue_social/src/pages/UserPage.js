import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ROUTE } from '../constants';
window.Buffer = window.Buffer || require("buffer").Buffer;

const UserPage = () => {
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${ROUTE}/api/users/getone/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const deckData = await response.json();
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div>
      <h2>{userId}</h2>
    </div>
  );
};

export default UserPage;