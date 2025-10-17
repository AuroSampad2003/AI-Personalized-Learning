/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";  // <- import your Tailwind-enabled CSS