import './App.scss';
import {
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import SemiFinal from "./pages/Semi";
import FinalJudge from "./pages/FinalJudge";
import FinalAudience from "./pages/FinalAudience";
import Settings from "./pages/Settings";
import Release from './pages/Release';
import ScoreSettings from './pages/ScoreSettings';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/settings/release" element={<Release/>}/>
                <Route path="/settings/judge" element={<ScoreSettings/>}/>
                <Route path="/semi" element={<SemiFinal/>}/>
                <Route path="/final/audience" element={<FinalAudience/>}/>
                <Route path="/final/judge" element={<FinalJudge/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
