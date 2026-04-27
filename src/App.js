import React from 'react';
import { Toaster } from 'react-hot-toast';
import { WheelProvider } from './context/WheelContext';
import Header from './components/Header';
import SpinWheel from './components/SpinWheel';
import Sidebar from './components/Sidebar';
import WinnerModal from './components/WinnerModal';
import styles from './App.module.css';

function AppContent() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <div className={styles.wheelPane}>
          <SpinWheel />
        </div>
        <div className={styles.sidePane}>
          <Sidebar />
        </div>
      </main>
      <WinnerModal />
    </div>
  );
}

export default function App() {
  return (
    <WheelProvider>
      <AppContent />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#16162a',
            color: '#f0f0ff',
            border: '1px solid #2a2a45',
            borderRadius: '12px',
            fontFamily: "'DM Sans', sans-serif",
          },
        }}
      />
    </WheelProvider>
  );
}
