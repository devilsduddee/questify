import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AchievementPopup } from "./components/common/AchievementPopup";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      <RouterProvider router={router} />
      <AchievementPopup />
    </div>
  );
}

export default App;
