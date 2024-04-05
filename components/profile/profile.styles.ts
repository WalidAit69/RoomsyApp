import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  UserCard: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: Colors.backgoundcolorlight,
    width: "90%",
    borderRadius: 12,
  },
  UserCardTop: {
    alignItems: "center",
    justifyContent: "center",
  },
  UserCardImg: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  UserCardTopText: {
    fontFamily: "popSemibold",
    fontSize: 16,
    marginTop: 10,
  },
  UserCardTopTexthost: {
    fontFamily: "popRegular",
    fontSize: 14,
    opacity: 0.5,
    lineHeight: 15,
  },
  UserCardBottom: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    width: "80%",
  },
  UserCardBottomView: {
    borderBottomWidth: 1,
    borderColor: "#cfcfcf",
  },
  UserCardBottomtext: {
    fontFamily: "popRegular",
    fontSize: 11,
    color: "#827f7f",
  },
  infoCard: {
    width: "90%",
    marginTop: 30,
    borderColor: "#cfcfcf",
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 12,
    gap: 20,
  },
  infoCardtext: {
    fontFamily: "popSemibold",
    fontSize: 16,
  },
  infoCardtextsm: {
    fontFamily: "popRegular",
    fontSize: 15,
    color: "#827f7f",
    marginTop: 1,
    maxWidth: "90%",
  },
  containerleft: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  about: {
    width: "90%",
    gap: 10,
    borderBottomWidth: 0.4,
    borderColor: "#cacaca",
    paddingBottom: 20,
  },
  aboutheaderText: {
    fontFamily: "popSemibold",
    fontSize: 25,
  },
  aboutView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  aboutText: {
    color: "#827f7f",
    fontFamily: "popRegular",
    marginTop: 3,
  },
  UserCardsbottomtext: {
    fontFamily: "popRegular",
    fontSize: 13,
    opacity: 0.6,
    width: "90%",
  },
  listingsheader: {
    width: "90%",
    marginTop: 20,
  },
  PlaceCard: {
    width: 250,
    marginLeft: 1,
  },
  PlaceCardImg: {
    width: "100%",
    height: 170,
    borderRadius: 10,
  },
  PlaceCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    alignItems: "center",
  },
  PlaceCardRating: {
    flexDirection: "row",
    marginTop: 2,
    alignItems: "center",
    gap: 2,
  },
  PlaceCardTopText: {
    fontFamily: "popSemibold",
    fontSize: 14,
  },
  PlaceCardBottomText: {
    fontFamily: "popRegular",
    fontSize: 12,
    opacity: 0.6,
    textAlign: "justify",
  },
  logoutBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "row",
    gap: 20,
  },
});

export default styles;
