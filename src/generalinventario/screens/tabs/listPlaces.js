import React, { Component } from "react"
import { SafeAreaView, StyleSheet,FlatList, TouchableOpacity, Text, View } from "react-native"
import PlaceCard from "../../../cards/placeCard"
import APISQLite from "../../../db/connectionSQLite"
class ListPlaces extends Component {
    constructor(props){
        super(props)
        this.state = {
            showComponent: false,
            id_inventario: this.props.route.params.data.id_inventario,
            //id_edificio: this.props.route.params.data.id_edificio,
            data: [
                {id:1,edificio:"EDIFICIO PRUEBA 1"},
                {id:2,edificio:"EDIFICIO PRUEBA 2"},
                {id:3,edificio:"EDIFICIO PRUEBA 3"},
            ]
        }
    }
    
    render(){
        const fecha = this.props.route.params.data.fecha
        const id_inventario = this.props.route.params.data.id_inventario 
        const estatus = this.props.route.params.data.estatus 
        const data = this.state.data
        return(
            <SafeAreaView style={styles.center}>
                <View style={styles.textContainer}>
                    <Text style={styles.texto}>Fecha del inventario: {fecha}</Text>
                </View>
                <FlatList
                //horizontal={true}
                    data = {data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => {
                        return(
                            this.state.showComponent? (
                            <TouchableOpacity 
                                onPress={() => {
                                    this.props.navigation.navigate("TabsInventario",  
                                    {  
                                        fechaInventario:fecha, 
                                        id_inventario:id_inventario, 
                                        id_edificio:item.id,
                                        edificio:item.edificio,
                                        area:item.area,                             
                                    }); 
                                }} 
                            > 
                                <PlaceCard
                                    id={item.id}
                                    edificio={item.edificio}
                                    area={item.area}
                                />
                            </TouchableOpacity> 
                            ) : null
                        )
                    }
                    }
                />
            </SafeAreaView>
        )
    }

    async componentDidMount(){        
        let dataBaseOPen = await APISQLite.abrirBaseDeDatos()
        if(dataBaseOPen){
            let _data = await APISQLite.getLugaresConBienes();  //await APISQLite.getValuesWithCallback("places",this.reciveDataFromDataBase)
            this.setState({data:_data})
            this.setState({showComponent:true})
        }
    }
}
const styles = StyleSheet.create({
    center: {
        flex: 1,
        backgroundColor: "#aaa1",
        alignContent: "center",
        justifyContent: "center",
        paddingBottom:10,
    },
    row:{
    },
    texto: {
        fontSize: 18,                 // Tamaño de la fuente
        color: 'black',               // Color del texto
        marginVertical: 10,           // Espaciado vertical entre los textos
    },
    textContainer: {
        alignItems: 'center',         // Centra el contenido del contenedor
    }
})
export default ListPlaces
