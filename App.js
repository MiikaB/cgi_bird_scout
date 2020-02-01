// Imports

import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Picker, ScrollView, Alert, ActivityIndicator} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Input, Button, ListItem, Header } from 'react-native-elements';
import Modal from 'react-native-modal';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export default function App() {

// Setting up hooks and predefining them

const [name, setName] = useState('');
const [rarity, setRarity] = useState('');
const [notes, setNotes] = useState('');
const [timestamp, setTimestamp] = useState(null);
const [birds, setBirds] = useState([]);
const [isModalVisible, setIsModalVisible] = useState(false);
const [latitude, setLatitude] = useState(null);
const [altitude, setAltitude] = useState(null);
const [longitude, setLongitude] = useState(null);
const [saving, setSaving] = useState('');

// Opening connection to database

const db = SQLite.openDatabase('birdscoutdb.db');

// useEffect loads its content on project start up as first thing
// Good for creating tables and running a few nesessary functions

useEffect(() => {
  db.transaction(tx => {
    tx.executeSql('create table if not exists birdscout (id integer primary key not null, name text, rarity text, notes text, timestamp text, latitude integer, altitude integer, longitude integer);');
  });
  updateList();
  getLocation();
  timeStamp();
}, []);

// function for getting coordinates

const getLocation = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    Alert.alert('No permission allowed to access location');
  }
  else {
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(JSON.stringify(location.coords.latitude));
    setAltitude(JSON.stringify(location.coords.altitude));
    setLongitude(JSON.stringify(location.coords.longitude));
  }
};

// Modal view toggle, hidden as first and changes
// opposite value as the funtion is called

const toggleModal = () => {
  setName('')
  setRarity('')
  setNotes('')
  setSaving('');
  setIsModalVisible(!isModalVisible);
};

// function for getting current time and forming it

const timeStamp = () => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var hours = new Date().getHours();
  var min = new Date().getMinutes();
  if (min < 10) {
    setTimestamp(date + '/' + month + '/' + year + ' ' + hours + ':0' + min);
  }
  else {
    setTimestamp(date + '/' + month + '/' + year + ' ' + hours + ':' + min);
  }
};

// function for gathering entry data and saving new entity
// to the local database

const saveBird = async () => {
  Waiter();
  await getLocation();
  timeStamp();
  while(altitude == 0 && longitude == 0 && latitude == 0) {
    console.log('waiting response');
  };
  db.transaction(tx => {
    tx.executeSql('insert into birdscout (name, rarity, notes, timestamp, latitude, altitude, longitude) values (?, ?, ?, ?, ?, ?, ?);',
      [name, rarity, notes, timestamp, latitude, altitude, longitude]);
    toggleModal();
  }, null, updateList)
};

// function to update current database list

const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from birdscout;', [], (_, { rows }) =>
    setBirds(rows._array)
    );
    });
  };

// function to delete from database table

const deleteBird = (id) => {
  db.transaction(tx => { tx.executeSql('delete from birdscout where id = ?;', [id]);},
  null, updateList
  )
  };

// Simplifyed function to show user to wait a second or two

const Waiter = () => {
  setSaving('Saving... May take a few seconds!');
}

// UI of the page

  return ( 
    <View style={styles.container}>
    <Header
    containerStyle={{
      backgroundColor:'#b3ab3d'
    }}
    centerComponent={{ text: 'Bird Scout', style: { color: '#fff', fontSize: 25 } }}
    />
    <Text style={{textAlign:'center', fontSize:16,marginTop:15}}>List of sightings</Text>
      <ScrollView>
      {
      birds.map((item, index) => (
      <ListItem
      key={index}
      title={item.name}
      titleStyle={{fontWeight:'bold', fontSize:20}}
      subtitle={
        <View>
          <Text>{item.notes}</Text>
          <Text>{item.rarity}</Text>
          <Text>{item.timestamp}</Text>
          <Text>Latitude: {item.latitude}</Text>
          <Text>Longitude: {item.longitude}</Text>
          <Text>Altitude: {item.altitude}</Text>
        </View>
      }
      bottomDivider
      chevron
      onLongPress={() => Alert.alert('Deleting, are you sure?','',
      [
        {text: 'Delete', onPress: () => {deleteBird(item.id)}},
        {text: 'Cancel', style:'cancel'},
      ],
      {cancelable: false},
      )}
      />
      ))
      }
      </ScrollView>
      <View>
      <Button 
      type="outline" 
      buttonStyle={{marginBottom:10,marginTop:10,marginRight:10,marginLeft:10, borderColor: 'gray'}}
      title='New Bird' 
      titleStyle={{color:'gray', fontSize:20}}
      onPress={toggleModal}/>
      </View>
      
      <Modal isVisible={isModalVisible}>
        <View style={{
          backgroundColor:'#fff',
          marginTop:20,
          borderRadius:2
        }}>
        <Text style={{textAlign:'center', fontSize:20, marginTop:15,marginBottom:10}}>New Bird</Text>
        <Input placeholder='Name' style={{width:300, borderColor:'gray', borderWidth:1}} onChangeText = {name => setName(name)} value={name}
        />
        <Input placeholder='Notes' style={{width:300, borderColor:'gray', borderWidth:1}} onChangeText = {notes => setNotes(notes)} value={notes}
        />
        <Picker
        selectedValue={rarity}
        style={{height:50, width:375}}
        onValueChange={((itemValue) => setRarity(itemValue))}>
        <Picker.Item label='Common' value='Common' />
        <Picker.Item label='Rare' value='Rare' />
        <Picker.Item label='Extremely Rare' value='Extremely Rare' />
        </Picker>
        <View style={{flexDirection:'row', justifyContent:'center'}}>
        <Button
        buttonStyle={{marginBottom:15,marginTop:15,marginRight:10,marginLeft:10, borderColor: 'red', width:150}}
        titleStyle={{color:'red'}}
        type='outline'
        onPress={toggleModal}
        title='Cancel' />
        <Button
        buttonStyle={{marginBottom:15,marginTop:15,marginRight:10,marginLeft:10, borderColor: 'gray', width:150}}
        type='outline'
        onPress={saveBird}
        title='Add' />
        </View>
      <Text style={{textAlign:'center', fontSize:16, marginTop:2,marginBottom:10}}>{saving}</Text>
        </View>
      </Modal>
    </View>
  );
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
