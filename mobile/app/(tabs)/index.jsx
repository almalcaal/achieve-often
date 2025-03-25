import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView, // Import ScrollView
  RefreshControl, // Import RefreshControl
} from "react-native";
import React, { useEffect, useState, useCallback } from "react"; // Import useCallback
import { style } from "../../assets/styles/home.style";
import { BASE_URL } from "../../constants/urls";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { formatDate } from "../../lib/utils";
import COLORS from "../../constants/colors";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [todayHabits, setTodayHabits] = useState({
    date: "",
    goodCount: 0,
    badCount: 0,
  });
  const { user, token } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state

  const fetchTodayHabits = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const { _id: userId } = user;
      const response = await fetch(
        `${BASE_URL}/auth/${userId}/today?timezone=${
          Intl.DateTimeFormat().resolvedOptions().timeZone
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch today's habits");
      setTodayHabits(data);
    } catch (err) {
      console.log("Error fetching today's habits:", err);
      Alert.alert("Error", "Failed to fetch habits.");
    } finally {
      setLoading(false);
      setRefreshing(false); // Set refreshing to false when done
    }
  };

  useEffect(() => {
    fetchTodayHabits();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTodayHabits();
  }, []);

  const updateHabit = async (url) => {
    try {
      setLoading(true);

      const { _id: userId } = user;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // Alert.alert("Success", "Habit updated!");
      fetchTodayHabits(); // Re-fetch data after successful update
    } catch (err) {
      console.log("Error updating habit:", err);
      Alert.alert("Error caught", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const incrementGoodHabit = async () => {
    await updateHabit(`${BASE_URL}/auth/${user._id}/good`);
  };

  const decrementGoodHabit = async () => {
    await updateHabit(`${BASE_URL}/auth/${user._id}/good/decrement`);
  };

  const incrementBadHabit = async () => {
    await updateHabit(`${BASE_URL}/auth/${user._id}/bad`);
  };

  const decrementBadHabit = async () => {
    await updateHabit(`${BASE_URL}/auth/${user._id}/bad/decrement`);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={style.emptyContainer}></View>
      <View style={style.contentContainer}>
        <View style={style.headerContainer}>
          <Text style={style.headerText}>{formatDate(todayHabits.date)}</Text>
          <View style={style.subHeaderContainer}>
            <Text style={style.subHeaderText}>
              Good: {todayHabits.goodCount}
            </Text>
            <Text style={style.subHeaderText}>Bad: {todayHabits.badCount}</Text>
          </View>
        </View>
        <View style={style.habitButtonsMainContainer}>
          <View style={style.habitButtonsSubContainer}>
            <TouchableOpacity
              style={style.goodHabitButton}
              onPress={incrementGoodHabit}
            >
              <Ionicons
                name="add-circle-outline"
                size={70}
                style={{ color: COLORS.goodButton }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={style.goodHabitButton}
              onPress={decrementGoodHabit}
            >
              <Ionicons
                name="remove-circle-outline"
                size={70}
                style={{ color: COLORS.goodButton }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={style.badHabitButton}
              onPress={incrementBadHabit}
            >
              <Ionicons
                name="add-circle-outline"
                size={70}
                style={{ color: COLORS.badButton }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={style.badHabitButton}
              onPress={decrementBadHabit}
            >
              <Ionicons
                name="remove-circle-outline"
                size={70}
                style={{ color: COLORS.badButton }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
