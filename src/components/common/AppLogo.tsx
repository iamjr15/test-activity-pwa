import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../../helper/responsiveScreen'
import { fontPath } from '../../utils/fontPath'
import { colors } from '../../utils/colors'

const AppLogo = () => {
  return (
    <View>
      <View style={styles.round} />
      <Text style={styles.title}>folkcomputing</Text>
    </View>
  )
}

export default AppLogo

const styles = StyleSheet.create({
  round: {
    width: wp(12),
    height: wp(12),
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 25
  },
  title: {
    fontFamily: fontPath.MontserratExtraBold,
    fontSize: 22,
    marginTop: hp(2),
    alignSelf:'center',
    color: colors.light_black
  }
})