import React, { Component } from "react" 
import { SafeAreaView, StyleSheet,FlatList,View } from "react-native" 
import LastInventoriedBienCard from "../../../cards/lastInventoriedBienCard" 
import CodeBar from "../../../cards/codeBar"
import APISQLite from "../../../db/connectionSQLite"

class LastInventoriedBien extends Component{
    constructor(props){
        super(props)
        this.state = {
            id_inventario: this.props.route.params.data.id_inventario,
            id_edificio: this.props.route.params.data.id_edificio,
            showComponent: false,
            data: [                
                {id:3,numero_activo:"123446781",descripcion:"Computadora",material:"Plastico",color:"Gris",marca:"Apple",imagen:"sin"}, 
            ]
        }
    }

    render(){
        const data = this.state.data
        return(
            <SafeAreaView style={styles.center}>
                <CodeBar/>
                <FlatList
                    data = {data}
                    keyExtractor={(item) => item.id} 
                    renderItem={({item}) => {
                        return(
                            this.state.showComponent?
                                <LastInventoriedBienCard
                                    id = {item.id}
                                    numero_activo={item.numero_activo}  
                                    descripcion={item.descripcion} 
                                    material={item.material} 
                                    color={item.color} 
                                    marca={item.marca}
                                    modelo={item.modelo} 
                                    imagen={item.imagen}
                                /> : null
                        )
                    }
                    }
                />
            </SafeAreaView>
        )
    }

    async componentDidMount(){
        const {id_inventario, id_edificio} = this.state;
        //const id_inventario = this.state.id_inventario
        //const id_edificio = this.state.id_edificio
        let dataBaseOPen = await APISQLite.abrirBaseDeDatos()
        if(dataBaseOPen){ 
          let data = await APISQLite.getLastBienLocatedFromPlace(id_inventario, id_edificio)
          const updateData = data.map(item => {
            return{
                ...item, //Deja todos los campos de mi arreglo igual y solo cambia imagen
                imagen: `data:image/jpeg;base64,${item.imagen}` //Devuelve el base64 a una imagen mostrable
            }
        })
        //Cambiamos data:data por data:updateData que es la información con la imagen bien, sin el base64
        this.setState({data:updateData})
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