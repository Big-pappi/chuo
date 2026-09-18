import React, {useRef, useState} from 'react';
import {FlatList, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, ViewToken} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const navy = '#06265f';
const blue = '#0b4da8';
const gold = '#fdbb22';

const slides = [
  {id: 'welcome', title: 'University App', description: '', kind: 'welcome', backgroundImage: require('../../../assets/onboard1.jpg')},
  {id: 'journey', title: 'University App', description: 'Your academic journey starts here.', kind: 'journey', backgroundImage: require('../../../assets/onboard2.jpg')},
  {id: 'tomorrow', title: 'Knowledge Builds Tomorrow', description: '', kind: 'tomorrow', backgroundImage: require('../../../assets/onboard3.jpg')},
] as const;

type Slide = {
  id: string;
  title: string;
  description: string;
  kind: string;
  backgroundImage: any;
};

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);
  const last = index === slides.length - 1;

  const next = () => {
    if (last) navigation.navigate('Login' as never);
    else if (index === 0) listRef.current?.scrollToIndex({index: 1, animated: true});
    else listRef.current?.scrollToIndex({index: index + 1, animated: true});
  };

  const skip = () => {
    navigation.navigate('Login' as never);
  };

  const renderSlide = ({item}: {item: Slide}) => (
    <View style={[styles.slide, item.kind === 'welcome' && styles.welcomeSlide, item.kind === 'journey' && styles.journeySlide, item.kind === 'tomorrow' && styles.tomorrowSlide]}>
      <Image source={item.backgroundImage} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.overlay} />
      <View style={[styles.slideContent, item.kind === 'tomorrow' && styles.slideContentNoLogo]}>
        {item.kind !== 'tomorrow' && <Image source={require('../../../assets/logo.png')} style={[styles.logo, item.kind === 'journey' && styles.darkLogo]} resizeMode="contain" />}
        {item.kind === 'tomorrow' ? (
          <View style={styles.tomorrowTitleContainer}>
            <Text style={[styles.tomorrowTitle, styles.lightText]}>Knowledge</Text>
            <Text style={[styles.tomorrowTitle, styles.lightText]}>Builds</Text>
            <Text style={[styles.tomorrowTitle, styles.lightText, styles.accentWord]}>Tomorrow</Text>
          </View>
        ) : (
          <Text style={[styles.title, item.kind === 'welcome' && styles.lightText, item.kind === 'journey' && styles.navyText]}>{item.title}</Text>
        )}
        {!!item.description && <Text style={[styles.description, item.kind === 'welcome' && styles.lightText, item.kind === 'journey' && styles.navyText]}>{item.description}</Text>}
        {item.kind === 'tomorrow' && <View style={styles.divider} />}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList ref={listRef} data={slides} renderItem={renderSlide} keyExtractor={item => item.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onViewableItemsChanged={useRef(({viewableItems}: {viewableItems: ViewToken[]}) => {if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);}).current} viewabilityConfig={{viewAreaCoveragePercentThreshold: 60}} />
      <View style={styles.controls}>
        <View style={styles.dots}>{slides.map((slide, dotIndex) => <View key={slide.id} style={[styles.dot, dotIndex === index && styles.activeDot]} />)}</View>
        <TouchableOpacity onPress={next} style={styles.button} activeOpacity={0.85}><Text style={styles.buttonText}>{index === 0 ? 'Get Started' : (last ? 'Get started' : 'Continue')}</Text></TouchableOpacity>
        {index !== 0 && <TouchableOpacity onPress={skip} style={styles.skipButtonBelow}><Text style={styles.skipText}>Skip</Text></TouchableOpacity>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: navy},
  slide: {width, height, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  welcomeSlide: {backgroundColor: navy},
  journeySlide: {backgroundColor: '#ffffff'},
  tomorrowSlide: {backgroundColor: '#082e6d'},
  backgroundImage: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%'},
  overlay: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 0},
  slideContent: {alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, zIndex: 1, marginTop: -80},
  slideContentNoLogo: {alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, zIndex: 1, marginTop: -40},
  logo: {width: 140, height: 140, marginBottom: 32, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8},
  darkLogo: {width: 120, height: 120, marginBottom: 28, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8},
  title: {fontSize: 32, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4},
  lightText: {color: '#fff'},
  navyText: {color: navy},
  tomorrowTitleContainer: {alignItems: 'center', gap: 8},
  tomorrowTitle: {fontSize: 36, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4},
  accentWord: {color: gold},
  description: {fontSize: 18, textAlign: 'center', marginTop: 56, lineHeight: 28, maxWidth: 300, fontWeight: '500', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2},
  divider: {width: 48, height: 2, backgroundColor: '#fff', marginTop: 24},
  controls: {position: 'absolute', bottom: 50, left: 24, right: 24, alignItems: 'center'},
  dots: {flexDirection: 'row', gap: 10, marginBottom: 24},
  dot: {width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.4)'},
  activeDot: {width: 32, backgroundColor: '#fff', borderRadius: 5},
  button: {width: '100%', backgroundColor: navy, borderRadius: 20, paddingVertical: 18, alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8},
  buttonText: {color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5},
  skipButtonBelow: {marginTop: 16},
  skipText: {color: '#fff', fontSize: 16, fontWeight: '600', textDecorationLine: 'underline'},
});
