import { Platform, StyleSheet, Text, View } from "react-native";
import { CountryButton } from "react-native-country-codes-picker";

interface ListHeaderProps {
  countries: Country[];
  lang?: string;
  onPress: (country: Country) => void;
}

interface Country {
  name: { [key: string]: string };
  dial_code: string;
  code: string;
  flag: string;
}

export function ListHeaderComponent({
  countries,
  lang,
  onPress,
}: ListHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular countries</Text>
      {countries?.map((country, index) => {
        return (
          <CountryButton
            key={index}
            item={country}
            name={country?.name?.[lang || "en"]}
            onPress={() => onPress(country)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  title: {
    fontFamily: "popSemibold",
    fontSize: 16,
    marginBottom: 10,
    marginTop: Platform.OS == 'ios' ? 25 : 0,
  },
});
