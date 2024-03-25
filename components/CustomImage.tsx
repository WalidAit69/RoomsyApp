import { Image, ImageProps } from "react-native";

export default function CustomImage({
  source,
  ...rest
}: { source: string } & Omit<ImageProps, "source">) {
  if (typeof source === "string") {
    source = source.includes("https://")
      ? source
      : "https://roomsy-v3-server.vercel.app/server/routes/uploads/" + source;
  }

  return <Image {...rest} source={{ uri: source }} />;
}
