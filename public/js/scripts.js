console.log("Welcome to assignment 4!")


// const submit = function (e) {
//   //prevent default form action from being carried out
//   e.preventDefault();

//   if (document.getElementById('yourname').value === "") {
//     alert("Please don't leave the name blank");
//     return false;
//   }

//   const userScore = {
//     name: document.getElementById('yourname').value,
//     clicks: clickcount,
//     seconds: seconds
//   }

//   const body = JSON.stringify(userScore);

//   fetch('/submit', {
//     method: 'POST',
//     body
//   })
//     .then(function (response) {
//       //response
//       response.json().then(function (data) {
//         //data
//         console.log("Submit Response:", response);
//         console.log("Returned data: ", data);
//         restartGame();

//         buildTable(data);
//       })
//     })

//   return false;
// }



window.onload = function () {
//  const button = document.getElementById('submitbtn');

  console.log("Loaded!");
}