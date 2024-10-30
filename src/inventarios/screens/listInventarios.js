import React, { Component } from "react"
import { SafeAreaView, StyleSheet,FlatList, TouchableOpacity } from "react-native"
import ActionButton from 'react-native-action-button';
import InventarioCard from "../../cards/inventarioCard"
import IconsMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import APISQLite from "../../db/connectionSQLite"

class ListInventarios extends Component {
    constructor(props){
        super(props)
        this.state = {
            showComponent: false,
            data: []
        }
        this.cargarInventarios = this.cargarInventarios.bind(this);
        this.insertInventario = this.insertInventario.bind(this);
    }

    
    async insertInventario(){
        //Formatear 
        console.log("Entro al insertInventario")
        const obtenerFechaActual = () => {
            const fechaActual = new Date(); // Obtiene la fecha y hora actuales
            const año = fechaActual.getFullYear();
            const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan en 0
            const día = fechaActual.getDate().toString().padStart(2, '0'); // Día con dos dígitos
            
            // Formato YYYY-MM-DD
            const fechaFormateada = `${año}-${mes}-${día}`;
            return fechaFormateada;
        };        
        const fechaActual = obtenerFechaActual()
        const newInventario = [
            {"fecha": fechaActual, "estatus": 0}
        ]
        //Insertar un nuevo inventario en la base de datos local
        if(APISQLite.insertarRegistrosFromJSONWithAutoIncrementId('inventario', newInventario)){
            console.log(`Se ingresó correctamente el inventario de la fecha: ${fechaActual}`, )
            alert(`Se ingresó correctamente el inventario de la fecha: ${fechaActual}`)

            APISQLite.insertInventarioToAPIREST(newInventario)
            let _data = await this.cargarInventarios()
            this.setState({data:_data})

            //Obtener id del último inventario creado 
            const lastInventory = await APISQLite.getLastInventoryInserted();
            const lastInventory_id = lastInventory[0].id;

            //Asociar el último inventario a todos los bienes
            if(await APISQLite.fillBienesWithInventary(lastInventory_id)){
                console.log(`Bienes asociados exitosamente al inventario ${lastInventory_id}.`);
            }
            else{
                console.log("No se encontraron bienes para asociar.");
            }
            return
        }
        console.log(`No se ingresó el inventario de la fecha: ${fechaActual}`)
        alert(`No se ingresó el inventario de la fecha: ${fechaActual}`)
    }

    render(){
        const data = this.state.data
        return(
            <SafeAreaView style={styles.center}>                
                <FlatList
                    data = {data}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => {
                        return(
                            this.state.showComponent?
                            <TouchableOpacity 
                                onPress={() => { 
                                this.props.navigation.navigate("TabsGeneralInventario",  
                                {  
                                    id_inventario:item.id, 
                                    fecha:item.fecha, 
                                    estatus: item.estatus,
                                }); 
                                }} 
                            > 
                                <InventarioCard                                
                                    fechaInventario={item.fecha} 
                                    estatusInventario={item.estatus}
                                />
                            </TouchableOpacity> 
                            : null
                        )
                    }
                    }
                />
                <ActionButton
                    title="AddInventory"
                    onPress={this.insertInventario}                    
                    renderIcon={() => (<IconsMaterialIcons name="add-circle" style={styles.actionButtonIcon} />)}
                    shadowStyle={styles.floatinRightBottomBtn}
                    buttonColor="rgba(255,255,255,1)"
                    hideShadow={false}                
                />
            </SafeAreaView>
        )
    }

    async componentDidMount(){
        await this.cargarInventarios()
    }

    async cargarInventarios(){
        let dataBaseOPen = await APISQLite.abrirBaseDeDatos()
        if(dataBaseOPen){
            let data = await APISQLite.getValuesWithCallback("inventario",this.reciveDataFromDataBase)
            console.log("Datos de SQLite: ")
            console.log(data)
            this.setState({data:data})
            this.setState({showComponent:true})
            return data
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
    row: {

    },
    actionButtonIcon: {
        fontSize: 30,
        height: 30,
        color: 'green',
    },
    floatinRightBottomBtn: {
        position: 'absolute',
        top: "95%",
        left: "70%",
        shadowColor: "green",
        borderColor: "green",
        borderWidth: 3,
        borderRadius: 35,
    },
})

export default ListInventarios