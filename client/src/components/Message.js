import React, { useState } from 'react';

const Message = ({ id, text, sender, isCurrentUser, onEdit, onDelete}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [deletedText, setDeletedText] = useState(text)

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(text);
  };

  const handleDelete = () => {
    // Implement delete functionality
    onDelete(id, deletedText )
  };

  const handleSaveEdit = () => {

    // Call the onEdit callback function with the edited text and message id
    onEdit(id, editedText);
    setIsEditing(false);
  };

  return (
    <div
      className="message"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isEditing ? (
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <div className="message-content">
          <p>{sender}</p>
          <p>{text}</p>
        </div>
      )}
      {isCurrentUser && isHovered && (
        <div className="message-actions">
          {isEditing ? (
            <>
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;

