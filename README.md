# Readability Widget

This is a readability widget that you can install on your website. It helps balance competing accessibility needs by offering an extra set of optional accommodations. 

**Note**: This widget alone will not make your website accessible; it is intended to be additive. We recommend that you ensure your site is WCAG-compliant before adding this widget.


## Features

- **Warm background**: peachy color overlay
- **OpenDyslexic font**: affects all text 
- **Highlight links**: in yellow 
- **Hide images**: blanks them out

## Screenshots

![Prototypes](https://github.com/user-attachments/assets/470ec383-dc27-4d5d-914f-a839f567d110)

## How to install
1. Clone this repository
2. Link to the widget.js script just before the closing <body> tag of your application: ``<script src="path/to/your/widget.js"></script>``
3. Optional: edit the colors in widget.scss to match those of your organization. 

The widget will appear at the bottom right of your site. To expand the widget, the user clicks on the "Readability" button. 
## How to install widget on Springshare
-Fork repository to your github
-Edit colors in widget.scss and/or widget.css
-Deploy widget via GitHub-pages
-Embebed widget

Final Embedded code sample that will be placed in the Look & Feel > Custom JS/CSS Section:
<script src="https://<screename>.github.io/Accessibility-Widget/widget.js"></script>
<link rel="stylesheet" href="https://<screenname>.github.io/Accessibility-Widget/widget.css">

<article id="readability-widget" class="open" style="bottom: 0px; opacity: 1;">
	<section id="widget-toggle">
		<button id="widget-toggle-button" class="closed" aria-label="Open readability menu"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H256C273.7 32 288 46.33 288 64C288 81.67 273.7 96 256 96zM256 352H32C14.33 352 0 337.7 0 320C0 302.3 14.33 288 32 288H256C273.7 288 288 302.3 288 320C288 337.7 273.7 352 256 352zM0 192C0 174.3 14.33 160 32 160H416C433.7 160 448 174.3 448 192C448 209.7 433.7 224 416 224H32C14.33 224 0 209.7 0 192zM416 480H32C14.33 480 0 465.7 0 448C0 430.3 14.33 416 32 416H416C433.7 416 448 430.3 448 448C448 465.7 433.7 480 416 480z"></path></svg> Readability</button>
	</section>
	<section id="widget-content">
		<label class="readability-switch">
			<span class="readability-switch-label">
				Warm Background
			</span>
			<span class="switch-toggle-container">
				<input id="warm-background-toggle" type="checkbox" tabindex="0">
				<span class="toggle-switch">
					<span class="label-on">ON</span>
					<span class="label-off">OFF</span>
				</span>
			</span>
		</label>
		<label class="readability-switch">
			<span class="readability-switch-label">
				Highlight Links
			</span>
			<span class="switch-toggle-container">
				<input id="highlight-links-toggle" type="checkbox" tabindex="0">
				<span class="toggle-switch">
					<span class="label-on">ON</span>
					<span class="label-off">OFF</span>
				</span>
			</span>
		</label>
		<label class="readability-switch">
			<span class="readability-switch-label">
				OpenDyslexic Font
			</span>
			<span class="switch-toggle-container">
				<input id="open-dyslexic-font-toggle" type="checkbox" tabindex="0">
				<span class="toggle-switch">
					<span class="label-on">ON</span>
					<span class="label-off">OFF</span>
				</span>
			</span>
		</label>
		<label class="readability-switch">
			<span class="readability-switch-label">
				Hide Images
			</span>
			<span class="switch-toggle-container">
				<input id="hide-images-toggle" type="checkbox" tabindex="0">
				<span class="toggle-switch">
					<span class="label-on">ON</span>
					<span class="label-off">OFF</span>
				</span>
			</span>
		</label>
		<p><button id="hide-widget-button" tabindex="-1">Hide this widget</button></p>
	</section>
</article>

Other ways to embbed code: Render HTML via JS file instead of providing HTML code to the embedded code.
### Requirements: none

- No additional JavaScript libraries are required. It’s vanilla!
- Not required: the OpenDyslexic font file is included in this package.
- The _paq variable in widget.js is used to load Matomo Analytics. If you use Matomo, you may want to adjust the custom event tracking in widget.js. If you don’t use Matomo, this variable is extraneous and can be removed or kept - it shouldn’t impact the widget’s functionality.

## Credits

This widget was originally created by Erik Olson, Meredith Wynn, and Robin Davis of the User Experience department at NC State University Libraries in 2021. It has been adapted and customized for GBC Library Site by Alice Gonzalez, including theme color modifications and integration into the website.
