import AsyncStorage from "@react-native-async-storage/async-storage";

const useLocalUser = () => async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("user_session");
    const User = jsonValue != null ? JSON.parse(jsonValue) : null;

    return User;
  } catch (error) {
    console.log("Error getting data:", error);
  }
};

export default useLocalUser;
