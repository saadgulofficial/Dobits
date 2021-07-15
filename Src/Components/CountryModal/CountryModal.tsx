import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity, StatusBar, FlatList, ActivityIndicator, StyleSheet, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, Header, SearchBar } from 'react-native-elements';
import { hp, wp, GColor } from "../../Globals";

//Vectors
import Ionicons from 'react-native-vector-icons/Ionicons'

//CountryData
import countries from './Countries'

export class countryModal extends Component<any> {
    constructor(props: any) {
        super(props)
        this.setData = this.setData.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.RenderHeader = this.RenderHeader.bind(this)
    }
    state: {
        containerLoader: boolean,
        countryData: any,
        countryDataTemp: any,
        countryDataTemp2: any,
        searchTxt: string
    } = {
            containerLoader: true,
            countryData: '',
            countryDataTemp: '',
            countryDataTemp2: '',
            searchTxt: ''
        }


    componentDidMount() {
        this.setData()
    }
    render() {
        const { containerLoader, searchTxt, countryData } = this.state
        const { gray0, secondaryWhiteTwo } = GColor
        return (

            <SafeAreaView>
                <StatusBar backgroundColor={secondaryWhiteTwo} barStyle='dark-content' />
                {
                    containerLoader ?
                        <Modal
                            visible={containerLoader}
                        >
                            <this.RenderHeader />
                            <ActivityIndicator color={gray0} />
                        </Modal>
                        :
                        <Modal
                            visible={true}
                            onRequestClose={this.props.closeModal}
                        >
                            <this.RenderHeader />
                            <SearchBar
                                containerStyle={styles.searchBarContainer}
                                inputContainerStyle={styles.inputSearchBarStyle}
                                placeholder="Search country"
                                lightTheme round editable={true}
                                //@ts-ignore
                                loadingProps={<ActivityIndicator color={gray0} size={'large'} />}
                                showLoading={false}
                                onChangeText={this.handleSearch}
                                value={searchTxt}
                            />
                            <View style={styles.container}>
                                <FlatList
                                    data={countryData}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity style={styles.itemContainer}
                                            onPress={this.props.selectedCountry.bind(this, item)}
                                        >
                                            <View style={styles.codeFlagContainer}>
                                                <Text style={styles.text}>{item.dial_code}</Text>
                                                <Text style={{ fontSize: wp(7), marginLeft: wp(2) }}>{item.flag}</Text>
                                            </View>
                                            <View style={styles.nameContainer}>
                                                <Text style={styles.nameText}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        </Modal>
                }
            </SafeAreaView>
        )
    }

    RenderHeader() {
        return (
            <Header
                leftComponent={
                    <TouchableOpacity onPress={this.props.closeModal}>
                        <Ionicons name="ios-close-outline" size={wp(8)} color={'#000'} style={{ marginTop: hp(1) }} />
                    </TouchableOpacity>
                }
                centerComponent={{ text: 'Select Country', style: { color: '#000', fontSize: wp(5), textAlignVertical: 'bottom', marginTop: hp(1) }, }}
                containerStyle={{ height: Platform.OS === 'ios' ? 'auto' : hp(8), backgroundColor: '#fff', borderBottomWidth: 0 }}
            />
        )
    }

    setData() {
        const data = countries
        this.setState({
            countryData: data, countryDataTemp: data,
            countryDataTemp2: data, containerLoader: false
        })
    }


    handleSearch(searchTxt: any) {
        const { countryDataTemp } = this.state
        this.setState({ searchTxt },
            () => {
                if('' == searchTxt) {
                    this.setState({ countryData: countryDataTemp });
                    return;
                }
                this.state.countryDataTemp2 = countryDataTemp.filter(function (element: any) {
                    const text = searchTxt.toUpperCase()
                    //@ts-ignore
                    const name = element.name.toUpperCase()
                    return name.includes(text)
                }).map(function (item: any) {
                    return item
                })

                this.setState({ countryData: this.state.countryDataTemp2 })
            }
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: hp(1)
    },
    itemContainer: {
        marginBottom: hp(1),
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    codeFlagContainer: {
        borderWidth: 0,
        flexDirection: "row",
        alignItems: 'center'
    },
    text: {
        fontSize: wp(5),
        color: colors.grey1
    },
    nameContainer: {
        width: wp(65),
        borderBottomWidth: 1,
        borderBottomColor: colors.grey4,
        paddingHorizontal: wp(2),
        justifyContent: 'center'
    },
    nameText: {
        fontSize: wp(4.2),
        color: colors.grey1
    },
    searchBarContainer: {
        backgroundColor: '#fff',
        width: '100%',
    },
    inputSearchBarStyle: {
        backgroundColor: '#F1F2F4',
        height: hp(5),
        borderRadius: 30
    },
})
export default countryModal


