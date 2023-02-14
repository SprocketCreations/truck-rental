{// Set default date to right now
	let now = new Date();
	now = new Date(now.getTime() - (now.getTimezoneOffset() * 60 * 1000));
	document.querySelector("#pickup-date").value = now.toISOString().split('T')[0];
}

{
	/** @type {number} Millisecond interval that must elapse before a search request can be sent */
	const TIMEOUT = 1000;

	/** @type {HTMLElement} */
	const container = document.querySelector("#truck-search-preview-container");
	/** @type {HTMLTemplateElement} */
	const template = document.querySelector("#truck-search-preview-template");
	/** @type {HTMLFormElement} */
	const form = document.querySelector("#truck-search-form");

	/** @type {boolean} */
	let waiting = false;
	/** @type {boolean} */
	let changesSinceLastFetch = false;

	form.addEventListener("submit", event => { event.preventDefault() });
	form.addEventListener("change", () => { fetchHomepage(); });

	/**
	 * Fetches the data from the server in intervals to prevent the spamming of requests.
	 */
	const fetchHomepage = async () => {
		if (waiting) {
			changesSinceLastFetch = true;
		} else {
			waiting = true;

			// Set a timeout to run in TIMEOUT milliseconds
			const timeoutPromise = new Promise(resolve => setTimeout(resolve, TIMEOUT));
			const fetchPromise = fetch(getFetchUrl(form));

			fetchPromise.then(async response => {
				const json = await response.json();
				clearTruckPreviewArea();
				json.forEach(createTruckPreview);
			});

			// Await the time and fetch
			await Promise.all([timeoutPromise, fetchPromise]);

			// After that time, we are done waiting.
			waiting = false;
			console.log("wait over")
			// If the user altered the form while waiting, refetch the homepage
			if (changesSinceLastFetch) {
				changesSinceLastFetch = false;
				fetchHomepage();
			}
		}
	};

	/**
	 * @param {HTMLFormElement} form The form that contains all the stuff
	 * @return {string} The url to fetch from
	 */
	const getFetchUrl = form => {
		/** @type {string[]} The search params waiting to be joined */
		const params = [];

		const pickUpDate = form.elements["pickup-date"].value;
		const rentTime = form.elements["rent-duration"].value;
		const sortBy = form.elements["sort-by"].value;
		const widthMin = form.elements["width-min"].value;
		const widthMax = form.elements["width-max"].value;
		const heightMin = form.elements["height-min"].value;
		const heightMax = form.elements["height-max"].value;
		const lengthMin = form.elements["length-min"].value;
		const lengthMax = form.elements["length-max"].value;

		if (pickUpDate) params.push(`pickUpDate=${pickUpDate}`);
		if (rentTime) params.push(`rentTime=${rentTime}`);
		if (sortBy) params.push(`sortBy=${sortBy}`);
		if (widthMin) params.push(`widthMin=${widthMin}`);
		if (widthMax) params.push(`widthMax=${widthMax}`);
		if (heightMin) params.push(`heightMin=${heightMin}`);
		if (heightMax) params.push(`heightMax=${heightMax}`);
		if (lengthMin) params.push(`lengthMin=${lengthMin}`);
		if (lengthMax) params.push(`lengthMax=${lengthMax}`);

		return `/api/search?${params.join("&")}`;
	};

	/**
	 * Clones, fills, and appends the template.
	 * @param {object} truck The truck object.
	 * @param {string} truck.anchor The url to direct to for viewing this truck.
	 * @param {string} truck.imageUrl The url to fetch the image from.
	 * @param {string} truck.name The display name.
	 * @param {number} truck.pricePerHour The cost of rent per hour .
	 * @param {number} truck.pricePerMile The cost of rent per mile driven.
	 * @param {number} truck.rating The average rating.
	 */
	const createTruckPreview = truck => {
		/** @type {DocumentFragment} */
		const fragment = template.content.cloneNode(true);
		fragment.querySelector("#truck-anchor").setAttribute("href", truck.anchor);
		fragment.querySelector("#truck-image").setAttribute("src", truck.imageUrl);

		fragment.querySelector("#truck-name").textContent = truck.name;
		fragment.querySelector("#truck-price-per-hour").textContent = truck.pricePerHour;
		fragment.querySelector("#truck-price-per-mile").textContent = truck.pricePerMile;
		fragment.querySelector("#truck-rating").textContent = truck.rating ? `${truck.rating}⭐` : "No reviews";

		container.appendChild(fragment);
	};

	/**
	 * Removes all the children from the container element.
	 */
	const clearTruckPreviewArea = () => {
		while (container.firstChild) {
			container.removeChild(container.lastChild);
		}
	};

	fetchHomepage();
}

