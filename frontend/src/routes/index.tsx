import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { MapPage } from "@/pages/MapPage";
import { QuestPage } from "@/pages/QuestPage";
import { BattlePage } from "@/pages/BattlePage";
import { AdventureListPage } from "@/pages/AdventureListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/adventures",
    element: <AdventureListPage />,
  },
  {
    path: "/map",
    element: <MapPage />,
  },
  {
    path: "/quest/:id",
    element: <QuestPage />,
  },
  {
    path: "/battle/:id",
    element: <BattlePage />,
  }
]);
