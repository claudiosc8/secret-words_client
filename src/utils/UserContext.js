import React from "react";

// set the defaults
const UserContext = React.createContext({
  user: null,
  setUser: () => {}
});

export default UserContext;
