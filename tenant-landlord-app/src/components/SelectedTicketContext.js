import React, { useReducer, useEffect } from "react";

let reducer = (selectedTicket, newSelectedTicket) => {
  if (newSelectedTicket === null) {
    localStorage.removeItem("selectedticket");
    return initialState;
  }
  return { ...selectedTicket, ...newSelectedTicket };
};

const initialState = {
  id: 0
};

const localState = JSON.parse(localStorage.getItem("selectedticket"));

const SelectedTicketContext = React.createContext();

function SelectedTicketProvider(props) {
  const [selectedTicket, setSelectedTicket] = useReducer(reducer, localState || initialState);

  useEffect(() => {
    localStorage.setItem("selectedticket", JSON.stringify(selectedTicket));
  }, [selectedTicket]);

  return (
    <SelectedTicketContext.Provider value={{ selectedTicket, setSelectedTicket }}>
      {props.children}
    </SelectedTicketContext.Provider>
  );
}

export { SelectedTicketContext, SelectedTicketProvider };