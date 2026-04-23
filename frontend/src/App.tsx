import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import About from "@/pages/About";
import OurStory from "@/pages/OurStory";
import Mission from "@/pages/Mission";
import Leadership from "@/pages/Leadership";
import Ministries from "@/pages/Ministries";
import Sermons from "@/pages/Sermons";
import Events from "@/pages/Events";
import Give from "@/pages/Give";
import LiveStream from "@/pages/LiveStream";
import Contact from "@/pages/Contact";
import Quotes from "@/pages/Quotes";
import Notices from "@/pages/Notices";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";

const queryClient = new QueryClient();
import Members from "@/pages/admin/Members";
import Attendance from "@/pages/admin/Attendance";
import Finance from "@/pages/admin/Finance";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminSermons from "@/pages/admin/AdminSermons";
import Communications from "@/pages/admin/Communications";
import PrayerRequests from "@/pages/admin/PrayerRequests";
import Analytics from "@/pages/admin/Analytics";
import PrayerRequestForm from "@/pages/PrayerRequestForm";
import Settings from "@/pages/admin/Settings";
import SocialQuotes from "@/pages/admin/SocialQuotes";
import Branches from "@/pages/admin/Branches";
import SundaySchool from "@/pages/admin/SundaySchool";
import UserRoles from "@/pages/admin/UserRoles";
import AdminNotices from "@/pages/admin/Notices";
import Messages from "@/pages/admin/Messages";
import MemberProfiles from "@/pages/admin/MemberProfiles";
import MemberTransfers from "@/pages/admin/MemberTransfers";
import FinanceReports from "@/pages/admin/FinanceReports";
import NotificationPreferences from "@/pages/admin/NotificationPreferences";
import AnalyticsEnhanced from "@/pages/admin/AnalyticsEnhanced";
import BackupAndSecurity from "@/pages/admin/BackupAndSecurity";
import RolesManagement from "@/pages/admin/RolesManagement";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/about/our-story" element={<PublicLayout><OurStory /></PublicLayout>} />
        <Route path="/about/mission" element={<PublicLayout><Mission /></PublicLayout>} />
        <Route path="/about/leadership" element={<PublicLayout><Leadership /></PublicLayout>} />
        <Route path="/ministries" element={<PublicLayout><Ministries /></PublicLayout>} />
        <Route path="/sermons" element={<PublicLayout><Sermons /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/give" element={<PublicLayout><Give /></PublicLayout>} />
        <Route path="/live" element={<PublicLayout><LiveStream /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/quotes" element={<PublicLayout><Quotes /></PublicLayout>} />
        <Route path="/prayer-request" element={<PublicLayout><PrayerRequestForm /></PublicLayout>} />
        <Route path="/notices" element={<PublicLayout><Notices /></PublicLayout>} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="member-profiles" element={<MemberProfiles />} />
          <Route path="member-transfers" element={<MemberTransfers />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="finance" element={<Finance />} />
          <Route path="finance-reports" element={<FinanceReports />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="sermons" element={<AdminSermons />} />
          <Route path="communications" element={<Communications />} />
          <Route path="prayer-requests" element={<PrayerRequests />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics-enhanced" element={<AnalyticsEnhanced />} />
          <Route path="notifications" element={<NotificationPreferences />} />
          <Route path="backup-security" element={<BackupAndSecurity />} />
          <Route path="roles-management" element={<RolesManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="social-quotes" element={<SocialQuotes />} />
          <Route path="branches" element={<Branches />} />
          <Route path="sunday-school" element={<SundaySchool />} />
          <Route path="user-roles" element={<UserRoles />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
      <Toaster />
    </Router>
    </AuthProvider>
    </QueryClientProvider>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default App;
