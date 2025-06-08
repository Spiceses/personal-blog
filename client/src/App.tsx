import { Routes, Route } from "react-router-dom";
import BlogPage from "./pages/BlogPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} /> */}
        <Route path="/blog" element={<BlogPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  );
};

export default App;
