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
  rating: {
    fontFamily: "popSemibold",
    marginRight: 2,
    marginLeft: 4,
    marginTop: Platform.OS === "android" ? 5 : 0,
  },
  reviewslocation: {
    opacity: 0.7,
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
  pricecontainer: {},
  availabilitybtn: {
    backgroundColor: Colors.maincolor,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 7,
  },
  availabilitybtntext: {
    color: "white",
    fontFamily: "popMedium",
  },
  perkContainer: {
    marginTop: 15,
    flexDirection: "row",
    gap: 7,
  },
  perk: {
    gap: 0,
    maxWidth: "90%",
  },
  perktitle: {
    fontFamily: "popSemibold",
    fontSize: 15,
  },
  perkdesc: {
    fontFamily: "popRegular",
    fontSize: 14,
    opacity: 0.6,
  },
  amenities: {
    borderBottomWidth: 1,
    borderColor: Colors.bordercolor,
    paddingVertical: 15,
  },
  descriptiontext: {
    fontFamily: "popRegular",
    fontSize: 14,
  },
  descriptionbtn: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionbtntext: {
    fontFamily: "popBold",
    textDecorationLine: "underline",
  },
  arrangementsTitle: {
    fontFamily: "popBold",
    fontSize: 17,
  },
  arrangementCard: {
    height: 120,
    width: 140,
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 15,
    paddingLeft: 10,
    gap: 10,
  },
  arrangementCardTitle: {
    fontFamily: "popMedium",
    fontSize: 15,
  },
  arrangementCardSubtitle: {
    fontFamily: "popRegular",
    fontSize: 13,
  },
  ReviewContainer: {
    width: 250,
    height: 150,
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  ReviewTop: {
    flexDirection: "row",
    gap: 10,
  },
  reviewImg: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  reviewname: {
    fontFamily: "popSemibold",
    fontSize: 15,
  },
  reviewdate: {
    fontFamily: "popRegular",
    fontSize: 13,
    opacity: 0.6,
  },
  comment: {
    fontFamily: "popRegular",
    marginTop: 15,
  },
  MiniMap: {
    width: "100%",
    height: 400,
    marginTop: 10,
  },
  HomeContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.maincolor,
    alignItems: "center",
    justifyContent: "center",
  },
  HomeOuterContainer: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#fa693338",
    alignItems: "center",
    justifyContent: "center",
  },
  MorePlacesContainer: {
    alignItems: "center",
    backgroundColor: "#F3F3F4",
    width: "100%",
    marginTop: 30,
    paddingVertical: 30,
    marginBottom: 0,
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
});
