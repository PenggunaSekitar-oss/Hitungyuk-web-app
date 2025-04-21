import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize the localStorage data structure if it doesn't exist
if (!localStorage.getItem("hitungYukData")) {
  localStorage.setItem(
    "hitungYukData",
    JSON.stringify({
      projects: [],
      calculations: [],
      profile: {
        username: "",
        email: "",
        bio: "",
        photoUrl: "",
      },
    })
  );
}

createRoot(document.getElementById("root")!).render(<App />);
