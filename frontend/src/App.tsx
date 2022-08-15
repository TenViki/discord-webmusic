import { useState } from "react";
import "./index.scss";
import Router from "./Router";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <Router />
    </div>
  );
}

export default App;
