{
	const signinForm = document.querySelector("#signin-form");
	const signupForm = document.querySelector("#signup-form");
	const showSignup = document.querySelector("#show-signup");


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
			alert("Passwords dont match");
			return;
		}

		// Verify that the user typed a valid password.
		if (/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/.test(event.target[1].value)) {
			alert("Password must be 8 characters or longer and contain at least one:\nLower case letter\nUpper case letter\nNumber\nSymbol")
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
			}
		} catch (error) {
			console.log(error);
		}
		outgoing = false;
	};
}