import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import ShowMessage from '../Services/Notifications/Foreground'


//Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { UserScreens, CommonScreens, AuthScreens } from './index'

//Services
import { GAsyncStorage, GFirebase } from '../Services';

//Screens
import {
    PhoneNumber, VerifyCode, Home,
    Conversations, Chat, AddProfileImage,
    AddName, Profile
} from '../Screens'
import { GColor } from '../Globals';
import { Loader } from '../Components/Loader';



const Stack = createStackNavigator();
const StackNav = () => {
    const { theme } = GColor
    const [containerLoader, setcontainerLoader] = useState(true)
    const [initialRoute, setinitialRoute] = useState<any>('')
    const [isLoggedIn, setisLoggedIn] = useState(false)
    useEffect(() => {
        async function fetchData() {
            const user = await GAsyncStorage.getLocalData()
            if(!user) {
                setisLoggedIn(false)
                setinitialRoute('PhoneNumber')
                setcontainerLoader(false)
            }
            else {
                user.isLoggedIn ?
                    (
                        setisLoggedIn(true),
                        setinitialRoute('Home'),
                        setcontainerLoader(false)
                    )
                    :
                    (
                        setisLoggedIn(false),
                        setinitialRoute('PhoneNumber'),
                        setcontainerLoader(false)
                    )
            }
        }
        fetchData()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {
                !containerLoader && initialRoute === 'Home' ?
                    <NavigationContainer >
                        <Stack.Navigator
                            initialRouteName={'Home'}
                            mode='card'
                            screenOptions={{
                                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                                headerShown: false,
                                gestureEnabled: true
                            }}
                        >
                            <Stack.Screen name="Home" component={Home} />
                            <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
                            <Stack.Screen name="VerifyCode" component={VerifyCode} />
                            <Stack.Screen name="AddName" component={AddName} />
                            <Stack.Screen name="AddProfileImage" component={AddProfileImage} />
                            <Stack.Screen name="Profile" component={Profile} />
                            <Stack.Screen name="Conversations" component={Conversations} />
                            <Stack.Screen name="Chat" component={Chat} />
                            <Stack.Screen name="ShowMessage" component={ShowMessage} />
                        </Stack.Navigator>
                    </NavigationContainer>
                    :
                    !containerLoader && initialRoute === 'PhoneNumber' ?
                        <NavigationContainer >
                            <Stack.Navigator
                                initialRouteName={'PhoneNumber'}
                                mode='card'
                                screenOptions={{
                                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                                    headerShown: false,
                                    gestureEnabled: true
                                }}
                            >
                                <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
                                <Stack.Screen name="Home" component={Home} />
                                <Stack.Screen name="VerifyCode" component={VerifyCode} />
                                <Stack.Screen name="AddName" component={AddName} />
                                <Stack.Screen name="AddProfileImage" component={AddProfileImage} />
                                <Stack.Screen name="Profile" component={Profile} />
                                <Stack.Screen name="Conversations" component={Conversations} />
                                <Stack.Screen name="Chat" component={Chat} />
                            </Stack.Navigator>
                        </NavigationContainer>
                        :
                        <Loader />
            }
        </View>
    )
}

export default StackNav


                // !containerLoader ?
                //     <NavigationContainer>
                //         <Stack.Navigator
                //             mode='card'
                //             screenOptions={{
                //                 cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                //                 headerShown: false,
                //                 gestureEnabled: true
                //             }}
                //         >
                //             {
                //                 Object.entries({
                //                     ...(isLoggedIn ? UserScreens : AuthScreens)
                //                 }).map(([name, component]) => (
                //                     <Stack.Screen name={name} component={component} />
                //                 ))
                //             }
                //         </Stack.Navigator>
                //     </NavigationContainer>
                //     :
                //     <Loader />
