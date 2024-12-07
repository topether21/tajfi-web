import "@expo/metro-runtime";
import { Buffer } from "buffer";
import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";
global.Buffer = Buffer;
renderRootComponent(App);
