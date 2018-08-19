import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Platform,
  InteractionManager,
} from 'react-native'

import PropTypes from 'prop-types'

const { width, height } = Dimensions.get('window')

const ALPHA_FONT_FAMILY = Platform.select({
  ios: 'Gill Sans',
  android: 'sans-serif',
})

const styleType = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.number,
  PropTypes.array,
])

export default class AlphabetFlatList extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    keyExtractor: PropTypes.func,
    viewabilityConfig: PropTypes.object,
    getItemLayout: PropTypes.func.isRequired,
    mainFlatListContainerStyle: styleType,
    alphabetListProps: PropTypes.shape({
      onPressLetter: PropTypes.func,
      alphabetListContainerStyle: styleType,
      alphabetButtonStyle: styleType,
      selectedAlphabetButtonStyle: styleType,
      alphabetTextStyle: styleType,
      selectedAlphabetTextStyle: styleType,
    }),
    matchFieldName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }

  static defaultProps = {
    viewabilityConfig: {
      itemVisiblePercentThreshold: 100,
    },
    keyExtractor: (item, index) => index,
    mainFlatListContainerStyle: {},
    alphabetListProps: {
      alphabetListContainerStyle: {},
      alphabetButtonStyle: {},
      selectedAlphabetButtonStyle: {},
      alphabetTextStyle: {},
      selectedAlphabetTextStyle: {},
    },
    matchFieldName: false,
  }

  constructor(props) {
    super(props)
    let letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')
    this.state = {
      alphabetList: letters,
      selectedLetter: letters[0],
    }
  }

  onPressLetter = selectedItem => {
    let { matchFieldName } = this.props

    let matchedIndex = this.props.data.findIndex(item => {
      if (matchFieldName && !item[matchFieldName]) {
        return console.warn(
          `matchFieldName ${matchFieldName} is not present in data`,
        )
      }

      let letterToMatch = matchFieldName ? item[matchFieldName][0] : item[0]
      return letterToMatch.toUpperCase() === selectedItem
    })
    if (matchedIndex === -1) return
    this._mainList.scrollToIndex({
      animated: true,
      index: matchedIndex,
      viewPosition: 0,
    })

    InteractionManager.runAfterInteractions(() => {
      this.setState({ selectedLetter: selectedItem })
    })
    this.props.onPressLetter && this.props.onPressLetter(selectedItem)
  }

  setAlphabetTextStyle = letter =>
    this.state.selectedLetter === letter
      ? [
          styles.selectedAlphabetTextStyle,
          this.props.alphabetListProps.selectedAlphabetTextStyle,
        ]
      : [
          styles.alphabetTextStyle,
          this.props.alphabetListProps.alphabetTextStyle,
        ]

  setAlphabetButtonStyle = letter =>
    this.state.selectedLetter === letter
      ? [
          styles.alphabetButtonStyle,
          this.props.alphabetListProps.selectedAlphabetButtonStyle,
        ]
      : [
          styles.alphabetButtonStyle,
          this.props.alphabetListProps.alphabetButtonStyle,
        ]

  renderAlphabetItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={this.onPressLetter.bind(this, item)}
        style={styles.alphabetButtonContainerStyle}
      >
        <View style={this.setAlphabetButtonStyle(item)}>
          <Text style={this.setAlphabetTextStyle(item)}>{item}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    let topItem = viewableItems[0]
    let { matchFieldName } = this.props
    if (!topItem) return

    let { item } = topItem

    if (matchFieldName && !item[matchFieldName]) {
      return console.warn(
        `matchFieldName ${matchFieldName} is not present in data`,
      )
    }

    let letterToMatch = matchFieldName ? item[matchFieldName][0] : item[0]

    let letter = letterToMatch.toUpperCase()
    let matchedIndex = this.state.alphabetList.findIndex(
      item => item === letter,
    )
    matchedIndex > -1 &&
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          selectedLetter: letter,
        })
      })
  }

  alphabetKeyExtractor = (item, index) => index

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.mainFlatListContainerStyle,
            this.props.mainFlatListContainerStyle,
          ]}
        >
          <FlatList
            ref={ref => (this._mainList = ref)}
            scrollEventThrottle={16}
            onViewableItemsChanged={this.onViewableItemsChanged}
            extraData={this.props}
            getItemLayout={this.props.getItemLayout}
            {...this.props}
          />
        </View>

        {/** Right Side Alphabet FlatList */}
        <View
          style={[
            styles.alphabetListContainerStyle,
            this.props.alphabetListProps.alphabetListContainerStyle,
          ]}
        >
          <FlatList
            ref={ref => (this._alphaList = ref)}
            data={this.state.alphabetList}
            renderItem={this.renderAlphabetItem}
            keyExtractor={this.alphabetKeyExtractor}
            extraData={this.state}
            showsVerticalScrollIndicator={false}
            {...this.props.alphabetListProps}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  mainFlatListContainerStyle: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  alphabetListContainerStyle: {
    flex: 0.2,
    backgroundColor: 'transparent',
  },
  alphabetButtonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetButtonContainerStyle: {
    flex: 1,
    paddingVertical: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetTextStyle: {
    fontFamily: ALPHA_FONT_FAMILY,
    fontSize: height * 0.026,
    color: 'rgb(90,90,90)',
  },
  selectedAlphabetTextStyle: {
    fontFamily: ALPHA_FONT_FAMILY,
    fontWeight: '600',
    fontSize: height * 0.026,
    color: 'rgb(90,90,90)',
  },
})
