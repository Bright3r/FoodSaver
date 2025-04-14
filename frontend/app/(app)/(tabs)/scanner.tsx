import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useRouter } from 'expo-router';
import {StatusBar} from "expo-status-bar";

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(true); // Set to true so camera starts automatically

  const router = useRouter();

  let scanSuccess = false;

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  async function handleBarcodeScanned ({ type, data }: { type: string; data: string }) {
    if (scanSuccess) return;
    scanSuccess = true;

    //setScanned(true);
    setScannedData(data);
    //setCameraActive(false);

    console.log(`Scanned barcode type: ${type}\nData: ${data}`);

    router.push({
      pathname: '../ingredient',
      params: { scannedData: data },
    });

    setTimeout(() => scanSuccess = false, 1000);
  };

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
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "qr",
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
      <StatusBar style="light" backgroundColor={"#000000"}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannedText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
