import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Picker, ScrollView,} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Input, Button, ListItem, Header } from 'react-native-elements';
import Modal from 'react-native-modal';

export default function App() {

const [name, setName] = useState('');
const [rarity, setRarity] = useState('');
const [notes, setNotes] = useState('');
const [timestamp, setTimestamp] = useState('');
const [birds, setBirds] = useState([]);
const [isModalVisible, setIsModalVisible] = useState(false);
const db = SQLite.openDatabase('birdscoutdb.db');

useEffect(() => {
  db.transaction(tx => {
    tx.executeSql('create table if not exists birdscout (id integer primary key not null, name text, rarity text, notes text, timestamp integer);');
  });
  updateList();
  timeStamp();
}, []);

const toggleModal = () => {
  setName('')
  setRarity('')
  setNotes('')
  setIsModalVisible(!isModalVisible);
}

const timeStamp = () => {
  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  if (min < 10) {
    var digitalminutes = '0' + min;
  }
  setTimestamp(date + '/' + month + '/' + year + ' ' + hours + ':' + digitalminutes,);
}

const saveBird = () => {
  timeStamp();
  db.transaction(tx => {
    tx.executeSql('insert into birdscout (name, rarity, notes, timestamp) values (?, ?, ?, ?);',
      [name, rarity, notes, timestamp]);
    toggleModal();
  }, null, updateList)}

const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from birdscout;', [], (_, { rows }) =>
    setBirds(rows._array)
    );
    });
  }

const deleteBird = (id) => {
  db.transaction(tx => { tx.executeSql('delete from birdscout where id = ?;', [id]);},
  null, updateList
  )
  }

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
        </View>
      }
      bottomDivider
      chevron
      onPress={() => deleteBird(item.id)}
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
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
