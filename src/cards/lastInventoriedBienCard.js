import React, { Component } from "react";
import { Modal, StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
      subnumero: this.props.subnumero,
      descripcion: this.props.descripcion,
      material: this.props.material,
      color: this.props.color,
      marca: this.props.marca,
      modelo: this.props.modelo,
      serie: this.props.serie,
      estado: this.props.estado,
      imagen: this.props.imagen || "https://http2.mlstatic.com/D_NQ_NP_2X_924991-MLM70333484951_072023-F.webp", // Imagen por defecto
      imagenBytes: this.props.imagenBytes || null,
      textCodigoDeBarrasTextInput: '',  // Nuevo estado para el código de barras
      isEditModalVisible: false,  // Estado para controlar la visibilidad del modal de editar bien
      isChangePlaceModal: false,  // Estado para controlar la visibilidad del modal de cambiar de place un bien
      places: [],
      selectedPlaceId: 0,
      edificio: this.props.edificio,
    };
    this.updateImage = this.updateImage.bind(this);
    this.updateBien = this.updateBien.bind(this);
    this.editBien = this.editBien.bind(this);
    this.changeTextInput = this.changeTextInput.bind(this);  // Vinculamos el método
    this.saveChanges = this.saveChanges.bind(this);
    this.changePlaceInBien = this.changePlaceInBien.bind(this);
    this.changePlaceInBienInDatabase = this.changePlaceInBienInDatabase.bind(this);
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
      await this.updateBien();
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

  async editBien(){
    //Cambia el estado para mostrar el modal
    this.setState({isEditModalVisible: true});
  }

  async changePlaceInBien(){
    let _places = await APISQLite.getValuesWithCallback('lugar')
    this.setState({places: _places})
    this.setState({isChangePlaceModal: true});
    console.log(this.state.places);
  }

  async saveChanges() {
    // Aquí podrías llamar a una función que actualice la base de datos y el API REST    
    //Llenar en la base de datos tanto local como en la API
    const {id, descripcion, subnumero, material, color, marca, modelo, serie, estado} = this.state;
    console.log("ID:", this.state.id);
    console.log("Descripcion:", this.state.descripcion);
    console.log("Subnumero:", this.state.subnumero);
    console.log("Material:", this.state.material);
    console.log("Color:", this.state.color);
    console.log("Marca:", this.state.marca);
    console.log("Modelo:", this.state.modelo);
    console.log("Serie:", this.state.serie);
    console.log("Estado:", this.state.estado);    
    if(await APISQLite.updateBien(id, descripcion, material, marca, color, serie, estado, modelo, subnumero)){
      this.setState({ isEditModalVisible: false }); // Oculta el modal después de guardar
      alert("Bien actualizado en local y en API REST");
      console.log("Bien actualizado en local y en API REST");
    }
  }

  async changePlaceInBienInDatabase(){
    const {selectedPlaceId, id, descripcion} = this.state;
    console.log(selectedPlaceId, id, descripcion)
    if(await APISQLite.changePlaceInBien(id, selectedPlaceId)){
      this.setState({isChangePlaceModal: false})
      alert(`Bien ${descripcion} con id ${id} movido al lugar con id ${selectedPlaceId}`);
    }
  }

  render() {
    const {id, numero_activo, descripcion, material, color, marca, modelo, imagen, subnumero } = this.state;
    const {edificio} = this.state;
    let isEditModalVisible = this.state.isEditModalVisible;
    let isChangePlaceModal = this.state.isChangePlaceModal;
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
          <Text style={styles.characteristics}>ID: {id}</Text>
          <Text style={styles.numero_activo}>Numero activo: {numero_activo}</Text>
          <Text style={styles.characteristics}>Bien: {descripcion}</Text>
          <Text style={styles.characteristics}>Material: {material}</Text>
          <Text style={styles.characteristics}>Modelo: {modelo}</Text>
          <Text style={styles.characteristics}>Color: {color}</Text>
          <Text style={styles.characteristics}>Marca: {marca}</Text>
          <Text style={styles.characteristics}>Subnumero: {subnumero}</Text>
          <ActionButton
            title="UpdateBien"
            renderIcon={() => (<IconsMaterialIcons name="edit" style={styles.actionButtonIcon} />)}
            shadowStyle={styles.floatinRightTopBtn}
            buttonColor="rgba(255,255,255,1)"
            onPress={this.editBien}
            hideShadow={false}
          />
          <ActionButton
            title="changePlace"
            renderIcon={() => (<IconsMaterialIcons name="apartment" style={styles.actionButtonIcon} />)}
            shadowStyle={styles.floatinLeftBottomBtn}
            buttonColor="rgba(255,255,255,1)"
            onPress={this.changePlaceInBien}
            hideShadow={false}
          />
        </View>
        {/* Modal para el formulario de edición del bien */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditModalVisible}
          onRequestClose={() => this.setState({ isEditModalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Editar Bien</Text>
              <TextInput
                style={styles.input}
                placeholder="Subnumero"
                value={String(this.state.subnumero)}
                onChangeText={(text) => this.setState({ subnumero: text })}
              />              
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={this.state.descripcion}
                onChangeText={(text) => this.setState({ descripcion: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Material"
                value={this.state.material}
                onChangeText={(text) => this.setState({ material: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Color"
                value={this.state.color}
                onChangeText={(text) => this.setState({ color: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Marca"
                value={this.state.marca}
                onChangeText={(text) => this.setState({ marca: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Modelo"
                value={this.state.modelo}
                onChangeText={(text) => this.setState({ modelo: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Serie"
                value={this.state.serie}
                onChangeText={(text) => this.setState({ serie: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Estado"
                value={this.state.estado}
                onChangeText={(text) => this.setState({ estado: text })}
              />              
              <TouchableOpacity style={styles.saveButton} onPress={this.saveChanges}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => this.setState({ isEditModalVisible: false })}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Modal para el formulario de cambiar de lugar un bien */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isChangePlaceModal}
          onRequestClose={() => this.setState({ isChangePlaceModal: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Cambiar de lugar al bien: {this.state.descripcion} con id: {this.state.id}</Text>
              <Picker
                selectedValue={this.state.selectedPlaceId}
                style={styles.input}
                onValueChange={(itemValue) => this.setState({ selectedPlaceId: itemValue })}
              >
                <Picker.Item label={"Lugar actual del bien: "+ edificio || "Selecciona el nuevo edificio"} value="" />
                {this.state.places.map((place) => (
                  <Picker.Item key={place.id} label={place.edificio} value={place.id} />
                ))}
              </Picker>
              
              <TouchableOpacity style={styles.saveButton} onPress={this.changePlaceInBienInDatabase}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => this.setState({ isChangePlaceModal: false })}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  floatinLeftBottomBtn: {
    position: 'absolute',
    top: "5%",
    left: "50%",
    transform: [{ translateX: -60 }],
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: 'blue',
    width: '80%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    width: '60%',
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});