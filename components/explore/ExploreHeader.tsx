import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const categories = [
  {
    name: "All",
    icon: "earth-europe",
  },
  {
    name: "Entire home",
    icon: "house-chimney",
  },
  {
    name: "Studio",
    icon: "bed",
  },
  {
    name: "Mansion",
    icon: "place-of-worship",
  },
  {
    name: "Unique stays",
    icon: "gem",
  },
  {
    name: "Outdoor gateways",
    icon: "campground",
  },
  {
    name: "Luxe",
    icon: "bell-concierge",
  },
];

interface Props {
  onCategoryChanged: (category: string) => void;
  setFadeRight: any;
}

const ExploreHeader = ({ onCategoryChanged, setFadeRight }: Props) => {
  const router = useRouter();
  const catsRef = useRef<Array<TouchableOpacity | null>>([]);
  const ScrollRef = useRef<ScrollView>(null);
  const [activeIndex, setactiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    const selected = catsRef.current[index];
    setactiveIndex(index);

    if (index < activeIndex) {
      setFadeRight(true);
    } else {
      setFadeRight(false);
    }

    selected?.measure((x) => {
      ScrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/(modals)/booking")}
        >
          <View style={styles.actionRow}>
            <View style={styles.actionRowLeft}>
              <AntDesign name="search1" size={23} color="black" />
              <Text
                style={{
                  opacity: 0.6,
                  fontFamily: "popRegular",
                  fontSize: 13,
                  marginTop: 3,
                }}
              >
                Where are you going ?
              </Text>
            </View>

            <TouchableOpacity>
              <Ionicons name="options-outline" size={23} color="black" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <ScrollView
          ref={ScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: 45,
            paddingHorizontal: 16,
          }}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity
              style={
                activeIndex === index
                  ? styles.categoryBtnActive
                  : styles.categoryBtn
              }
              key={index}
              ref={(el) => (catsRef.current[index] = el)}
              onPress={() => {
                selectCategory(index);
              }}
            >
              <FontAwesome6
                name={cat.icon as any}
                size={20}
                color={activeIndex === index ? "black" : "#C7C8CC"}
              />
              <Text
                style={
                  activeIndex === index
                    ? styles.categoryTextActive
                    : styles.categoryText
                }
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 0 : 30,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  actionRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionBtn: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 40,
  },
  categoryBtn: {
    alignItems: "center",
    marginTop: 15,
    justifyContent: "center",
    paddingBottom: 10,
  },
  categoryBtnActive: {
    alignItems: "center",
    marginTop: 15,
    justifyContent: "center",
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: "black",
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "popRegular",
    color: "#C7C8CC",
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: "popRegular",
    color: "black",
  },
});

export default ExploreHeader;
