import {
  BrowserRouter,
  useNavigate,
  Link,
  Routes,
  Route,
} from "react-router-dom/dist/index.js";

export const useLocation = () => ({
  pathname: "/tenant/",
  search: "?mocked=query",
  hash: "#mocked-hash",
  state: { role: "tenant" },
  key: "mocked-key",
});

export { BrowserRouter, useNavigate, Link, Routes, Route };
