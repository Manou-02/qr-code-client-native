import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from 'axios';



const db_uri = "http://192.168.43.149:5000/presence";

export default function App() {
  const [hasPermition, setHasPermition] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('');


  const demanderCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermition(status == 'granted')
    })()
  }
  useEffect(() => {
    demanderCameraPermission();
  }, []);

  const barCodeScanned =  ({type, data}) => {
    setScanned(true);
    setText(data);


    axios.post(db_uri, {userMat : data}).then((docs) => { 
        console.log("success");
    }).catch(err => {
      console.log(err)  ;
    })

    // axios({
    //   method : 'POST',
    //   baseURL : db_uri,
    //   data : "aaaaaa"
    // }).then((docs) => { 
    //     console.log("success");
    // }).catch(err => {
    //   console.log(err)  ;
    // })


    console.log(`Type : ${type}, \nData : ${data}`);
  }
  const reScanne = () => {
    setScanned(false);
    setText('');
  }

  if(hasPermition == null){
    return (
      <View style={styles.container}>
        <Text>Camera permission</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  if(hasPermition === false){
    return (
      <View style={styles.container}>
        <Text>Vous n'avez pas d'accès au Camera</Text>
        <Button  title={'Demander permission'} onPress={() => demanderCameraPermission()} />
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.barCodeBox}>
          <BarCodeScanner 
            onBarCodeScanned={scanned ? undefined : barCodeScanned}
            style={{height: 400, width : 600}}
          />
      </View>
          <Text style={styles.mainText}>{text} </Text>
          {scanned &&
            <Button 
              title={'Re-scan'} 
              onPress={reScanne}
            />
          }
    </View>
  );


}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barCodeBox : {
    backgroundColor : '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height : 300,
    width : 400,
    borderRadius : 30,
    overflow : 'hidden'
  },
  mainText : {
    fontSize : 16,
    margin : 20,
  },
});
