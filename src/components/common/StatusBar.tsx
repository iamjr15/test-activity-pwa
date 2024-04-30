import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "react-native";
import React from 'react';

export function FocusAwareStatusBar(props: any) {
    const isFocused = useIsFocused();

    return isFocused ? <StatusBar{...props} /> : null;
}
