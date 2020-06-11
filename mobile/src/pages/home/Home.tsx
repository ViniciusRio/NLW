import React from 'react';
import { View, Image, Text, ImageBackground } from 'react-native';
import { styles } from './styles';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';

const Home = () => {
    return (
        <ImageBackground 
        style={ styles.container }
        source={ require('../../assets/home-background.png') }
        imageStyle={{ width: 274, height: 358 }}
        >
            <View style={styles.main}>
                <Image source={ require('../../assets/logo.png') }/>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos as pessoas encontrarem pontos de coleta de forma inteligente</Text>
            </View>

            <View style={ styles.footer }>
                <RectButton style={ styles.button } onPress={  ()=> {}}>
                    <View style={ styles.buttonIcon }>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={20}/>
                        </Text>
                    </View>

                    <Text style={ styles.buttonText }>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};


export default Home;