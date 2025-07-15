import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Box, OrbitControls } from "@react-three/drei/native";
import useGetRadicals from "../../../hooks/api/kanji-builder/useGetRadicals";

export default function BuilderScreen() {
  const { data } = useGetRadicals();

  const [canvasRadicals, setCanvasRadicals] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const addRadicalToCanvas = (radical) => {
    const newRadical = {
      ...radical,
      position: [Math.random() * 4 - 2, Math.random() * 4 - 2, 0],
      id: `canvas-${radical.id}-${Date.now()}`,
    };

    setCanvasRadicals([...canvasRadicals, newRadical]);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas} camera={{ position: [0, 0, 5], fov: 60 }}>
        {canvasRadicals.map((radical) => (
          <Box key={radical.id} position={radical.position} scale={0.5}>
            <meshStandardMaterial
              color={`hsl(${Math.random() * 360}, 70%, 60%)`}
            />
          </Box>
        ))}
        <gridHelper />
        <OrbitControls enableZoom={true} zoomSpeed={0.5} />
      </Canvas>

      <View style={styles.uiContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={toggleDropdown}
        >
          <Text style={styles.dropdownHeaderText}>
            {isDropdownOpen ? "▲ Hide Radicals" : "▼ Show Radicals"}
          </Text>
        </TouchableOpacity>

        {/* Dropdown Content */}
        {isDropdownOpen && (
          <View style={styles.dropdownContent}>
            <FlatList
              data={data || []}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.radicalItem}
                  onPress={() => addRadicalToCanvas(item)}
                >
                  <View style={styles.radicalBox}>
                    <Text style={styles.radicalText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Canvas Radicals Count */}
        <View style={styles.canvasInfo}>
          <Text style={styles.canvasInfoText}>
            Radicals in Canvas: {canvasRadicals.length}
          </Text>
        </View>

        {/* Clear Canvas Button */}
        {canvasRadicals.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setCanvasRadicals([])}
          >
            <Text style={styles.clearButtonText}>Clear Canvas</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  canvas: {
    flex: 1,
  },
  uiContainer: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownHeader: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#3498db",
    borderRadius: 8,
    alignItems: "center",
  },
  dropdownHeaderText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  dropdownContent: {
    marginTop: 10,
    maxHeight: 200,
  },
  radicalItem: {
    flex: 1 / 3, // 3 columns
    padding: 5,
  },
  radicalBox: {
    backgroundColor: "#ecf0f1",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  radicalText: {
    fontSize: 16,
  },
  canvasInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    alignItems: "center",
  },
  canvasInfoText: {
    fontSize: 14,
    color: "#2c3e50",
  },
  clearButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
