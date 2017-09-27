//
//  ImageToBase64.m
//  TrafficPoliceRN
//
//  Created by sky on 2017/7/25.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <AssetsLibrary/AssetsLibrary.h>
#import <UIKit/UIKit.h>
#import "ImageToBase64.h"

@interface ImageToBase64()

@property (nonatomic,strong)RCTPromiseResolveBlock resolve;
@property (nonatomic,strong)RCTPromiseRejectBlock reject;

@end

@implementation ImageToBase64

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(convertToBase64:(NSString*)path
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIImage *image = [UIImage imageWithContentsOfFile:path];
    if(!image){
      NSMutableDictionary *map = [[NSMutableDictionary alloc] initWithCapacity:1];
      [map setObject:@"hasn't picker" forKey:@"error"];
      resolve(map);
      return;
    }
    
    float maxWidth = 750;
    float maxHeight = 1000;
    image = [self downscaleImageIfNecessary:image maxWidth:maxWidth maxHeight:maxHeight];
    NSData *data = UIImageJPEGRepresentation(image, 0.5);
//    [data writeToFile:path atomically:YES];
    NSString *dataString = [data base64EncodedStringWithOptions:0]; // base64 encoded image string
    
    NSMutableDictionary *map = [[NSMutableDictionary alloc] initWithCapacity:1];
    NSNumber *fileSizeValue = nil;
    NSError *fileSizeError = nil;
    NSURL *fileURL = [NSURL fileURLWithPath:path];
    [fileURL getResourceValue:&fileSizeValue forKey:NSURLFileSizeKey error:&fileSizeError];
    if (fileSizeValue){
      [map setObject:fileSizeValue forKey:@"fileSize"];
    }
    
    [map setObject:dataString forKey:@"base64"];
    resolve(map);
  });
  
}

- (UIImage*)downscaleImageIfNecessary:(UIImage*)image maxWidth:(float)maxWidth maxHeight:(float)maxHeight
{
  UIImage* newImage = image;
  
  // Nothing to do here
  if (image.size.width <= maxWidth && image.size.height <= maxHeight) {
    return newImage;
  }
  
  CGSize scaledSize = CGSizeMake(image.size.width, image.size.height);
  if (maxWidth < scaledSize.width) {
    scaledSize = CGSizeMake(maxWidth, (maxWidth / scaledSize.width) * scaledSize.height);
  }
  if (maxHeight < scaledSize.height) {
    scaledSize = CGSizeMake((maxHeight / scaledSize.height) * scaledSize.width, maxHeight);
  }
  
  // If the pixels are floats, it causes a white line in iOS8 and probably other versions too
  scaledSize.width = (int)scaledSize.width;
  scaledSize.height = (int)scaledSize.height;
  
  UIGraphicsBeginImageContext(scaledSize); // this will resize
  [image drawInRect:CGRectMake(0, 0, scaledSize.width, scaledSize.height)];
  newImage = UIGraphicsGetImageFromCurrentImageContext();
  if (newImage == nil) {
    NSLog(@"could not scale image");
  }
  UIGraphicsEndImageContext();
  
  return newImage;
}


@end
