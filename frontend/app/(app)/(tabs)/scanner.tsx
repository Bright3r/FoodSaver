import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { CameraView, Camera } from "expo-camera";
import { RootStackParams } from '../../RootStackParams';

type ScannerNavProp = StackNavigationProp<RootStackParams, 'Scanner'>;

interface ScannerProps {
  navigation: ScannerNavProp;
}

export default function Scanner({ navigation }: ScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scannedType, setScannedType] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScannedData(data);
    setScannedType(type);
    alert(`Scanned barcode type: ${type}\nData: ${data}`);

    navigation.navigate('Ingredient', { scannedData: data, scannedType: type });
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!cameraActive ? (
        <Button title="Open Scanner" onPress={() => setCameraActive(true)} />
      ) : (
        <>
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
          <View style={styles.buttonContainer}>
            {scanned ? (
              <>
                <Text style={styles.scannedText}>
                    Scanned Data: {scannedData}
                </Text>
                <Button title="Scan Again" onPress={() => setScanned(false)} />
              </>
            ) : (
              <Button title="Close Scanner" onPress={() => setCameraActive(false)} />
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scannedText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});