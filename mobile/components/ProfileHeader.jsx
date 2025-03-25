import { View, Text } from "react-native";
import React from "react";
import { useAuthStore } from "../store/authStore";
import { style } from "../assets/styles/profile.style";
import { Image } from "expo-image";
import { formatMemberSince } from "../lib/utils";

export default function ProfileHeader() {
  const { user } = useAuthStore();

  console.log("user:", user);

  // required since the logout is happening fast, otherwise the image
  if (!user) return null;

  return (
    <View style={style.profileHeader}>
      <Image source={{ uri: user.profileImage }} style={style.profileImage} />

      <View style={style.profileInfo}>
        <Text style={style.username}>{user.username}</Text>
        <Text style={style.email}>{user.email}</Text>
        <Text style={style.memberSince}>
          🗓️ Joined {formatMemberSince(user.createdAt)}
        </Text>
      </View>
    </View>
  );
}
