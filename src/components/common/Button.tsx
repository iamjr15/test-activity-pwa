import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../../helper/responsiveScreen'
import { fontPath } from '../../utils/fontPath'
import { colors } from '../../utils/colors'

interface  ButtonProps {
    buttonName: string
    onPress: () => void
    width: number
    buttonStyle?: StyleProp<any>
    isLoading?: boolean
}

const Button = (props:ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button,{width:props?.width}, props.buttonStyle]} onPress={props?.onPress}>
       {props.isLoading ?
        <ActivityIndicator color={colors.light_white} size={50}/>:
        <Text style={styles.buttonText}>{props?.buttonName}</Text>}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button:{
        backgroundColor:colors.primary,
        borderRadius:30
    },
    buttonText:{
        fontFamily:fontPath.PoppinsSemiBold,
        color:colors.white,
        textAlign:'center',
        fontSize:18,
        paddingVertical:hp(1.5)
    }
})