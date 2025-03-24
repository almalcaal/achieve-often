import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { style } from "../../assets/styles/login.style";
import React, { useState } from "react";
import { Image } from "expo-image";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, login, isCheckingAuth } = useAuthStore();

  const handleLogin = async () => {
    const result = await login(email, password);

    if (!result.success) {
      Alert.alert("Error", result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={style.container}>
        {/* header */}
        <View style={style.topIllustration}>
          <Image
            source={require("../../assets/images/canoe.svg")}
            style={style.illustrationImage}
            contentFit="contain"
          />
        </View>

        {/* card form */}
        <View style={style.card}>
          <View style={style.formContainer}>
            <View style={style.inputGroup}>
              <Text style={style.label}>Email</Text>
              <View style={style.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={style.inputGroup}>
              <Text style={style.label}>Password</Text>
              <View style={style.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={style.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={style.button}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={style.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* footer */}
            <View style={style.footer}>
              <Text style={style.footerText}>Don't have an account?</Text>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <Text style={style.link}>Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
