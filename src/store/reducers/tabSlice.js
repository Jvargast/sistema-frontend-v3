import { createSlice } from "@reduxjs/toolkit";

function arrayMove(arr, from, to) {
  const newArr = arr.slice();
  const [moved] = newArr.splice(from, 1);
  newArr.splice(to, 0, moved);
  return newArr;
}

const persistedTabs = (() => {
  try {
    const raw = localStorage.getItem("tabsState");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = persistedTabs || {
  openTabs: [],
  activeTab: null,
};

const tabSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    openTab: (state, action) => {
      const { key, label, icon, path } = action.payload;
      const exists = state.openTabs.find((tab) => tab.key === key);

      if (!exists) {
        state.openTabs.push({
          key,
          label,
          icon,
          path,
          minimized: false,
        });
      }
      state.activeTab = key;
    },

    closeTab: (state, action) => {
      const key = action.payload;
      const tabIndex = state.openTabs.findIndex((tab) => tab.key === key);

      if (tabIndex !== -1) {
        const wasActive = state.activeTab === key;
        state.openTabs.splice(tabIndex, 1);

        if (wasActive) {
          const right = state.openTabs
            .slice(tabIndex)
            .find((t) => !t.minimized);
          const left = [...state.openTabs.slice(0, tabIndex)]
            .reverse()
            .find((t) => !t.minimized);
          const next = right || left || null;
          state.activeTab = next ? next.key : null;
        }
      }
    },

    setActiveTab: (state, action) => {
      const key = action.payload;
      const tabExists = state.openTabs.find((tab) => tab.key === key);

      if (tabExists) {
        state.activeTab = key;
      }
    },

    minimizeTab: (state, action) => {
      const key = action.payload;
      const tab = state.openTabs.find((tab) => tab.key === key);

      if (tab) {
        tab.minimized = true;

        if (state.activeTab === key) {
          const nextActiveTab = state.openTabs.find(
            (t) => t.key !== key && !t.minimized
          );
          state.activeTab = nextActiveTab?.key || null;
        }
      }
    },

    maximizeTab: (state, action) => {
      const key = action.payload;
      const tab = state.openTabs.find((tab) => tab.key === key);

      if (tab) {
        tab.minimized = false;
        state.activeTab = key;
      }
    },

    closeAllTabs: (state) => {
      state.openTabs = [];
      state.activeTab = null;
      localStorage.setItem(
        "tabsState",
        JSON.stringify({ openTabs: [], activeTab: null })
      );
    },

    closeOtherTabs: (state, action) => {
      const keepKey = action.payload;
      const tabToKeep = state.openTabs.find((tab) => tab.key === keepKey);

      if (tabToKeep) {
        state.openTabs = [tabToKeep];
        state.activeTab = keepKey;
      }
    },

    reorderTabs: (state, action) => {
      const { from, to } = action.payload;
      if (
        from !== to &&
        from >= 0 &&
        to >= 0 &&
        from < state.openTabs.length &&
        to < state.openTabs.length
      ) {
        state.openTabs = arrayMove(state.openTabs, from, to);

        const currentActiveIdx = state.openTabs.findIndex(
          (tab) => tab.key === state.activeTab
        );
        if (currentActiveIdx === -1 && state.openTabs.length > 0) {
          state.activeTab = state.openTabs[0].key;
        }
      }
    },

    updateTabLabel: (state, action) => {
      const { key, label } = action.payload;
      const tab = state.openTabs.find((tab) => tab.key === key);

      if (tab) {
        tab.label = label;
      }
    },
    syncWithRoute: (state, action) => {
      const { path } = action.payload;
      const matchingTab = state.openTabs.find(
        (tab) => tab.path === path || tab.key === path
      );

      if (matchingTab && state.activeTab !== matchingTab.key) {
        state.activeTab = matchingTab.key;
      }
    },
    navigateToTab: (state, action) => {
      const { key, label, icon, path } = action.payload;

      const existingTab = state.openTabs.find((tab) => tab.key === key);

      if (!existingTab) {
        state.openTabs.push({
          key,
          label,
          icon,
          path,
          minimized: false,
        });
      }
      state.activeTab = key;
    },

    handleRouteNavigation: (state, action) => {
      const { path, tabInfo } = action.payload;

      if (tabInfo) {
        const { key, label, icon } = tabInfo;
        const existingTab = state.openTabs.find((tab) => tab.key === key);

        if (!existingTab) {
          state.openTabs.push({
            key,
            label,
            icon,
            path,
            minimized: false,
          });
        }

        state.activeTab = key;
      }
    },
  },
});

export const {
  openTab,
  closeTab,
  setActiveTab,
  minimizeTab,
  maximizeTab,
  closeAllTabs,
  closeOtherTabs,
  reorderTabs,
  updateTabLabel,
  syncWithRoute,
  navigateToTab,
  handleRouteNavigation,
} = tabSlice.actions;

export default tabSlice.reducer;
