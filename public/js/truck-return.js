{
	/** @type {HTMLFormElement} */
	const form = document.querySelector("#truck-return-form");

	let outgoing = false;

	form.addEventListener("submit", event => {
		event.preventDefault();

		if (!outgoing) {
			sendReturn(event);
		}
	});

	const sendReturn = async event => {
		outgoing = true;
		try {
			//Regex is fun
			const truckId = /\/(?<id>[0-9]*)(\?|$)/.exec(window.location.href).groups.id;

			const returnPromise = fetch(`/api/truck/return/${truckId}`, {
				method: "PUT",
				cache: 'no-cache',
				credentials: 'same-origin',
				redirect: 'follow',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					distanceDriven: form.elements["return-truck-distance"]
				}),
			});

			const reviewPromise = fetch("/api/review", {
				method: "POST",
				cache: 'no-cache',
				credentials: 'same-origin',
				redirect: 'follow',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					rating: form.elements["return-truck-rating"],
					blurb: form.elements["return-truck-review"],
					TruckId: truckId
				}),
			});

			const [returnResponse, reviewResponse] = await Promise.all([returnPromise, reviewPromise]);
			const [returnJson, reviewJson] = await Promise.all([returnResponse.json(), reviewResponse.json()]);
			console.log(returnJson, reviewJson);
		} catch (error) {
			console.log(error);
		}
		outgoing = false;
	};
}