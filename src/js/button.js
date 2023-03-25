import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, Button, ButtonGroup } from "@chakra-ui/react";

export function initButton() {
  return <ChakraProvider>
    <Button>submit</Button>
  </ChakraProvider>

}
