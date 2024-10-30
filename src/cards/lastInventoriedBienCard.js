import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system'
import { Dimensions } from "react-native";
import ActionButton from 'react-native-action-button';
import IconsMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import APISQLite from "../db/connectionSQLite"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

class LastInventoriedBienCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      numero_activo: this.props.numero_activo,
      descripcion: this.props.descripcion,
      material: this.props.material,
      color: this.props.color,
      marca: this.props.marca,
      modelo: this.props.modelo,
      imagen: this.props.imagen || "https://http2.mlstatic.com/D_NQ_NP_2X_924991-MLM70333484951_072023-F.webp", // Imagen por defecto
      imagenBytes: this.props.imagenBytes || null,
      textCodigoDeBarrasTextInput: '',  // Nuevo estado para el código de barras
    };
    this.updateImage = this.updateImage.bind(this);
    this.updateBien = this.updateBien.bind(this);
    this.changeTextInput = this.changeTextInput.bind(this);  // Vinculamos el método
  }

  // Método para capturar el texto del código de barras
  changeTextInput(text) {
    this.setState({ textCodigoDeBarrasTextInput: text.nativeEvent.text });
    console.log(text.nativeEvent.text);
  }
  
  // Método para abrir la cámara y capturar una foto
  async updateImage() {
    
    // Solicitar permisos para la cámara
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permiso para acceder a la cámara es requerido');
      return;
    }

    // Abrir la cámara y permitir la captura de una imagen
    const result = await ImagePicker.launchCameraAsync({
      //allowsEditing: true, // Permite editar la imagen capturada (opcional)
      aspect: [4, 3], // Proporción de la imagen
      qusality: 1, // Calidad de la imagen (0 a 1)
    });
    // Si la captura no es cancelada, actualiza la imagen en el estado
    if (!result.canceled) {
      this.setState({ imagen: result.assets[0].uri });
      console.log("Result: ", result)
      const binario = await FileSystem.readAsStringAsync(result.assets[0].uri, {encoding: FileSystem.EncodingType.Base64}) 
      //console.log(binario)
      this.setState({ imagenBytes: binario})
    }
  }
  async updateBien() {
    const {id, imagenBytes} = this.state;
    let dataBaseOpen = await APISQLite.abrirBaseDeDatos()

    if(dataBaseOpen){
      let response = await APISQLite.updateImageBien(id, imagenBytes)

      if (response.success){
        alert(response.message)
      }
      else{
        alert(response.message)
      }
    }

  }

  render() {
    const {id, numero_activo, descripcion, material, color, marca, modelo, imagen } = this.state;
    return (
      <View>        
        <View style={[styles.lastInventoriedBienCard, styles.shadowProp, { paddingTop: 50 }]}> 
          <Image
            style={styles.bienImage}
            source={{
              uri: imagen,
            }}
          />          
          <ActionButton
            title="UpdateImage"
            onPress={this.updateImage}
            renderIcon={() => (<IconsMaterialIcons name="photo-camera" style={styles.actionButtonIcon} />)}
            shadowStyle={styles.floatinLeftTopBtn}
            buttonColor="rgba(255,255,255,1)"
            hideShadow={false}
          />
          <Text style={styles.characteristics}>{id}</Text>
          <Text style={styles.numero_activo}>{numero_activo}</Text>
          <Text style={styles.descripcion}>{descripcion}</Text>
          <Text style={styles.characteristics}>{material}</Text>
          <Text style={styles.characteristics}>{modelo}</Text>
          <Text style={styles.characteristics}>{color}</Text>
          <Text style={styles.characteristics}>{marca}</Text>
          <ActionButton
            title="UpdateBien"
            renderIcon={() => (<IconsMaterialIcons name="edit" style={styles.actionButtonIcon} />)}
            shadowStyle={styles.floatinRightTopBtn}
            buttonColor="rgba(255,255,255,1)"
            onPress={this.updateBien}
            hideShadow={false}
          />
        </View>
      </View>
    );
  }
}
export default LastInventoriedBienCard

const styles = StyleSheet.create({
  lastInventoriedBienCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: '#0006',
    marginLeft: "2%",
    marginRight: "2%",
    marginTop: "2%",
    borderRadius: 15,
    height: screenHeight - 0.2 * screenHeight,
  },
  divImagen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "center",
    height: "50%",
    padding: 10,
  },
  informacion: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: "center",
    height: "50%",
  },
  numero_activo: {
    color: "blue",
    fontSize: 30,
  },
  numero_descripcion_activo: {
    color: "green",
    fontSize: 25,
  },
  characteristics: {
    color: "black",
    fontSize: 20,
  },
  bienImage: {
    height: screenHeight * 0.3,  // Ajuste del tamaño de la imagen
    width: screenWidth * 0.8,   // Ajuste del tamaño de la imagen
    resizeMode: 'contain',      // Para que la imagen se ajuste dentro del espacio disponible
  },
  actionButtonIcon: {
    fontSize: 30,
    height: 30,
    color: 'green',
  },
  floatinLeftTopBtn: {
    position: 'absolute',
    top: "10%",
    left: "1%",
    shadowColor: "green",
    borderColor: "green",
    borderWidth: 3,
    borderRadius: 35,
  },
  floatinRightTopBtn: {
    position: 'absolute',
    top: "10%",
    right: "1%",
    shadowColor: "green",
    borderColor: "green",
    borderWidth: 3,
    borderRadius: 35,
  },
  // Estilos para el TextInput y el View que lo contiene
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
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.7,
    shadowRadius: 10,
  }
});