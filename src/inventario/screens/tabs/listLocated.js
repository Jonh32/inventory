import React, { Component } from "react" 
import { SafeAreaView, StyleSheet,FlatList } from "react-native" 
import BienCard from "../../../cards/bienCards" 
import APISQLite from "../../../db/connectionSQLite"
import eventEmitter from "../../../emiter/eventEmitter"

class ListLocated extends Component{
    constructor(props){
        super(props)
        this.state = {
            showComponent: false, 
            id_inventario: this.props.route.params.data.id_inventario, 
            fechaInventario:this.props.route.params.data.fechaInventario,         
            id_edificio: this.props.route.params.data.id_edificio, 
            edificio: this.props.route.params.data.edificio,
            data: [ 
                {id:1,numero_activo:"123446789",descripcion:"Silla"}, 
                {id:2,numero_activo:"123446780",descripcion:"Escritorio"}, 
                {id:3,numero_activo:"123446781",descripcion:"Computadora"}, 
            ]
        }
        this.loadData = this.loadData.bind(this);
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
                                <BienCard
                                    id_bien={item.id}
                                    numero_activo={item.numero_activo}    
                                    descripcion={item.descripcion}                              
                                /> 
                        : null 
                    ) 
                } 
                } 
            /> 
            </SafeAreaView>
        )
    }

    async loadData() {
        const { id_inventario, id_edificio } = this.state;
        let dataBaseOPen = await APISQLite.abrirBaseDeDatos();
        if (dataBaseOPen) {
            let _data = await APISQLite.getBienesLocatedFromPlace(id_inventario, id_edificio);
            this.setState({ data: _data, showComponent: true });
        }
    }

    async componentDidMount(){ 
        this.loadData();
        //Escuchar el evento
        eventEmitter.on('databaseUpdated', this.loadData);
        eventEmitter.on('databaseUpdated_place', this.loadData);
    }

    async componentWillUnmount() {
        // Anular la suscripción para evitar fugas de memoria
        eventEmitter.off('databaseUpdated', this.loadData);
        eventEmitter.off('databaseUpdated_place', this.loadData);
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
    } 
})

export default ListLocated