# react-native-alphabetflatlist

A Flatlist with alphabet sidebar.

## Usage

```
    import AlphabetFlatList from 'react-native-flatlist'

    /* inside your render function */
    <AlphabetFlatList
        renderItem={this.renderItem}
        data={names}
        getItemLayout={this.getItemLayout}
        />
```

## Props

You can use all the props provided by FlatList.

| Name                       | Type     | Default                                                                                                                                                                                             | Required |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| data                       | array    |                                                                                                                                                                                                     | YES      |
| renderItem                 | function |                                                                                                                                                                                                     | YES      |
| keyExtractor               | function | (item, index) => index                                                                                                                                                                              |          |
| viewabilityConfig          | object   | { itemVisiblePercentThreshold: 50 }                                                                                                                                                                 |          |
| getItemLayout              | function |                                                                                                                                                                                                     | YES      |
| mainFlatListContainerStyle | object   | {}                                                                                                                                                                                                  |          |
| alphabetListProps          | object   | { <br>&ensp;alphabetListContainerStyle: {},<br>&ensp;alphabetButtonStyle: {},<br>&ensp;selectedAlphabetButtonStyle: {},<br>&ensp;alphabetTextStyle: {},<br>&ensp;selectedAlphabetTextStyle: {}<br>} |          |
