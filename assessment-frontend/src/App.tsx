import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Dashboard from './dashboard/Dashboard';
import WorkflowDetail from './workflow/WorkflowDetail';
import { useAuthStore } from './state/authStore';


function Protected({ children }: { children: JSX.Element }) {
    const token = useAuthStore((s) => s.token);
    return token ? children : <Navigate to="/login" />;
}


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Protected><Dashboard /></Protected>} />
                <Route path="/leads/:id" element={<Protected><WorkflowDetail /></Protected>} />
            </Routes>
        </BrowserRouter>
    );
}