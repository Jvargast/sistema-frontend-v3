import { useEffect } from "react";
import { useSelector } from "react-redux";

function TabsPersister() {
  const tabsState = useSelector((state) => state.tabs);

  useEffect(() => {
    localStorage.setItem("tabsState", JSON.stringify(tabsState));
  }, [tabsState]);

  return null;
}

export default TabsPersister;
