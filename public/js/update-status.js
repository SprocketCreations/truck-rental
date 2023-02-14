{// Pickup button
	const pickupButton = document.querySelector("#pickup-rent-button");
	const PUT_URL = `/api/rent/pickup/${pickupButton.getAttribute("data-rent-id")}`;
	pickupButton.removeAttribute("data-rent-id");
	pickupButton.removeAttribute("id");
	let outgoing = false;
	pickupButton.addEventListener("click", async event => {
		if (!outgoing) {
			outgoing = true;
			try {
				const response = await fetch(PUT_URL, {
					method: "PUT",
					cache: 'no-cache',
					credentials: 'same-origin',
					redirect: 'follow'
				});
				const json = await response.json();
				console.log(json);
				
				if (response.status === 200) {
					window.location.reload();
				}
			} catch (error) {
				console.log(error);
			}
			outgoing = false;
		}
	});
}

{
	const cancelButton = document.querySelector("#cancel-rent-button");
	const PUT_URL = `/api/rent/cancel/${cancelButton.getAttribute("data-rent-id")}`;
	cancelButton.removeAttribute("id");
	cancelButton.removeAttribute("data-rent-id");
	let outgoing = false;
	cancelButton.addEventListener("click", async event => {
		if (!outgoing) {
			outgoing = true;
			try {
				const response = await fetch(PUT_URL, {
					method: "PUT",
					cache: 'no-cache',
					credentials: 'same-origin',
					redirect: 'follow'
				});
				const json = await response.json();
				console.log(json);

				if (response.status === 200) {
					window.location.reload();
				} else {
					alert(json);
				}
			} catch (error) {
				console.log(error);
			}
			outgoing = false;
		}
	});
}