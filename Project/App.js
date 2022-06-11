import React, {useState,useEffect} from 'react';
import {View, StyleSheet, Pressable, SafeAreaView,ActivityIndicator} from 'react-native';
import Amplify,{Hub} from 'aws-amplify'
import config from './src/aws-exports'
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withAuthenticator } from 'aws-amplify-react-native/dist/Auth';
import { DataStore } from 'aws-amplify';
import HomeScreen from './source/screens/HomeScreen';
import MatchesScreen from './source/screens/MatchesScreen';
import ProfileScreen from './source/screens/ProfileScreen';
Amplify.configure({
  ...config,
  Analytics:{
    disable:true,
  },
});

const App = () => {
  const [activeScreen, setActiveScreen] = useState('HOME');
  const[isUserLoading,setIsUserLoading]= useState(true);
  const color = '#b5b5b5';
  const activeColor = '#F76C6B';
  // useEffect(()=> {
  //   const listener = Hub.listen('datastore', async hubData => {
  //     const  { event,data } = hubData.payload;
  //     if (event === 'modelSynced'&& data?.model?.name === 'User' ) {
  //       console.log(`Model has finished syncing:`);
  //       setIsUserLoading(false);
  //     }
  //   }); 
  //   DataStore.start();
  //   return () => listener();
  // },[]);

  // const renderPage = () => { 
  //   if(activeScreen === 'HOME')
  //    return  <HomeScreen isUserLoading={isUserLoading}/>
  //    if (isUserLoading) {
  //     return <ActivityIndicator style={{flex:1}}/>;
  //    }
  //    if( activeScreen === 'CHAT')
  //    return <MatchesScreen/>
  //  if  (activeScreen === 'PROFILE') 
  //    return  <ProfileScreen/>
  // };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <View style={styles.topNavigation}>
          <Pressable onPress={() => setActiveScreen('HOME')}>
            <Fontisto
              name="tinder"
              size={30}
              color={activeScreen === 'HOME' ? activeColor : color}
            />
          </Pressable>
          <MaterialCommunityIcons
            name="star-four-points"
            size={30}
            color={color}
          />
          <Pressable onPress={() => setActiveScreen('CHAT')}>
            <Ionicons name="ios-chatbubbles" size={30}
            color={activeScreen === 'CHAT' ? activeColor : color}/>
          </Pressable>
          <Pressable onPress={() => setActiveScreen('PROFILE')}>
          <FontAwesome name="user" 
          size={30} 
          color={activeScreen === 'PROFILE' ? activeColor : color} 
          />
          </Pressable>

        </View>
        {/* {renderPage()} */}
        {activeScreen === 'HOME' &&  <HomeScreen/>}
        {activeScreen === 'CHAT' &&  <MatchesScreen/>}
        {activeScreen === 'PROFILE' &&  <ProfileScreen/>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
});

export default withAuthenticator(App);
