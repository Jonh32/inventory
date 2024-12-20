import React, { Component } from "react" 
import { SafeAreaView, StyleSheet,FlatList,View } from "react-native" 
import LastInventoriedBienCard from "../../../cards/lastInventoriedBienCard" 
import CodeBar from "../../../cards/codeBar"
import APISQLite from "../../../db/connectionSQLite"
import eventEmitter from "../../../emiter/eventEmitter"

class LastInventoriedBien extends Component{
    constructor(props){
        super(props)
        this.state = {
            id_inventario: this.props.route.params.data.id_inventario,
            id_edificio: this.props.route.params.data.id_edificio,
            edificio: '',
            showComponent: false,
            data: [                
                //{id:3,numero_activo:"123446781",descripcion:"Computadora",material:"Plastico",color:"Gris",marca:"Apple",imagen:"sin"}, 
            ]
        }
        this.refreshData = this.refreshData.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    async refreshData() {
        const { id_inventario, id_edificio } = this.state;
        let dataBaseOPen = await APISQLite.abrirBaseDeDatos();
        if (dataBaseOPen) {
            let data = await APISQLite.getLastBienLocatedFromPlace(id_inventario, id_edificio);
            let edificio_name = await APISQLite.getPlaceUsingID(this.state.id_edificio);
            const updateData = data.map(item => ({
                ...item,
                imagen: `data:image/jpeg;base64,${item.imagen}`
            }));
            this.setState({ data: updateData, edificio: edificio_name[0].edificio, showComponent: true });
        }
    }

    render(){
        const data = this.state.data
        const edificio = this.state.edificio
        return(
            <SafeAreaView style={styles.center}>
                <CodeBar
                    id_edificio = {this.state.id_edificio}
                    id_inventario = {this.state.id_inventario}
                    onDatabaseChange = {this.refreshData}
                />
                <FlatList
                    data = {data}
                    keyExtractor={(item) => item.id} 
                    renderItem={({item}) => {
                        return(
                            this.state.showComponent?
                                <LastInventoriedBienCard
                                    id = {item.id}
                                    numero_activo={item.numero_activo}  
                                    subnumero={item.subnumero}
                                    descripcion={item.descripcion} 
                                    material={item.material} 
                                    color={item.color} 
                                    marca={item.marca}
                                    modelo={item.modelo} 
                                    serie={item.serie}
                                    estado={item.estado}
                                    imagen={item.imagen}
                                    edificio={edificio} //Nombre del edificio
                                /> : null
                        )
                    }
                    }
                />
            </SafeAreaView>
        )
    }

    async componentDidMount(){
        this.loadData();
        eventEmitter.on('databaseUpdated_place', this.loadData);
    } 

    async componentWillUnmount() {
        // Anular la suscripción para evitar fugas de memoria
        eventEmitter.off('databaseUpdated_place', this.loadData);
    }

    async loadData(){
        const {id_inventario, id_edificio} = this.state;
        //const id_inventario = this.state.id_inventario
        //const id_edificio = this.state.id_edificio
        let dataBaseOPen = await APISQLite.abrirBaseDeDatos()
        if(dataBaseOPen){ 
          let data = await APISQLite.getLastBienLocatedFromPlace(id_inventario, id_edificio)
          let edificio_name = await APISQLite.getPlaceUsingID(this.state.id_edificio)
          const updateData = data.map(item => {
            return{
                ...item, //Deja todos los campos de mi arreglo igual y solo cambia imagen
                imagen: `data:image/jpeg;base64,${item.imagen}` //Devuelve el base64 a una imagen mostrable
            }
        })
        //Cambiamos data:data por data:updateData que es la información con la imagen bien, sin el base64
        this.setState({ data: updateData, edificio: edificio_name[0].edificio, showComponent: true });
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
    } 
}) 

export default LastInventoriedBien