/**
* Created by wuran on 16/12/21.
* 页面容器，页面提供导航等页面基础配置
*/
import React, {Component} from 'react';
import {View, StatusBar, StyleSheet, Platform } from 'react-native';

import {connect} from 'react-redux';
import { Reducer, Actions, Router, Scene, Modal, OpenPro } from 'react-native-router-flux';

/** 自定义 */
import { mainBackColor, mainColor, mainTabBarColor, borderColor } from './configs/index.js';
import { routerReducerCreate } from './redux/index.js';

/** 所有views页面 */
import * as Scenes from './views/index.js';
import * as Components from './components/index.js';

const backIcon = require('./views/image/icon-back.png');
const statusBackColor = Platform.select({ android:mainColor, ios:'transparent' })

class RootView extends Component {

  constructor(props){
    super(props);
    this.state={
      statusBackColor: statusBackColor
    };
  }

  render(){
    let { statusBackColor } = this.state;
    let { guide, isAuth } = this.props;
    console.log('the ROOT view props -->> ', this.props);
    return(
      <View style={styles.container}>
        <StatusBar backgroundColor={statusBackColor} />

        <Router createReducer={routerReducerCreate} getSceneStyle={getSceneStyle}>
          <Scene key="modal" component={Modal}>
            <Scene key="root" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle} leftButtonStyle={styles.leftButtonStyle} leftButtonIconStyle={styles.backButtonImage} backButtonImage={backIcon} backButtonTextStyle={styles.backButtonTextStyle} rightButtonTextStyle={styles.rightButtonTextStyle} hideTabBar backTitle='返回'>

              <Scene key="main" component={Scenes.MainView} hideNavBar panHandlers={null}/>
              <Scene key="login" component={Scenes.LoginView} title='登录' direction="vertical" hideNavBar={true} initial={!isAuth} panHandlers={null}/>
              <Scene key="commonWeb" component={Scenes.CommonWebView} hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="signature" component={Scenes.SignatureView} hideNavBar={true} backTitle='返回' panHandlers={null}/>
              <Scene key="lawWeb" component={Scenes.LawWebView} hideNavBar={false} backTitle='返回' panHandlers={null}/>

              <Scene key="apHome" component={Scenes.APHomeView} title='网上办公大厅' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apFireControlTypes" component={Scenes.APFireControlTypesView} title='消防网上预约办理' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apFireControlTemplet" component={Scenes.APFireControlTempletView} title='消防网上预约办理' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apHistoryList" component={Scenes.APHistoryListView} title='历史预约' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apAirMerchantCheck" component={Scenes.APAirMerchantCheckView} title='空防新入场单位资质审核' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apAirMerchantCheckHistory" component={Scenes.APAirMerchantCheckHistoryView} title='空防单位审核历史' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apAirMerchantCheckDetail" component={Scenes.APAirMerchantCheckDetailView} title='空防单位审核详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apCertificateApplyHome" component={Scenes.APCertificateApplyHomeView} title='新机场证件' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apSelectPartment" component={Scenes.APSelectPartmentView} title='选择工程项目部门' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apCertificateApplySubmit" component={Scenes.APCertificateApplySubmitView} title='新机场证件' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apCertificateCheckRecords" component={Scenes.APCertificateCheckRecords} title='证件审核信息' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apCertificateCheckDetail" component={Scenes.APCertificateCheckDetailView} title='证件审核详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apCertificateApplyHistory" component={Scenes.APCertificateApplyHistoryView} title='证件申请历史记录' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="apCertificateApplyDetail" component={Scenes.APCertificateApplyDetailView} title='证件申请历史详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>

              <Scene key="svoHome" component={Scenes.SVOHomeView} title='安全监管' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoInspectedMerchant" component={Scenes.SVOInspectedMerchantView} title='选择被检查单位' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoSearch" component={Scenes.SVOSearchView} title='单位搜索' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoCopySearch" component={Scenes.SVOCopySearchView} title='抄送单位搜索' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoAirCheckIn" component={Scenes.SVOAirCheckInView} title='空防登记记录' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoFireCheckIn" component={Scenes.SVOFireCheckInView} title='消防登记记录' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoFireCheckInTemplet" component={Scenes.SVOFireCheckInTempletView} title='消防检查模板' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoFireCheckInTempletWeb" component={Scenes.SVOFireCheckInTempletWebView} title='消防检查模板Web' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoHistoryCheckIn" component={Scenes.SVOHistoryCheckInView} title='历史检查记录' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoHistoryCheckInDetail" component={Scenes.SVOHistoryCheckedInDetailView} title='历史检查详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoCheckInDetail" component={Scenes.SVOCheckInDetailView} title='历史检查记录详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoSearchPolice" component={Scenes.SVOSearchPoliceView} title='选择民警' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svoCheckReason" component={Scenes.SVOCheckReasonView} title='审核不通过' hideNavBar={false} backTitle='返回' panHandlers={null}/>

              <Scene key="svmHome" component={Scenes.SVMHomeView} title='安全监管' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svmCheckedIn" component={Scenes.SVMCheckedInView} title='被检查列表' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="svmCheckedInDetail" component={Scenes.SVMCheckedInDetailView} title='被检查详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>

              <Scene key="cfHome" component={Scenes.CFHomeView} title='证件管理' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="cfInspect" component={Scenes.CFInspectView} title='持证人检查' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="cfInspectRegister" component={Scenes.CFInspectRegisterView} title='违规登记' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="cfLawRecordsView" component={Scenes.CFLawRecordsView} title='法律条文' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="cfInspectedRecords" component={Scenes.CFInspectedRecordsView} title='检查记录' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="cfInspectedRecordDetail" component={Scenes.CFInspectedRecordDetailView} title='检查详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="cfTempCertificateLost" component={Scenes.CFTempCertificateLostView} title='临时证件挂失' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="cfScoreManager" component={Scenes.CFScoreManagerView} title='记分管理' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="cfScoreDetail" component={Scenes.CFScoreDetailView} title='扣分详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="cfApplyReInspect" component={Scenes.CFApplyReInspectView} title='申请复议' hideNavBar={false} backTitle='返回' panHandlers={null}/>

              <Scene key="policeNews" component={Scenes.PoliceNewsView} title='警务新闻' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="policeNewsDetail" component={Scenes.PoliceNewsDetailView} title='警务新闻详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>

              <Scene key="reportHome" component={Scenes.ReportHomeView} title='违法举报' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="reportPosting" component={Scenes.ReportPostingView} title='我要举报' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="reportHistory" component={Scenes.ReportHistoryView} title='举报历史' hideNavBar={false} backTitle='返回' panHandlers={null}/>
              <Scene key="reportHistoryDetail" component={Scenes.ReportHistoryDetailView} title='举报历史详情' hideNavBar={false} backTitle='返回' panHandlers={null}/>

            </Scene>

            <Scene key="error" component={Scenes.ErrorView} />
            <Scene key="success" component={Scenes.SuccessView} />
            <Scene key="tip" component={Scenes.TipView} />
            <Scene key="netTip" component={Scenes.NetTipView} />
            <Scene key="bigImage" component={Scenes.BigImageView} />
            <Scene key="policeList" component={Scenes.PoliceListView} />
            <Scene key="datePicker" component={Components.DatePicker} />
            <Scene key="commonPicker" component={Components.CommonPickerView} />

          </Scene>
        </Router>
      </View>
    );
  }
}

const NavBarH = Platform.select({ android: 50, ios: 64 });
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navigationBarStyle: {
        height: NavBarH,
        backgroundColor: mainColor,
        borderBottomWidth: 0,
        borderBottomColor: borderColor
    },
    titleStyle: {
        color: 'white'
    },
    rightButtonTextStyle: {
        color: 'white',
        fontSize: 14
    },
    backButtonTextStyle: {
      color:'white',
    },
    leftButtonStyle:{
      alignItems:'center'
    },
    backButtonImage: {
      tintColor: 'white'
    },
});

// define this based on the styles/dimensions you use
// 用于路由根据 props，computedProps 来动态改变所需样式
// 控制所有Scene最底层的样式，e.g: 标题栏 和 最底层的backgroundColor。。。
const getSceneStyle = (/* NavigationSceneRendererProps */props, computedProps) => {
    const style = {
        flex: 1,
        backgroundColor: mainBackColor,
        shadowColor: null,
        shadowOffset: null,
        shadowOpacity: null,
        shadowRadius: null
    };
    if (computedProps.isActive) {
        style.marginTop = computedProps.hideNavBar
            ? -2
            : NavBarH;
        style.marginBottom = computedProps.hideTabBar
            ? 0
            : 50;
    }
    return style;
};

export default RootView
