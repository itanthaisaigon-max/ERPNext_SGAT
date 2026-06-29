(function () {
	frappe.provide("erpnext");
	const root = document.documentElement;
	const storage_key = "sgat_neo_desk_theme";
	const neo_themes = {
		"SGAT Neo Light": "neo-light",
		"SGAT Neo Dark": "neo-dark",
		"SGAT-20Y": "20y",
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

	erpnext.apply_theme = apply_theme;

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

	// Reactive sync: Watch for attribute changes to keep UI components (like checkboxes) in sync
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === "attributes" && mutation.attributeName === "data-sgat-theme") {
				const new_theme = root.getAttribute("data-sgat-theme");
				$(".sgat-theme-toggle").each(function () {
					$(this).prop("checked", new_theme === "neo-dark");
				});
			}
		});
	});
	observer.observe(root, { attributes: true });

	// Reactive sync across tabs via localStorage
	window.addEventListener("storage", (e) => {
		if (e.key === storage_key) {
			apply_theme(e.newValue);
		}
	});

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", sync_theme_from_settings);
	} else {
		sync_theme_from_settings();
	}
	
	// Expose method to apply theme from website settings page
	erpnext.apply_sgat_theme = function (theme_name) {
		const mapping = {
			"SGAT Neo Light": "neo-light",
			"SGAT Neo Dark": "neo-dark",
			"SGAT-20Y": "20y",
		};
		apply_theme(mapping[theme_name]);

		frappe.call({
			method: "frappe.client.set_value",
			args: {
				doctype: "Website Settings",
				name: "Website Settings",
				fieldname: "website_theme",
				value: theme_name,
			},
		});
	};

	// Event listener for theme toggle checkbox
	$(document).on("change", ".sgat-theme-toggle", function () {
		const theme_name = this.checked ? "SGAT Neo Dark" : "SGAT Neo Light";
		erpnext.apply_sgat_theme(theme_name);
	});

	// Sync checkbox state on load
	$(document).on("toolbar_setup", function () {
		const current_theme = root.getAttribute("data-sgat-theme");
		$(".sgat-theme-toggle").prop("checked", current_theme === "neo-dark");
	});

	// Trigger theme update after saving Website Settings
	$(document).on("app_ready", function () {
		if (window.frappe && frappe.ui && frappe.ui.form) {
			frappe.ui.form.on("Website Settings", {
				after_save: function (frm) {
					const theme_name = frm.doc.website_theme;
					const mapping = {
						"SGAT Neo Light": "neo-light",
						"SGAT Neo Dark": "neo-dark",
					};
					apply_theme(mapping[theme_name]);
				},
			});
		}
	});
})();
