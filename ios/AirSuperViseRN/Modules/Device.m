//
//  Device.m
//  XinfenqiApp
//
//  Created by renhanyi on 2017/2/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "Device.h"
#import <CoreTelephony/CTCarrier.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import "SAMKeychain.h"

@implementation Device
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getDeviceId,
                 resolver1:(RCTPromiseResolveBlock)resolve
                 rejecter1:(RCTPromiseRejectBlock)reject)
{
  NSString *appName=[[[NSBundle mainBundle] infoDictionary] objectForKey:(NSString*)kCFBundleNameKey];
  NSString *strApplicationUUID =  [SAMKeychain passwordForService:appName account:@"incoding"];
  if (strApplicationUUID == nil)
  {
    strApplicationUUID  = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    
    NSError *error = nil;
    SAMKeychainQuery *query = [[SAMKeychainQuery alloc] init];
    query.service = appName;
    query.account = @"incoding";
    query.password = strApplicationUUID;
    query.synchronizationMode = SAMKeychainQuerySynchronizationModeNo;
    [query save:&error];
    
  }
  
  resolve(strApplicationUUID);
}

//接口方法，显示通讯录选择
RCT_REMAP_METHOD(getImsiCode,
                 resolver2:(RCTPromiseResolveBlock)resolve
                 rejecter2:(RCTPromiseRejectBlock)reject)
{
  CTTelephonyNetworkInfo *info = [[CTTelephonyNetworkInfo alloc] init];
  CTCarrier *carrier = [info subscriberCellularProvider];
  NSString *mcc = [carrier mobileCountryCode];
  NSString *mnc = [carrier mobileNetworkCode];
  NSString *imsi = [NSString stringWithFormat:@"%@%@", mcc, mnc];
  
  resolve(imsi);
}

@end
