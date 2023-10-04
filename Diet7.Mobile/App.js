import * as React from "react";
import { debounce } from 'lodash';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import uuid from 'react-native-uuid';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons, MaterialIcons, Entypo } from "@expo/vector-icons";
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

const apiHost = 'http://diet7.mvp-stack.ru';
const apiMenusPath = '/api/menus/{userId}';
const apiMenuItemsPath = '/api/menus/{userId}/items/{itemId}';
const apiRecipesPath = '/api/recipes/{userId}';
const apiRecipeDetailPath = '/api/recipeDetail/{userId}/{recipeId}';
const apiProductsPath = '/api/products/{userId}';
const apiIlnessesPath = '/api/ilnesses';

async function getUserId() {
  try {
    let value = await AsyncStorage.getItem('userId3');
    if (value) {
      return value;
    }
    value = uuid.v4();
    await AsyncStorage.setItem('userId3', value);
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
    menuItems: []
  },
  {
    id: 2,
    name: 'illnesse2',
    description: 'Description',
    menuItems: [
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

const days = [
  {
    id: 1,
    name: 'Понедельник'
  },
  {
    id: 2,
    name: 'Вторник'
  },
  {
    id: 3,
    name: 'Среда'
  },
  {
    id: 4,
    name: 'Четверг'
  },
  {
    id: 5,
    name: 'Пятница'
  },
  {
    id: 6,
    name: 'Суббота'
  },
  {
    id: 7,
    name: 'Воскресенье'
  }
];

const times = [
  {
    id: 1,
    name: '01:00'
  },
  {
    id: 2,
    name: '02:00'
  },
  {
    id: 3,
    name: '03:00'
  },
  {
    id: 4,
    name: '04:00'
  },
  {
    id: 5,
    name: '05:00'
  },
  {
    id: 6,
    name: '06:00'
  },
  {
    id: 7,
    name: '07:00'
  },
  {
    id: 8,
    name: '08:00'
  },
  {
    id: 9,
    name: '09:00'
  },
  {
    id: 10,
    name: '10:00'
  },
  {
    id: 11,
    name: '11:00'
  },
  {
    id: 12,
    name: '12:00'
  },
  {
    id: 13,
    name: '13:00'
  },
  {
    id: 14,
    name: '14:00'
  },
  {
    id: 15,
    name: '15:00'
  },
  {
    id: 16,
    name: '16:00'
  },
  {
    id: 17,
    name: '17:00'
  },
  {
    id: 18,
    name: '18:00'
  },
  {
    id: 19,
    name: '19:00'
  },
  {
    id: 20,
    name: '21:00'
  },
  {
    id: 21,
    name: '21:00'
  },
  {
    id: 22,
    name: '22:00'
  },
  {
    id: 23,
    name: '23:00'
  },
  {
    id: 24,
    name: '24:00'
  }
];

function getType(value) {
  var type = 'other';
  switch (value) {
    case 1:
      type = 'первое';
      break;
    case 2:
      type = 'второе';
      break;
    case 3:
      type = 'салат';
      break;
    case 4:
      type = 'напиток';
      break;
    default:
      break;
  }
  return type;
}

function getHour(hour) {
  return times.find(s => s.id === hour).name;
}

function getDay(day) {
  return days.find(s => s.id === day).name;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function MenuComponent(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [illnesses, setIllnesses] = useState([]);
  const [selectedIllnessId, setSelectedIllnessId] = useState(0);
  const [selectedIllness, setSelectedIllness] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(0);


  const fetchData = async () => {
    try {
      const userId = await getUserId();
      const response = await axios.get(`${apiHost}${apiMenusPath.replace('{userId}', userId)}`);
      setIllnesses(response.data);
      if (!!props.route.params?.illnessId) {
        setSelectedIllnessId(props.route.params.illnessId);
        setSelectedIllness(response.data.find(s => s.id === props.route.params.illnessId));

        if (!!props.route.params?.day) {
          handleDaySelect(props.route.params.day);
        }
      }

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
    axios.delete(`${apiHost}${apiMenuItemsPath.replace('{userId}', userId).replace('{itemId}', id)}`);
    const updatedIllnesses = [...illnesses];
    const updatedIllness = updatedIllnesses.find(s => s.id === selectedIllnessId);
    updatedIllness.menuItems = updatedIllness.menuItems.filter(s => s.id !== id);
    setIllnesses(updatedIllnesses);
    setSelectedIllness(updatedIllness);
  };

  const getItems = (day) => {
    return selectedDay == day
      ? <Box w={80}>
        {selectedIllness.menuItems.filter(s => s.day === day).sort((l, r) => l.hour - r.hour).map((item, index) =>
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
                    {!!item.recipe.image && <Box w="100%" h="200px">
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
                    </Box>}

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
            : null
        }
      </Box>
    </ScrollView>
  );
}

function RecipesComponent(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  const fetchData = async () => {
    try {
      const userId = await getUserId();
      const response = await axios.get(`${apiHost}${apiRecipesPath.replace('{userId}', userId)}`);
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
                  {!!recipe.image && <Box w="100%" h="200px">
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
                  </Box>}
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
  const [recipe, setRecipe] = useState(null);

  const fetchData = async () => {
    try {
      const userId = await getUserId();
      const response = await axios.get(`${apiHost}${apiRecipeDetailPath.replace('{userId}', userId).replace('{recipeId}', props.route.params.recipeId)}`);
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
                  {!!recipe.image && <Box w="100%" h="200px">
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
                  </Box>}

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

                {
                  !recipe.products.length
                    ? null
                    : <>
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
                          {!!product.image && <Box w="100%" h="200px">
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
                          </Box>}
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
                    </>
                }

                {
                  !recipe.cookingSteps.length
                    ? null
                    : <>
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
                          {!!step.image && <Box w="100%" h="200px">
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
                          </Box>}
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
                }
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

  const handleChange = async (productId, isExcluded) => {
    const userId = await getUserId();
    axios.post(`${apiHost}${apiProductsPath.replace('{userId}', userId)}`, { productId: productId, isExcluded: isExcluded });
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

  const fetchData = async () => {
    try {
      const userId = await getUserId();
      const response = await axios.get(`${apiHost}${apiProductsPath.replace('{userId}', userId)}`);

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
                    {!!product.image && <Box w="100%" h="200px">
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
                    </Box>}
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [illnesses, setIllnesses] = useState([]);
  const [illnessId, setIllnessId] = useState(0);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(1);


  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiHost}${apiIlnessesPath}`);
      setIllnesses(response.data);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Ошибка', '', [{ text: 'Ok' }]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newItem = {
        illnessId: illnessId,
        day: day,
        hour: hour,
        recipeId: props.route.params.recipeId
      };
      const userId = await getUserId();
      await axios.post(`${apiHost}${apiMenusPath.replace('{userId}', userId)}`, newItem);
      props.navigation.navigate('Menu', { illnessId: illnessId, day: day });
    } catch (e) {
      Alert.alert('Ошибка', '', [{ text: 'Ok' }]);
    }
  };

  return (
    <ScrollView>
      <Box alignItems="center">
        {
          isLoading
            ? <Spinner size="lg" mt="5" />
            : illnesses.length
              ? <VStack w="80">
                <FormControl isRequired>
                  <FormControl.Label _text={{
                    bold: true
                  }}>Заболевание</FormControl.Label>
                  <Select selectedValue={illnessId} minWidth="200" accessibilityLabel="Выберите заболевание" placeholder="Выберите заболевание" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                  }} onValueChange={itemValue => setIllnessId(itemValue)}>
                    {illnesses.map((item, index) => <Select.Item key={index} label={item.name} value={item.id} />)}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormControl.Label _text={{
                    bold: true
                  }}>День</FormControl.Label>
                  <Select selectedValue={day} minWidth="200" accessibilityLabel="Выберите день" placeholder="Выберите день" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                  }} onValueChange={itemValue => setDay(itemValue)}>
                    {days.map((item, index) => <Select.Item key={index} label={item.name} value={item.id} />)}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormControl.Label _text={{
                    bold: true
                  }}>Время</FormControl.Label>
                  <Select selectedValue={hour} minWidth="200" accessibilityLabel="Выберите время" placeholder="Выберите время" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                  }} onValueChange={itemValue => setHour(itemValue)}>
                    {times.map((item, index) => <Select.Item key={index} label={item.name} value={item.id} />)}
                  </Select>
                </FormControl>
                <Button isDisabled={!illnessId} colorScheme="primary" isLoading={isSubmitting} onPress={onSubmit} mt="5">
                  Добавить
                </Button>
              </VStack>
              : <Text>Нет заболеваний</Text>
        }
      </Box>
    </ScrollView>
  );
}

const getIcon = (screenName) => {
  switch (screenName) {
    case "Menu":
      return <Entypo name="menu" />;
    case "Recipes":
      return <MaterialCommunityIcons name="book-open" />;
    case "Products":
      return <MaterialIcons name="fastfood" />;
    default:
      return undefined;
  }
};

const getTitle = (screenName) => {
  switch (screenName) {
    case "Menu":
      return 'Меню';
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
        <Drawer.Screen name="Menu" options={{ title: `${getTitle('Menu')}`, unmountOnBlur: true }} component={MenuComponent} />
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
