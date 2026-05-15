import { createRoot } from "react-dom/client"
import '../shared/lib/fallback-map.ts' // array protorype extention load

import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
    <App />
)
