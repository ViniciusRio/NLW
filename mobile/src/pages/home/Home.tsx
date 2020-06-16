import React, { useEffect, useState } from 'react';
import { View, Image, Text, ImageBackground, Alert } from 'react-native';
import { styles } from './styles';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { State } from '../../models/State';
import * as Location from 'expo-location';
import api from '../../services/api';
import { City } from '../../models/CIty';


const Home = () => {
    const navigation = useNavigation();

    const[ states, setState ] = useState<State[]>([]);
    const[ uf, setUf ] = useState('0');
    const[ citiesName, setCitiesNames ] = useState<City[]>([]);
    const[ selectedState, setSelectedState ] = useState('');
    const[ selectedUf, setSelectedUf ] = useState('');
    const[ selectedCity, setSelectedCity ] = useState('');
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);


    useEffect(() => {
        api.get<State[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                setState(response.data)
                
            }).catch(e => {
                Alert.alert(e);
            });
    }, []);
    useEffect(() => {
        api.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then(response => { 
                
                setCitiesNames(response.data);

                
             }).catch(e => {
                 console.log(e);
                 
             });
    }, [uf]);

    useEffect(() => {  
        
        loadPosition();
        
    }, []);

    async function loadPosition() { 

        const { status } = await Location.requestPermissionsAsync();

        if (status !== 'granted') {
            console.log('sem localização');
            
            Alert.alert('Não foi possível obter a localização');

            return;
        }

        const location = await Location.getCurrentPositionAsync();

        const { latitude, longitude } = location.coords;
        setInitialPosition([latitude, longitude]);


    }

    const handlerState = (ufValue: string) => {
        setUf(ufValue);
        setSelectedUf(ufValue)
    };


    const handlerCity = (cityValue: string) => {
        
        setSelectedCity(cityValue);
    };

    function handlerNavigationToPoints() { 
        navigation.navigate('Points', { city: selectedCity, uf: selectedUf, latitude: initialPosition[0], longitude: initialPosition[1]});
     }
        

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
            <View style={styles.selectCointainer}>
                <RNPickerSelect
                style={ { inputAndroid: { color: 'black'}} }
                onValueChange={(value) =>  handlerState(value) }
                placeholder={{ label: 'Selecione um Estado', value: null  }}
                items= {
                    states.map(state => {
                        return (
                            { label: state.nome, value: state.sigla }
                        );
                    })
                }
                />
            </View>
            <View style={styles.selectCointainer}>
                <RNPickerSelect 
                style={ { inputAndroid: { color: 'black'}} }
                onValueChange={ (value) => handlerCity(value) }
                placeholder={{ label: 'Selecione uma cidade', value: null  }}
                items={
                    citiesName.map(city => {
                        return (
                            { label: city.nome, value: city.nome }
                        );
                    })    
                }
                />
            </View>
            <View style={ styles.footer }>
                <RectButton style={ styles.button } onPress={ handlerNavigationToPoints }>
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

const pickerStyle = {
    inputAndroid: {
	},
};
export default Home;