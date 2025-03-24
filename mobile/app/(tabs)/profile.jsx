import { View, Text } from "react-native";
import LogoutButton from "../../components/LogoutButton";
import React from "react";
import { style } from "../../assets/styles/profile.style";

export default function Profile() {
  return (
    <View style={style.container}>
      <LogoutButton />
    </View>
  );
}
