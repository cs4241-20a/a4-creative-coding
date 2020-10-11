// Add some Javascript code here, to run on the front end.
import { ChinaData, IndiaData, USAData } from './countryGraphs.js'
import { visSeven, popup } from './interaction.js'

console.log('Assignment 4: Creative Coding')

const startApp = function () {
  ChinaData()
  IndiaData()
  USAData()
  visSeven
  popup()
}

window.onload = function () {
  startApp()
}

