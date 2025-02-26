import { MainLandingPage } from "@/components/MainLandingPage";
import { DashboardFeatures } from "@/components/DashboardFeatures";

// This is a mock function. In a real app, you'd use your authentication system.
const isUserSignedIn = () => {
  // Replace this with actual auth check
  return false;
};

export default function Home() {
  const userSignedIn = isUserSignedIn();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {userSignedIn ? <DashboardFeatures /> : <MainLandingPage />}
    </div>
  );
}
