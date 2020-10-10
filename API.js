const { MongoClient } = require("mongodb");
const ObjectID = require('mongodb').ObjectID;

const host = process.env.MONGODB_HOST
const user = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD
const database = process.env.MONGODB_DATABASE

const uri = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`

const client = new MongoClient(uri);

client.connect()
.then(() => {
  let words =
    "alligator, alpaca, angler fish, ant, anteater, antelope, armadillo, bald eagle, barn owl, bat, bearded dragon, beaver, bee, beetle, bigfoot, bird, bison, boar, brontosaurus, bull, bulldog, butterfly, camel, cat, caterpillar, catfish, centipede, chameleon, cheetah, chicken, chicken turtle, chihuahua, clown fish, cobra, cockroach, cow, crab, crocodile, crow, dalmatian, deer, dinosaur, dog, dolphin, donkey, dragon, dragonfly, duck, eagle, eel, elephant, firefly, flamingo, flea, fly, flying fox, fox, frog, gazelle, gecko, giant anteater, giant panda, giant tortoise, giraffe, goat, golden hamster, goldfish, goose, grasshopper, hammerhead shark, hamster, hedgehog, hen, hippo, horse, hummingbird, hyena, jaguar, jellyfish, kangaroo, killer whale, king crab, king kong, king penguin, king vulture, kitten, koala, kraken, lamb, leech, lemur, leopard, lion, lizard, llama, loch ness monster, lynx, maggot, mammoth, mantis, meerkat, mole, monkey, moose, mosquito, moth, mountain chicken, mountain zebra, mouse, naked cat, naked mole rat, narwhal, octopus, orangutan, orca, ostrich, otter, owl, panda, panther, parrot, peacock, pelican, penguin, pig, pigeon, piranha, platypus, polar bear, pony, poodle, porcupine, puffer fish, puma, puppy, python, rabbit, raccoon, ram, rat, rattlesnake, red panda, reindeer, rhinoceros, rooster, satanic leaf gecko, scorpion, sea lion, seagull, seal, shark, sheep, sheep dog, shiba, skunk, sloth, snail, snake, snapping turtle, spider, spider monkey, spinosaurus, squid, squirrel, stegosaurus, stingray, stink bug, stork, sun bear, superworm, swan, swordfish, tadpole, tarantula, termite, tick, tiger, tiger beetle, tiger fish, tortoise, toucan, triceratops, trilobite, turkey, turtle, tyrannosaurus rex, unicorn, vulture, walrus, warthog, wasp, water scorpion, water snake, whale, whale shark, wolf, woodpecker, worm, yeti, zebra"
  let wordArr = words.split(", ")
  for(let i = 0; i < wordArr.length; i++) {
    console.log(wordArr[i])
  }
});




// Get the specified number of words from the db
const getWords = function(num) {
  var queryDoc = {};
  
  return client.db("a4-webware").collection("words").find({limit: num}).toArray();
}

exports.getWords = getWords;