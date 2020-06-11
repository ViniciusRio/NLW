import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/home/Home';
import Points from './pages/points';
import Details from './pages/details';

const AppStack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator 
            headerMode="none" 
            screenOptions=
            {{ 
                cardStyle: {
                    backgroundColor: '#f0f0f5'
                }
            }}>
                <AppStack.Screen name="Home" component={ Home }/>
                <AppStack.Screen name="Points" component={ Points }/>
                <AppStack.Screen name="Details" component={ Details }/>
            </AppStack.Navigator>
        </NavigationContainer>
    )
};

export default Routes;



