/**
 * Created by wr on 16/4/26.
 * © 2016 NCF GROUP ALL RIGHTS RESERVED
 */

import { Platform, Dimensions, AsyncStorage } from "react-native"

const { width, height } = Dimensions.get("window")

export const Version = '1.1';
export const W = width
export const H = height
export const InputH = 50

/* 修正不同屏幕 字体和尺寸 */
export function getResponsiveSize ( x ) {
  return (W / 320) * x
}
