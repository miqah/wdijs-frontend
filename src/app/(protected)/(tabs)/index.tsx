import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system";
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  AudioModule,
  setAudioModeAsync,
} from "expo-audio";

import useCreateStreamableTranslation from "../../../hooks/api/translator/useCreateStreamableTranslation";

export default function HomeScreen() {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; text: string; timestamp: string }[]
  >([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [status, setStatus] = useState<
    "idle" | "listening" | "uploading" | "translating"
  >("idle");

  const { mutate } = useCreateStreamableTranslation();

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const isRecording = recorderState.isRecording;

  const flatListRef = useRef<FlatList>(null);
  const buttonsDisabled = status !== "idle";

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleTranslation = async (recordingUri: string) => {
    try {
      const info = await FileSystem.getInfoAsync(recordingUri);
      if (!info.exists || info.size < 1024) {
        Alert.alert("Recording too short", "Try speaking again.");
        setStatus("idle");
        return;
      }

      setStatus("uploading");

      mutate(
        {
          recordingUri,
          languageId: 1,
          onProgressUpdate: (update) => {
            setStatus("translating");
            if (update.response) {
              setMessages((prev) => [
                ...prev,
                {
                  type: "user",
                  text: update.response,
                  timestamp: getTimestamp(),
                },
              ]);
            }
            if (update.transcription) {
              setMessages((prev) => [
                ...prev,
                {
                  type: "bot",
                  text: update.transcription,
                  timestamp: getTimestamp(),
                },
              ]);
            }
          },
        },
        {
          onSuccess: () => setStatus("idle"),
          onError: (error) => {
            setStatus("idle");
            Alert.alert("Translation error", error.message);
          },
        }
      );
    } catch (error) {
      setStatus("idle");
      Alert.alert("Error", "Failed to process audio.");
    }
  };

  const speakTranslation = () => {
    const lastBotMessage = [...messages]
      .reverse()
      .find((msg) => msg.type === "bot");

    if (lastBotMessage && !isSpeaking) {
      setIsSpeaking(true);
      Speech.speak(lastBotMessage.text, {
        language: "ja-JP",
        pitch: 1.0,
        rate: 0.8,
        volume,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const stopSpeaking = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    }
  };

  const record = async () => {
    if (buttonsDisabled) return;

    // Set audio mode to allow recording - routes playback to earpiece
    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
      interruptionMode: AudioModule.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: AudioModule.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setStatus("listening");
  };

  const stopRecording = async () => {
    await audioRecorder.stop();

    // Set audio mode for playback - route audio to speaker
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
      interruptionMode: AudioModule.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: AudioModule.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    const recordingUri = audioRecorder.uri;
    if (recordingUri) {
      handleTranslation(recordingUri);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        interruptionMode: AudioModule.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid:
          AudioModule.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
    })();

    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.type === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatContainer}
      />

      {status !== "idle" && (
        <View style={styles.statusBar}>
          <ActivityIndicator size="small" color="#555" />
          <Text style={styles.statusText}>
            {status === "listening"
              ? "Listening..."
              : status === "uploading"
              ? "Uploading..."
              : "Translating..."}
          </Text>
        </View>
      )}

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Voice Volume</Text>
        <Slider
          style={{ width: 150 }}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor="#6a4c93"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#6a4c93"
          disabled={buttonsDisabled}
        />
      </View>

      <View style={styles.controls}>
        {!isRecording && (
          <TouchableOpacity
            onPress={record}
            style={[styles.micButton, buttonsDisabled && styles.disabled]}
            disabled={buttonsDisabled}
          >
            <FontAwesome name="microphone" size={28} color="#967ea7" />
          </TouchableOpacity>
        )}

        {isRecording && (
          <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
            <FontAwesome name="stop" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        {messages.some((msg) => msg.type === "bot") && (
          <TouchableOpacity
            onPress={isSpeaking ? stopSpeaking : speakTranslation}
            style={[styles.speakButton, buttonsDisabled && styles.disabled]}
            disabled={buttonsDisabled}
          >
            <FontAwesome
              name={isSpeaking ? "stop" : "volume-up"}
              size={22}
              color={isSpeaking ? "#ff6b6b" : "#6a4c93"}
            />
          </TouchableOpacity>
        )}

        {messages.length > 0 && (
          <TouchableOpacity
            onPress={() => setMessages([])}
            style={[styles.clearButton, buttonsDisabled && styles.disabled]}
            disabled={buttonsDisabled}
          >
            <FontAwesome name="trash" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f3fc",
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 140,
  },
  messageBubble: {
    maxWidth: "80%",
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#d1e7ff",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#f0dfff",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  timestamp: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
    textAlign: "right",
  },
  controls: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  micButton: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 40,
    elevation: 3,
  },
  stopButton: {
    backgroundColor: "#ff6b6b",
    padding: 16,
    borderRadius: 40,
    elevation: 3,
  },
  speakButton: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 30,
    elevation: 2,
  },
  clearButton: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 30,
    elevation: 2,
  },
  disabled: {
    opacity: 0.4,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingBottom: 4,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  sliderContainer: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  sliderLabel: {
    fontSize: 12,
    color: "#444",
    marginBottom: 4,
  },
});
