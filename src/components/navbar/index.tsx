import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import Link from 'next/link';

const NavBar = () => {
  return (
    <Box bg="brand" w="100%" color="white" textAlign="center" padding="10px">
      Nav Bar
      <Link href="/login">
        <Button color="grey" size="xs" float="right" bg='brand'>
          Sign in
        </Button>
      </Link>
    </Box>
  );
};

export default NavBar;
