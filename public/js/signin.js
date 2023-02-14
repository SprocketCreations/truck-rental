{
	const signinForm = document.querySelector("#signin-form");
	const signupForm = document.querySelector("#signup-form");
	const showSignup = document.querySelector("#show-signup");

	const incorrectEorPMessage = document.querySelector("#incorrect-email-or-password-message");
	const emailInUseMessage = document.querySelector("#email-in-use-message");
	const passwordsDontMatchMessage = document.querySelector("#passwords-dont-match-message");
	const passwordRequirementsMessage = document.querySelector("#password-requirements-message");

	document.querySelectorAll("input").forEach(input => input.addEventListener("input", event => {
		incorrectEorPMessage.style.display = "none";
		emailInUseMessage.style.display = "none";
		passwordsDontMatchMessage.style.display = "none";
		passwordRequirementsMessage.style.display = "none";
	}));


	/** @type {boolean} Whether we are waiting for a response from the server. */
	let outgoing = false;

	showSignup.addEventListener("click", event => {
		event.preventDefault();
		document.querySelector("#signin-screen").style.display = "none";
		document.querySelector("#signup-screen").style.display = "block";
	});

	signinForm.addEventListener("submit", event => {
		event.preventDefault();

		if (!outgoing) signin(event.target[0].value, event.target[1].value);
	});

	signupForm.addEventListener("submit", event => {
		event.preventDefault();

		// Verify that the two passwords match.
		if (event.target[1].value !== event.target[2].value) {
			passwordsDontMatchMessage.style.display = "block";
			return;
		}

		// Verify that the user typed a valid password.
		if (/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/.test(event.target[1].value)) {
			passwordRequirementsMessage.style.display = "block";
			return;
		}

		if (!outgoing) signup(event.target[0].value, event.target[1].value);
	});

	/** Sends a POST request to the server to log in. */
	const signin = async (email, password) => {
		outgoing = true;
		try {
			const response = await fetch("/api/signin", {
				method: "POST",
				cache: 'no-cache',
				credentials: 'same-origin',
				redirect: 'follow',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			const json = await response.json();
			console.log(json);

			if (response.status === 201) {
				if (window.location.href == document.referrer) {
					window.location.href = "/"
				} else {
					window.location.href = document.referrer;
				}
			} else if (response.status === 403) {
				incorrectEorPMessage.style.display = "block";
			}
		} catch (error) {
			console.log(error);
		}
		outgoing = false;
	};

	/** Sends a POST request to the server to create a new account. */
	const signup = async (email, password) => {
		outgoing = true;
		try {
			const response = await fetch("/api/signup", {
				method: "POST",
				cache: 'no-cache',
				credentials: 'same-origin',
				redirect: 'follow',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			const json = await response.json();
			console.log(json);

			if (response.status === 201) {
				if (window.location.href == document.referrer) {
					window.location.href = "/"
				} else {
					window.location.href = document.referrer;
				}
			} else if (response.status === 403) {
				emailInUseMessage.style.display = "block";
			}
		} catch (error) {
			console.log(error);
		}
		outgoing = false;
	};
}