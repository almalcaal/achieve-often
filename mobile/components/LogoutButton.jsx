import { Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useAuthStore } from "../store/authStore";
import { style } from "../assets/styles/profile.style";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function LogoutButton() {
  const { logout } = useAuthStore();

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" },
    ]);
  };

  return (
    <TouchableOpacity style={style.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
      <Text style={style.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
