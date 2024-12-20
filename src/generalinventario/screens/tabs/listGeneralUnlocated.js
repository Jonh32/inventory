import React, { Component } from "react" 
import { SafeAreaView, StyleSheet, FlatList } from "react-native" 
import BienCard from "../../../cards/bienCards"
import APISQLite from "../../../db/connectionSQLite"

class ListGeneraUnlocated extends Component {
    constructor(props){
        super(props)
        this.state = {
            showComponent: false, 
            id_inventario: this.props.route.params.data.id_inventario, 
            fechaInventario:this.props.route.params.data.fechaInventario,   
            data: [ 
                {id:1,numero_activo:"123446789",descripcion:"Silla"}, 
                {id:2,numero_activo:"123446780",descripcion:"Escritorio"}, 
                {id:3,numero_activo:"123446781",descripcion:"Computadora"}, 
            ]
        }
    }

    render(){
        const data = this.state.data
        return(
            <SafeAreaView style={styles.center}> 
                <FlatList
                    //horizontal={true} 
                    data = {data} 
                    keyExtractor={(item) => item.id} 
                    renderItem={({item}) => {
                        return (
                            this.state.showComponent?
                            <BienCard
                                id_bien={item.id}
                                numero_activo={item.numero_activo}    
                                descripcion={item.descripcion}
                            /> : null
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
            const {id_inventario} = this.state;
            //const id_inventario = this.props.route.params.data.id_inventario 
            let _data = await APISQLite.getBienesNoLocalizados(id_inventario);
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
    } 
})
export default ListGeneraUnlocated