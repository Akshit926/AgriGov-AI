import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import DocumentProcessing from './pages/DocumentProcessing';
import FraudDetection from './pages/FraudDetection';
import FieldVerification from './pages/FieldVerification';
import GrievanceSystem from './pages/GrievanceSystem';
import SchemePrediction from './pages/SchemePrediction';

function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500 text-sm">{title} — Coming Soon</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<DocumentProcessing />} />
          <Route path="/fraud" element={<FraudDetection />} />
          <Route path="/field" element={<FieldVerification />} />
          <Route path="/grievances" element={<GrievanceSystem />} />
          <Route path="/schemes" element={<SchemePrediction />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="/help" element={<PlaceholderPage title="Help & Support" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
