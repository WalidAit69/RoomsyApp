import Toast from "react-native-root-toast";
import Colors from "@/constants/Colors";

const UseToast = ({ msg }: any) => {
  return Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP,
    shadow: false,
    animation: true,
    hideOnPress: true,
    backgroundColor: Colors.maincolor,
    opacity: 1,
    textStyle: { fontFamily: "popMedium" },
  });
};

export default UseToast;
