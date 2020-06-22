const ChromecastAPI = require("chromecast-api");

const convertToDates = obj => {
  for (key in obj) {
    const timeArray = obj[key]
      .split(":")
      .map((i) => Number(i));
    const timeDate = new Date();
    timeDate.setHours(timeArray[0]);
    timeDate.setMinutes(timeArray[1]);
    obj[key] = timeDate;
  }
}

let timings = {
	Fajr: "03:45",
	// Sunrise: '05:25',
	Dhuhr: "12:58",
	Asr: "16:58",
	// Sunset: '20:31',
	Maghrib: "20:31",
	Isha: "22:11",
	// Imsak: '03:35',
	// Midnight: '00:58'
};
convertToDates(timings);


const axios = require("axios");

const getTimes = () => {
	axios
		.get(
			"http://api.aladhan.com/v1/timingsByCity?city=New+York&country=United+States&method=2"
		)
		.then(function (response) {
			const newTimings = response.data.data.timings;
			delete newTimings.Sunrise;
			delete newTimings.Sunset;
			delete newTimings.Imsak;
			delete newTimings.Midnight;
			timings = newTimings;

      convertToDates(timings);
		});
};

const playAdhan = () => {
	const client = new ChromecastAPI();

	client.on("device", function (device) {
		if (device.friendlyName == "Attic Wifi") {
			var mediaURL =
				"https://res.cloudinary.com/ddakrweyq/video/upload/v1592805396/videoplayback_lc4sxo.mp4";

			device.play(mediaURL, function (err) {
				if (err) {
          console.log(err);
				}
			});
		}
	});
};

const checkTime = () => {
	const now = new Date();
	for (key in timings) {
		if (timings[key] < now) {
			playAdhan();
			delete timings[key];
		}
	}
};

setInterval(getTimes, 86400 * 1000);
setInterval(checkTime, 30 * 1000);
