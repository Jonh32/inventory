import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TextInput, Dimensions } from 'react-native';
import APISQLite from "../db/connectionSQLite"
import eventEmitter from "../emiter/eventEmitter";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

class CodeBar extends Component{
    constructor(props) {
        super(props);
        this.state = {
          id_edificio: this.props.id_edificio,
          id_inventario: this.props.id_inventario,
          textCodigoDeBarrasTextInput: '',  // Nuevo estado para el código de barras
        };
        this.changeTextInput = this.changeTextInput.bind(this);  // Vinculamos el método
        this.onDatabaseChange = this.props.onDatabaseChange;
    }

    async changeTextInput(text) {
        let codigoDeBarrasText = text.nativeEvent.text; 
        this.setState({ textCodigoDeBarrasTextInput: codigoDeBarrasText });
        //Verificar si el texto ingresado pertenece a un número activo de un bien existente y devuelve el id del bien
        const id_bien = await APISQLite.verifyIfNumeroActivoExists(codigoDeBarrasText);
        console.log("ID del bien obtenido con el numero_activo",id_bien);
        if (id_bien == undefined){
          console.log("El número activo ingresado no existe");
          alert("El número activo " + codigoDeBarrasText + " no existe");
          return;
        }
        //Cambiar el campo located usando el id_inventario y el id_bien que obtuvimos
        const obtenerFechaActual = () => {
          const fechaActual = new Date(); // Obtiene la fecha y hora actuales
          const año = fechaActual.getFullYear();
          const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan en 0
          const día = fechaActual.getDate().toString().padStart(2, '0'); // Día con dos dígitos
          const horas = fechaActual.getHours().toString().padStart(2, '0'); // Horas con dos dígitos
          const minutos = fechaActual.getMinutes().toString().padStart(2, '0'); // Minutos con dos dígitos
          const segundos = fechaActual.getSeconds().toString().padStart(2, '0'); // Segundos con dos dígitos
      
          // Formato YYYY/MM/DD HH:MM:SS
          const fechaFormateada = `${año}-${mes}-${día} ${horas}:${minutos}:${segundos}`;
          return fechaFormateada;
        };
        const fechaHora = obtenerFechaActual();
        const {id_inventario} = this.state;
        if(await APISQLite.changeLocatedInventarioBien(id_inventario, id_bien, fechaHora)){
          console.log("Bien " + id_bien + " localizado en el inventario " + id_inventario);
          alert("Bien " + id_bien + " localizado en el inventario " + id_inventario);
          if (this.props.onDatabaseChange) {
            this.props.onDatabaseChange();
            //Emitir el evento de actualización de la base de datos
            eventEmitter.emit('databaseUpdated');
          } 
          return;
        }
        console.log("No se pudo localizar el bien");
        alert("No se pudo localizar el bien");
    }

    render(){
        return(
            <View style={styles.viewCodigoDeBarras}>
              <TextInput
                placeholder="Código de barras"
                style={styles.codigoDeBarrarTextInput}
                onEndEditing={this.changeTextInput}
              />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewCodigoDeBarras: {
      alignItems: 'center',
      justifyContent: "center",
      backgroundColor: "#fff",
      borderWidth: 1,
      marginLeft: "2%",
      marginRight: "2%",
      marginTop: "2%",
      borderRadius: 15,
      padding: 10,
      borderWidth: 2,
      height: 0.1 * screenHeight,
    },
    codigoDeBarrarTextInput: {
      backgroundColor: "white",
      height: "100%",
      width: "100%",
      fontSize: 30,
      padding: 5,
    }
});

export default CodeBar