import { useParams } from 'react-router-dom';
import { ROUTE } from '../constants';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../component_styles/commentdisplay.css';

const CommentDisplay = ({ loggedInUser }) => {
    const deckId = useParams()
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showBanner, setShowBanner] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [bannerProgress, setBannerProgress] = useState(0);

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

    const postComment = async (comment) => {
        try {
            const response = await fetch(`${ROUTE}/api/comments/post/${deckId.deckId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: loggedInUser.username, comment })
            });
            if (!response.ok) {
                throw new Error('Failed to post comment');
            }
            setNewComment(''); // Clear input field
            getComments(); // Refresh comments after posting
            setShowBanner(true); // Show banner
            setTimeout(() => setShowBanner(false), 3000); // Hide banner after 3 seconds
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!commentToDelete) return;
        try {
            const response = await fetch(`${ROUTE}/api/comments/delete/${commentToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            getComments(); // Refresh comments after deleting one
            setShowDeletePopup(false); // Hide the confirmation popup
            setCommentToDelete(null); // Reset the comment to delete
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const confirmDeleteComment = (commentId) => {
        setCommentToDelete(commentId);
        setShowDeletePopup(true);
    };

    const handleDeleteCancel = () => {
        setShowDeletePopup(false);
        setCommentToDelete(null);
    };

    useEffect(() => {
        getComments();
    }, [getComments])

    useEffect(() => {
        if (showBanner) {
            const timer = setTimeout(() => {
                setShowBanner(false);
                setBannerProgress(0);
            }, 3000); // Display banner for 3 seconds

            const interval = setInterval(() => {
                setBannerProgress((prev) => prev - (100 / 3)); // Decrease progress over time
            }, 30); // Update every 30ms

            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        }
    }, [showBanner]);

    return (
        <>
            {showBanner && (
                <div className="notification-banner">
                    <div className="banner-content">
                        <div className="banner-progress" style={{ width: `${bannerProgress}%` }}></div>
                        <span className="banner-message">Comment added!</span>
                    </div>
                </div>
            )}
            <div className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="3"
                    style={{ width: '100%', padding: '10px', marginTop: '10px' }}
                ></textarea>
                <button onClick={() => postComment(newComment)} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>
                    Post Comment
                </button>
            </div>
            {comments && comments.length > 0 && (
                <div>
                    {comments.map(comment => (
                        <div key={comment._id} className="comment-card">
                            <div className="comment-header">
                                <div className="comment-header-content">
                                    <Link to={`/users/${comment.Username}`} className="comment-username">
                                        {comment.Username}
                                    </Link>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {loggedInUser && loggedInUser.username === comment.Username && (
                                    <FontAwesomeIcon 
                                        icon={faTrash} 
                                        onClick={() => confirmDeleteComment(comment._id)} 
                                        className="delete-icon"
                                    />
                                )}
                            </div>
                            <div className="comment-body">
                                <p className="comment-text">{comment.Comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showDeletePopup && (
                <div className="delete-popup-overlay">
                    <div className="delete-popup">
                        <p>Are you sure you want to delete this comment?</p>
                        <div className="popup-buttons">
                            <button onClick={handleDeleteConfirm} className="popup-button confirm">Yes</button>
                            <button onClick={handleDeleteCancel} className="popup-button cancel">No</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CommentDisplay