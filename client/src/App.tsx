import { Routes, Route } from "react-router-dom";
import BlogPage from "./pages/BlogPage.tsx";

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      {/* <Route path="/about" element={<AboutPage />} /> */}
      <Route path="/blog" element={<BlogPage />} />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default App;
