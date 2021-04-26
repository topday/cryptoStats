import React, { useState, useEffect } from 'react';
import { 
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  Text, 
  View, 
  StyleSheet, 
  Image 
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { Col, Row, Grid } from "react-native-easy-grid";

const TopCrypto = ({data, selectedCurrency, navigation}): Node => {

  const routeDetails = cryptoCurrency => {
    navigation.navigate('Details', { selectedCurrency, cryptoCurrency })
  };

  return data.map(record => {
    if (!record.RAW.hasOwnProperty(selectedCurrency))  {
      console.info('Error', {record});
      return;
    }
    const node = record.RAW[selectedCurrency];
    const uri = 'https://www.cryptocompare.com' + node.IMAGEURL;

    return (
      <TouchableHighlight 
        key={`${node.FROMSYMBOL}-${node.PRICE}`} 
        onPress={() => routeDetails(node.FROMSYMBOL)} 
        style={{ height: 70}} 
        >
        <View>
          <Grid style={styles.gridTop10}>
            <Col size={5}>
                <Image source={{ uri }} style={{width: 20, height: 20}} />
            </Col>
            <Col size={10} style={{ height: 60}}  >
                <Text>{node.FROMSYMBOL}</Text>
            </Col>
            <Col size={65} >
              <Row style={{ height: 20}}  >
                <Text>Price: {node.PRICE}</Text>
              </Row>
              <Row style={{ height: 20}}   >
                <Text>MKCAP: {node.MKTCAP}</Text>
              </Row>
              <Row style={{ height: 20}}   >
                  <Text>CHNG24H: {node.CHANGE24HOUR}</Text>
              </Row>
            </Col>
          </Grid>
        </View>
      </TouchableHighlight>
    );
  });
};

const Home = ({navigation})  => {

  const [selectedCurrency, setSelectedCurrency] = useState("GBP");
  const [cryptos, setCryptos] = useState([]);
  const [reload, setReload] = useState(0);
  const [spinner, setSpinner] = useState(0);
  const currency = 'USD,JPY,EUR,GBP'.split(',').map(currency => {
    return (<Picker.Item key={currency} label={currency} value={currency} />)
  });
  const triggerReload = () => {
    setTimeout(() => setReload(Date.now()), 60000)
  }

  useEffect(() => {
    setSpinner(1);
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=' + selectedCurrency;
    const fetchData = async () => {
      try {
        let response = await fetch(url);
        let json = await response.json();
        setCryptos(json.Data);
        setSpinner(0);
        triggerReload();
      } catch (error) {
        console.error(error);
      }
    };
 
    fetchData();
  }, [selectedCurrency, reload]);

  if (spinner) {
    return (
      <View style={[styles.spinnerC, styles.spinnerH]}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={{height: 40}}>
        <Grid key="header">
          <Col size={60}>
            <Text>Top 10 Crypto currency</Text>
          </Col>
          <Col size={40}>
            <Picker
              selectedValue={selectedCurrency}
              onValueChange={(itemValue, itemIndex) => setSelectedCurrency(itemValue)}
            >
              { currency }
            </Picker>
          </Col>
        </Grid>
      </View>
      <View style={{height: 30}}>
        <Grid key="header-top-10" style={styles.gridHead}>
          <Col size={15}><Text>Symbol</Text></Col>
          <Col size={65}><Text>Details</Text></Col>
        </Grid>
      </View>
      <View>
        <ScrollView style={{marginTop: 10}} >
          <TopCrypto data={cryptos} selectedCurrency={selectedCurrency} navigation={navigation} />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  gridTop10: {
    padding: 5
  },
  gridHead: {
    backgroundColor: '#DFD',
    margin: 2
  },
  gridFirstCol: {
    backgroundColor: '#FDD'
  },
  spinnerC: { flex: 1, justifyContent: "center" },
  spinnerH: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});

export default Home;
