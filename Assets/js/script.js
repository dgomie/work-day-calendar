// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  var currentDay = $("#currentDay");
  var today = dayjs();
  var savedData = JSON.parse(localStorage.getItem("scheduleData"));

  // TODO: Add code to display the current date in the header of the page.
  function getDate() {
    var todayDay = today.format("DD");
    var todayLastDigit = todayDay.split("")[1];
    var suffix = "";
    // Determines the suffix needed based on
    if (todayLastDigit === "1") {
      suffix = "st";
    } else if (todayLastDigit === "2") {
      suffix = "nd";
    } else if (todayLastDigit === "3") {
      suffix = "rd";
    } else {
      suffix = "th";
    }
    var todayDate = dayjs().format(`dddd, MMMM D[${suffix}] h:mmA`);
    currentDay.text(todayDate);
  }

  // change currentDay element by calling getDate function.
  getDate();
  setInterval(getDate, 1000);

  function createHourBlocks() {
    // loops for the set amount of hours in workday and creates a time block. Default sets block to future time
    for (let i = 0; i < 10; i++) {
      var hour = i + 9;
      var blockColor = checkHour(hour);
      var hourBlock = $("<div>", {
        id: `hour-${hour}`,
        class: blockColor,
      });
      var hourDisplay = $("<div>", {
        class: "col-2 col-md-1 hour text-center py-3",
      });
      var textDisplay = $("<textarea>", {
        class: "col-8 col-md-10 description",
        rows: "3",
      });
      var saveButton = $("<button>", {
        class: "btn saveBtn col-2 col-md-1",
        "aria-label": "save",
      });

      // saving text input to local storage on click
      saveButton.click(saveData);
      // saveButton.click(function () {
      //   var hourBlockID = "#" + $(this).parent().attr("id");
      //   var textAreaEl = $(hourBlockID).children()[1];
      //   var userText = $(textAreaEl).val();
      //   var eventObj = {};
      //   eventObj[hourBlockID] = userText;

      //   if (savedData !== null) {
      //     for (let i = 0; i < savedData.length; i++) {
      //       if (Object.keys(savedData[i]).toString() === hourBlockID) {
      //         console.log(savedData[i][`${hourBlockID}`]);
      //         // console.log(typeof Object.keys(savedData[0]).toString());
      //         // console.log(hourBlockID === Object.keys(savedData[i]).toString())
      //         savedData[i][`${hourBlockID}`] = userText;

      //         console.log("Object edited");
      //       } else {
      //         savedData.push(eventObj);
      //         console.log("New object pushed");
      //       }
      //     }
      //   } else {
      //     savedData = [];
      //     savedData.push(eventObj);
      //     console.log("New Array created");
      //   }
      //   localStorage.setItem("scheduleData", JSON.stringify(savedData));
      //   console.log(savedData);

      // });

      var saveIcon = $("<i>", { class: "fas fa-save", "aria-hidden": "true" });

      // Time display. Converts the 24-hour clock to 12-hour and determines if AM or PM
      var amPM = "AM";
      if (hour === 12) {
        amPM = "PM";
      } else if (hour > 12) {
        hour %= 12;
        amPM = "PM";
      }
      hourDisplay.text(hour + amPM);

      // appends created hour block elements to the hour block container. renders the content in main container
      $(saveButton).append(saveIcon);
      $(hourBlock).append(hourDisplay, textDisplay, saveButton);
      $("#container").append(hourBlock);
    }
  }

  createHourBlocks();

  /* TODO: Add a listener for click events on the save button. This code should use the id in the containing time-block as a key to save the user input in local storage. HINT: What does `this` reference in the click listener function? How can DOM traversal be used to get the "hour-x" id of the time-block containing the button that was clicked? How might the id be useful when saving the description in local storage?
   */

  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  function checkHour(hourArg) {
    var currentHour = Number(today.format("H"));
    // var currentHour = Number("12");
    if (hourArg < currentHour) {
      return "row time-block past";
    } else if (hourArg === currentHour) {
      return "row time-block present";
    } else {
      return "row time-block future";
    }
  }

  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //

  function saveData() {
    var hourBlockID = "#" + $(this).parent().attr("id");
    var textAreaEl = $(hourBlockID).children()[1];
    var userText = $(textAreaEl).val();
    var eventObj = {};
    eventObj[hourBlockID] = userText;

    var editMade = false;

    if (savedData !== null) {
      for (let i = 0; i < savedData.length; i++) {
        if (Object.keys(savedData[i]).toString() === hourBlockID) {
          savedData[i][`${hourBlockID}`] = userText;
          localStorage.setItem("scheduleData", JSON.stringify(savedData));
          console.log("Object edited");
          editMade = true;
          break; // Exit the loop since we found and edited the object
        }
      };

      if (!editMade) {
        savedData.push(eventObj);
        localStorage.setItem("scheduleData", JSON.stringify(savedData));
        console.log("New object pushed");
      };
    } else {
      savedData = [];
      savedData.push(eventObj);
      console.log("New Array created");
    };
  };
  //
  function pullStoredData() {
    var data = JSON.parse(localStorage.getItem("scheduleData"));

    if (data !== null) {
      for (let i = 0; i < data.length; i++) {
        var hourBlockID = Object.keys(data[i]).toString();
        var storedText = data[i][hourBlockID];
        $(hourBlockID).children()[1].value = storedText;
      }
    }
  }

  pullStoredData();
});

function eventSavedPrompt() {
  
}