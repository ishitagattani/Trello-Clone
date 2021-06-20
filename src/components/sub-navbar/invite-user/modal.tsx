import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@chakra-ui/react';
import checkEnvironment from '@/util/check-environment';

const host = checkEnvironment();

const InviteModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    validate();
  };
  const validate = () => {
    if (!validEmail.test(email)) {
      setEmailErr(true);
    } else {
      setEmailErr(false);
    }
  };

  const sendEmail = async () => {
    const url = `${host}/api/mail`;

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ email })
    });

    const inJSON = await response.json();

    if (inJSON.status === 200) {
      onClose();
      setEmail('');
    }
  };

  return (
    <>
      <Button onClick={onOpen} size="xs" ml="5px">
        Invite
      </Button>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!validEmail.test(email)}
              colorScheme="blue"
              mr={3}
              onClick={sendEmail}>
              Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InviteModal;
