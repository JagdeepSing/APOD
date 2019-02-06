(function() {
	"use strict";

  window.addEventListener('load', loadPage);

  const API_URL = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"

	/**
	 *	Initializes page by calling API and getting the Astronomy Picture of the Day
	 */
  function loadPage() {
    getTodayAPOD();
    $("search").addEventListener("click", getCustomAPOD);
  }

  /**
   *  from JSON data of Astronomy Image of the Day, displays on webpage
   */
  function displayImage(response) {
    let title = response.title;
    let date = response.date;
    let explanation = response.explanation;
    let url = response.url;
		let mediaType = response.media_type;

    $("name").innerText = title;
    $("explanation").innerText = explanation;
    $("date").innerText = new Date(date).toUTCString().replace(" 00:00:00 GMT", "");

		if (mediaType == "image") {
			$("apod-image").src = url;
			$("apod-video").src = "";
			$("apod-link").href = response.hdurl;

			$("apod-video").classList.add("hidden");
			$("apod-link").classList.remove("hidden");
		} else {
			$("apod-video").src = url;
			$("apod-image").src = "";
			$("apod-link").href = "";

			$("apod-link").classList.add("hidden");
			$("apod-video").classList.remove("hidden");
		}
  }

	/**
	 *	gets today's APOD as JSON data via GET request
	 */
	function getTodayAPOD() {
    fetch(API_URL)
      .then(checkStatus)
      .then(JSON.parse)
      .then(displayImage)
      .catch(handleError);
	}

  /**
   *  gets APOD for a inputted date
   */
  function getCustomAPOD() {
    let date = $("input-date").value;

    let input_date = new Date(date);
    let boundary = new Date("1995-06-16");
    let today = new Date();

    if ((input_date > boundary) && (input_date <= today)) {
      $("date-error").classList.add("hidden");
      let url = API_URL + "&date=" + date;
      fetch(url)
        .then(checkStatus)
        .then(JSON.parse)
        .then(displayImage)
        .catch(handleError);
    } else {
      $("date-error").classList.remove("hidden");
    }
  }

	/**
	 * Helper function to return the response's result text if successful, otherwise
	 * returns the rejected Promise result with an error status and corresponding text
	 * @param {object} response - response to check for success/error
	 * @returns {object} - valid result text if response was successful, otherwise rejected
	 *                     Promise result
	 */
	function checkStatus(response) {
		 const OK = 200;
		 const ERROR = 300;
		 let responseText = response.text();
		 if (response.status >= OK && response.status < ERROR || response.status === 0) {
		    return responseText;
		 } else {
		    return responseText.then(Promise.reject.bind(Promise));
	   }
	}

  /**
	 *	Displays error message onto webpage
	 *	@param {string} error, error message to display
	 */
  function handleError(error) {
    $("apodDiv").classList.add("hidden");
    $("custom-date").classList.add("hidden");
    $("error").classList.remove("hidden");
		console.log(error);
  }

		/* ------------------------- Helper Functions  ------------------------- */

	/**
	 * Returns the element that has the ID attribute with the specified value.
	 * @param {string} id - element ID
	 * @returns {object} DOM object associated with id.
	 */
	function $(id) {
		return document.getElementById(id);
	}

	/**
	 * Returns the first element that matches the given CSS selector.
	 * @param {string} query - CSS query selector.
	 * @returns {object} The first DOM object matching the query.
	 */
	function qs(query) {
		return document.querySelector(query);
	}

	/**
	 * Returns the array of elements that match the given CSS selector.
	 * @param {string} query - CSS query selector
	 * @returns {object[]} array of DOM objects matching the query.
	 */
	function qsa(query) {
		return document.querySelectorAll(query);
	}
})();
