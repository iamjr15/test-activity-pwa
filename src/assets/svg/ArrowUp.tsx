import React from 'react';
import {ClipPath, Defs, G, Path, Rect, Svg} from 'react-native-svg';

const ArrowUp = () => {
  return (
    <Svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <G clip-path="url(#clip0_35_498)">
        <Path
          d="M20 10.5L13 17.5L6 10.5"
          stroke="black"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_35_498">
          <Rect
            width="25.428"
            height="25.0908"
            fill="white"
            transform="matrix(0 1 -1 0 25.082 0.198792)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default ArrowUp;
