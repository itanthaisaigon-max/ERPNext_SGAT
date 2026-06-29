import os
from pathlib import Path

import frappe


BAD_FONT_IMPORTS = (
	'@import"frappe/public/css/fonts/inter/inter.css";',
	'@import "frappe/public/css/fonts/inter/inter.css";',
	'@import url("frappe/public/css/fonts/inter/inter.css");',
)
GOOD_FONT_IMPORT = '@import"/assets/frappe/css/fonts/inter/inter.css";'


def execute():
	website_theme_dir = Path(frappe.get_site_path("public", "files", "website_theme"))
	if not website_theme_dir.is_dir():
		return

	for css_file in website_theme_dir.glob("*.css"):
		replace_bad_font_import(css_file)


def replace_bad_font_import(css_file):
	try:
		css = css_file.read_text(encoding="utf-8-sig")
	except OSError:
		return

	updated_css = css
	for bad_import in BAD_FONT_IMPORTS:
		updated_css = updated_css.replace(bad_import, GOOD_FONT_IMPORT)

	if updated_css == css:
		return

	temp_file = css_file.with_suffix(f"{css_file.suffix}.tmp")
	temp_file.write_text(updated_css, encoding="utf-8")
	os.replace(temp_file, css_file)
