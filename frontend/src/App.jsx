import React from "react";
import Header from "./CommonView/components/Header";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      {/* Main content goes here */}
      <main className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome!</h1>
        <p className="text-gray-700 dark:text-gray-300">Your personalized learning assistant.</p>
      </main>
    </div>
  );
}

export default App;
