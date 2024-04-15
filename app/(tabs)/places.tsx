import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import CustomUserImage from "@/components/CustomUserImage";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUserData } from "@/features/userSlice";
import { ChangeLocation, fetchPlaces } from "@/features/placeSlice";
import Colors from "@/constants/Colors";
import { fetchLocation } from "@/features/userLocation";
import Bars from "@/widgets/Bars";
import Animated, { FadeIn } from "react-native-reanimated";
import PlaceCard from "@/components/places/placeCard";

const Page = () => {
  const router = useRouter();

  // getting user and places and location with redux
  const dispatch: AppDispatch = useDispatch();
  const { address, loading: locationloading } = useSelector(
    (state: RootState) => state.loaction
  );
  const { User, Loading } = useSelector((state: RootState) => state.user);

  const {
    PlaceByLocation,
    Place,
    Loading: isLoading,
  } = useSelector((state: RootState) => state.place);

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchPlaces());
    dispatch(fetchLocation());
  }, []);

  const [country, setcountry] = useState<string | null>();

  useEffect(() => {
    setcountry(address?.country);
    if (country != undefined) {
      const filteredPlaces =
        Place &&
        Place.filter((place) => {
          return country === "" || place.country === country;
        });

      dispatch(ChangeLocation(filteredPlaces?.slice(0, 5)));
    } else {
      dispatch(ChangeLocation(Place?.slice(0, 5)));
    }
  }, [Place, country, address]);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerTitle: "",
          headerLeft: () => (
            <View style={styles.headerleftContainer}>
              <TouchableOpacity
                style={styles.headerleft}
                onPress={() => router.push("/(tabs)/profile")}
              >
                <CustomUserImage style={styles.img} source={User?.profilepic} />
              </TouchableOpacity>

              <View>
                <Text style={styles.textlight}>Current location</Text>
                {!locationloading ? (
                  <TouchableOpacity
                    style={[styles.headerleftContainer, { gap: 3 }]}
                  >
                    <Ionicons
                      name="location-sharp"
                      size={20}
                      color={Colors.maincolor}
                    />

                    <Text style={[styles.textdark, { marginTop: 1 }]}>
                      {address
                        ? address?.country + "," + address?.city
                        : "Choose a country"}
                    </Text>

                    <Ionicons name="chevron-down" size={20} color="gray" />
                  </TouchableOpacity>
                ) : (
                  <ActivityIndicator size={"small"} color={Colors.maincolor} />
                )}
              </View>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/notifications")}
              style={styles.headerright}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={"black"}
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerShown: Loading && isLoading ? false : true,
          headerTitleStyle: {
            fontFamily: "popMedium",
          },
          headerBackground: () => <View style={styles.header}></View>,
          headerTransparent: true,
        }}
      />

      {!Loading && !isLoading ? (
        <ScrollView
          style={{ marginTop: 100, marginBottom: 10 }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={{ width: "95%" }}>
            <Animated.View
              entering={FadeIn.delay(100)}
              style={styles.searchBar}
            >
              <Ionicons name="search" size={22} color={Colors.bordercolor} />
              <TextInput style={styles.input} placeholder="Search..." />
              <TouchableOpacity>
                <Bars />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(200)}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Explore your country</Text>
                <TouchableOpacity>
                  <Text style={styles.btn}>See all</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>

          <Animated.FlatList
            entering={FadeIn.delay(300)}
            data={PlaceByLocation}
            renderItem={(place) => <PlaceCard SelectedPlace={place.item} />}
            keyExtractor={(place) => place._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <View style={{ width: "95%" }}>
            <View>
              <Animated.View
                entering={FadeIn.delay(400)}
                style={styles.titleRow}
              >
                <Text style={styles.title}>Popular Location</Text>
                <TouchableOpacity>
                  <Text style={styles.btn}>See all</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

          <Animated.FlatList
            entering={FadeIn.delay(600)}
            data={Place?.slice(5, 10)}
            renderItem={(place) => <PlaceCard SelectedPlace={place.item} />}
            keyExtractor={(place) => place._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>
      ) : (
        <ActivityIndicator
          size={"large"}
          color={Colors.maincolor}
          style={{ marginTop: 100 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: "100%",
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "popSemibold",
    fontSize: 20,
    marginBottom: 5,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#fff",
  },
  headerleft: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  img: {
    height: "100%",
    width: "100%",
    borderRadius: 50,
  },
  headerright: {
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.bordercolor,
  },
  headerleftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textlight: {
    fontFamily: "popRegular",
    fontSize: 12,
    opacity: 0.5,
  },
  textdark: {
    fontFamily: "popMedium",
    fontSize: 13,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 60,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: "popMedium",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 20,
  },
  btn: {
    fontFamily: "popMedium",
    color: Colors.maincolor,
    textDecorationLine: "underline",
  },
});

export default Page;
