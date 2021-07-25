import React from 'react';
import { Flex, Box, FormControl, Input, Button, Image, Link, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import shortId from 'shortid';
import checkEnvironment from '@/util/check-environment';
import { useRouter } from 'next/router';
import inviteUser from '@/util/invite-user';

const SignUp = (): JSX.Element => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [isCreating, setIsCreatingStatus] = useState(false);

  const toast = useToast();
  const router = useRouter();

  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
  const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');

  const validate = () => {
    if (!validEmail.test(values.email)) {
      setEmailErr(true);
    } else {
      setEmailErr(false);
    }

    if (!validPassword.test(values.password)) {
      setPasswordErr(true);
    } else {
      setPasswordErr(false);
    }
  };

  const showToast = () => {
    toast({
      position: 'top',
      title: 'Account created.',
      description: "We've created your account. Redirecting you to login page in 3 seconds ",
      status: 'success',
      duration: 2500,
      isClosable: true
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setIsCreatingStatus(true);

    const id = shortId.generate();
    const host = checkEnvironment();

    const { email, password, confirmPassword, fullName } = values;

    const data = {
      id,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      fullName: fullName
    };

    const url = `${host}/api/register`;

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
      body: JSON.stringify(data)
    });

    const result = await response.json();
    setIsCreatingStatus(false);

    const { email: inviteEmail, token, boardId } = router.query;
    const isInvitedUser = inviteEmail && token && boardId;

    if (isInvitedUser && result.message === 'success') {
      const hasInvited = inviteUser({ email: inviteEmail, boardId });

      if (hasInvited) {
        redirectToLoginPage();
      }
    } else {
      if (result.message === 'success') {
        redirectToLoginPage();
      }
    }
  };

  const redirectToLoginPage = () => {
    showToast();

    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });

    validate();
  };

  const isButtonDisabled = () => {
    const isValidPassword = values.password !== values.confirmPassword;
    const isDisabled = !values.email || !values.fullName;

    return isValidPassword || isDisabled || !values.password || !values.confirmPassword;
  };

  return (
    <>
      <Box display="flex">
        <Image
          height="30px"
          ml="auto"
          mr="auto"
          my="40px"
          src="/trello-logo.svg"
          display="inline-block"
          alt="brand logo"
        />
      </Box>
      <Flex
        alignItems="center"
        flexDirection={['column', 'column', 'row', 'row']}
        justifyContent="center">
        <Image
          position="absolute"
          bottom="5%"
          left="5%"
          src="/signup/sign-up-left.svg"
          alt=" team work illustration"
          width={[0, '25%']}
        />
        <Image
          position="absolute"
          bottom="5%"
          right="5%"
          src="/signup/sign-up-right.svg"
          alt="work together illustration"
          width={[0, '25%']}
          borderRadius="3px"
        />
        <Box
          p="25px 40px"
          width={['80%', '60%', '45%', '25%']}
          borderRadius="3px"
          bg="white"
          boxShadow="rgb(0 0 0 / 10%) 0 0 10px">
          <Box
            textAlign="center"
            color="#5E6C84"
            mt="5"
            mb="25"
            fontSize={['10px', '10px', '15px', '15px']}
            fontWeight="semibold"
            lineHeight="normal">
            <h1>Sign up for your account</h1>
          </Box>
          <Box my={4} textAlign="left">
            <FormControl isRequired>
              <Input
                type="email"
                name="email"
                value={values.email}
                placeholder="Enter Email"
                onChange={handleChange}
                autoComplete="off"
              />
              {emailErr && <p color="red">Invalid email.</p>}
            </FormControl>
            <FormControl my="4" isRequired>
              <Input
                type="text"
                name="fullName"
                value={values.fullName}
                placeholder="Full name"
                onChange={handleChange}
                autoComplete="off"
              />
            </FormControl>
            <FormControl my="4">
              <Input
                type="password"
                name="password"
                value={values.password}
                placeholder="Create password"
                onChange={handleChange}
              />
              {passwordErr && <p color="red">Invalid password.</p>}
            </FormControl>
            <FormControl my="4">
              <Input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                placeholder="Confirm password"
                onChange={handleChange}
              />
            </FormControl>
            <Button
              fontWeight="semibold"
              width="full"
              mt={4}
              disabled={isButtonDisabled()}
              bg="success"
              color="white"
              onClick={registerUser}
              isLoading={isCreating}
              loadingText="Registering">
              Sign up
            </Button>
            <Box m="5" textAlign="center">
              <Link href="/login" color="brand" p="2">
                Already have an account? Log in.
              </Link>
            </Box>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default SignUp;
