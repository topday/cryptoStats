import React, { useState, useEffect } from 'react';
import { 
  ActivityIndicator,
  Button,
  SafeAreaView,
  ScrollView,
  Text, 
  View, 
  StyleSheet, 
  Image 
} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

const DetailsList = ({data, selectedCurrency, cryptoCurrency}): Node => {
  if (!data) { return []; }
  if (!data.hasOwnProperty('DISPLAY')) { return []; }
  if (!data.DISPLAY.hasOwnProperty(cryptoCurrency)) { return []; }
  if (!data.DISPLAY[cryptoCurrency].hasOwnProperty(selectedCurrency)) { return []; }

  const node = data.DISPLAY[cryptoCurrency][selectedCurrency];
  const uri = 'https://www.cryptocompare.com' + node.IMAGEURL;

  return (
    <View style={{ marginTop: 60}}>
      <Grid>
        <Col size={5}>
            <Image source={{ uri }} style={{width: 20, height: 20}} />
        </Col>
        <Col size={10} style={{ height: 60}}  >
            <Text>{node.FROMSYMBOL}</Text>
        </Col>
        <Col size={65} >
          <Row style={{ height: 20}}  >
            <Text>24h volume: {node.VOLUME24HOUR}</Text>
          </Row>
          <Row style={{ height: 20}}   >
            <Text>circulating supply: {node.SUPPLY}</Text>
          </Row>
        </Col>
      </Grid>
    </View>
  );
};

const Details = ({navigation, route})  => {

  const { selectedCurrency, cryptoCurrency } = route.params;
  const [cryptos, setCryptos] = useState({});
  const [spinner, setSpinner] = useState(0);

  const routeHome = () => {
    navigation.navigate('Home', { })
  };

  useEffect(() => {
    setSpinner(1);
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoCurrency}&tsyms=${selectedCurrency}`;
    const fetchData = async () => {
      try {
        let response = await fetch(url);
        let json = await response.json();
        setCryptos(json);
        setSpinner(0);
      } catch (error) {
        console.error(error);
      }
    };
 
    fetchData();
  }, [selectedCurrency]);

  if (spinner) {
    return (
      <View style={[styles.spinnerC, styles.spinnerH]}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }

  return (
    <View  style={styles.containerMain} >

      <ScrollView style={{marginTop: 10, marginBottom: 50}} >
        <DetailsList data={cryptos}  {...route.params} />
      </ScrollView>
      <View style={styles.button}>
        <Button
            title="Go Home"
            onPress={() => routeHome() }
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  button: {     
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
});

export default Details;
