{
	/** @type {HTMLFormElement} */
	const form = document.querySelector("#reserve-truck-form");

	let outgoing = false;

	form.addEventListener("submit", event => {
		event.preventDefault();

		if (!outgoing) {
			reserveTruck();
		}
	});

	const reserveTruck = async () => {
		outgoing = true;
		try {
			const response = await fetch("/api/truck/reserve", {
				method: "POST",
				cache: 'no-cache',
				credentials: 'same-origin',
				redirect: 'follow',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pickUpDate: form.elements["pickup-date"].value,
					hours: form.elements["rent-duration"].value,
					// I am a menace
					TruckId: /\/(?<truckId>[0-9]*)(\?|$)/.exec(window.location.href).groups.truckId,
				}),
			});
			const json = await response.json();
			console.log(json);
		} catch (error) {
			console.log(error);
		}
		outgoing = false;
	};
}