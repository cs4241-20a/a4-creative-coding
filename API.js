const { MongoClient } = require("mongodb");
const ObjectID = require('mongodb').ObjectID;

const host = process.env.MONGODB_HOST
const user = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD
const database = process.env.MONGODB_DATABASE

const uri = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`

const client = new MongoClient(uri);
client.connect()



// This block of code is for inserting records into the DB.

// try {
// client.connect()
// .then(() => {
//   let words =
//       // "aerobics, archer, arena, arrow, athlete, badminton, ball, baseball, baseball bat, basketball, baton, batter, bicycle, bike, biker, billiards, bobsleigh, boomerang, bow, bowling, boxing, canoe, cathcer, chest plate, club, coach, competitor, curling, cyclist, dartboard, darts, deadlifting, diving, dodgeball, dugout, dumbbell, e-sports, end zone, exercise, fencing, field, field hockey, figure skating, finish, fitness, football, formula one, free throw, frisbee, goal, goalie, golf, gym, gymnast, half time, hammer throw, handball, hang gliding, hardball, helmet, high jump, hole in one, home run, home team, hurdle, ice hockey, ice skating, jogging, judo, jump rope, karate, keeper, kitesurfing, kneepads, kung fu, lacrosse, lawn bowling, loser, marathon, nascar, off season, offside, olympics, overtime, penalty, ping pong, pit crew, pit stop, pitcher, pole vault, puck, race, rafting, rally, referee, rock climbing, roller derby, roller skating, rugby, sailing, score, shoulder pad, ski, snorkeling, snowboarding, soccer, softball, somersault, stadium, start, studded shoes, sumo wrestling, surfing, swimming, synchronized swimming, table tennis, target, team, teammate, tee, tennis racket, trampoline, triathlon, tug of war, ultramarathon, volley ball, wakeboarding, water polo, water ski, weightlifting, wetsuit, windsurfing, winner, yoga"
//       //"apple, apple juice, apple pie, apple sauce, asparagus, avocado, bacon, bagel, baguette, baked beans, baked potato, banana, banana bread, banana split, barbecue sauce, bean, beer, beet, bell pepper, biscuit, blackberry, blueberry, bread, broccoli, brownie, bubblegum, burrito, butter, cabbage, cake, candy necklace, caramel apple, carrot, cauliflower, caviar, celery, cereal, cheese, cheeseburger, cheesecake, cherry, chicken burger, chicken nugget, chili, chocolate, chocolate bunny, chocolate cake, chocolate egg, chocolate milk, churro, citrus, cocktail, coffee, cookie, corn, corn dog, cotton candy, crab stick, cranberry, croissant, cucumber, cupcake, curry, donut, egg, energy drink, fish and chips, fish burger ,fish sauce, fondue, french fries, french toast, frog butt, fruitcake, garlic, garlic bread, grape, grapefruit, gravy, grilled cheese, grilled chicken, guacamole, gummy bear, gummy worm, ham, hamburger, hash brown, honey, hot chocolate, hot dog, hot sauce, ice cream, ice cream cake, ice cube, iced tea, jalapeno, jam, jawbreaker, jelly, kebab, ketchup, kiwi, lamb chops, lasagna, lemon, lemonade, lettuce, lime, liquorish, lollipop, mac and cheese, macaroni, maple syrup, margarine, martini, mashed potatoes, mayonnaise, meatball, meatloaf, melon, milk, milkshake, monkey brain, mushroom, mustard, nacho, noodle, olive, omelet, onion, onion ring, orange, orange juice, oyster sauce, pancake, papaya, peach, peanut butter, pear, peas, pepper, pepperoni, pickle, pie, pigs in a blanket, pineapple, pizza, plum, pomegranate, popcorn, popcorn chicken, potato, potato chip, prawn cracker, pretzel, prune, pudding, pumpkin pie, radish, raisin, ranch sauce, raspberry, ravioli, relish, rice, salsa, salt, sandwich, sausage, scrambled egg, shrimp, smoothie, soda, soup, space cake, spaghetti, spare ribs, sprout, star fruit, steak, strawberry, stroop waffle, stuffing, sugar, sushi, sweet potato, taco, tail fin soup, tangerine, tea, toast, tomato, turkey, turnip, vodka, waffle, wasabi, watermelon, whipped cream, whiskey, wine, yogurt"
//   let wordArr = words.split(", ")
//   let docs = []
//   for(let i = 0; i < wordArr.length; i++) {
//     let doc = {word: wordArr[i]}
//     docs.push(doc)
//   }
//     client.db("a4-webware").collection("words").insertMany(docs)
  
// })
// } catch(e) {
//   console.log(e)
// }


// Get the specified number of words from the db
const getWords = function(num) {
  var queryDoc = {};
  
  return client.db("a4-webware").collection("words").aggregate([{ $sample: { size: num } }]).toArray();
}

exports.getWords = getWords;