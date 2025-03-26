import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useAuthStore } from "../store/authStore";
import { style } from "../assets/styles/profile.style";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function DeleteButton() {
  const { user, deleteUser } = useAuthStore();

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account?",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteUser(user._id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={style.deleteButton} onPress={confirmDelete}>
      <Ionicons name="trash-outline" size={20} color={COLORS.white} />
      <Text style={style.logoutText}>Delete</Text>
    </TouchableOpacity>
  );
}
