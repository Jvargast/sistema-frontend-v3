import * as React from "react";
import PropTypes from "prop-types";
import { FixedSizeList } from "react-window";

const LISTBOX_PADDING = 8;

const OuterElementContext = React.createContext({});
const OuterElementType = React.forwardRef(function OuterElementType(
  props,
  ref
) {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function renderRow({ data, index, style }) {
  const item = data[index];
  return React.cloneElement(item, {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
}

export const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;

  const items = React.Children.toArray(children);
  const itemCount = items.length;

  const ITEM_SIZE = 48;

  const height = Math.min(8, itemCount) * ITEM_SIZE + 2 * LISTBOX_PADDING;

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          height={height}
          width="100%"
          itemSize={ITEM_SIZE}
          itemCount={itemCount}
          overscanCount={5}
          itemData={items}
          outerElementType={OuterElementType}
          innerElementType="ul" 
        >
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};
