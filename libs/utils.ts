import { Platform } from "react-native";
const isWebview = require("is-ua-webview");

export const isWebView = () => {
    if (Platform.OS === "web") {
        // Check if running in webview to handle redirect appropriately
        // since webview doesn't support router.push()
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const webview = isWebview(userAgent);
        if (webview) {
            console.log("isWebView", { userAgent, webview });
            return true
        }
    }
}