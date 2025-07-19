import {
  Tabs,
  Tab,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { tabMenu } from "./tabMenu"; 

export default function NavigationTabs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.hash
    ? location.hash.replace(/^#/, "")
    : location.pathname;

  const tabIndex = tabMenu.findIndex((tab) => currentPath.startsWith(tab.path));

  if (isMobile) {
    return (
      <BottomNavigation
        showLabels
        value={tabIndex === -1 ? 0 : tabIndex}
        onChange={(_, newValue) => {
          navigate(tabMenu[newValue].path);
        }}
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
      >
        {tabMenu.map((tab) => (
          <BottomNavigationAction
            key={tab.key}
            label={tab.label}
            icon={tab.icon}
          />
        ))}
      </BottomNavigation>
    );
  }

  return (
    <Tabs
      value={tabIndex === -1 ? 0 : tabIndex}
      onChange={(_, newValue) => {
        navigate(tabMenu[newValue].path);
      }}
    >
      {tabMenu.map((tab) => (
        <Tab key={tab.key} label={tab.label} icon={tab.icon} />
      ))}
    </Tabs>
  );
}
