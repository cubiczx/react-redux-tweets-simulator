import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Tweet } from "../reducers/tweetsReducer";
import moment from "moment";
import "moment/locale/es";
import { deleteTweet, likeTweet, editTweet } from "../actions/tweetsActions";
import ConfirmModal from "./ConfirmModal";
import EditTweetModal from "./EditTweetModal";

moment.locale("es");

export default function TweetsList() {
  const tweets = useSelector((state: RootState) => state.tweets.list || []);
  return (
    <div className="tweets-container">
      {tweets.length === 0 ? (
        <div className="text-center mt-5">
          <h3 style={{ color: '#667eea' }}>¡No hay tweets aún!</h3>
          <p style={{ color: '#888' }}>Sé el primero en compartir algo 🚀</p>
        </div>
      ) : (
        tweets.map((tweet: Tweet) => (
          <TweetListItem key={tweet.id} tweet={tweet} />
        ))
      )}
    </div>
  );
}

function TweetListItem(props: { tweet: Tweet }) {
  const { tweet } = props;
  const dispatch = useDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLike = () => {
    dispatch(likeTweet(tweet.id));
  };

  const handleDelete = () => {
    dispatch(deleteTweet(tweet.id));
    setShowConfirmModal(false);
  };

  const handleEdit = (newText: string) => {
    dispatch(editTweet(tweet.id, newText));
    setShowEditModal(false);
  };

  return (
    <>
      <Card className="tweet-card mb-4">
        <Card.Body>
          <Card.Title className="tweet-author">{tweet.author}</Card.Title>
          <Card.Text className="tweet-text">{tweet.text}</Card.Text>
          <Card.Subtitle className="tweet-timestamp mb-3">
            {moment(tweet.timestamp, "DD-MM-YYYY HH:mm:ss").format(
              "dddd D [de] MMMM [de] YYYY [a las] HH:mm[h]"
            )}
          </Card.Subtitle>
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-1">
              <Button className="btn-icon btn-like" onClick={handleLike} title="Me gusta">
                ❤️
              </Button>
              <span className="likes-count">{tweet.likes}</span>
            </div>
            <Button
              className="btn-icon btn-edit"
              onClick={() => setShowEditModal(true)}
              title="Editar"
            >
              ✏️
            </Button>
            <Button className="btn-icon btn-delete" onClick={() => setShowConfirmModal(true)} title="Eliminar">
              🗑️
            </Button>
          </div>
        </Card.Body>
      </Card>

      <ConfirmModal
        show={showConfirmModal}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar el tweet de ${tweet.author}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmModal(false)}
      />

      <EditTweetModal
        show={showEditModal}
        tweet={tweet}
        onSave={handleEdit}
        onCancel={() => setShowEditModal(false)}
      />
    </>
  );
}