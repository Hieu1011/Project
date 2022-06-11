import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../../../Project/src/models/'
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-gesture-handler';
import "@azure/core-asynciterator-polyfill";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState();
  const [lookingFor, setLookingFor] = useState();

  useEffect(() => {
    const getCurrentUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>
         u.sub('eq',authUser.attributes.sub),
        );

      if (!dbUsers || dbUsers.length === 0){
        console.warn('This is a new user')
        return;
      }
      const dbUser = dbUsers[0];
      setUser(dbUser);

      setName(dbUser.name);
      setBio(dbUser.bio);
      setGender(dbUser.gender);
      setLookingFor(dbUser.lookingFor);
    };
    getCurrentUser();
  }, []);

  const isVaild = () => {
    return name && bio && gender && lookingFor;
  };
  const save = async () => {
    if (!isVaild()) {
      console.warn('Not vaild ');
      return;
    }
    if (user) {
      const updateUser = User.copyOf(user, updated => {
        updated.name = name;
        updated.gender = gender;
        updated.bio = bio;
        updated.lookingFor = lookingFor;
      })
      await DataStore.save(updateUser);
    } else {
      const authUSer = await Auth.currentAuthenticatedUser();
      const newUser = new User({
        sub: authUSer.attributes.sub,
        name,
        bio,
        gender,
        lookingFor,
        image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png',
      });
      await DataStore.save(newUser);
    }
    Alert.alert('User saved successfully');
  };
  const signOut = async () =>{
    await DataStore.clear();
    Auth.signOut();
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name ..."
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio ..."
          multiline
          numberOfLines={3}
          value={bio}
          onChangeText={setBio}
        />

        <Text>Gender</Text>
        <Picker
          label="Gender"
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}>
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label='Other' value="OTHER" />
        </Picker>

        <Text>LookingFor</Text>
        <Picker
          label="LookingFor"
          selectedValue={lookingFor}
          onValueChange={(itemValue) => setLookingFor(itemValue)}>
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label='Other' value="OTHER" />
        </Picker>

        <Pressable onPress={save} style={styles.button}>
          <Text> Save</Text>
        </Pressable>

        <Pressable onPress={signOut} style={styles.button}>
          <Text> SignOut</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 10,

  },
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    margin: 10,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: '#F63A6E',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
  user: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 50,

    borderWidth: 2,
    padding: 3,
    borderColor: '#F63A6E',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});
export default ProfileScreen;
