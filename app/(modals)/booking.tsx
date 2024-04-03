import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import Colors from "@/constants/Colors";
import { places } from "@/assets/data/places";
import { format } from "date-fns";

//@ts-ignore
import DatePicker from "react-native-modern-datepicker";

const booking = () => {
  const router = useRouter();
  const today = new Date().toISOString().substring(0, 10);
  const [openCard, setopenCard] = useState(0);
  const [selectedPlace, setselectedPlace] = useState(0);

  const [ShowCalendar, setShowCalendar] = useState(false);
  const [Checkin, setCheckin] = useState();
  const [Checkout, setCheckout] = useState();

  const [nextDay, setnextDay] = useState(new Date());

  const handlecheckinClick = () => {
    setShowCalendar(false);
    setCheckout(undefined);
  };

  const handlecheckoutClick = () => {
    setShowCalendar(true);
    if (Checkin) {
      const nextDay = new Date(Checkin);
      nextDay.setDate(nextDay.getDate() + 1);
      setnextDay(nextDay);
    }
  };

  const onClear = () => {
    setselectedPlace(0);
    setopenCard(0);
  };

  const onSearch = () => {};

  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <BlurView
      intensity={70}
      experimentalBlurMethod={"dimezisBlurView"}
      tint="light"
      style={styles.container}
    >
      <ScrollView style={{ marginBottom: 120 }}>
        {/* Where */}
        <View style={styles.card}>
          {openCard != 0 && (
            <AnimatedTouchableOpacity
              entering={FadeIn.duration(200)}
              style={styles.cardbtn}
              onPress={() => setopenCard(0)}
            >
              <Text style={styles.previewText}>Where</Text>
              <Text style={styles.previewDate}>I'm flexible</Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 0 && (
            <Animated.View>
              <Animated.Text
                entering={FadeIn.delay(200)}
                style={styles.cardHeader}
              >
                Where to ?
              </Animated.Text>

              <Animated.View
                entering={FadeIn.delay(300)}
                style={styles.cardBody}
              >
                <View style={styles.searchSection}>
                  <AntDesign name="search1" size={17} color="black" />
                  <TextInput placeholder="Search" style={styles.dropdown} />
                </View>
              </Animated.View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 15,
                  paddingHorizontal: 15,
                  marginBottom: 20,
                }}
              >
                {places.map((place, index) => (
                  <AnimatedTouchableOpacity
                    entering={FadeIn.delay(400)}
                    key={index}
                    onPress={() => setselectedPlace(index)}
                  >
                    <Image
                      source={place.img}
                      style={
                        selectedPlace === index
                          ? styles.placeSelected
                          : styles.place
                      }
                    />
                    <Text
                      style={
                        selectedPlace === index
                          ? styles.placeSelectedtext
                          : styles.placetext
                      }
                    >
                      {place.title}
                    </Text>
                  </AnimatedTouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )}
        </View>

        {/* When */}
        <View style={styles.card}>
          {openCard != 1 && (
            <AnimatedTouchableOpacity
              entering={FadeIn.duration(200)}
              style={styles.cardbtn}
              onPress={() => setopenCard(1)}
            >
              <Text style={styles.previewText}>When</Text>
              <Text style={styles.previewDate}>Any week</Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 1 && (
            <Animated.View>
              <Animated.Text
                entering={FadeIn.delay(200)}
                style={styles.cardHeader}
              >
                When's your trip ?
              </Animated.Text>

              <Animated.View style={styles.cardBody}>
                {!ShowCalendar && (
                  <DatePicker
                    options={{
                      defaultFont: "popMedium",
                      headerFont: "popSemibold",
                      mainColor: Colors.maincolor,
                    }}
                    current={today}
                    selected={Checkin}
                    mode="calendar"
                    style={{ borderRadius: 10 }}
                    minimumDate={today}
                    onSelectedChange={(date: any) =>
                      setCheckin(date.replace(/\//g, "-"))
                    }
                  />
                )}
                {ShowCalendar && (
                  <DatePicker
                    options={{
                      defaultFont: "popMedium",
                      headerFont: "popSemibold",
                      mainColor: Colors.maincolor,
                    }}
                    minimumDate={nextDay.toISOString().substring(0, 10)}
                    current={nextDay.toISOString().substring(0, 10)}
                    selected={Checkout}
                    mode="calendar"
                    style={{ borderRadius: 10 }}
                    onSelectedChange={(date: any) =>
                      setCheckout(date.replace(/\//g, "-"))
                    }
                  />
                )}

                {Checkin && (
                  <View style={{ gap: 10 }}>
                    <TouchableOpacity
                      onPress={handlecheckinClick}
                      style={
                        !ShowCalendar
                          ? styles.searchSectionActive
                          : styles.searchSection
                      }
                    >
                      <Text style={styles.searchSectionText}>{Checkin}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handlecheckoutClick}
                      style={
                        ShowCalendar
                          ? styles.searchSectionActive
                          : styles.searchSection
                      }
                    >
                      {Checkout ? (
                        <Text style={styles.searchSectionText}>{Checkout}</Text>
                      ) : (
                        <Text
                          style={[styles.searchSectionText, { opacity: 0.5 }]}
                        >
                          Select check out
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </Animated.View>
          )}
        </View>

        {/* Who */}
        <View style={styles.card}>
          {openCard != 2 && (
            <AnimatedTouchableOpacity
              entering={FadeIn.duration(200)}
              style={styles.cardbtn}
              onPress={() => setopenCard(2)}
            >
              <Text style={styles.previewText}>Who</Text>
              <Text style={styles.previewDate}>Add guests</Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 2 && (
            <Animated.View>
              <Animated.Text
                entering={FadeIn.delay(200)}
                style={styles.cardHeader}
              >
                Who's coming ?
              </Animated.Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={onClear}>
            <Text
              style={{
                fontFamily: "popMedium",
                fontSize: 16,
                textDecorationLine: "underline",
              }}
            >
              Clear All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSearch} style={styles.btn}>
            <AntDesign
              name="search1"
              size={20}
              color="white"
              style={{ marginBottom: 2 }}
            />
            <Text style={styles.btntext}>Search</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  footer: {
    position: "absolute",
    width: "100%",
    padding: 30,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    bottom: 0,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Colors.maincolor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  btntext: {
    color: "#fff",
    fontFamily: "popMedium",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  cardbtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  previewText: {
    fontFamily: "popRegular",
    opacity: 0.5,
    fontSize: 14,
  },
  previewDate: {
    fontFamily: "popMedium",
    opacity: 0.8,
    fontSize: 14,
  },
  cardHeader: {
    fontFamily: "popSemibold",
    fontSize: 20,
    padding: 20,
  },
  cardBody: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  searchSection: {
    height: 60,
    flexDirection: "row",
    borderColor: Colors.bordercolor,
    borderWidth: 1,
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingLeft: 20,
  },
  dropdown: {
    flex: 1,
    height: "100%",
    fontFamily: "popMedium",
  },
  place: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  placeSelected: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  placetext: {
    fontFamily: "popRegular",
    fontSize: 13,
    opacity: 0.5,
  },
  placeSelectedtext: {
    fontFamily: "popRegular",
    fontSize: 13,
    opacity: 1,
  },
  searchSectionActive: {
    height: 60,
    flexDirection: "row",
    borderColor: Colors.maincolor,
    borderWidth: 1,
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingLeft: 20,
  },
  searchSectionText: {
    fontFamily: "popMedium",
    fontSize: 14,
  },
});

export default booking;
