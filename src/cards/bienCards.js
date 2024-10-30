import React, { Component } from "react"
import { StyleSheet, Text, View} from 'react-native'
class BienCard extends Component{
    constructor(props){
        super(props)
        this.state={
            numero_activo: this.props.numero_activo,
            descripcion: this.props.descripcion,
        }
    }

    render(){
        const numero_activo = this.state.numero_activo
        const descripcion = this.state.descripcion
        return(
            <View style={styles.bienCard}>
                <Text style={styles.numero_activo}>{numero_activo}</Text>
                <Text style={styles.descripcion}>{descripcion}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    bienCard: {
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
    },
    numero_activo:{
        color:"blue",
        fontSize: 30,
    },
    descripcion:{
        color:"green",
        fontSize: 25,
    },
})
export default BienCard