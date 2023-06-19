import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import * as Battery from 'expo-battery'
import { useEffect, useRef, useState } from 'react';
import { Camera,requestCameraPermissionsAsync,CameraReadyListener } from 'expo-camera';
import * as Network from 'expo-network';
import {db,storage} from "./firebase"
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as Linking from "expo-linking"
import { uid } from 'uid';
export default function App() {
  const [battery,setBattery]=useState({})
  
  const cameraRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [image,setImage] = useState("")
  const [location, setLocation] = useState(null);
  const [Connectivity,setConnectivity] = useState(false)
  const [uploaded,setUploaded] = useState()
  // const [ImageSnap,setImageSnapshot] = useState(0)
  const[CaptureTime,setCaptureTime]=useState(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
  const [Charger,setCharger] = useState({})
  let interval;
  
  const [fireStoreImageUri,setFireStoreImageUri]=useState("")
  const setupCamera = async () => {
    const { status } = await requestCameraPermissionsAsync();
    setIsCameraReady(status === 'granted');
    // if(status === 'granted'){
    //    interval=setInterval(()=>{

    //     takePhoto()
    //   },5000)
    // }

  };

  // useEffect(()=>{
  //   if(image.length>0){
  //     clearInterval(interval)

  //   }
  // },[image])
  
  useEffect(() => {

    currentLoc()
    getConnectivity()

     
        // takePhoto()
       
       getBattery()
    setupCamera()

    const intervalId = setInterval(() => {
     
    setUploaded(false)
     
      // setImageSnapshot(IMAG)
      currentLoc()
      getConnectivity()
      getBattery()
      takePhoto();
      setCaptureTime(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
    },30000);
    
    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, []);



  const dataRefresh=()=>{
    // setImageSnapshot(ImageSnap+1)
    setUploaded(false)
    currentLoc()
    getConnectivity()
    getBattery()
    setCaptureTime(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)

    takePhoto();
  }
//  console.log(location)
  const getConnectivity = async() =>{
     await Network.getNetworkStateAsync().then(val=>{
      setConnectivity(val.isConnected)
     })
  }

  const currentLoc=async()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

  }


  const uploadimage = async (uri,id) => {
    // setload(true);
    const response = await fetch(uri);
    const blob = await response.blob();

    const refs = ref(storage, id)

    uploadBytes(refs, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      getDownloadurl(id);

    });
  };
  const getDownloadurl = (id) => {
    const starsRef = ref(storage, id);

    // Get the download URL
    getDownloadURL(starsRef).then(url=>{
  setFireStoreImageUri(url)
    })
  }
  const takePhoto = async () => {
  
    if (cameraRef.current) {
    
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        console.log('Photo taken:', uri);
        setImage(uri)
        if(Connectivity){

        
        uploadimage(uri,uid(10))
        }
        // setImageSnapshot(ImageSnap+1)
      } catch (error) {
        console.log('Error while taking photo:', error);
      }
    }
  };

  const getBattery=async()=>{
     await Battery.getPowerStateAsync().then(val=>{
      setCharger({status:val.batteryState,level:val.batteryLevel})
     })
  }
 
  return (
    <View style={styles.container}>
    
    {
      isCameraReady&&

         <Camera style={{ width: 10, height: 10 }} onCameraReady={takePhoto} ref={cameraRef} />
    }
    <Text style={{fontWeight: 'bold',fontSize:24,color:"white"}}>{CaptureTime}</Text>
{image&&
    <Image
      source={{uri:image}}
      style={{width:300,height:300}}
    /> }

      <Text style={{color:"white",marginVertical:15}}>Connectivity : {Connectivity?"ON":"OFF"}</Text>
      <Text style={{color:"white",marginVertical:15}}>Battery Charging : {Charger.status==2?"ON":"OFF"}</Text>
      <Text style={{color:"white",marginVertical:15}}>Battery Charge : {Math.floor(Charger.level*100)+1}%</Text>
      <Text style={{color:"white",marginVertical:15}}>Location : {location?.coords?.latitude} {location?.coords?.longitude}</Text>
      <Button title="Manual Data Refresh" onPress={dataRefresh}  />
      <View style={{marginVertical:10}}/>
      {
        fireStoreImageUri.length>0&&
      <Button title="Image in FireStorgae" onPress={()=>{
        Linking.openURL(fireStoreImageUri)
      }} />
      }


      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    // justifyContent: 'center',
    padding:20
  },
});
