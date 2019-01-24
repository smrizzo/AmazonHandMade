import firebase from 'react-native-firebase'
import LoginWithAmazon from 'react-native-login-with-amazon'

export function amazonLogin(email, password) {
  return (dispatch, prevState) => {
    return new Promise(async (resolve, reject) => {
      LoginWithAmazon.login((error, accessToken, profileData) => {
        if(error) {
          console.log(error)
          resolve()
          dispatch({ type: 'ERROR', error: error })
        } else {
          console.log("Login with Amazon successful!")

          fetch('https://us-central1-handmade-error-404.cloudfunctions.net/loginWithAmazon', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken: accessToken,
              userInfo: {
                email: profileData.email,
                name: profileData.name,
                user_id: profileData.user_id
              }
            })
          }).then(res => {
            return res.json()
          }).then(body => {
            console.log("Received response with token: " + body.token)
            firebase.auth().signInWithCustomToken(body.token).then(currentUser => {
              console.log("Signed in with firebase custom auth and amazon")
              user = {
                email: currentUser.user.email,
                displayName: currentUser.user.displayName,
                emailVerified: currentUser.user.emailVerified,
                photoURL: currentUser.user.photoURL,
                phoneNumber: currentUser.user.phoneNumber
              }

              resolve()
              dispatch({ type: 'LOGIN', user: user })
            })
          }).catch(error => {
            resolve()
            dispatch({ type: 'ERROR', error: error })
          })
        }
      })
    })
  }
}

export function emailLogin(email, password) {
  return (dispatch, prevState) => {
    return new Promise(async (resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(currentUser => {
        user = {
          email: currentUser.user.email,
          displayName: currentUser.user.displayName,
          emailVerified: currentUser.user.emailVerified,
          photoURL: currentUser.user.photoURL,
          phoneNumber: currentUser.user.phoneNumber
        }

        resolve()
        dispatch({ type: 'LOGIN', user: user })
      }).catch(error => {
        resolve()
        dispatch({ type: 'ERROR', error: error })
      })
    })
  }
}

export function register(email, password) {
  return (dispatch, prevState) => {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(currentUser => {
        user = {
          email: currentUser.user.email,
          displayName: currentUser.user.displayName,
          emailVerified: currentUser.user.emailVerified,
          photoURL: currentUser.user.photoURL,
          phoneNumber: currentUser.user.phoneNumber
        }

        resolve()
        dispatch({ type: 'LOGIN', user: user })
      }).catch(error => {
        resolve()
        dispatch({ type: 'ERROR', error: error })
      })
    })
  }
}