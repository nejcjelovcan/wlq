import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/core'
import React, { useRef } from 'react'

const StartGameModal = ({
  isOpen,
  onClose,
  startGame,
}: {
  isOpen: boolean
  onClose: () => void
  startGame: () => void
}) => {
  const focusRef = useRef<HTMLButtonElement>(null)
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      initialFocusRef={focusRef}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Do you really want to start the game all by yourself?
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              ref={focusRef}
              onClick={() => {
                onClose()
                startGame()
              }}
              mr={3}
            >
              Start game!
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
export default StartGameModal
