import * as React from "react";
import PropTypes from "prop-types";
import { List } from "react-window";

function RowComponent({ index, style, items }) {
  const item = items[index];
  return React.cloneElement(item, {
    style: {
      ...item.props.style,
      ...style,
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

  const height = Math.min(8, itemCount) * ITEM_SIZE;

  return (
    <div ref={ref}>
      <List
        {...other}
        rowComponent={RowComponent}
        rowCount={itemCount}
        rowHeight={ITEM_SIZE}
        rowProps={{ items }}
        overscanCount={5}
        tagName="ul"
        style={{ height, width: "100%" }}
      />
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

RowComponent.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
};
