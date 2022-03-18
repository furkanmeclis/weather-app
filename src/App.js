import { useState,useEffect } from 'react';
import { VStack, Box, Button, Container, Center, Text, Icon, Image, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, Flex } from '@chakra-ui/react'
import './App.css';
import {ExternalLinkIcon} from '@chakra-ui/icons'
function App() {
  const apiKey = process.env.REACT_APP_API_KEY;
  const shareData = {
    title: 'Hava Durumu Uygulaması',
    text: 'Sende Furkan Meclis\'in hazırladığı hava durumu uygulamasını kullanmak istermisin.',
    url: process.env.REACT_APP_URL
  }
  const [isLoading, setIsLoading] = useState(true);
  const [icon, setIcon] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [temp, setTemp] = useState('');
  const [description, setDescription] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const getLocation = async () => {
    if ("geolocation" in navigator) {
      await navigator.geolocation.getCurrentPosition(function (position) {
        getWeatherData(position.coords.latitude, position.coords.longitude);
        setIsLoading(false);
      },function (error){
        let message = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = "Kullanıcı, Konum talebini reddetti."
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Konum bilgisi mevcut değil."
            break;
          case error.TIMEOUT:
            message = "Kullanıcı konumunu alma isteği zaman aşımına uğradı."
            break;
          case error.UNKNOWN_ERROR:
            message = "Bilinmeyen bir hata oluştu."
            break;
        }
        setIsError(true);
        setErrorMessage(message);
        setIsLoading(false);
      })
    } else {
      setIsError(true);
      setErrorMessage("Cihazınız Konum Servislerini desteklemiyor.");
    }
  }
  useEffect(() => {
    getLocation();
    document.body.style.backgroundColor = 'var(--chakra-colors-gray-800)';
  } , []);
  const shareWebSite = async () => {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.log(error);
    }
  }
  const getWeatherData = (latitude, longitude) => {

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=tr`)
      .then(response => response.json())
      .then(data => {
        setIcon(`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
        setCity(data.name);
        setCountry(data.sys.country);
        setTemp(Math.round(data.main.temp));
        setDescription(data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1));
        setIsLoading(false);
      }).catch(error => {
        setErrorMessage('Servis Kaynaklı Bir Sorun Oluştu. Daha Sonra Tekrar Deneyiniz.');
        setIsError(true);
      });
  }
  const LocationIcon = (props) => {
    return (
      <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
      </Icon>
    );
  }
  const homeScreen = () => {
    return (
      <VStack align='stretch'>
        <Center h='20vh' px={15} m={0} py={5} style={{margin:'0 !important'}}>
        <Text color="white" fontSize={28} fontWeight={600}><LocationIcon color="white" w={10} />{city},{country}</Text>
        </Center>
        <Box h="20vh"></Box>
        <Box h='45vh' px={15} m={0} style={{margin:'0 !important'}}>
          <VStack align="stretch">
            <Box h='20%' px={15} m={0}>
              <Center><Image src={icon} alt="weather" loading="lazy" h="auto" w="70px" /></Center>
            </Box>
            <Box h='50%' px={15} m={0}>
              <Center><Text color="white" fontSize={28} fontWeight={600}>{description}</Text></Center>
              <Center><Text color="white" fontSize={28} fontWeight={600}>{temp}°C</Text></Center>
            </Box> 
          </VStack>
        </Box> 
        <Flex h="4vh" justifyContent="end"><Button onClick={shareWebSite} bg="transparent" rightIcon={<ExternalLinkIcon color="white" w={6} h={6} />} color="white" _hover={{ bg: 'transparent' }} _active={{bg: 'transparent',scale:0, borderColor: 'transparent'}}  _focus={{boxShadow:'none'}}>Bizi Paylaş</Button></Flex>
        <Center h="3vh"><Text color="gray.300" fontSize="14px">Veriler <a href="https://openweathermap.org" target="_blank">openweathermap</a> tarafından sağlanmaktadır.({new Date().toLocaleDateString()} {new Date().toLocaleTimeString().substring(0,5)})</Text></Center>
      </VStack>
    );
  }
  const loadingScreen = () => {
    return (<>
      <Center h="100vh">
        <Spinner
          thickness='5px'
          speed='0.65s'
          emptyColor='gray.200'
          color='orange.500'
          size='xl'
          label='Yükleniyor...'
        />
      </Center>
    </>);
  }
  const errorScreen = () => {
    return (<><Center h="100vh">
      <Alert
        status='warning'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='200px'
        rounded='lg'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          Bir Sorun Oluştu
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          {errorMessage}
        </AlertDescription>
      </Alert>
    </Center></>);
  }
  return (
    <>
      <Container bg='gray.800' >
        {isLoading ? loadingScreen() : isError ? errorScreen() : homeScreen()}
      </Container>
    </>
  );
}

export default App;
