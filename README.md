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

![Embedded](https://github.com/user-attachments/assets/2a92be96-65f5-4515-9495-bc72c7a7f2a4)

**Copy/Paste code in widget.html file as well**

Other ways to embbed code: Render HTML via JS file instead of providing HTML code to the embedded code.
### Requirements: none

- No additional JavaScript libraries are required. It’s vanilla!
- Not required: the OpenDyslexic font file is included in this package.
- The _paq variable in widget.js is used to load Matomo Analytics. If you use Matomo, you may want to adjust the custom event tracking in widget.js. If you don’t use Matomo, this variable is extraneous and can be removed or kept - it shouldn’t impact the widget’s functionality.

## Credits

This widget was originally created by Erik Olson, Meredith Wynn, and Robin Davis of the User Experience department at NC State University Libraries in 2021. It has been adapted and customized for the GBC Library Site by *Alice Gonzalez*, including theme color modifications, integration into the website, and code adjustments to specifically apply the widget to Springshare's LibGuides, a content management system widely used by academic and public libraries to create research guides, manage library resources, and support students and researchers.
