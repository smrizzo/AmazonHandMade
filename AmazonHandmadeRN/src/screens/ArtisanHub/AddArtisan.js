import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList
} from 'react-native';

import {
  AsyncButton,
  UserInput,
  Divider,
  Wallpaper,
  ProfilePicture
} from '@components'

import ImagePicker from 'react-native-image-crop-picker';

export default class AddArtisan extends Component {
  static navigationOptions = {
    title: 'Add Artisan'
  }

  constructor(props) {
    super(props)

    this.state = {
      name: "",
      phoneNumber: "",
      profilePicturePath: "",
      description: "",
      adding: false
    }

    this.pickImage = this.pickImage.bind(this)
    this.createArtisan = this.createArtisan.bind(this)
    this.verifyFields = this.verifyFields.bind(this)
  }

  pickImage() {
    ImagePicker.openPicker({
      width: 100,
      height: 100,
      cropping: true
    }).then(image => {
      this.setState({profilePicturePath: image.path})
    });
  }

  verifyFields() {
    console.log("Not yet implemented")
    return true
  }
  
  createArtisan() {
    if(this.verifyFields()) {
      this.setState({adding: true})
      this.props.createArtisan({
        name: this.state.name,
        phoneNumber: this.state.phoneNumber,
        profilePicturePath: this.state.profilePicturePath,
        description: this.state.description
      }).then(() => {
        this.setState({adding: false})
        this.props.navigation.goBack()
      })
    }
  }

  render() {
    return (
      <Wallpaper style={styles.container}>
        <View style={styles.firstSection}>
          <ProfilePicture 
            imageUri={this.state.profilePicturePath}
            onPress={() => this.pickImage()}
            style={styles.image}
          />
          <View style={styles.namePhone}>
            <UserInput
              iconName="id-card"
              placeholder="Name"
              value={this.state.name}
              onChangeText={(newText) => this.setState({name: newText})}
              style={styles.smallInput1}
            />
            <UserInput
              iconName="phone"
              placeholder="Phone Number"
              value={this.state.phoneNumber}
              onChangeText={(newText) => this.setState({phoneNumber: newText})}
              style={styles.smallInput2}
            />
          </View>
        </View>
        <View style={styles.secondSection}>
          <UserInput 
            placeholder="Describe this artisan"
            value={this.state.description}
            onChangeText={(newText) => this.setState({description: newText})}
            style={styles.largeInputs}
            multiline={true}
          />
        </View>
        <AsyncButton 
          title="Create"
          color="#c14700"
          textColor="white"
          onPress={this.createArtisan}
          style={styles.button}
          spinning={this.state.adding}
        />
      </Wallpaper>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '2%'
  },
  image: {
    borderRadius: 5
  },
  firstSection: {
    width: '100%',
    height: 100,
    flexDirection: 'row'
  },
  secondSection: {
    width: '100%',
    flexDirection: 'column',
    flex: 4
  },
  namePhone: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  smallInput1: {
    marginTop: 0,
    marginBottom: 2,
    marginLeft: 4,
    marginRight: 0,
    borderRadius: 5
  },
  smallInput2: {
    marginTop: 2,
    marginBottom: 0,
    marginLeft: 4,
    marginRight: 0,
    borderRadius: 5
  },
  largeInputs: {
    marginTop: 4,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 5,
  },
  button: {
    borderRadius: 5, 
    flex: 1, 
    flexDirection: 'column'
  }
})