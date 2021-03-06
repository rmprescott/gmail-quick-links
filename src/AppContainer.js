import React from 'react'
import LinkList from './components/LinkList'

import {
  storage,
  getQuickLinks,
  addQuickLink,
  removeGlobalLink,
  removeAccountLink,
  toggleLink,
  GMAIL_QUICK_LINKS_NAME
} from './config'

class AppContainer extends React.Component {
  constructor(props) {
    super(props)
    this.buildList = this.buildList.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.state = {
      name: "",
      version: "",

      //global
      linkList: {},

      //accountList contains all accounts, with nested lists in each account
      accountList: {}
    }
  }

  buildList(gql) {
    const {
      name = GMAIL_QUICK_LINKS_NAME.name,
      version = GMAIL_QUICK_LINKS_NAME.version,
      linkList = {},
      accountList = {}
    } = gql

    this.setState((prevState, props) => {
      return {
        name,
        version,
        linkList,
        accountList
      }
    })
  }

  onAdd(event) {
    event.preventDefault()
    const { accountName } = this.props
    //TODO: do we use location.hash?  or something else?
    const urlHash = location.hash
    const name = prompt(`Enter title for current view [${urlHash.substring(1)}]`, urlHash.substring(1))

    if (name) {
      addQuickLink(
        accountName,
        name,
        urlHash
      )
    }
  }

  componentWillMount() {
    // when the storage changes, we should update the list
    storage.onChanged.addListener((changes, areaName) => {
      getQuickLinks(this.buildList)
    })
  }

  componentDidMount() {
    getQuickLinks(this.buildList)
  }

  render() {
    const { linkList, accountList } = this.state
    const { accountName, location } = this.props

    const moreProps = {
      className: (location === 'widget') ? 'py' : ''
    }

    return (
      <div id={GMAIL_QUICK_LINKS_NAME.divId} {...moreProps}>
        <LinkList
          linkList={linkList}
          accountList={accountList[accountName]}
          onAdd={this.onAdd}
          onDelete={(type, name) => {
            if (type === 'global') {
              removeGlobalLink(name)
            } else {
              removeAccountLink(accountName, name)
            }
          }}
          onClickGlobeCircle={(type, name) => {
            toggleLink(type, name, accountName)
          }}
        />
      </div>
    )
  }
}

export default AppContainer
