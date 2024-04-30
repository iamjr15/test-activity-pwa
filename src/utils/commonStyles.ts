import { StyleSheet } from "react-native";
import { fontPath } from "./fontPath";
import { hp, wp } from "../helper/responsiveScreen";
import { colors } from "./colors";

export const commonstyle = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontFamily: fontPath.MontserratExtraBold,
        fontSize: 20,
        color: colors.light_black,
        textAlign: 'center',
        marginVertical: hp(5)
    },
    error: {
        fontFamily: fontPath.MontserratRegular,
        fontSize: 10,
        marginHorizontal: wp(12),
        marginTop: hp(1),
        color: colors.primary
    },
    checkbox: {
        width: wp(5),
        height: wp(5),
    },
    rowBottom: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: hp(5)
    },
    loginText: {
        fontFamily: fontPath.MontserratRegular,
        color: colors.light_black_1,
        alignSelf: 'center',
        marginRight: wp(5),
    },
    rightArrow: {
        backgroundColor: colors.primary,
        alignSelf: 'flex-start',
        width: wp(8),
        height: wp(8),
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomRowText:{
        flexDirection:'row',
        width:wp(90),
        alignSelf:'center',
        justifyContent:'space-between',
        position:'absolute',
        bottom:hp(5)
      },
      termText:{
        fontFamily:fontPath.PoppinsMedium,
        color:colors.light_black
      },
})