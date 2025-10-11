import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const THRESHOLD = 70;
const MAX_PULL = 120;

export default function PullToRefresh({
  onRefresh,
  scrollTargetRef,
  disabled = false,
  children,
}) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef(null);
  const pullingRef = useRef(false);

  useEffect(() => {
    const el = scrollTargetRef?.current;
    if (!el || disabled) return;

    const onTouchStart = (e) => {
      if (refreshing) return;
      if (el.scrollTop !== 0) return;
      startYRef.current = e.touches[0].clientY;
      pullingRef.current = true;
      setPull(0);
    };

    const onTouchMove = (e) => {
      if (!pullingRef.current || refreshing) return;
      if (el.scrollTop !== 0) return;
      const dy = e.touches[0].clientY - startYRef.current;
      if (dy > 0) {
        e.preventDefault(); 
        const d = Math.min(dy, MAX_PULL);
        setPull(d);
      } else {
        setPull(0);
      }
    };

    const onTouchEnd = async () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;

      if (pull >= THRESHOLD && !refreshing) {
        try {
          setRefreshing(true);
          setPull(THRESHOLD);
          await onRefresh?.();
        } finally {
          setTimeout(() => {
            setRefreshing(false);
            setPull(0);
          }, 300);
        }
      } else {
        setPull(0);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [scrollTargetRef, disabled, refreshing, pull, onRefresh]);

  return (
    <Box
      sx={{
        position: "relative",
        transform: `translateY(${pull}px)`,
        transition: refreshing
          ? "transform 120ms ease"
          : "transform 180ms ease",
        willChange: "transform",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: `-${Math.max(pull, THRESHOLD)}px`,
          left: 0,
          right: 0,
          height: Math.max(pull, THRESHOLD),
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            mb: 1,
            opacity: pull > 8 ? 1 : 0,
            transition: "opacity .15s",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {refreshing ? (
            <CircularProgress size={20} />
          ) : (
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid",
                borderColor: "divider",
                borderTopColor: "primary.main",
                transform: `rotate(${(pull / THRESHOLD) * 180}deg)`,
                transition: "transform .1s",
              }}
            />
          )}
          <Box component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
            {refreshing
              ? "Actualizando…"
              : pull >= THRESHOLD
              ? "Suelta para refrescar"
              : "Desliza para refrescar"}
          </Box>
        </Box>
      </Box>

      {children}
    </Box>
  );
}

PullToRefresh.propTypes = {
  onRefresh: PropTypes.func,
  scrollTargetRef: PropTypes.object,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};
