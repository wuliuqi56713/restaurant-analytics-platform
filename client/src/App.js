import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import DataInputPage from './pages/DataInputPage';
import AnalysisPage from './pages/AnalysisPage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Layout className="app-layout">
      <Header />
      <Content className="app-content">
        <Routes>
          <Route path="/" element={<DataInputPage />} />
          <Route path="/analysis" element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
