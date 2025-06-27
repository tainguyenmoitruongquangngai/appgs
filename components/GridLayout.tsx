import React from "react";
import { View, StyleSheet } from "react-native";

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  spacing?: number;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  columns = 2,
  spacing = 12,
}) => {
  const childrenArray = React.Children.toArray(children);
  const rows: React.ReactNode[][] = [];

  // Group children into rows
  for (let i = 0; i < childrenArray.length; i += columns) {
    rows.push(childrenArray.slice(i, i + columns));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.row,
            {
              marginBottom: rowIndex < rows.length - 1 ? spacing : 0,
            },
          ]}
        >
          {row.map((child, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.column,
                {
                  flex: 1 / columns,
                  marginRight: colIndex < row.length - 1 ? spacing / 2 : 0,
                  marginLeft: colIndex > 0 ? spacing / 2 : 0,
                },
              ]}
            >
              {child}
            </View>
          ))}

          {/* Fill empty spaces in the last row */}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map(
              (_, emptyIndex) => (
                <View
                  key={`empty-${emptyIndex}`}
                  style={[
                    styles.column,
                    {
                      flex: 1 / columns,
                      marginLeft: spacing / 2,
                    },
                  ]}
                />
              )
            )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  column: {
    justifyContent: "center",
  },
});
