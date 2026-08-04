import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
