import React, { Component } from "react"
import { StyleSheet, Text, View} from 'react-native'
class BienCard extends Component{
    constructor(props){
        super(props)
        this.state={
            id_bien: this.props.id_bien,
            numero_activo: this.props.numero_activo,
            descripcion: this.props.descripcion,
        }
    }

    render(){
        const numero_activo = this.state.numero_activo
        const descripcion = this.state.descripcion
        const id_bien = this.state.id_bien
        return(
            <View style={styles.bienCard}>
                <Text style={styles.numero_activo}>ID: {id_bien}</Text>
                <Text style={styles.numero_activo}>Número activo: {numero_activo}</Text>
                <Text style={styles.descripcion}>Descripción: {descripcion}</Text>
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