import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TextInput, Dimensions } from 'react-native';
//import APISQLite from "../db/connectionSQLite"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

class CodeBar extends Component{
    constructor(props) {
        super(props);
        this.state = {
          textCodigoDeBarrasTextInput: '',  // Nuevo estado para el código de barras
        };
        this.changeTextInput = this.changeTextInput.bind(this);  // Vinculamos el método
    }

    changeTextInput(text) {
        this.setState({ textCodigoDeBarrasTextInput: text.nativeEvent.text });
        console.log(text.nativeEvent.text);
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