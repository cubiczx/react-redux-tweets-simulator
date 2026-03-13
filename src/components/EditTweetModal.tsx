import React, { useState, useEffect } from "react";
import { Modal as ModalBootstrap, Button, Form } from "react-bootstrap";
import { Tweet } from "../reducers/tweetsReducer";

interface EditTweetModalProps {
  show: boolean;
  tweet: Tweet;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export default function EditTweetModal({
  show,
  tweet,
  onSave,
  onCancel,
}: EditTweetModalProps) {
  const [text, setText] = useState(tweet.text);

  useEffect(() => {
    setText(tweet.text);
  }, [tweet.text]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === "") return;
    onSave(text);
  };

  return (
    <ModalBootstrap show={show} onHide={onCancel} centered size="lg">
      <ModalBootstrap.Header closeButton>
        <ModalBootstrap.Title>Editar Tweet</ModalBootstrap.Title>
      </ModalBootstrap.Header>
      <Form onSubmit={handleSubmit}>
        <ModalBootstrap.Body>
          <Form.Group>
            <Form.Label>Tweet de {tweet.author}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Edita tu tweet..."
            />
          </Form.Group>
        </ModalBootstrap.Body>
        <ModalBootstrap.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar cambios
          </Button>
        </ModalBootstrap.Footer>
      </Form>
    </ModalBootstrap>
  );
}
