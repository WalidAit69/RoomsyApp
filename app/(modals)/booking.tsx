import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import Colors from "@/constants/Colors";
import { places } from "@/assets/data/places";
import { Dropdown } from "react-native-element-dropdown";
import useCountries from "@/hooks/useCountries";
import UseToast from "@/widgets/Toast";

//@ts-ignore
import DatePicker from "react-native-modern-datepicker";

const booking = () => {
  const router = useRouter();
  const [openCard, setopenCard] = useState(0);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  //Countries
  const countries = useCountries().getAll();
  const [isFocus, setIsFocus] = useState(false);
  const [selectedPlace, setselectedPlace] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("");
  const renderLabel = () => {
    if (selectedCountry || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: Colors.maincolor }]}>
          Select country
        </Text>
      );
    }
    return null;
  };
  const handleLocationClick = (index: number, title: string) => {
    setselectedPlace(index);
    setSelectedCountry(title);
  };

  //Check in/out
  const [ShowCalendar, setShowCalendar] = useState(false);
  const [Checkin, setCheckin] = useState();
  const [Checkout, setCheckout] = useState();
  const today = new Date().toISOString().substring(0, 10);
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

  // Guests
  const [adults, setadults] = useState(1);
  const [childrens, setchildrens] = useState(0);
  const [infants, setinfants] = useState(0);
  const guests = adults + childrens + infants;
  const handleAdultsMinusClick = () => {
    if (adults > 1) {
      setadults(adults - 1);
    }
  };

  //sending data
  const [isLoading, setisLoading] = useState(false);
  const onClear = () => {
    setselectedPlace(0);
    setSelectedCountry("");
    setopenCard(0);
    setCheckin(undefined);
    setCheckout(undefined);
    setadults(1);
    setchildrens(0);
    setinfants(0);
    setShowCalendar(false);
  };
  const onSearch = async () => {
    if (selectedCountry && Checkin && Checkout && guests) {
      try {
        setisLoading(true);

        router.push({
          pathname: "/(modals)/placesearch",
          params: { selectedCountry, Checkin, Checkout, guests },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setisLoading(false);
      }
    } else {
      UseToast({ msg: "Please fill all fields" });
    }
  };

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
                  {renderLabel()}
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isFocus && { borderColor: Colors.maincolor },
                    ]}
                    placeholder={!isFocus ? "Select country" : "..."}
                    data={countries}
                    value={selectedCountry}
                    labelField="label"
                    valueField="value"
                    onChange={(item) => {
                      setSelectedCountry(item.value);
                      setIsFocus(false);
                      setselectedPlace(0);
                    }}
                    search
                    searchPlaceholder="Search..."
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                  />
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
                    onPress={() => handleLocationClick(index, place.title)}
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

              <Animated.View
                entering={FadeIn.delay(300)}
                style={styles.cardBody}
              >
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
                  <Animated.View
                    entering={FadeIn.delay(200)}
                    style={{ gap: 10 }}
                  >
                    <TouchableOpacity
                      onPress={handlecheckinClick}
                      style={
                        !ShowCalendar
                          ? styles.searchSectionActive
                          : styles.searchSectionNoActive
                      }
                    >
                      <Text style={styles.searchSectionText}>{Checkin}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handlecheckoutClick}
                      style={
                        ShowCalendar
                          ? styles.searchSectionActive
                          : styles.searchSectionNoActive
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
                  </Animated.View>
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

              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Animated.View
                  entering={FadeIn.delay(200)}
                  style={styles.guestcontainer}
                >
                  <View style={styles.guests}>
                    <Text style={styles.guestText}>Adults</Text>
                    <Text style={styles.guestDesc}>Ages 13 or above</Text>
                  </View>

                  <View style={styles.guestnumbercountainer}>
                    <TouchableOpacity
                      disabled={adults === 1}
                      style={adults === 1 ? styles.icon : styles.iconActive}
                      onPress={handleAdultsMinusClick}
                    >
                      <AntDesign name="minus" size={15} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.guestnumber}>{adults}</Text>

                    <TouchableOpacity
                      style={styles.iconActive}
                      onPress={() => {
                        setadults(adults + 1);
                      }}
                    >
                      <AntDesign name="plus" size={15} color="black" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>

                <Animated.View
                  entering={FadeIn.delay(300)}
                  style={styles.guestcontainer}
                >
                  <View style={styles.guests}>
                    <Text style={styles.guestText}>Children</Text>
                    <Text style={styles.guestDesc}>Ages 2-12</Text>
                  </View>

                  <View style={styles.guestnumbercountainer}>
                    <TouchableOpacity
                      disabled={childrens === 0}
                      style={childrens === 0 ? styles.icon : styles.iconActive}
                      onPress={() => {
                        setchildrens(childrens - 1);
                      }}
                    >
                      <AntDesign name="minus" size={15} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.guestnumber}>{childrens}</Text>

                    <TouchableOpacity
                      style={styles.iconActive}
                      onPress={() => {
                        setchildrens(childrens + 1);
                      }}
                    >
                      <AntDesign name="plus" size={15} color="black" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>

                <Animated.View
                  entering={FadeIn.delay(400)}
                  style={[styles.guestcontainer, { borderBottomWidth: 0 }]}
                >
                  <View style={styles.guests}>
                    <Text style={styles.guestText}>Infants</Text>
                    <Text style={styles.guestDesc}>Under 2</Text>
                  </View>

                  <View style={styles.guestnumbercountainer}>
                    <TouchableOpacity
                      disabled={infants === 0}
                      style={infants === 0 ? styles.icon : styles.iconActive}
                      onPress={() => {
                        setinfants(infants - 1);
                      }}
                    >
                      <AntDesign name="minus" size={15} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.guestnumber}>{infants}</Text>

                    <TouchableOpacity
                      style={styles.iconActive}
                      onPress={() => {
                        setinfants(infants + 1);
                      }}
                    >
                      <AntDesign name="plus" size={15} color="black" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
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

          <TouchableOpacity
            onPress={onSearch}
            style={styles.btn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator
                size={Platform.OS === "ios" ? "small" : 30}
                color={Colors.mainlightcolor}
              />
            ) : (
              <>
                <AntDesign
                  name="search1"
                  size={20}
                  color="white"
                  style={{ marginBottom: 2 }}
                />
                <Text style={styles.btntext}>Search</Text>
              </>
            )}
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
    borderRadius: 5,
    width: 130,
    height: 55,
    justifyContent: "center",
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
    backgroundColor: "white",
  },
  dropdown: {
    minHeight: 60,
    height: "auto",
    borderColor: Colors.bordercolor,
    borderWidth: 0.5,
    borderRadius: 8,
    flex: 1,
    fontFamily: "popMedium",
    paddingHorizontal: 20,
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
  searchSectionNoActive: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingLeft: 20,
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
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 13,
    fontFamily: "popRegular",
    color: Colors.bordercolor,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "popRegular",
    opacity: 0.5,
  },
  selectedTextStyle: {
    fontSize: 15,
    fontFamily: "popMedium",
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 14,
    borderRadius: 8,
    fontFamily: "popRegular",
  },
  guestcontainer: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: Colors.backgoundcolor,
    marginTop: 20,
    marginBottom: 10,
    width: "90%",
  },
  guests: {
    gap: 5,
  },
  guestText: {
    fontFamily: "popRegular",
    fontSize: 15,
  },
  guestDesc: {
    fontFamily: "popRegular",
    fontSize: 14,
    opacity: 0.5,
  },
  guestnumbercountainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  guestnumber: {
    fontFamily: "popMedium",
    fontSize: 16,
    marginTop: 5,
  },
  iconActive: {
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    padding: 10,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    padding: 10,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.3,
  },
});

export default booking;
