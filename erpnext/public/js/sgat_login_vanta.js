// Load Vanta.js dependencies dynamically for the login page
frappe.ready(() => {
	if (document.body.getAttribute("data-path") !== "login") {
		return;
	}

	const loadScript = (src) => {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = src;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	};

	const ensureVantaLayer = () => {
		let layer = document.getElementById("sgat-login-vanta-bg");
		if (!layer) {
			layer = document.createElement("div");
			layer.id = "sgat-login-vanta-bg";
			layer.setAttribute("aria-hidden", "true");
			document.body.prepend(layer);
		}
		return layer;
	};

	const initVanta = () => {
		if (!window.VANTA || !window.VANTA.BIRDS || window.sgat_login_vanta) {
			return false;
		}

		window.sgat_login_vanta = window.VANTA.BIRDS({
			el: ensureVantaLayer(),
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.00,
			minWidth: 200.00,
			scale: 1.00,
			scaleMobile: 1.00,
			backgroundColor: 0x07192f,
			color1: 0xffcc00,
			color2: 0x00d1ff,
			colorMode: "varianceGradient",
			quantity: 5.00,
			birdSize: 1.00,
			wingSpan: 30.00,
			speedLimit: 5.00,
			separation: 20.00,
			alignment: 20.00,
			cohesion: 20.00,
			backgroundAlpha: 1.00
		});
		return true;
	};

	// Sequence: Three.js -> Vanta Birds -> Init
	loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js")
		.then(() => loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js"))
		.then(() => {
			initVanta();
		})
		.catch(err => console.error("Failed to load Vanta.js dependencies:", err));
});
