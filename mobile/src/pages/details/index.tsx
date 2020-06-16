import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import { PointParams } from '../../models/PointParams';
import api  from '../../services/api';
import { styles } from './styles';
import { PointDetails } from '../../models/PointDetails';


const Details = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as PointParams;
    
    const [data, setData] = useState<PointDetails>({} as PointDetails);
    
    useEffect(() => {
        
        api.get(`point/${routeParams.point_id}`)
            .then(response => { 
                setData(response.data);
             }).catch(e => {
                 console.log('deu errado: ', e);
             });

    }, []);

    if(!data.point) {
        
        return null;
    }

    const handlerEmail = () => {
        MailComposer.composeAsync({
            subject: 'Ponto de coleta',
            recipients: [ data.point.email ]
        }).then(status => {
        });
    };

    const handlerWhatsapp = () => {
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Ponto de Coleta`);
    };
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={ styles.container }>
                <TouchableOpacity onPress={() => {navigation.navigate('Points')} }>
                    <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
                </TouchableOpacity>
                <View>
                    <Image style={styles.pointImage} source={{ uri: data.point.image }}/>
                    <Text style={ styles.pointName }>{ data.point.name }</Text>
                    <Text style={ styles.pointItems }>
                        { data.items.map(item => item.title).join(', ') }
                    </Text>
                </View>
                <View style={ styles.address }>
                    <Text style={ styles.addressTitle }>Endereço</Text>
                    <Text style={ styles.addressContent }>
                        { data.point.city }, { data.point.uf }
                    </Text>
                </View>
            </View>

            <View style={ styles.footer }>
                <RectButton style={ styles.button } onPress={ handlerWhatsapp }>
                    <FontAwesome name="whatsapp" size={20} color="#FFF"/>
                    <Text style={ styles.buttonText }>WhatsApp</Text>
                </RectButton>

                <RectButton style={ styles.button } onPress={ handlerEmail }>
                    <Icon name="mail" size={ 20 } color="#FFF"/>
                    <Text style={ styles.buttonText }>
                        E-mail
                    </Text>
                </RectButton>
            </View>
        </SafeAreaView>
    );
};

export default Details;
