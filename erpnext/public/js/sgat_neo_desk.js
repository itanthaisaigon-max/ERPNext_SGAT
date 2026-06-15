(function () {
	const root = document.documentElement;
	const storage_key = "sgat_neo_desk_theme";
	const neo_themes = {
		"SGAT Neo Light": "neo-light",
		"SGAT Neo Dark": "neo-dark",
	};

	function apply_theme(theme) {
		if (theme) {
			root.setAttribute("data-sgat-theme", theme);
			localStorage.setItem(storage_key, theme);
			return;
		}

		root.removeAttribute("data-sgat-theme");
		localStorage.removeItem(storage_key);
	}

	const cached_theme = localStorage.getItem(storage_key);
	if (cached_theme) {
		apply_theme(cached_theme);
	}

	function sync_theme_from_boot() {
		if (!window.frappe || !frappe.boot) {
			return false;
		}

		apply_theme(neo_themes[frappe.boot.sgat_website_theme]);
		return Boolean(frappe.boot.sgat_website_theme);
	}

	function sync_theme_from_settings() {
		if (sync_theme_from_boot()) {
			return;
		}

		if (!window.frappe || !frappe.db || !frappe.db.get_single_value) {
			return;
		}

		frappe.db
			.get_single_value("Website Settings", "website_theme")
			.then((theme_name) => apply_theme(neo_themes[theme_name]))
			.catch(() => apply_theme());
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", sync_theme_from_settings);
	} else {
		sync_theme_from_settings();
	}
})();
