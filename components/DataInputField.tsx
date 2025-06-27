import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface DataInputFieldProps {
  label: string;
  value: string;
  unit?: string;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  icon?: string;
  required?: boolean;
  error?: string;
}

export const DataInputField: React.FC<DataInputFieldProps> = ({
  label,
  value,
  unit,
  placeholder,
  editable = true,
  keyboardType = "default",
  onChangeText,
  onPress,
  icon,
  required = false,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={styles.inputContainer}>
        {icon && (
          <View style={styles.iconContainer}>
            <Icon name={icon} size={20} color="#666" />
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.inputWrapper,
            !editable && styles.disabledInput,
            error && styles.errorInput,
          ]}
          onPress={onPress}
          disabled={!onPress}
          activeOpacity={onPress ? 0.7 : 1}
        >
          <TextInput
            style={[
              styles.input,
              !editable && styles.disabledText,
              unit && styles.inputWithUnit,
            ]}
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#999"
            editable={editable && !onPress}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
          />

          {unit && (
            <View style={styles.unitContainer}>
              <Text style={styles.unitText}>{unit}</Text>
            </View>
          )}

          {onPress && (
            <View style={styles.chevronContainer}>
              <Icon name="chevron-forward" size={20} color="#666" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#ff3b30",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRightWidth: 0,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    minHeight: 50,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  inputWithUnit: {
    paddingRight: 0,
  },
  disabledInput: {
    backgroundColor: "#f8f9fa",
  },
  disabledText: {
    color: "#666",
  },
  errorInput: {
    borderColor: "#ff3b30",
  },
  unitContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#f8f9fa",
    borderLeftWidth: 1,
    borderLeftColor: "#e1e1e1",
    minWidth: 60,
    alignItems: "center",
  },
  unitText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  chevronContainer: {
    paddingHorizontal: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#ff3b30",
    marginTop: 4,
  },
});

export default DataInputField;
