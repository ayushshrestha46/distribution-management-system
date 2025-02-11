
import { ToastContainer, Bounce } from "react-toastify";
import { Route, Routes, useLocation } from "react-router-dom";
import { Login, Register, Activate } from "./components";
import {HomePage} from './pages/HomePage'
function App() {
  // const location = useLocation();
  // const isLogin = location.pathname === "/login" || "/register";
  return (
    <>
      {/* {!isLogin && <Header />} */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate" element={<Activate />} />
        <Route path="/" element={<HomePage />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}

export default App;
