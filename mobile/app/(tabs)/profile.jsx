import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import LogoutButton from "../../components/LogoutButton";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { style } from "../../assets/styles/profile.style";
import ProfileHeader from "../../components/ProfileHeader";
import { useAuthStore } from "../../store/authStore";
import { BASE_URL } from "../../constants/urls";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

export default function Profile() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const fetchData = async () => {
    console.log("this running thou");
    try {
      setIsLoading(true);
      const { _id: userId } = user;
      console.log("HERE DA ID DOUGH:", userId);
      const response = await fetch(
        `${BASE_URL}/auth/${userId}/habits?page=${page}&limit=10&timezone=${
          Intl.DateTimeFormat().resolvedOptions().timeZone
        }`, // Adjust limit
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch habits");
      }

      if (data.habits.length === 0) {
        setAllDataLoaded(true);
      } else {
        setHabits((prevHabits) => [...prevHabits, ...data.habits]);
      }
    } catch (err) {
      console.log("Error in fetchData:", err);
      Alert.alert("Error", "Failed to load habits. Pull down to refresh.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setHabits([]);
    setPage(1);
    setAllDataLoaded(false);
    await fetchData();
  };

  const renderHabitItem = ({ item }) => (
    <View style={style.bookItem}>
      <View style={style.bookInfoDate}>
        <Text style={style.bookDate}>{item.localizedDate}</Text>
      </View>
      <View style={style.bookInfo}>
        <Text style={style.bookCaption}>Good Habits: {item.goodCount}</Text>
        <Text style={style.bookCaption}>Bad Habits: {item.badCount}</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (isLoading) {
      return <ActivityIndicator />;
    }
    return null;
  };

  // console.log("timezone?", Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <View style={style.container}>
      <ProfileHeader />
      <LogoutButton />

      {/* habit history */}
      <View style={style.booksHeader}>
        <Text style={style.booksTitle}>Habit History ✅</Text>
      </View>

      {/* render flatlist */}
      <FlatList
        data={habits}
        renderItem={renderHabitItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={() => {
          if (!allDataLoaded && !isLoading) {
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={style.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={style.emptyText}>No habit history yet</Text>
          </View>
        }
      />
    </View>
  );
}
