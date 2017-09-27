//
//  BaiduMapModule.h
//  TrafficPoliceRN
//
//  Created by Sky on 2017/6/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Location/BMKLocationComponent.h>
#import <BaiduMapAPI_Search/BMKSearchComponent.h>

#ifndef BaiduMapModule_h
#define BaiduMapModule_h

// 设置本身为百度general代理
@interface BaiduMapModule : NSObject <RCTBridgeModule, BMKGeneralDelegate, BMKLocationServiceDelegate, BMKGeoCodeSearchDelegate>
@end

#endif /* BaiduMapModule_h */
