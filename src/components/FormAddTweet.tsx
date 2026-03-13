import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setErrorFormAddTweet } from "../actions/validationsActions";
import { addTweet } from "../actions/tweetsActions";
import { hideModal } from "../actions/modalsActions";

export default function FormAddTweet() {
  const dispatch = useDispatch();
  const addTweetDispatch = (name: string, tweet: string) => dispatch(addTweet(name, tweet));
  const errorForm = (state: boolean) => dispatch(setErrorFormAddTweet(state));

  const errorFormAddTweet = useSelector(
    (state: any) => state.validations.errorFormAddTweet,
  );

  const [tweetText, setTweetText] = useState({
    name: "@",
    tweet: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      // Asegurar que siempre comience con @
      const newValue = value.startsWith("@") ? value : "@" + value;
      setTweetText({
        ...tweetText,
        name: newValue,
      });
    } else {
      setTweetText({
        ...tweetText,
        [name]: value,
      });
    }
  };

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, tweet } = tweetText;
    if (name.trim() === "@" || name.trim() === "" || tweet.trim() === "") {
      errorForm(true);
      return;
    }
    errorForm(false);
    setTweetText({
      name: "@",
      tweet: "",
    });
    addTweetDispatch(name, tweet);
    dispatch(hideModal());
  };

  return (
    <Form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
      <Form.Group controlId="formName">
        <Form.Control
          type="text"
          name="name"
          placeholder="@tu_usuario"
          value={tweetText.name}
          onChange={onChange}
        />
      </Form.Group>
      <Form.Group controlId="formTweet">
        <Form.Control
          as="textarea"
          name="tweet"
          rows={3}
          placeholder="Tweetea algo..."
          value={tweetText.tweet}
          onChange={onChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Publicar
      </Button>
      {errorFormAddTweet && (
        <Alert variant="danger" className="mt-4">Por favor, completa ambos campos.</Alert>
      )}
    </Form>
  );
}
