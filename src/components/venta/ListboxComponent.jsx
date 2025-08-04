import { FixedSizeList } from "react-window";
import * as React from "react";
import PropTypes from "prop-types";

const LISTBOX_PADDING = 8; 

const renderRow = (props) => {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
};
export const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;

  return (
    <div ref={ref} {...other}>
      <FixedSizeList
        height={220}
        width="100%"
        itemSize={54}
        itemCount={itemCount}
        overscanCount={5}
        itemData={children}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};
