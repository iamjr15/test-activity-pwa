import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ClipPath, Defs, G, Mask, Path, Rect, Svg } from 'react-native-svg'

const SendIcons = () => {
    return (
        <Svg width="28" height="26" viewBox="0 0 28 26" fill="none">
            <G clip-path="url(#clip0_35_579)">
                <Mask id="mask0_35_579" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="2" y="2" width="22" height="24">
                    <Path fill-rule="evenodd" clip-rule="evenodd" d="M2.0769 2.50046H23.2077V25.2493H2.0769V2.50046Z" fill="white" />
                </Mask>
                <G mask="url(#mask0_35_579)">
                    <Path fill-rule="evenodd" clip-rule="evenodd" d="M11.6187 16.2874L15.5817 23.2093C15.7551 23.5126 16.0261 23.5091 16.1355 23.4928C16.245 23.4764 16.5083 23.4041 16.6037 23.0599L21.5594 5.04075C21.6461 4.72225 21.4868 4.50525 21.4152 4.42825C21.3459 4.35125 21.1476 4.18675 20.8604 4.27425L4.11092 9.55459C3.7934 9.65492 3.72405 9.94192 3.70888 10.0598C3.6937 10.1799 3.68937 10.4774 3.97004 10.6676L10.4732 15.0461L16.219 8.79509C16.5343 8.45209 17.0491 8.44859 17.3687 8.78809C17.6884 9.12759 17.6906 9.68292 17.3752 10.0259L11.6187 16.2874ZM16.051 25.2498C15.2967 25.2498 14.6053 24.8368 14.1979 24.1274L9.99643 16.7879L3.10851 12.1504C2.36619 11.6499 1.97823 10.7586 2.09852 9.82175C2.21772 8.88492 2.81484 8.14059 3.65361 7.87575L20.4031 2.59542C21.1736 2.35275 21.9993 2.58259 22.5672 3.19159C23.135 3.80642 23.3464 4.70475 23.1166 5.53775L18.1609 23.5558C17.9128 24.4623 17.2192 25.1028 16.3512 25.2276C16.2493 25.2416 16.1507 25.2498 16.051 25.2498Z" fill="black" />
                </G>
            </G>
            <Defs>
                <ClipPath id="clip0_35_579">
                    <Rect width="25.0227" height="27.7791" fill="white" transform="matrix(0 1 -1 0 27.9479 0.845001)" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default SendIcons;