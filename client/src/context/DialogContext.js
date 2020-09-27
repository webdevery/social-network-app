import { createContext } from "react";

function noop() {}

export const DialogContext = createContext({
  messages: null,
  setMesages: noop
});
