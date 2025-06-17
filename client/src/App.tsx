import { Routes, Route } from "react-router-dom";

import BlogPage from "@pages/BlogPage.tsx";
import HomePage from "@pages/HomePage.tsx";
import PostPage from "@pages/PostPage.tsx";
import AboutPage from "@pages/AboutPage.tsx";
import NotFoundPage from "@pages/NotFoundPage.tsx";

import Navbar from "@components/Navbar/Navbar.tsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<PostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
