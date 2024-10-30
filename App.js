import React, { Component } from "react"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"; 

import ListInventarios from "./src/inventarios/screens/listInventarios"
import ListPlaces from "./src/generalinventario/screens/tabs/listPlaces"
import ListGeneralLocated from "./src/generalinventario/screens/tabs/listGeneralLocated"
import ListGeneralUnlocated from "./src/generalinventario/screens/tabs/listGeneralUnlocated"

import LastInventoriedBien from "./src/inventario/screens/tabs/lastInventoriedBien"
import ListLocated from "./src/inventario/screens/tabs/listLocated"
import ListUnlocated from "./src/inventario/screens/tabs/listUnlocated"

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator()
const TopTab = createMaterialTopTabNavigator()

function renderDrawerGeneralInventarioTabsComponents(props){
  return(
    <TopTab.Navigator>
      <TopTab.Screen name="ListPlaces" component={ListPlaces} options={{title:"Places"}}
      initialParams={{data:props.route.params}}/>
      <TopTab.Screen name="ListGeneralLocated" component={ListGeneralLocated} options={{title:"General located"}} 
      initialParams={{data:props.route.params}}/>
      <TopTab.Screen name="ListGeneralUnlocated" component={ListGeneralUnlocated} options={{title:"General unlocated"}}
      initialParams={{data:props.route.params}}/>
    </TopTab.Navigator>
  )
}

function renderDrawerInventarioTabsComponents(props){
  //console.log("App -> props")
  //console.log(props)
  return(
    <TopTab.Navigator>
      <TopTab.Screen name="LastInventoriedBien" component={LastInventoriedBien} options={{title:"Last located"}}
      initialParams={{data:props.route.params}}/>
      <TopTab.Screen name="ListLocated" component={ListLocated} options={{title:"Located"}}
      initialParams={{data:props.route.params}}/>
      <TopTab.Screen name="ListUnlocated" component={ListUnlocated} options={{title:"Unlocated"}}
      initialParams={{data:props.route.params}}/>
    </TopTab.Navigator>
  )
}

class App extends Component{
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="ListInventarios" component={ListInventarios}></Stack.Screen>
          <Stack.Screen name="TabsGeneralInventario" children={renderDrawerGeneralInventarioTabsComponents}></Stack.Screen>
          <Stack.Screen name="TabsInventario" children={renderDrawerInventarioTabsComponents}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App