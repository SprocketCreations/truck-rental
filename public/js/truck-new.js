{
	// The form submission
	/** @type {HTMLFormElement} */
	const form = document.querySelector("#new-truck-form");

	let outgoing = false;

	form.addEventListener("submit", event => {
		event.preventDefault();

		if (!outgoing) {
			sendNewTruck(event);
		}
	});

	const sendNewTruck = async event => {
		outgoing = true;
		try {
			const formData = new FormData();

			formData.append("image", form.elements["new-truck-image"].files[0]);
			formData.append("name", form.elements["new-truck-name"].value);
			formData.append("costPerHour", form.elements["new-truck-cost-per-hour"].value);
			formData.append("costPerMile", form.elements["new-truck-cost-per-mile"].value);
			formData.append("width", form.elements["new-truck-width"].value);
			formData.append("length", form.elements["new-truck-length"].value);
			formData.append("height", form.elements["new-truck-height"].value);
			formData.append("fuelTankSize", form.elements["new-truck-fuel-tank-size"].value);
			formData.append("mpg", form.elements["new-truck-mpg"].value);
			formData.append("milage", form.elements["new-truck-milage"].value);
			formData.append("features", getFeatures());

			const response = await fetch("/api/truck/new", {
				method: "POST",
				cache: 'no-cache',
				credentials: 'same-origin',
				redirect: 'follow',
				body: formData,
			});
			const json = await response.json();
			console.log(json);
		} catch (error) {
			console.log(error);
		}

		outgoing = false;
	};

	// The image select box

	const imageInput = document.querySelector("#new-truck-image");
	const imageInputLabel = document.querySelector("#new-truck-image-label");
	const imageInputPreview = document.querySelector("#new-truck-image-preview");

	imageInput.addEventListener("change", event => {
		const fileReader = new FileReader();
		fileReader.onload = event => {
			imageInputPreview.setAttribute("src", event.target.result);
			imageInputPreview.style.display = "block";
			imageInputLabel.classList.remove("new-truck-image-idle");
			imageInputLabel.querySelector("a").style.display = "none";
		};
		fileReader.readAsDataURL(imageInput.files[0]);
	});

	// The Feature panel's infinite text boxes

	const featuresList = document.querySelector("#new-truck-features-list");
	/** @type {Array<HTMLInputElement>} */
	const featureInputs = [];

	/** @returns {string[]} List of the features */
	const getFeatures = () => featureInputs.map(input => input.value).filter(feature => feature);


	/** @param {HTMLInputElement} input */
	const removeFeature = input => {
		const index = featureInputs.indexOf(input);
		if (index !== -1) {
			featureInputs.splice(index, 1);
		}
		input.parentElement.remove();
	};

	const addFeature = () => {
		const li = document.createElement("li");
		const input = document.createElement("input");
		li.appendChild(input);
		featureInputs.push(input);
		featuresList.appendChild(li);

		input.setAttribute("type", "text");

		input.addEventListener("change", event => {
			if (input.value) {
				if (input === featureInputs[featureInputs.length - 2] || input === featureInputs[featureInputs.length - 1]) {
					addFeature();
				}
			} else {
				removeFeature(input);
			}
		});
	};
	addFeature();
	addFeature();
	addFeature();
}