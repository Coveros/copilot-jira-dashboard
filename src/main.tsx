import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import MetricsExplained from "./pages/MetricsExplained.tsx";
import { DataProvider } from './contexts/DataContext.tsx';

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <DataProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/metrics-explained" element={<MetricsExplained />} />
                </Routes>
            </BrowserRouter>
        </DataProvider>
    </StrictMode>
);
