import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar, Navbar } from './components';
import { useTranslation } from './i18n';
import {
  DashboardPage,
  GatesPage,
  PerceptronPage,
  XorMlpPage,
  TruthTablePage,
  TheoryPage,
  ConclusionPage,
  MultiInputOverviewPage,
  MultiInputGatesPage,
  MultiInputPerceptronPage,
  MultiInputXorMlpPage,
  TrainingLabPage,
  ScalingAnalysisPage,
  MultiInputTruthTablePage,
  ExtendedTheoryPage,
  FinalConclusionPage,
} from './pages';

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current page title for Navbar
  const getPageTitle = (path: string): string => {
    switch (path) {
      case '/':
        return t.nav.dashboard;
      case '/logic-gates':
        return t.nav.gates;
      case '/perceptron':
        return t.nav.perceptron;
      case '/xor-mlp':
        return t.nav.xorMlp;
      case '/truth-table':
        return t.nav.truthTable;
      case '/theory':
        return t.nav.theory;
      case '/conclusion':
        return t.nav.conclusion;
      case '/multi-input':
        return t.nav.multiOverview;
      case '/multi-input/gates':
        return t.nav.multiGates;
      case '/multi-input/perceptron':
        return t.nav.multiPerceptron;
      case '/multi-input/xor-mlp':
        return t.nav.multiXorMlp;
      case '/multi-input/training':
        return t.nav.trainingLab;
      case '/multi-input/scaling':
        return t.nav.scalingAnalysis;
      case '/multi-input/truth-table':
        return t.nav.multiTruthTable;
      case '/multi-input/theory':
        return t.nav.extendedTheory;
      case '/multi-input/conclusion':
        return t.nav.finalConclusion;
      default:
        return t.nav.appTitle;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-lab-bg text-slate-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            {/* 2-Input Base Pages */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/logic-gates" element={<GatesPage />} />
            <Route path="/perceptron" element={<PerceptronPage />} />
            <Route path="/xor-mlp" element={<XorMlpPage />} />
            <Route path="/truth-table" element={<TruthTablePage />} />
            <Route path="/theory" element={<TheoryPage />} />
            <Route path="/conclusion" element={<ConclusionPage />} />

            {/* Multi-Input Lab Pages */}
            <Route path="/multi-input" element={<MultiInputOverviewPage />} />
            <Route path="/multi-input/gates" element={<MultiInputGatesPage />} />
            <Route path="/multi-input/perceptron" element={<MultiInputPerceptronPage />} />
            <Route path="/multi-input/xor-mlp" element={<MultiInputXorMlpPage />} />
            <Route path="/multi-input/training" element={<TrainingLabPage />} />
            <Route path="/multi-input/scaling" element={<ScalingAnalysisPage />} />
            <Route path="/multi-input/truth-table" element={<MultiInputTruthTablePage />} />
            <Route path="/multi-input/theory" element={<ExtendedTheoryPage />} />
            <Route path="/multi-input/conclusion" element={<FinalConclusionPage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
export default App;
