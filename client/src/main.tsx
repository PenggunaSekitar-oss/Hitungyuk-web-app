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

// Initialize the authentication data structures if they don't exist
if (!localStorage.getItem("hitungyuk_users")) {
  localStorage.setItem("hitungyuk_users", JSON.stringify([]));
}

// Make sure current user is null initially
if (!localStorage.getItem("hitungyuk_current_user")) {
  localStorage.setItem("hitungyuk_current_user", null);
}

createRoot(document.getElementById("root")!).render(<App />);
