import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthComponent from './component/AuthComponent'
import MainComponent from './component/MainComponent';
import SettingsComponent from './component/SettingsComponent';
import UsersPanelComponent from './component/UsersPanelComponent';
import WorkersPanelComponent from './component/WorkersPanelComponent';
import SubordinatesComponent from './component/SubordinatesComponent';
import CreateTaskComponent from './component/CreateTaskComponent';
import AllTasksComponent from './component/AllTasksComponent';
import FreeTasksComponent from './component/FreeTasksComponent';
import FreeUserTasksComponent from './component/FreeUserTaskComponent';
import MyTasksComponent from './component/MyTasksComponent';
import CompletedTasksComponent from './component/CompletedTasksComponent';
import UserBonusesComponent from './component/UserBonusesComponent';
import MyBonusesComponent from './component/MyBonusesComponent';
import ManagerBonusesComponent from './component/ManagerBonusesComponent';

import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* публичный маршрут */}
        <Route path="/auth" element={<AuthComponent />} />

        {/* защищённые маршруты */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPanelComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <WorkersPanelComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subordinates"
          element={
            <ProtectedRoute>
              <SubordinatesComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/create"
          element={
            <ProtectedRoute>
              <CreateTaskComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/all"
          element={
            <ProtectedRoute>
              <AllTasksComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/pending"
          element={
            <ProtectedRoute>
              <FreeTasksComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/unassigned"
          element={
            <ProtectedRoute>
              <FreeUserTasksComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/my"
          element={
            <ProtectedRoute>
              <MyTasksComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/completed"
          element={
            <ProtectedRoute>
              <CompletedTasksComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bonuses"
          element={
            <ProtectedRoute>
              <MyBonusesComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bonuses/:userId"
          element={
            <ProtectedRoute>
              <UserBonusesComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users_bonuses"
          element={
            <ProtectedRoute>
              <ManagerBonusesComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App
