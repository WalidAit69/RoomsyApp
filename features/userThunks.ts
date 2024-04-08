import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchLocalUser = () => async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("user_session");
    const User = jsonValue != null ? JSON.parse(jsonValue) : null;

    return User;
  } catch (error) {
    console.log("Error getting data:", error);
  }
};
