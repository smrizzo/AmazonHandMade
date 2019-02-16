import firebase from 'react-native-firebase'

export function createArtisan(data) {
  return (dispatch, prevState) => { 
    return new Promise(async (resolve, reject) => {
      console.log("Pushing artisan to db")
      var db_ref = await firebase.database().ref('artisans/').push({
        name: data.name,
        phoneNumber: data.phoneNumber,
        description: data.description
      })
      console.log("Done")

      artisanObject = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        description: data.description,
        uid: db_ref.key
      }

      if(data.profilePicturePath) {
        console.log("Pushing photo to storage")
        var st_ref = await firebase.storage()
          .ref(`artisanFiles/${db_ref.key}/images/profilePicture`)
          .putFile(data.profilePicturePath)
          console.log("Done")

        artisanObject.profilePictureURL = st_ref.downloadURL
        
        console.log("Fetching photo download url")
        firebase.database().ref(`artisans/${artisanObject.uid}`).update(
          { profilePictureURL: st_ref.downloadURL })
      }

      resolve()
      dispatch({type: 'ADD_ARTISAN', artisan: artisanObject})
    })
  }
}

export const saveArtisan = ({ name, phoneNumber, description, profilePicturePath, uid }) => {
   return (dispatch) => {
      return new Promise(async (resolve, reject) => {
         await firebase.database().ref(`/artisans/${uid}`)
         .update({ name, phoneNumber, description });

         artisanObject = {
            name,
            phoneNumber,
            description,
            uid
         };
         console.log("artisan object name" + artisanObject.name);
         if(profilePicturePath) {
            console.log("Pushing photo to storage")
            await firebase.storage().ref(`artisanFiles/${uid}/images/profilePicture`).delete()
            let st_ref = await firebase.storage()
               .ref(`artisanFiles/${uid}/images/profilePicture`)
               .putFile(profilePicturePath);

            artisanObject.profilePictureURL = st_ref.downloadURL;
            await firebase.database().ref(`/artisans/${uid}`).update({ profilePictureURL: st_ref.downloadURL });
         }
          
         resolve();
         dispatch({ type: 'SAVE_ARTISAN', artisan: artisanObject })
      })
   }
};

export function fetchArtisans() {
  return (dispatch, prevState) => {
    return new Promise(async (resolve, reject) => {
      console.log("Fetching artisans")
      snapshot = await firebase.database().ref('artisans').once('value')
      console.log("Done")
      artisanArray = []
      artisanObject = snapshot.val()
      
      for(var uid in artisanObject) {
        artisanArray.push({
          ...artisanObject[uid],
          uid: uid
        })
      }
      
      resolve()
      dispatch({type: 'GET_ARTISANS', artisans: artisanArray})
    })
  }
}

//Fetch all products (so all CGA products) or the ones associated with a specific artisan
// export function fetchProducts(artisanID = "") {
//    return (dispatch, prevState) => {
//      return new Promise(async (resolve, reject) => {
//        console.log("Fetching products")
//        let snapshot = await firebase.database().ref('products').once('value')
//        console.log("Done")
//        let productArray = []
//        let productObject = snapshot.val()
       
//        for(var productID in productObject) {
//          productArray.push({
//            ...productObject[productID],
//            productID: productID
//          })
//        }
 
//        //if artisanID is provided, narrow the products list
//        if (artisanID !== ""){
//          let artisanProds = await firebase.database().ref(`artisan/${artisanID}/products`).once('value').val()
//          productArray = productArray.filter(obj => artisanProds.includes(obj.productID))
//        }
 
//        resolve()
//        dispatch({type: 'GET_PRODUCTS', products: productArray})
//      })
//    }
//  }

// action takes in current list of artisans and artisan to be deleted
// sends that artisan to reducer to be filtered out of state
//Also check that artisan has an image if so delete that from storage
export function deleteArtisan(artisans, artisan) {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      await firebase.database().ref(`artisans/${artisan}`).remove()
      await firebase.storage().ref(`artisanFiles/${artisan}/images/profilePicture`).delete()
      
      resolve()
      dispatch({type: 'DELETE_ARTISAN', artisan: artisan})
    })  
  }
}

