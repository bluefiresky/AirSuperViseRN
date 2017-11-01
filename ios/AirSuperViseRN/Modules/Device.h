//
//  Device.h
//  XinfenqiApp
//
//  Created by renhanyi on 2017/2/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface Device : NSObject<RCTBridgeModule>
@property (nonatomic, strong) RCTPromiseResolveBlock resolve;
@end
