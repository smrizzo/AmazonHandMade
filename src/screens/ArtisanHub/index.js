import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from './actions'
import * as globalActions from '@actions'

function mapStateToProps(state) {
  return {
    User: state.User,
    Artisans: state.Artisans,
    Errors: state.Errors,
    Products: state.Products,
    Conversations: state.Conversations
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...actions, ...globalActions }, dispatch)
}

import { default as UnconnectedArtisanList } from './ArtisanList'
import { default as UnconnectedAddArtisan } from './AddArtisan'
import { default as UnconnectedArtisanDetail } from './ArtisanDetail'
import { default as UnconnectedEditArtisan } from './EditArtisan'

const ArtisanList = connect(mapStateToProps, mapDispatchToProps)(UnconnectedArtisanList)
const AddArtisan = connect(mapStateToProps, mapDispatchToProps)(UnconnectedAddArtisan)
const ArtisanDetail = connect(mapStateToProps, mapDispatchToProps)(UnconnectedArtisanDetail)
const EditArtisan = connect(mapStateToProps, mapDispatchToProps)(UnconnectedEditArtisan)

export {
  ArtisanList,
  AddArtisan,
  ArtisanDetail,
  EditArtisan
}