import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

interface UserAvatarProps {
  size?: number;
  userName?: string;
  imageUri?: string;
  showInitials?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 100,
  userName = "",
  imageUri,
  showInitials = true,
}) => {
  const getInitials = (name: string) => {
    if (!name) return "?";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={[styles.avatar, avatarStyle]}
        onError={() => {
          // Fallback to initials if image fails to load
        }}
      />
    );
  }

  if (showInitials && userName) {
    return (
      <View
        style={[
          styles.initialsContainer,
          avatarStyle,
          styles.defaultBackground,
        ]}
      >
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
          {getInitials(userName)}
        </Text>
      </View>
    );
  }

  // Default avatar
  return (
    <View style={[styles.defaultContainer, avatarStyle]}>
      <Text style={[styles.defaultIcon, { fontSize: size * 0.5 }]}>👤</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#f0f0f0",
  },
  initialsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  defaultBackground: {
    backgroundColor: "#007AFF",
  },
  initials: {
    color: "#fff",
    fontWeight: "bold",
  },
  defaultContainer: {
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultIcon: {
    color: "#999",
  },
});

export default UserAvatar;
