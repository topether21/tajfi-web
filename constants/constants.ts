import { Platform } from "react-native";

export const IS_NATIVE = Platform.OS !== "web";
export const IS_WEB = !IS_NATIVE;

export const APP_NAME = "Tajfi";
