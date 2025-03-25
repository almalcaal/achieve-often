import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { style } from "../../assets/styles/home.style";
import { BASE_URL } from "../../constants/urls";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { formatDate } from "../../lib/utils";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [todayHabits, setTodayHabits] = useState({
    date: "",
    goodCount: 0,
    badCount: 0,
  });
  const { user, token } = useAuthStore();

  const fetchTodayHabits = async () => {
    try {
      setLoading(true);
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
    }
  };

  useEffect(() => {
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
    <View style={style.container}>
      <View>
        <Text>{formatDate(todayHabits.date)}</Text>
        <View>
          <Text>Good: {todayHabits.goodCount}</Text>
          <Text>Bad: {todayHabits.badCount}</Text>
        </View>
      </View>
      <View>
        <View>
          <TouchableOpacity
            style={style.goodHabitButton}
            onPress={incrementGoodHabit}
          >
            <Ionicons name="add-circle-outline" size={40} />
          </TouchableOpacity>
          <TouchableOpacity
            style={style.goodHabitButton}
            onPress={decrementGoodHabit}
          >
            <Ionicons name="remove-circle-outline" size={40} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={style.badHabitButton}
            onPress={incrementBadHabit}
          >
            <Ionicons name="add-circle-outline" size={40} />
          </TouchableOpacity>
          <TouchableOpacity
            style={style.badHabitButton}
            onPress={decrementBadHabit}
          >
            <Ionicons name="remove-circle-outline" size={40} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
