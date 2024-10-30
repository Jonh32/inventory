import React, { Component } from "react"
import { StyleSheet, Text, View} from 'react-native'
class PlaceCard extends Component{
    constructor(props){
        super(props)
        this.state={
            edificio: this.props.edificio,
            area: this.props.area,
        }
    }

    render(){
        const edificio = this.state.edificio
        const area = this.state.area
        return(
            <View style={styles.placeCard}>
                <Text style={styles.place}>{edificio}</Text>
                <Text style={styles.area}>{area}</Text>
            </View>   
        )
    }
}

const styles = StyleSheet.create({
    placeCard: {
    //flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: '#0006',
        marginLeft:10,
        marginRight:10,
        marginTop: 10,
        borderRadius: 15,
        padding:10,
        //width: 350,
        //height: 560,
    },
    place:{
        color:"blue",
        fontSize: 25,
        textAlign: "center",
    },
    area:{
        color:"green",
        fontSize: 20,
        textAlign: "center",
    },
})

export default PlaceCard