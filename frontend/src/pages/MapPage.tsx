import React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AdventureMap } from "@/features/quest/AdventureMap"

export const MapPage: React.FC = () => {
  return (
    <DashboardLayout>
      <AdventureMap />
    </DashboardLayout>
  )
}
