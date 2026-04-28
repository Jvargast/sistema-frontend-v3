export const asSlotObject = (value, ownerState) =>
  typeof value === "function" ? value(ownerState) : value || {};

const mergeClassName = (base, legacy) =>
  [base, legacy].filter(Boolean).join(" ") || undefined;

const mergeSxValue = (base, legacy) => {
  if (!base) return legacy;
  if (!legacy) return base;
  return [
    ...(Array.isArray(base) ? base : [base]),
    ...(Array.isArray(legacy) ? legacy : [legacy]),
  ];
};

export const mergeSlotProp = (base, legacy) => {
  if (!legacy) return base;
  if (!base) return legacy;

  if (typeof base === "function" || typeof legacy === "function") {
    return (ownerState) =>
      mergeSlotProp(
        asSlotObject(base, ownerState),
        asSlotObject(legacy, ownerState)
      );
  }

  return {
    ...base,
    ...legacy,
    ...(base.className || legacy.className
      ? { className: mergeClassName(base.className, legacy.className) }
      : {}),
    ...(base.style || legacy.style
      ? { style: { ...base.style, ...legacy.style } }
      : {}),
    ...(base.sx || legacy.sx ? { sx: mergeSxValue(base.sx, legacy.sx) } : {}),
  };
};

export const mergeSlotProps = (slotProps = {}, additions = {}) => {
  const nextSlotProps = { ...slotProps };

  Object.entries(additions).forEach(([slot, value]) => {
    if (value) {
      nextSlotProps[slot] = mergeSlotProp(nextSlotProps[slot], value);
    }
  });

  return nextSlotProps;
};

export const mergeSlots = (slots = {}, additions = {}) => {
  const nextSlots = { ...slots };

  Object.entries(additions).forEach(([slot, value]) => {
    if (value) {
      nextSlots[slot] = value;
    }
  });

  return nextSlots;
};

export const normalizeMenuProps = (menuProps) => {
  if (!menuProps) return menuProps;

  const {
    BackdropProps,
    MenuListProps,
    PaperProps,
    TransitionComponent,
    TransitionProps,
    slotProps,
    slots,
    ...rest
  } = menuProps;

  return {
    ...rest,
    slots: mergeSlots(slots, { transition: TransitionComponent }),
    slotProps: mergeSlotProps(slotProps, {
      backdrop: BackdropProps,
      list: MenuListProps,
      paper: PaperProps,
      transition: TransitionProps,
    }),
  };
};

export const normalizeSelectProps = (selectProps) => {
  if (!selectProps) return selectProps;

  return {
    ...selectProps,
    MenuProps: normalizeMenuProps(selectProps.MenuProps),
  };
};
