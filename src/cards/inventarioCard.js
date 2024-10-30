import React, { Component } from "react"
import { StyleSheet, Text, View } from "react-native"

class InventarioCard extends Component{
    constructor(props){
        super(props)
        this.state={
            fechaInventario: this.props.fechaInventario,
            estatusInventario: this.props.estatusInventario,
        }
    }

    render(){
        const {fechaInventario, estatusInventario} = this.state;
        return(
            <View style={styles.InventarioCard}>
                <Text style={styles.fechaInventario}>Fecha: {fechaInventario}</Text>
                <Text style={styles.fechaInventario}>Estatus: {estatusInventario}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    InventarioCard: {
        //flex: 1
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#0006',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 15,
        padding: 20,
    },
    fechaInventario:{
        color:"blue",
        fontSize: 30,
    }
})
export default InventarioCard