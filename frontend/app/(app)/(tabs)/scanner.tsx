import React, { useState, useEffect, useRef, useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSession } from "@/app/ctx";
import { useFocusEffect } from "@react-navigation/native";

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const { hasUser } = useSession();
  const router = useRouter();

  // Persist across renders
  const scanSuccess = useRef(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    if (hasUser()) {
      getCameraPermissions();
    } else {
      router.replace("/sign-in");
    }
  }, []);

  // Handle screen focus to activate/deactivate camera
  useFocusEffect(
    useCallback(() => {
      setCameraActive(true);
      return () => {
        setCameraActive(false);
      };
    }, [])
  );

  async function handleBarcodeScanned({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) {
    if (scanSuccess.current) return;
    scanSuccess.current = true;

    console.log(`Scanned barcode type: ${type}\nData: ${data}`);

    router.push({
      pathname: "../ingredient",
      params: { scannedData: data },
    });

    setTimeout(() => {
      scanSuccess.current = false;
    }, 1000);
  }

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {cameraActive && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "code93",
              "itf14",
              "pdf417",
            ],
          }}
        />
      )}
      <StatusBar style="light" backgroundColor={"#000000"} translucent={false}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});