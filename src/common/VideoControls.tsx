import { AntDesign, Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus } from "expo-av";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "./StyledComponents";


type Status = Partial<AVPlaybackStatus> & {
    isPlaying?: boolean;
    uri?: string;
    rate?: number;
    positionMillis?: number;
    playableDurationMillis?: number;
};

const VideoControls = ({
    onTogglePlayPause,
    onPlayPreviousVideo,
    onPlayNextVideo,
    onTogglePlaybackSpeed,
    onSeek,
    duration,
    currentTime,
    rate,
    shouldPlay,
    videoName,
}) => {
    const formatTime = (timeInMillis) => {
        if (!isNaN(timeInMillis)) {
            const totalSeconds = Math.floor(timeInMillis / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""
                }${seconds}`;
        }

        return "00:00";
    };
    return (
        <View style={styles.container}>
            <View style={styles.background} />
            <View style={styles.controls}>
            <Text style={styles.videoNameText}>{videoName}</Text>
                <TouchableOpacity
                    hasTVPreferredFocus={true}
                    onPress={() => {
                        onTogglePlayPause();
                    }}
                    style={styles.controlButton}
                >
                    <Ionicons
                        name={shouldPlay ? "pause" : "play-sharp"}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onPlayPreviousVideo}
                    style={styles.controlButton}
                >
                    <AntDesign name="stepbackward" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onSeek(-10000)}
                    style={styles.controlButton}
                >
                    <AntDesign name="fastbackward" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onSeek(10000)}
                    style={styles.controlButton}
                >
                    <AntDesign name="fastforward" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onPlayNextVideo}
                    style={styles.controlButton}
                >
                    <AntDesign name="stepforward" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        onTogglePlaybackSpeed();
                    }}
                    style={styles.controlButton}
                >
                    <Text style={styles.playbackSpeedText}>{`${rate}x`}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <ProgressBar fractionComplete={currentTime / duration} />
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.8,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    controlButton: {
        marginHorizontal: 10,
    },
    playbackSpeedText: {
        color: "white",
        fontSize: 16,
    },
    videoNameText: {
        color: "white",
        fontSize: 16,
        position:'absolute',
        left: 0,
        marginLeft: 20
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        alignSelf: "center",
        padding: 10,
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
    timeText: {
        marginHorizontal: 10,
        color: "white",
        fontSize: 12,
    },
});

export default VideoControls;