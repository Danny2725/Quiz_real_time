// import { Navigate, Route, Routes } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { LoginPage } from "./pages/LoginPage/LoginPage";
// import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
// import HomePage from "./pages/HomePage/HomePage";
// import Sidebar from "./components/common/Sidebar";
// import LoadingSpinner from "./components/common/LoadingSpinner";
// import Header from "./components/common/Header";

// export default function App() {
//   const { data: authUser, isLoading } = useQuery({
//     queryKey: ["authUser"],
//     queryFn: async () => {
//       try {
//         const res = await fetch("/api/auth/me");
//         const data = await res.json();
//         if (data.error) return null;
//         if (!res.ok) {
//           throw new Error(data.error || "Something went wrong");
//         }
//         return data;
//       } catch (error) {
//         if (error instanceof Error) {
//           throw new Error(error.message);
//         } else {
//           throw new Error("Something went wrong");
//         }
//       }
//     },
//     retry: false,
//   });

//   if (isLoading) {
//     return (
//       <div className="h-screen flex justify-center items-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       {authUser && <Header />}
//       <div className="flex flex-1">
//         {authUser && <Sidebar />}
//         <main className="flex-1">
//           <Routes>
//             <Route
//               path="/"
//               element={authUser ? <HomePage /> : <Navigate to="/login" />}
//             />
//             <Route
//               path="/login"
//               element={!authUser ? <LoginPage /> : <Navigate to="/" />}
//             />
//             <Route
//               path="/signup"
//               element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
//             />

//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }


import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import HomePage from "./pages/HomePage/HomePage";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

