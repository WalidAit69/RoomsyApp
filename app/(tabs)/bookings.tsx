import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import BookingCard from "@/components/Booking/BookingCard";
import Colors from "@/constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUserData } from "@/features/userSlice";
import CustomUserImage from "@/components/CustomUserImage";


const Page = () => {
  const router = useRouter();

  // data
  const [bookings, setbookings] = useState<any>();
  const [Booked, setBooked] = useState<any>();
  const [isLoading, setisLoading] = useState(false);

  // getting user with redux
  const dispatch: AppDispatch = useDispatch();
  const { User, Loading } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    dispatch(fetchUserData());
  }, []);


  // getting data
  async function getBookings() {
    if (User) {
      try {
        setisLoading(true);
        const { data } = await axios.get(
          `https://roomsy-v3-server.vercel.app/api/BookingPlaces/${User?.id}`
        );
        setbookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setisLoading(false);
      }
    }
  }
  async function getBooked() {
    if (User) {
      try {
        const { data } = await axios.get(
          `https://roomsy-v3-server.vercel.app/api/Booked/${User?.id}`
        );
        setBooked(data);
      } catch (error) {
        console.error(error);
      }
    }
  }
  useEffect(() => {
    if (User) {
      getBookings();
      getBooked();
    }
  }, [User]);
 
  return (
    <>
      <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
        <Stack.Screen
          options={{
            headerTitleAlign: "center",
            headerTitle: "Bookings",
            headerLeft: () => (
              <TouchableOpacity
                style={styles.headerleft}
                onPress={() => router.push("/(tabs)/profile")}
              >
                <CustomUserImage style={styles.img} source={User?.profilepic} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity style={styles.headerright}>
                <AntDesign name="search1" size={20} color="black" />
              </TouchableOpacity>
            ),
            headerShadowVisible: false,
            headerShown: !bookings && !Booked ? false : true,
            headerTitleStyle: {
              fontFamily: "popMedium",
            },
            headerBackground: () => <View style={styles.header}></View>,
            headerTransparent: true,
          }}
        />
        {!isLoading && (Booked || bookings) && User && (
          <View style={{ marginTop: 100 }}>
            <View style={{ alignItems: "center", marginTop: bookings && 20 }}>
              {bookings && (
                <Text style={[styles.container, styles.title]}>
                  My bookings
                </Text>
              )}
              <FlatList
                data={bookings}
                renderItem={(booking: any) => <BookingCard {...booking.item} />}
                keyExtractor={(booking) => booking._id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View
              style={{ alignItems: "center", marginVertical: Booked && 20 }}
            >
              {Booked && (
                <Text style={[styles.container, styles.title]}>
                  My booked places
                </Text>
              )}
              <View style={{ gap: 15 }}>
                {Booked &&
                  Booked.map((booking: any) => (
                    <BookingCard {...booking} key={booking._id} />
                  ))}
              </View>
            </View>
          </View>
        )}

        {(isLoading || Loading) && (
          <ActivityIndicator
            size={"large"}
            color={Colors.maincolor}
            style={{ marginTop: 150 }}
          />
        )}
      </ScrollView>

      {!isLoading && !bookings && !Booked && !Loading && (
        <View style={styles.center}>
          <MaterialCommunityIcons
            name="calendar-remove-outline"
            size={27}
            color="black"
          />
          <Text style={{ fontFamily: "popRegular", fontSize: 18 }}>
            No Bookings
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
  },
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
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  img: {
    height: "100%",
    width: "100%",
    borderRadius: 50,
  },
  headerright: {
    marginRight: 10,
    width: 40,
    height: 40,
    backgroundColor: Colors.backgoundcolorlight,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Page;
