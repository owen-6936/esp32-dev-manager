import Profile from "../components/ui/account/Profile";
import Stats from "../components/ui/account/Stats";
import Achievements from "../components/ui/account/Achievements";
import Preferences from "../components/ui/account/Preferences";
import Security from "../components/ui/account/Security";
import DataAndPrivacy from "../components/ui/account/DataAndPrivacy";

export const accountTabs = [
  { key: "profile", title: "Profile", panel: <Profile /> },
  { key: "stats", title: "Statistics", panel: <Stats /> },
  { key: "achievements", title: "Achievements", panel: <Achievements /> },
  { key: "preferences", title: "Preferences", panel: <Preferences /> },
  { key: "security", title: "Security", panel: <Security /> },
  { key: "data", title: "Data & Privacy", panel: <DataAndPrivacy /> },
];
