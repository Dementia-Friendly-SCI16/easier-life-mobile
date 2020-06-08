import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import HeaderComponent from '../components/HeaderComponent';
import { Container, Header, Content, Button, ListItem, Icon, Left, Body, Right, Switch } from 'native-base';
import {Linking} from 'expo';


const helplines =
    {
        emergency: [
            {
                name: "Australian Emergency Services",
                contact: "000",
                link: "https://www.triplezero.gov.au/",
            },
            {
                name: "Emergency Counselling",
                contact: "13 11 14",
                link: "https://www.lifeline.org.au/",
            },
            {
                name: "Personal Alert Victoria",
                contact: "1800 451 300",
                link: "https://www2.health.vic.gov.au/ageing-and-aged-care/supporting-independent-living/personal-alert-victoria",
            },
        ],
        dementia: [
            {
                name: "Dementia Australia",
                contact: "1800 100 500",
                link: "https://www.dementia.org.au/",
            },
            {
                name: "Dementia Behaviour Management Advisory Service",
                contact: "1800699799",
                link: "https://dementia.com.au/",
            },
            {
                name: "Dementia Training Australia",
                contact: "+61 2 4221 5555",
                link: "https://www.dta.com.au/",
            },
            {
                name: "Alzheimer's Association",
                contact: "8002723900",
                link: "https://alz.org/au/dementia-alzheimers-australia.asp",
            },
            {
                name: "Dementia Care International",
                contact: "03 9727 2744",
                link: "https://dementiacareinternational.com/",
            },
        
        ],
        communities: [
            {
                name: "Freedom Care Communities‎",
                contact: "1800075997",
                link: "https://www.freedomcarecommunities.com.au/",
            },
            {
                name: "Hammond Care",
                contact: "1800826166",
                link: "https://www.hammond.com.au/",
            },
            {
                name: "Ryman Pioneers Community",
                contact: "1800288299",
                link: "https://www.rymanhealthcare.com.au/villages",
            },
            {
                name: "My Aged Care",
                contact: "1800 200 422",
                link: "https://www.myagedcare.gov.au/",
            },
        ],
        care: [
            {
                name: "National Relay Service",
                contact: "13 36 77",
                link: "https://www.communications.gov.au/what-we-do/phone/services-people-disability/accesshub",
            },
            {
                name: "My Aged Care",
                contact: "1800 200 422",
                link: "https://www.myagedcare.gov.au/",
            },
            {
                name: "Carers Victoria",
                contact: "(03) 9396 9500",
                link: "https://www.carersvictoria.org.au/",
            },
            {
                name: "Cognitive Dementia and Memory Service (CDAMS) clinics",
                contact: "1300 135 090",
                link: "",
            },
            {
                name: "Council on the Ageing Victoria",
                contact: "(03) 9654 4443",
                link: "https://www.cotavic.org.au/",
            },
        ]
    }


export default function HelplineScreen() {
  return ( 
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <HeaderComponent headerTitle="Helpline" notifCount="5" showLogo={false}/>
        
        <ListItem itemDivider>
              <Text style={{fontSize:16, fontWeight: 'bold'}}>Emergency</Text>
        </ListItem>
        {
            helplines.emergency.map(e => {
                return(
                <ListItem icon style={{marginBottom: 4}}>
                    <Body>
                    <Text>{e.name}</Text>
                    </Body>
                    <Right>
                        <Button transparent 
                        onPress={()=> Linking.openURL('tel:'+e.contact)}>
                            <Icon active name="md-call" />
                        </Button>
                        <Button transparent 
                        onPress={()=> Linking.openURL(e.link)}>
                            <Icon active name="web" type="MaterialCommunityIcons"/>
                        </Button>                    
                    </Right>
                </ListItem>
                )
            })
        }
        <ListItem itemDivider>
              <Text style={{fontSize:16, fontWeight: 'bold'}}>Dementia</Text>
        </ListItem>
        {
            helplines.dementia.map(e => {
                return(
                <ListItem icon style={{marginBottom: 4}}>
                    <Body>
                    <Text>{e.name}</Text>
                    </Body>
                    <Right>
                        <Button transparent style={{ margin: 5}}
                        onPress={()=> Linking.openURL('tel:'+e.contact)}>
                            <Icon active name="md-call"/>
                        </Button>
                        <Button transparent onPress={()=> Linking.openURL(e.link)}>
                            <Icon active name="web" type="MaterialCommunityIcons"/>
                        </Button>                    
                    </Right>
                </ListItem>
                )
            })
        }
        <ListItem itemDivider>
              <Text style={{fontSize:16, fontWeight: 'bold'}}>Communities‎</Text>
        </ListItem>
        {
            helplines.communities.map(e => {
                return(
                <ListItem icon style={{marginBottom: 4}}>
                    <Body>
                    <Text>{e.name}</Text>
                    </Body>
                    <Right>
                        <Button transparent 
                        onPress={()=> Linking.openURL('tel:'+e.contact)}>
                            <Icon active name="md-call" />
                        </Button>
                        <Button transparent 
                        onPress={()=> Linking.openURL(e.link)}>
                            <Icon active name="web" type="MaterialCommunityIcons"/>
                        </Button>                    
                    </Right>
                </ListItem>
                )
            })
        }
        <ListItem itemDivider>
              <Text style={{fontSize:16, fontWeight: 'bold'}}>Care</Text>
        </ListItem>
        {
            helplines.care.map(e => {
                return(
                <ListItem icon style={{marginBottom: 4}}>
                    <Body>
                    <Text>{e.name}</Text>
                    </Body>
                    <Right>
                        <Button transparent 
                        onPress={()=> Linking.openURL('tel:'+e.contact)}>
                            <Icon active name="md-call" />
                        </Button>
                        <Button transparent 
                        onPress={()=> Linking.openURL(e.link)}>
                            <Icon active name="web" type="MaterialCommunityIcons"/>
                        </Button>                    
                    </Right>
                </ListItem> 
                )
            })
        }
        
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
