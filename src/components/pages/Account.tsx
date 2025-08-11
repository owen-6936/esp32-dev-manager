import useMediaQuery from "../../hooks/useMediaQuery";
import AccountPageContent from "../../constants/account-page-content";

const AccountPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm flex justify-around py-2 z-50">
          {[
            "profile",
            "stats",
            "achievements",
            "preferences",
            "security",
            "data",
          ].map((k) => (
            <button key={k} className="text-blue-200 text-sm">
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </nav>
      )}
      <div className={`p-4 ${isMobile ? "pb-16" : "max-w-7xl mx-auto p-6"}`}>
        <AccountPageContent isMobile={isMobile} />
      </div>
    </div>
  );
};

export default AccountPage;
