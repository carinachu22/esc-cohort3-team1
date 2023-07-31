import { ChakraProvider } from "@chakra-ui/react";
import { render } from '@testing-library/react';

const customRender = (ui, options) =>
  render(ui, { wrapper: ChakraProvider, ...options });

export * from "@testing-library/react";
export { customRender as render };
