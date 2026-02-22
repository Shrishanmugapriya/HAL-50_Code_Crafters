import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import TaskDetail from "./pages/TaskDetail";
import Gigs from "./pages/Gigs";
import CreateGig from "./pages/CreateGig";
import GigDetail from "./pages/GigDetail";
import MyGigs from "./pages/MyGigs";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import WalletPage from "./pages/Wallet";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/create" element={<CreateTask />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/gigs" element={<Gigs />} />
              <Route path="/gigs/create" element={<CreateGig />} />
              <Route path="/gigs/:id" element={<GigDetail />} />
              <Route path="/my-gigs" element={<MyGigs />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<UserProfile />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
