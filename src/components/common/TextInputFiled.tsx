import { Image, Platform, StyleProp, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { wp } from '../../helper/responsiveScreen'
import { fontPath } from '../../utils/fontPath'
import { colors } from '../../utils/colors'

interface TextInputFiledProps {
    placeholder: string
    multiline?: boolean
    value: string
    editable?: boolean
    onBlur?: (value : string | any) => void
    onChangeText: (value : string) => void
    secureTextEntry?: boolean
    type?: string
    source?: any
    onPress?: () => void
    style?: StyleProp<any>
}

const TextInputFiled = (props: TextInputFiledProps) => {
    return (
        <View style={[styles.row, props.style]}>
            <TextInput
                placeholder={props.placeholder}
                placeholderTextColor={colors.light_gray}
                style={styles.textinput}
                multiline={props.multiline}
                value={props.value}
                autoCapitalize={'none'}
                editable={props.editable}
                onBlur={props.onBlur}
                onChangeText={props.onChangeText}
                secureTextEntry={props.secureTextEntry}
            />
            {props.type == 'password' && <TouchableOpacity style={{alignSelf:'center'}} onPress={props.onPress}>
                <Image source={props.source} style={styles.icons} />
            </TouchableOpacity>}
        </ View>
    )
}

export default TextInputFiled

const styles = StyleSheet.create({
    row: {
        backgroundColor: colors.light_white,
        paddingVertical: Platform.OS == 'ios' && wp(4),
        paddingHorizontal:wp(5),
        borderRadius: 30,
        flexDirection: 'row',
        marginHorizontal: wp(8)
    },
    textinput: {
        flex:1,
        fontFamily: fontPath.PoppinsMedium,
        color:colors.black
    },
    icons: {
        width: wp(5),
        height: wp(5),
        resizeMode:'contain'
    }
})