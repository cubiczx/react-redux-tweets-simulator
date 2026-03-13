import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from './ConfirmModal';

describe('ConfirmModal Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when show is false', () => {
    render(
      <ConfirmModal
        show={false}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  test('renders modal when show is true', () => {
    render(
      <ConfirmModal
        show={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('renders confirm and cancel buttons', () => {
    render(
      <ConfirmModal
        show={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /Confirmar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmModal
        show={true}
        title="Delete Confirmation"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Confirmar/i });
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmModal
        show={true}
        title="Delete Confirmation"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('renders custom title and message', () => {
    render(
      <ConfirmModal
        show={true}
        title="Custom Title"
        message="This is a custom confirmation message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('This is a custom confirmation message')).toBeInTheDocument();
  });

  test('confirm button has danger variant', () => {
    render(
      <ConfirmModal
        show={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Confirmar/i });
    expect(confirmButton).toHaveClass('btn-danger');
  });

  test('cancel button has secondary variant', () => {
    render(
      <ConfirmModal
        show={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    expect(cancelButton).toHaveClass('btn-secondary');
  });
});
