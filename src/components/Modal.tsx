import React from "react";
import { Modal as ModalBootstrap, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../actions/modalsActions";

export default function Modal({ title, children }: any) {
  const dispatch = useDispatch();
  const { isTweetModalOpen } = useSelector(
    (state: any) => state.modals,
  );

  const handleClose = () => {
    dispatch(hideModal());
  };

  return (
    <ModalBootstrap
      show={isTweetModalOpen}
      onHide={handleClose}
      size="lg"
      centered
    >
      <ModalBootstrap.Header closeButton className="text-center">
        <ModalBootstrap.Title className="w-100">{title}</ModalBootstrap.Title>
      </ModalBootstrap.Header>
      <ModalBootstrap.Body>{children}</ModalBootstrap.Body>
      <ModalBootstrap.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </ModalBootstrap.Footer>
    </ModalBootstrap>
  );
}