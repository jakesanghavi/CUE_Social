import { useParams } from 'react-router-dom';
import { ROUTE, Link } from '../constants';
import React, { useState, useEffect, useCallback } from 'react';

const CommentDisplay = ({ loggedInUser }) => {
    const deckId = useParams()
    console.log(deckId)
    const [comments, setComments] = useState([]);

    const getComments = useCallback(async () => {
        try {
            const response = await fetch(`${ROUTE}/api/comments/get/${deckId.deckId}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Failed to get comments');
            }
            const retrievedComments = await response.json();
            setComments(retrievedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }, [deckId]);

    // const postComment = async (comment) => {
    //     try {
    //         const response = await fetch(`${ROUTE}/api/comments/post/${deckId.deckId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ username: loggedInUser.username, comment })
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to post comment');
    //         }
    //     } catch (error) {
    //         console.error('Error posting comment:', error);
    //     }
    // };

    useEffect(() => {
        getComments();
    }, [getComments])

    return (
        <>
            {comments && comments.length > 0 && (
                <div>
                    {comments.map(comment => (
                        <div key={comment._id}>
                            <div className="comment-info">
                                <div className="comment-title">
                                    by <Link to={`/users/${comment.username}`} style={{ textDecoration: 'underline' }}>{comment.username}</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default CommentDisplay