import * as React from "react";
import { debounce, forEach, indexOf } from 'lodash';
import { useEffect, useState, useCallback } from 'react';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { NavigationContainer } from "@react-navigation/native";
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import uuid from 'react-native-uuid';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import {
  NativeBaseProvider,
  Button,
  Box,
  Pressable,
  Heading,
  VStack,
  Text,
  Center,
  HStack,
  Divider,
  Icon,
  Image,
  Stack,
  Spinner,
  Input,
  FormControl,
  Select,
  CheckIcon,
  ScrollView,
  PresenceTransition,
  Spacer
} from "native-base";

global.__reanimatedWorkletInit = () => { };
const Drawer = createDrawerNavigator();

const apiHost = 'http://192.168.1.164:5259';
const apiPlantsPath = '/api/plants/{userId}';
const apiPlantPath = '/api/plants/{userId}/{plantId}';
const apiPlantTasksPath = '/api/planttasks/{userId}';
const apiPlantTaskPath = '/api/planttasks/{userId}/{taskId}';
const apiPlantTaskTypesPath = '/api/planttasktypes';

async function getUserId() {
  try {
    let value = await AsyncStorage.getItem('userId2');
    if (value) {
      return value;
    }
    value = uuid.v4();
    await AsyncStorage.setItem('userId2', value);
    return value;
  } catch (error) {
    Alert.alert('Ошибка', '', [{ text: 'Ok' }]);
    throw error;
  }

}

let fakeIllnesses = [
  {
    id: 1,
    name: 'illnesse1',
    description: 'Description',
    menu: null
  },
  {
    id: 2,
    name: 'illnesse2',
    description: 'Description',
    menu: {
      id: 1,
      items: [
        {
          id: 1,
          day: 1,
          hour: 9,
          recipe: {
            id: 1,
            name: 'recipe1',
            description: 'Description',
            image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
            type: 1,
            calories: 10
          }
        },
        {
          id: 2,
          day: 1,
          hour: 7,
          recipe: {
            id: 1,
            name: 'recipe2',
            description: 'Description',
            image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
            type: 2,
            calories: 10
          }
        }
      ]
    }
  }
];

let fakeRecipes = [
  {
    id: 1,
    name: 'recipe2',
    description: 'Description',
    image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
    type: 2,
    calories: 10,
    products: [
      {
        id: 1,
        name: 'product1',
        description: 'Description',
        image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
        calories: 10,
        isExcluded: false,
        allowedFor: [
          'illnesse1'
        ],
        prohibitedFor: [
          'illnesse2'
        ]
      },
      {
        id: 2,
        name: 'product2',
        description: 'Description',
        image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
        calories: 10,
        isExcluded: true,
        allowedFor: [
          'illnesse2'
        ],
        prohibitedFor: [
          'illnesse1'
        ]
      }
    ],
    cookingSteps: [
      {
        name: "step1",
        description: 'Description',
        image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg'
      },
      {
        name: "step2",
        description: 'Description',
        image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg'
      }
    ]
  },
  {
    id: 1,
    name: 'recipe1',
    description: 'Description',
    image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
    type: 1,
    calories: 10,
    products: [
      {
        id: 1,
        name: 'product1',
        description: 'Description',
        image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
        calories: 10,
        isExcluded: false,
        allowedFor: [
          'illnesse1'
        ],
        prohibitedFor: [
          'illnesse2'
        ]
      },
      {
        id: 2,
        name: 'product2',
        description: 'Description',
        image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
        calories: 10,
        isExcluded: true,
        allowedFor: [
          'illnesse2'
        ],
        prohibitedFor: [
          'illnesse1'
        ]
      }
    ],
    cookingSteps: [
      {
        name: "step1",
        description: 'Description',
        image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg'
      },
      {
        name: "step2",
        description: 'Description',
        image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg'
      }
    ]
  }
];

let fakeProducts = [
  {
    id: 1,
    name: 'product1',
    description: 'Description',
    image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
    calories: 10,
    isExcluded: false,
    allowedFor: [
      'illnesse1'
    ],
    prohibitedFor: [
      'illnesse2'
    ]
  },
  {
    id: 2,
    name: 'product2',
    description: 'Description',
    image: 'https://img1.russianfood.com/dycontent/images_upl/559/big_558596.jpg',
    calories: 10,
    isExcluded: true,
    allowedFor: [
      'illnesse2'
    ],
    prohibitedFor: [
      'illnesse1'
    ]
  }
]

function getType(value) {
  var type = 'other';
  switch (value) {
    case 1:
      type = 'first';
      break;
    case 2:
      type = 'second';
      break;
    default:
      break;
  }
  return type;
}

function getHour(hour) {
  return `${hour.toString().length === 1 ? '0' : ''}${hour}:00`;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function HomeComponent(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [illnesses, setIllnesses] = useState([]);
  const [selectedIllnessId, setSelectedIllnessId] = useState(0);
  const [selectedIllness, setSelectedIllness] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(0);


  const fetchData = async (filter) => {
    try {
      const userId = await getUserId();
      // const response = await axios.get(`${apiHost}${apiPlantsPath.replace('{userId}', userId)}`, {
      //   params: {
      //     filter: filter
      //   }
      // });
      response = {
        data: fakeIllnesses
      };
      await delay(2000);
      setIllnesses(response.data);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Ошибка', '', [{ text: 'Ok' }]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIllnessSelect = (id) => {
    setSelectedIllnessId(id);
    setSelectedIllness(illnesses.find(s => s.id === id));
  };

  const handleDaySelect = (day) => {
    if (selectedDay === day) {
      setSelectedDay(0);
    } else {
      setSelectedDay(day);
    }
  };

  const handleItemSelect = (id) => {
    if (selectedItemId === id) {
      setSelectedItemId(0);
    } else {
      setSelectedItemId(id);
    }
  };

  const handleDelete = (id) => {
    //axios.post(`${apiHost}${apiPlantTasksPath.replace('{userId}', userId)}`);
    const updatedIllnesses = [...illnesses];
    const updatedIllness = updatedIllnesses.find(s => s.id === selectedIllnessId);
    updatedIllness.menu.items = updatedIllness.menu.items.filter(s => s.id !== id);
    setIllnesses(updatedIllnesses);
    setSelectedIllness(updatedIllness);
  };

  const getItems = (day) => {
    return selectedDay == day
      ? <Box w={80}>
        {selectedIllness.menu.items.filter(s => s.day === day).sort((l, r) => l.hour - r.hour).map((item, index) =>
          <VStack key={index} borderBottomWidth="1" _dark={{
            borderColor: "muted.50"
          }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
            <HStack space={2}>
              <Text fontSize="xs" _dark={{
                color: "warmGray.50"
              }} color="coolGray.800" alignSelf="flex-start">
                {getHour(item.hour)}
              </Text>
              <VStack w={40} flexGrow={1}>
                <Text _dark={{
                  color: "warmGray.50"
                }} color="coolGray.800" bold>
                  {item.recipe.name}
                </Text>
                <Text color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }}>
                  Тип: {getType(item.recipe.type)}, калории: {item.recipe.calories}
                </Text>
              </VStack>
              <Spacer />
              <Button onPress={() => handleItemSelect(item.id)} endIcon={<Icon as={MaterialIcons} name={selectedItemId == item.id ? "keyboard-arrow-up" : "keyboard-arrow-down"} size="sm" />} alignSelf="flex-start">
                {selectedItemId == item.id ? "Закрыть" : "Открыть"}
              </Button>
            </HStack>
            <PresenceTransition visible={selectedItemId === item.id} initial={{
              opacity: 0,
              scale: 0,
            }} animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 250
              }
            }}>
              {
                selectedItemId === item.id
                  ? <Box key={index} my="2" w="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                  }} _web={{
                    shadow: 2,
                    borderWidth: 0
                  }} _light={{
                    backgroundColor: "gray.50"
                  }}>
                    <Box w="100%" h="200px">
                      <Image resizeMode="cover" source={{ uri: `${item.recipe.image}` }} alt={item.recipe.name} style={{ width: '100%', height: '100%' }} />
                      <Center bg="violet.500" _dark={{
                        bg: "violet.400"
                      }} _text={{
                        color: "warmGray.50",
                        fontWeight: "700",
                        fontSize: "xs"
                      }} position="absolute" bottom="0" px="3" py="1.5">
                        Фото
                      </Center>
                    </Box>
                    <Stack p="4" space={3}>
                      <Text fontWeight="400">
                        {item.recipe.description}
                      </Text>
                      <Button onPress={() => props.navigation.navigate('RecipeDetail', { recipeId: item.recipe.id })} colorScheme="primary">
                        Детали
                      </Button>
                      <Button onPress={() => handleDelete(item.id)} colorScheme="danger">
                        Удалить
                      </Button>
                    </Stack>
                  </Box>
                  : null
              }
            </PresenceTransition>
          </VStack>)}
      </Box>
      : null;
  };

  return (
    <ScrollView>
      <Box alignItems="center">
        {
          isLoading
            ? <Spinner size="lg" mt="5" />
            : illnesses.length > 0
              ? <Select w={80} mt={2} selectedValue={selectedIllnessId} minWidth="200" accessibilityLabel="Выберите заболевание" placeholder="Выберите заболевание" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} onValueChange={itemValue => handleIllnessSelect(itemValue)}>
                {illnesses.map((item, index) => <Select.Item key={index} label={item.name} value={item.id} />)}
              </Select>
              : <Text>Ничего не найдено.</Text>
        }
        {
          !!selectedIllness
            ? !!selectedIllness.menu
              ? <VStack space={4} mt={2} alignItems="center">
                <Button onPress={() => handleDaySelect(1)} endIcon={<Icon as={MaterialIcons} name={selectedDay === 1 ? "keyboard-arrow-up" : "keyboard-arrow-down"} size="sm" />} w="80" bg="tertiary.500" rounded="md" shadow={3} >Понедельник</Button>
                {getItems(1)}
                <Button onPress={() => handleDaySelect(2)} endIcon={<Icon as={MaterialIcons} name={selectedDay === 2 ? "keyboard-arrow-up" : "keyboard-arrow-down"} size="sm" />} w="80" bg="tertiary.500" rounded="md" shadow={3} >Вторник</Button>
                {getItems(2)}
                <Button onPress={() => handleDaySelect(3)} endIcon={<Icon as={MaterialIcons} name={selectedDay === 3 ? "keyboard-arrow-up" : "keyboard-arrow-down"} size="sm" />} w="80" bg="tertiary.500" rounded="md" shadow={3} >Среда</Button>
                {getItems(3)}
                <Button onPress={() => handleDaySelect(4)} endIcon={<Icon as={MaterialIcons} name={selectedDay === 4 ? "keyboard-arrow-up" : "keyboard-arrow-down"} size="sm" />} w="80" bg="tertiary.500" rounded="md" shadow={3} >Четверг</Button>
                {getItems(4)}
                <Button onPress={() => handleDaySelect(5)} endIcon={<Icon as={MaterialIcons} name={selectedDay === 5 ? "keyboard-arrow-up" : "keyboard-arrow-down"} size="sm" />} w="80" bg="tertiary.500" rounded="md" shadow={3} >Пятница</Button>
                {getItems(5)}
                <Button onPress={() => handleDaySelect(6)} endIcon={<Icon as={MaterialIcons} name={selectedDay === 6 ? "keyboard-arrow-up" : "keyboard-arrow-down"} size="sm" />} w="80" bg="warning.500" rounded="md" shadow={3} >Суббота</Button>
                {getItems(6)}
                <Button onPress={() => handleDaySelect(7)} endIcon={<Icon as={MaterialIcons} name={selectedDay === 7 ? "keyboard-arrow-up" : "keyboard-arrow-down"} size="sm" />} w="80" bg="warning.500" rounded="md" shadow={3} >Воскресенье</Button>
                {getItems(7)}
              </VStack>
              : <Button onPress={() => { }} mt={2} w="80" bg="tertiary.500" rounded="md" shadow={3}>
                Создать меню
              </Button>
            : null
        }
      </Box>
    </ScrollView>
  );
}

function RecipesComponent(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  const fetchData = async (filter) => {
    try {
      const userId = await getUserId();
      // const response = await axios.get(`${apiHost}${apiPlantsPath.replace('{userId}', userId)}`, {
      //   params: {
      //     filter: filter,
      //     isMy: true
      //   }
      // });
      response = {
        data: fakeRecipes
      };
      await delay(2000);
      setRecipes(response.data);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Ошибка', '', [{ text: 'Ok' }]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = text => {
    setIsLoading(true);
    fetchData(text);
  };
  //отложенный поиск на 0.5 сек
  const handleSearchDebouncer = useCallback(debounce(handleSearch, 500), []);

  return (
    <ScrollView>
      <Box alignItems="center">
        <VStack w="80" mt="2" space={5} alignSelf="center">
          <Input onChangeText={handleSearchDebouncer} placeholder="Найти" width="100%" borderRadius="4" py="3" px="1" fontSize="14" InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
        </VStack>
        {
          isLoading
            ? <Spinner size="lg" mt="5" />
            : recipes.length > 0
              ? recipes.map((recipe, index) => (
                <Box key={index} my="2" w="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }} _web={{
                  shadow: 2,
                  borderWidth: 0
                }} _light={{
                  backgroundColor: "gray.50"
                }}>
                  <Box w="100%" h="200px">
                    <Image resizeMode="cover" source={{ uri: `${recipe.image}` }} alt={recipe.name} style={{ width: '100%', height: '100%' }} />
                    <Center bg="violet.500" _dark={{
                      bg: "violet.400"
                    }} _text={{
                      color: "warmGray.50",
                      fontWeight: "700",
                      fontSize: "xs"
                    }} position="absolute" bottom="0" px="3" py="1.5">
                      Фото
                    </Center>
                  </Box>
                  <Stack p="4" space={3}>
                    <Stack space={2}>
                      <Heading size="md" ml="-1">
                        {recipe.name}
                      </Heading>
                    </Stack>
                    <Text fontWeight="300">
                      Тип: {getType(recipe.type)}, калории: {recipe.calories}
                    </Text>
                    <Text fontWeight="400">
                      {recipe.description}
                    </Text>
                    <Button onPress={() => props.navigation.navigate('RecipeDetail', { recipeId: recipe.id })} colorScheme="primary">
                      Детали
                    </Button>
                    <Button onPress={() => props.navigation.navigate('CreateMenuItem', { recipeId: recipe.id })} colorScheme="success">
                      Добавить в меню
                    </Button>
                  </Stack>
                </Box>
              ))
              : <Text>Ничего не найдено.</Text>
        }
      </Box>
    </ScrollView>
  );
}

function RecipeDetailComponent(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [recipe, setRecipe] = useState([]);

  const fetchData = async (filter) => {
    try {
      const userId = await getUserId();
      // const response = await axios.get(`${apiHost}${apiPlantsPath.replace('{userId}', userId)}`, {
      //   params: {
      //     filter: filter,
      //     isMy: true
      //   }
      // });
      response = {
        data: fakeRecipes.find(s => s.id === 1)
      };
      await delay(2000);
      setRecipe(response.data);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Ошибка', '', [{ text: 'Ok' }]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView>
      <Box alignItems="center">
        {
          isLoading
            ? <Spinner size="lg" mt="5" />
            : !!recipe
              ? <>
                <Box my="2" w="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }} _web={{
                  shadow: 2,
                  borderWidth: 0
                }} _light={{
                  backgroundColor: "gray.50"
                }}>
                  <Box w="100%" h="200px">
                    <Image resizeMode="cover" source={{ uri: `${recipe.image}` }} alt={recipe.name} style={{ width: '100%', height: '100%' }} />
                    <Center bg="violet.500" _dark={{
                      bg: "violet.400"
                    }} _text={{
                      color: "warmGray.50",
                      fontWeight: "700",
                      fontSize: "xs"
                    }} position="absolute" bottom="0" px="3" py="1.5">
                      Фото
                    </Center>
                  </Box>
                  <Stack p="4" space={3}>
                    <Stack space={2}>
                      <Heading size="md" ml="-1">
                        {recipe.name}
                      </Heading>
                    </Stack>
                    <Text fontWeight="300">
                      Тип: {getType(recipe.type)}, калории: {recipe.calories}
                    </Text>
                    <Text fontWeight="400">
                      {recipe.description}
                    </Text>
                    <Button onPress={() => props.navigation.navigate('CreateMenuItem', { recipeId: recipe.id })} colorScheme="success">
                      Добавить в меню
                    </Button>
                  </Stack>
                </Box>

                <Heading size="lg">Продукты</Heading>
                {recipe.products.map((product, index) => (
                  <Box key={index} my="2" w="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                  }} _web={{
                    shadow: 2,
                    borderWidth: 0
                  }} _light={{
                    backgroundColor: "gray.50"
                  }}>
                    <Box w="100%" h="200px">
                      <Image resizeMode="cover" source={{ uri: `${product.image}` }} alt={product.name} style={{ width: '100%', height: '100%' }} />
                      <Center bg="violet.500" _dark={{
                        bg: "violet.400"
                      }} _text={{
                        color: "warmGray.50",
                        fontWeight: "700",
                        fontSize: "xs"
                      }} position="absolute" bottom="0" px="3" py="1.5">
                        Фото
                      </Center>
                    </Box>
                    <Stack p="4" space={3}>
                      <Stack space={2}>
                        <Heading size="md" ml="-1">
                          {product.name}
                        </Heading>
                      </Stack>
                      <Text fontWeight="300">
                        Калории: {product.calories}
                      </Text>
                      <Text fontWeight="400">
                        {product.description}
                      </Text>
                      <Text fontWeight="400" color="tertiary.500">
                        Разрешено при: {product.allowedFor.join(', ')}
                      </Text>
                      <Text fontWeight="400" color="danger.500">
                        Запрещено при: {product.prohibitedFor.join(', ')}
                      </Text>
                    </Stack>
                  </Box>
                ))}

                <Heading size="lg">Шаги приготовления</Heading>
                {recipe.cookingSteps.map((step, index) => (
                  <Box key={index} my="2" w="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                  }} _web={{
                    shadow: 2,
                    borderWidth: 0
                  }} _light={{
                    backgroundColor: "gray.50"
                  }}>
                    <Box w="100%" h="200px">
                      <Image resizeMode="cover" source={{ uri: `${step.image}` }} alt={step.name} style={{ width: '100%', height: '100%' }} />
                      <Center bg="violet.500" _dark={{
                        bg: "violet.400"
                      }} _text={{
                        color: "warmGray.50",
                        fontWeight: "700",
                        fontSize: "xs"
                      }} position="absolute" bottom="0" px="3" py="1.5">
                        Фото
                      </Center>
                    </Box>
                    <Stack p="4" space={3}>
                      <Stack space={2}>
                        <Heading size="md" ml="-1">
                          Шаг {index + 1}: {step.name}
                        </Heading>
                      </Stack>
                      <Text fontWeight="400">
                        {step.description}
                      </Text>
                    </Stack>
                  </Box>
                ))}
              </>
              : <Text>Ничего не найдено.</Text>
        }
      </Box>
    </ScrollView>
  );
}

function ProductsComponent(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Все', 'Исключенные']);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchText, setSearchText] = useState('');

  const handleSearch = text => {
    setSearchText(text.toLowerCase());
  };
  //отложенный поиск на 0.5 сек
  const handleSearchDebouncer = useCallback(debounce(handleSearch, 500), []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleChange = (productId, isExcluded) => {
    //axios.post(`${apiHost}${apiPlantTasksPath.replace('{userId}', userId)}`);
    const updatedProducts = [...products];
    const updatedProduct = updatedProducts.find(s => s.id === productId);
    updatedProduct.isExcluded = isExcluded;
    setProducts(updatedProducts);
  };

  const getFilteredProducts = (items) => {
    let data = [];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (searchText !== '') {
        if (item.name.toLowerCase().indexOf(searchText) === -1
          && item.description?.toLowerCase().indexOf(searchText) === -1) {
          continue;
        }
      }
      if (selectedCategory !== 'Все') {
        if (selectedCategory === 'Исключенные') {
          if (!item.isExcluded) {
            continue;
          }
        }
        else {
          const itemCategories = item.allowedFor.map(s => `Разрешены при '${s}'`)
            .concat(item.prohibitedFor.map(s => `Запрещены при '${s}'`));
          if (!itemCategories.includes(selectedCategory)) {
            continue;
          }
        }
      }
      data.push(item);
    }
    return data;
  };

  const fetchData = async (filter) => {
    try {
      const userId = await getUserId();
      // const response = await axios.get(`${apiHost}${apiPlantTasksPath.replace('{userId}', userId)}`, {
      //   params: {
      //     filter: filter
      //   }
      // });
      response = {
        data: fakeProducts
      };
      await delay(2000);

      const newCategories = ['Все', 'Исключенные']
        .concat(...new Set(response.data.flatMap(s => s.allowedFor).map(s => `Разрешены при '${s}'`)))
        .concat(...new Set(response.data.flatMap(s => s.prohibitedFor).map(s => `Запрещены при '${s}'`)));

      setCategories(newCategories);
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Ошибка', '', [{ text: 'Ok' }]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView>
      <Box alignItems="center">
        <VStack w="80" mt="2" space={5} alignSelf="center">
          <Input onChangeText={handleSearchDebouncer} placeholder="Найти" width="100%" borderRadius="4" py="3" px="1" fontSize="14" InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
        </VStack>
        {
          isLoading
            ? <Spinner size="lg" mt="5" />
            : products.length > 0
              ? <Box w={80}>
                <Select w={80} mt={2} selectedValue={selectedCategory} minWidth="200" accessibilityLabel="Выберите категорию" placeholder="Выберите категорию" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }} onValueChange={itemValue => handleCategorySelect(itemValue)}>
                  {categories.map((category, index) => <Select.Item key={index} label={category} value={category} />)}
                </Select>
                {getFilteredProducts(products).map((product, index) => (
                  <Box key={index} my="2" w="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                  }} _web={{
                    shadow: 2,
                    borderWidth: 0
                  }} _light={{
                    backgroundColor: "gray.50"
                  }}>
                    <Box w="100%" h="200px">
                      <Image resizeMode="cover" source={{ uri: `${product.image}` }} alt={product.name} style={{ width: '100%', height: '100%' }} />
                      <Center bg="violet.500" _dark={{
                        bg: "violet.400"
                      }} _text={{
                        color: "warmGray.50",
                        fontWeight: "700",
                        fontSize: "xs"
                      }} position="absolute" bottom="0" px="3" py="1.5">
                        Фото
                      </Center>
                    </Box>
                    <Stack p="4" space={3}>
                      <Stack space={2}>
                        <Heading size="md" ml="-1">
                          {product.name}
                        </Heading>
                      </Stack>
                      <Text fontWeight="300">
                        Калории: {product.calories}
                      </Text>
                      <Text fontWeight="400">
                        {product.description}
                      </Text>
                      <Text fontWeight="400" color="tertiary.500">
                        Разрешено при: {product.allowedFor.join(', ')}
                      </Text>
                      <Text fontWeight="400" color="danger.500">
                        Запрещено при: {product.prohibitedFor.join(', ')}
                      </Text>
                      <Button onPress={() => handleChange(product.id, !product.isExcluded)} colorScheme={product.isExcluded ? "orange" : "primary"}>
                        {product.isExcluded ? "Убрать из исключенных" : "Добавить в исключенные"}
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Box>
              : <Text>Ничего не найдено.</Text>
        }
      </Box>
    </ScrollView>
  );
}

function CreateMenuItemComponent(props) {
  const [isCalendarPermissionsGranted, setCalendarPermissionsGranted] = useState(false);
  const [myCalendarId, setMyCalendarId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: '', type: '' });
  const [taskTypes, setTaskTypes] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [dateProcessing, setDateProcessing] = useState(new Date());


  const fetchData = async (filter) => {
    try {
      const response = await axios.get(`${apiHost}${apiPlantTaskTypesPath}`);
      setTaskTypes(response.data);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Ошибка', '', [{ text: 'Ok' }]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const existingCalendar = calendars.find(s => s.name === 'IndoorJungle');
        if (!existingCalendar) {
          const defaultCalendarSource = { isLocalAccount: true, name: 'Справочник комнатных растений' };
          const newCalendarID = await Calendar.createCalendarAsync({
            title: 'Справочник комнатных растений',
            color: 'green',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'IndoorJungle',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });
          setMyCalendarId(newCalendarID);
        }
        else {
          setMyCalendarId(existingCalendar.id);
        }
        setCalendarPermissionsGranted(true);
      }
    })();
  }, []);

  const validate = () => {
    let isValid = true;
    let errors = { name: '', type: '' };
    if (name.length === 0) {
      errors.name = 'Обязательное поле.';
      isValid = false;
    }
    if (type.length === 0) {
      errors.type = 'Обязательное поле.';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const onSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      const event = {
        title: name,
        startDate: dateProcessing,
        endDate: dateProcessing,
        timeZone: Localization.timeZone,
        alarms: [
          {
            relativeOffset: 0,
            method: Calendar.AlarmMethod.ALERT,
          },
        ],
      };
      try {
        const eventId = await Calendar.createEventAsync(myCalendarId, event);
        const newTask = {
          name: name,
          dateProcessing: dateProcessing,
          plantId: props.route.params.plantId,
          typeId: type,
          eventId: eventId
        };
        const userId = await getUserId();
        await axios.post(`${apiHost}${apiPlantTasksPath.replace('{userId}', userId)}`, newTask);
        props.navigation.navigate('Tasks');
      } catch (e) {
        Alert.alert('Ошибка', '', [{ text: 'Ok' }]);
      }
    }
  };

  const onChangeDateProcessing = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateProcessing(currentDate);
  };

  return (
    <ScrollView>
      <Box alignItems="center">
        {
          isLoading
            ? <Spinner size="lg" mt="5" />
            : <VStack w="80">
              <FormControl isRequired isInvalid={errors.name}>
                <FormControl.Label _text={{
                  bold: true
                }}>Название</FormControl.Label>
                <Input placeholder="Название" onChangeText={value => setName(value)} />
                {
                  errors.name
                    ? <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
                    : <FormControl.HelperText></FormControl.HelperText>
                }
              </FormControl>
              <FormControl isRequired isInvalid={errors.type}>
                <FormControl.Label _text={{
                  bold: true
                }}>Тип</FormControl.Label>
                <Select selectedValue={type} minWidth="200" accessibilityLabel="Выберите тип" placeholder="Выберите тип" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }} onValueChange={itemValue => setType(itemValue)}>
                  {taskTypes.map((item, index) => <Select.Item key={index} label={item.name} value={`${item.id}`} />)}
                </Select>
                {
                  errors.type
                    ? <FormControl.ErrorMessage>{errors.type}</FormControl.ErrorMessage>
                    : <FormControl.HelperText></FormControl.HelperText>
                }
              </FormControl>
              <FormControl>
                <FormControl.Label _text={{
                  bold: true
                }}>Дата обработки: {dateProcessing.toLocaleString()}</FormControl.Label>
                <Button.Group>
                  <Button onPress={() => DateTimePickerAndroid.open({
                    value: dateProcessing,
                    mode: 'date',
                    is24Hour: true,
                    onChange: onChangeDateProcessing
                  })}>Изменить дату</Button>
                  <Button onPress={() => DateTimePickerAndroid.open({
                    value: dateProcessing,
                    mode: 'time',
                    is24Hour: true,
                    onChange: onChangeDateProcessing
                  })}>Изменить время</Button>
                </Button.Group>
              </FormControl>
              <Button disabled={!isCalendarPermissionsGranted} isLoading={isSubmitting} onPress={onSubmit} mt="5">
                Создать
              </Button>
            </VStack>
        }
      </Box>
    </ScrollView>
  );
}

const getIcon = (screenName) => {
  switch (screenName) {
    case "Home":
      return <MaterialCommunityIcons name="home" />;
    case "Recipes":
      return <Entypo name="add-to-list" />;
    case "Products":
      return <FontAwesome name="tasks" />;
    default:
      return undefined;
  }
};

const getTitle = (screenName) => {
  switch (screenName) {
    case "Home":
      return 'Главная';
    case "Recipes":
      return 'Рецепты';
    case "RecipeDetail":
      return 'Детали рецепта';
    case "Products":
      return 'Продукты';
    case "CreateMenuItem":
      return 'Добавить элемент меню';
    default:
      return '';
  }
};

function MyMenuContent(props) {
  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space="6" my="2" mx="1">
        <Box px="4">
          <Text bold color="gray.700">
            Диета №7
          </Text>
        </Box>
        <VStack divider={<Divider />} space="4">
          <VStack space="3">
            {props.state.routeNames.filter(s => s !== 'RecipeDetail' && s !== 'CreateMenuItem').map((name, index) => (
              <Pressable
                key={index}
                px="5"
                py="3"
                rounded="md"
                bg={
                  index === props.state.index
                    ? "rgba(6, 182, 212, 0.1)"
                    : "transparent"
                }
                onPress={(event) => {
                  props.navigation.navigate(name);
                }}
              >
                <HStack space="7" alignItems="center">
                  <Icon
                    color={
                      index === props.state.index ? "primary.500" : "gray.500"
                    }
                    size="5"
                    as={getIcon(name)}
                  />
                  <Text
                    fontWeight="500"
                    color={
                      index === props.state.index ? "primary.500" : "gray.700"
                    }
                  >
                    {getTitle(name)}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}
function MyMenu() {
  return (
    <Box safeArea flex={1}>
      <Drawer.Navigator
        drawerContent={(props) => <MyMenuContent {...props} />}
      >
        <Drawer.Screen name="Home" options={{ title: `${getTitle('Home')}`, unmountOnBlur: true }} component={HomeComponent} />
        <Drawer.Screen name="Recipes" options={{ title: `${getTitle('Recipes')}`, unmountOnBlur: true }} component={RecipesComponent} />
        <Drawer.Screen name="RecipeDetail" options={{ title: `${getTitle('RecipeDetail')}`, unmountOnBlur: true }} component={RecipeDetailComponent} />
        <Drawer.Screen name="Products" options={{ title: `${getTitle('Products')}`, unmountOnBlur: true }} component={ProductsComponent} />
        <Drawer.Screen name="CreateMenuItem" options={{ title: `${getTitle('CreateMenuItem')}`, unmountOnBlur: true }} component={CreateMenuItemComponent} />
      </Drawer.Navigator>
    </Box>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <MyMenu />
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
