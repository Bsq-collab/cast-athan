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
	// Fajr: "03:45",
	// Sunrise: '05:25',
	// Dhuhr: "12:56",
	Asr: "16:59",
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

const playAdhan = (isFajr = false) => {
	const client = new ChromecastAPI();

	client.on("device", function (device) {
		// if (device.friendlyName == "1st Floor speaker") {
			var mediaURL = isFajr ?
      "https://res.cloudinary.com/ddakrweyq/video/upload/v1592809375/fajr_adhan_ptbjhq.mp3" :
      "https://res.cloudinary.com/ddakrweyq/video/upload/v1592860533/videoplayback_1_jndba1.mp4";

			device.play(mediaURL, function (err) {
				if (err) {
          console.log(err);
				}
			});
		// }
	});
};

const checkTime = () => {
	const now = new Date();
	for (key in timings) {
		if (timings[key] < now) {
			playAdhan( key === "Fajr" );
			delete timings[key];
		}
	}
};

setInterval(getTimes, 86400 * 1000);
setInterval(checkTime, 30 * 1000);
