import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
// import theme from '@chakra-ui/theme'
import { ChakraProvider } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react"
import { App } from "./content_script";

// function AppContainer({children}) {
//   return <ChakraProvider resetCss={false}>{children}</ChakraProvider>
// }

class InitBtnTest extends React.Component {
  render() {
    return <div>React test</div>
  }
}

export default class InitBtn extends React.Component {
  render() {
    return (
      <ChakraProvider resetCss={false}>
        <Box
          m="2"
          w="200px"
          borderWidth="1px"
          borderRadius="x1"
          className="testbtn"
        >
          <Box p="2" m="2" borderRadius="x1"
            bgColor="red.200"
            fontSize="md">Test1</Box>
        </Box>
      </ChakraProvider>
    )
  }
}