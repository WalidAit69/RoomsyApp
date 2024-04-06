import { Image, ImageProps } from "react-native";

export default function CustomUserImage({
  source,
  ...rest
}: { source: string | undefined } & Omit<ImageProps, "source">) {
  if (typeof source === "string") {
    source = source.includes("https://")
      ? source
      : "https://roomsy-v3-server.vercel.app/" + source;
  }

  return <Image {...rest} source={{ uri: source }} />;
}
