import frappe


@frappe.whitelist(allow_guest=True, methods=["POST"])
def login():
	"""Compatibility login endpoint; LoginManager handles authentication before dispatch."""
	rewrite_username_login()


def rewrite_username_login():
	login_id = frappe.form_dict.get("usr")
	if not login_id or "@" in login_id:
		return

	user = frappe.db.get_value("User", {"username": login_id, "enabled": 1}, "name")
	if user:
		frappe.form_dict["usr"] = user
