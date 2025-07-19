import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { openTab, setActiveTab } from "../store/reducers/tabSlice";

function useTabNavigation() {
  const dispatch = useDispatch();
  const openTabs = useSelector((state) => state.tabs.openTabs);
  const navigate = useNavigate();

  return (tabKey, tabInfo) => {
    const exists = openTabs.find((tab) => tab.key === tabKey);
    if (!exists) {
      dispatch(
        openTab({
          key: tabKey,
          label: tabInfo.label,
          icon: tabInfo.icon,
          path: tabKey,
        })
      );
    }
    dispatch(setActiveTab(tabKey));
    navigate("/" + tabKey);
  };
}

export default useTabNavigation
