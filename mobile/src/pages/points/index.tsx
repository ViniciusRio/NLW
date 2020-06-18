import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather as Icon } from '@expo/vector-icons';
import { styles } from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import { Item } from '../../models/item';
import * as Location from 'expo-location';
import { Point } from '../../models/Point';
import { CityUfParams } from '../../models/CityUfParams';

const Points = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as CityUfParams;

    const [items, setItems] = useState<Item[]>([]);
    const [points, setPoints] = useState<Point[]>([]);

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([routeParams.latitude, routeParams.longitude]);
    


    useEffect(() => { 
        
        api.get('points', { 
            params: { 
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
             }
         }).then(response => {
            setPoints(response.data);
         });
     }, [selectedItems]);

    useEffect(() => {
        api.get('items').then(response => {
            
            setItems(response.data);
        });
    }, []);


    const handlerNavigationBack = () => {
        navigation.navigate('Home');
    };

    const handlerNavigationDetails = (point_id: number) => {
        
        navigation.navigate('Details', { point_id: point_id } );
    };

    const HandlerSelectedItems = (id: number) => { 
        const alreadySelectedItem = selectedItems.findIndex(item => item === id)

        if (alreadySelectedItem !== -1) {
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
            return;
        }

        setSelectedItems([...selectedItems, id]);
     };
    return (
        <>
        <View style={ styles.container }>
            <TouchableOpacity onPress={ handlerNavigationBack }>
                <Icon name="arrow-left" size={20} color="#34cb79"/>
            </TouchableOpacity>

            <Text style={ styles.title }>Bem-vindo</Text>
            <Text style={ styles.description }>Encontre no mapa um ponto de coleta</Text>
            <View style={ styles.mapContainer }>
                    <MapView style={ styles.map }
                    initialRegion={{
                         latitude: initialPosition[0],
                         longitude: initialPosition[1],
                         latitudeDelta: 0.01,
                         longitudeDelta: 0.01
                    }}>
                       { points.map(point => {
                           return (
                            <Marker key={ point.id } 
                            style={styles.mapMarker} 
                            onPress={() =>  handlerNavigationDetails(point.id) } coordinate={{
                                latitude: point.latitude,
                                longitude: point.longitude,
                            }}>
                                <View style={styles.mapMarkerContainer}>
                                <Image  style={styles.mapMarkerImage} source={{
                                    uri: point.image_url
                                }}>
                                </Image>
                                <Text style={styles.mapMarkerTitle}>{ point.name }</Text>
                                </View>
                            </Marker>
                           );
                       }) }
                   </MapView>
            </View>
        </View>

        <View style={ styles.itemsContainer }>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={ false }
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
            { items.map(item => { 
                return (
                    <TouchableOpacity 
                    key={ String(item.id) } 
                    style={ [styles.item, selectedItems.includes(item.id) ? styles.selectedItem : {}]}
                    onPress={ () => HandlerSelectedItems(item.id) }>
                        <SvgUri width={42} height={42} uri={ item.image_url } />
                        <Text style={ styles.itemTitle }>   
                            { item.title }
                        </Text>
                    </TouchableOpacity>
                );
             }) }
            </ScrollView>
        </View>
        </>
    );
};

export default Points;
