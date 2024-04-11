import Colors from "@/constants/Colors";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    height: 100,
  },
  Images: {
    width: "100%",
    height: 500,
  },
  headerleft: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: "#fff",
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 40,
  },
  headerleftText: {
    fontFamily: "popMedium",
  },
  headerright: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  headerrightText: {
    fontFamily: "popMedium",
    textDecorationLine: "underline",
  },
  container: {
    alignItems: "center",
    backgroundColor: "white",
  },
  Textcontainer: {
    width: "92%",
  },
  title: {
    fontFamily: "popSemibold",
    fontSize: 22,
    marginTop: 15,
  },
  rowcontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bordercolor,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  hostContainer: {
    paddingVertical: 20,
  },
  hostinfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hostText: {
    fontFamily: "popMedium",
    fontSize: 18,
  },
  hostimage: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  placeinfo: {
    marginTop: 5,
    fontFamily: "popRegular",
    opacity: 0.6,
  },
  InfoContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.bordercolor,
    marginTop: 5,
    paddingTop: 20,
    width: "100%",
    alignItems: "center",
  },
  availability: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amenities: {
    borderBottomWidth: 1,
    borderColor: Colors.bordercolor,
    paddingVertical: 15,
  },
  rowcheck: {
    flexDirection: "row",
    alignItems: "center",
  },
  textdark: {
    fontFamily: "popMedium",
    fontSize: 14,
  },
  textlight: {
    fontFamily: "popRegular",
    fontSize: 12.5,
    opacity: 0.6,
  },
  dots: {
    width: 10,
    height: 3,
    marginHorizontal: 3,
    borderRadius: 3,
    backgroundColor: Colors.backgoundcolor,
  },
  activedot: {
    backgroundColor: Colors.maincolor,
    width: 15,
    height: 3,
    marginHorizontal: 3,
    borderRadius: 3,
  },
  dotscontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
    flexWrap: "wrap",
    marginHorizontal: 5,
    rowGap: 5,
  },
  reviewtitle: {
    fontFamily: "popMedium",
    fontSize: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontFamily: "popRegular",
    paddingTop: 15 ,
  },
  reviewbtn: {
    backgroundColor: Colors.maincolor,
    width: "50%",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  reviewbtntext: {
    color: "#fff",
    fontFamily: "popMedium",
    fontSize: 13,
  },
  errortext: {
    color: "red",
    fontFamily: "popRegular",
    fontSize: 12,
    marginLeft: 2,
  },
});
