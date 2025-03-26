var ra_widget = {
    // load widget to page
    init: function() {
        console.log("Initializing widget...");

        // Dynamically load the widget's CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './widget.css'; // Ensure this path is correct
        document.head.appendChild(link);

        // Dynamically inject the widget's HTML
        const widgetHTML = `
        <article id="readability-widget" class="closed">
            <section id="widget-toggle">
                <button id="widget-toggle-button" class="closed" aria-label="Open readability menu">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M256 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H256C273.7 32 288 46.33 288 64C288 81.67 273.7 96 256 96zM256 352H32C14.33 352 0 337.7 0 320C0 302.3 14.33 288 32 288H256C273.7 288 288 302.3 288 320C288 337.7 273.7 352 256 352zM0 192C0 174.3 14.33 160 32 160H416C433.7 160 448 174.3 448 192C448 209.7 433.7 224 416 224H32C14.33 224 0 209.7 0 192zM416 480H32C14.33 480 0 465.7 0 448C0 430.3 14.33 416 32 416H416C433.7 416 448 430.3 448 448C448 465.7 433.7 480 416 480z"/>
                    </svg> Readability
                </button>
            </section>
            <section id="widget-content">
                <label class="readability-switch">
                    <span class="readability-switch-label">Warm Background</span>
                    <span class="switch-toggle-container">
                        <input id="warm-background-toggle" type="checkbox">
                        <span class="toggle-switch">
                            <span class="label-on">ON</span>
                            <span class="label-off">OFF</span>
                        </span>
                    </span>
                </label>
                <label class="readability-switch">
                    <span class="readability-switch-label">Hide Images</span>
                    <span class="switch-toggle-container">
                        <input id="hide-images-toggle" type="checkbox">
                        <span class="toggle-switch">
                            <span class="label-on">ON</span>
                            <span class="label-off">OFF</span>
                        </span>
                    </span>
                </label>
            </section>
        </article>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Fetch and initialize the widget
        ra_widget._paq = window._paq || [];
        fetch('./widget.html') // Ensure this path is correct
            .then(function(response) {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(function(html) {
                document.body.insertAdjacentHTML("beforeend", html);

                // Ensure DOM is updated before attaching event listeners
                setTimeout(function() {
                    // once widget has loaded enable event listener on button
                    ra_widget.toggle_widget();

                    // enable event listeners on toggles
                    ra_widget.add_listeners_to_toggles();

                    // close when clicking outside widget area
                    ra_widget.close_on_click_outside_of_widget();

                    // close when esc key pressed
                    ra_widget.close_on_escape();

                    // hide widget when hide button pressed
                    ra_widget.set_hidden_event_listener();

                    // check localstorage toggles
                    ra_widget.check_localstorage_toggles();

                    // add analytics to html links
                    ra_widget.add_link_analytics();

                    // finally show widget to users
                    ra_widget.show_widget_to_users();
                }, 0); // Delay to ensure DOM is updated
            })
            .catch(function(err) {
                console.error("Failed to load widget.html:", err);
            });
    },

    show_widget_to_users: function() {
        // bug where widget content padding was not computed right away. wait for padding to be computed before showing widget
        const padding_check = setInterval(function() {
            widget_content = document.getElementById("widget-content");
            widget_content_padding = window.getComputedStyle(widget_content, null).getPropertyValue('padding-left');
            if (widget_content_padding != '0px') {
                clearInterval(padding_check);
                ra_widget.close_widget();
                // show widget
                document.getElementById('readability-widget').style.opacity = 1;
            }
        }, 100);
    },

    toggle_widget: function(e) {
        // add event listener to widget button (toggle on|off)
        document.querySelector("#widget-toggle-button").addEventListener("click", function(e) {
            widget_element = document.getElementById('readability-widget');
            if (widget_element.classList.contains('closed')) {
                ra_widget.reveal_widget();
            } else {
                ra_widget.close_widget();
            }
        });
    },

    reveal_widget: function() {
        widget_element = document.getElementById('readability-widget');
        widget_element.classList.remove('closed');
        widget_element.classList.remove('widget-hidden');
        widget_element.classList.add('open');
        // set bottom of article to 0px
        widget_element.style.bottom = "0px";

        ra_widget.set_widget_hidden_local_storage('false');

        ra_widget.enable_internal_tabbing();

        // add analytics
        ra_widget._paq.push(['trackEvent', 'Readability Widget', 'widget toggle', 'open']);
    },

    close_widget: function() {
        widget_element = document.getElementById('readability-widget');
        widget_element.classList.remove('open');
        widget_element.classList.add('closed');

        // set bottom of article to - height of the widget content
        widget_content = document.getElementById("widget-content");

        widget_element.style.bottom = -(widget_content.offsetHeight) + "px";

        ra_widget.disable_internal_tabbing();
    },

    disable_internal_tabbing: function() {
        all_internal_links = document.querySelectorAll('#widget-content a, #widget-content input, #widget-content button');

        all_internal_links.forEach(function(currentValue) {
            currentValue.tabIndex = -1;
        });
    },

    enable_internal_tabbing: function() {
        all_internal_links = document.querySelectorAll('#widget-content a, #widget-content input, #widget-content button');

        all_internal_links.forEach(function(currentValue) {
            currentValue.tabIndex = 0;
        });
    },

    close_on_click_outside_of_widget: function() {
        widget_element = document.getElementById('readability-widget');
        const outside_click_listener = event => {
            if (!widget_element.contains(event.target) && !widget_element.classList.contains('closed')) {
                ra_widget.close_widget();
            }
        }
        // add event listener to body
        document.addEventListener('click', outside_click_listener);
    },

    close_on_escape: function() {
        const escape_key_listener = event => {
            if (event.keyCode == 27) {
                ra_widget.close_widget();
            }
        }
        document.addEventListener("keydown", escape_key_listener);
    },

    set_hidden_event_listener: function() {
        document.getElementById("hide-widget-button").addEventListener('click', function(e) {
            ra_widget.hide_widget();
        })
    },

    hide_widget: function() {
        ra_widget.close_widget();
        // and hide it too
        widget_element = document.getElementById('readability-widget');
        widget_element.classList.add("widget-hidden");

        // set widget localStorage 
        ra_widget.set_widget_hidden_local_storage('true');

        // add analytics
        ra_widget._paq.push(['trackEvent', 'Readability Widget', 'widget toggle', 'hidden']);
    },

    check_localstorage_toggles: function() {
        // check if we should hide widget
        if (localStorage.widget_hidden == 'true') {
            ra_widget.hide_widget();
        }

        // check for warm background
        if (localStorage.warm_background == 'true') {
            const warm_overlay_el = document.createElement('div');
            warm_overlay_el.id = "readability-warm-overlay";
            document.body.appendChild(warm_overlay_el);
            document.getElementById("warm-background-toggle").checked = true;
        }

        // check for images
        if (localStorage.hide_all_images == 'true') {
            ra_widget.hide_show_all_images('true');
            document.getElementById("hide-images-toggle").checked = true;
        }

        // check for dyslexic font storage
        if (localStorage.open_dyslexic_font == 'true') {
            document.body.classList.add("open-dyslexic");
            document.getElementById("open-dyslexic-font-toggle").checked = true;
        }

        // check for highlight links storage
        if (localStorage.highlight_links == 'true') {
            ra_widget.hide_show_highlighted_links('true');
            document.getElementById("highlight-links-toggle").checked = true;
        }
    },

    set_widget_hidden_local_storage: function(value) {
        localStorage.widget_hidden = value;
    },

    add_listeners_to_toggles: function() {
        // Ensure elements exist before attaching event listeners
        const warmBackgroundToggle = document.getElementById("warm-background-toggle");
        const hideImagesToggle = document.getElementById("hide-images-toggle");
        const openDyslexicFontToggle = document.getElementById("open-dyslexic-font-toggle");
        const highlightLinksToggle = document.getElementById("highlight-links-toggle");

        if (warmBackgroundToggle) {
            warmBackgroundToggle.addEventListener('click', function(e) {
                if (e.target.checked) {
                    const warm_overlay_el = document.createElement('div');
                    warm_overlay_el.id = "readability-warm-overlay";
                    document.body.appendChild(warm_overlay_el);
                    localStorage.warm_background = 'true';

                    // add analytics
                    ra_widget._paq.push(['trackEvent', 'Readability Widget', 'warm background', 'on']);
                } else {
                    document.getElementById("readability-warm-overlay").remove();
                    localStorage.warm_background = 'false';

                    // add analytics
                    ra_widget._paq.push(['trackEvent', 'Readability Widget', 'warm background', 'off']);
                }
            });
        }

        if (hideImagesToggle) {
            hideImagesToggle.addEventListener('click', function(e) {
                if (e.target.checked) {
                    ra_widget.hide_show_all_images('true');
                } else {
                    ra_widget.hide_show_all_images('false');
                }
            });
        }

        if (openDyslexicFontToggle) {
            openDyslexicFontToggle.addEventListener('click', function(e) {
                if (e.target.checked) {
                    document.body.classList.add("open-dyslexic");
                    localStorage.open_dyslexic_font = 'true';

                    // add analytics
                    ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight dyslexic font', 'on']);
                } else {
                    document.body.classList.remove("open-dyslexic");
                    localStorage.open_dyslexic_font = 'false';

                    // add analytics
                    ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight dyslexic font', 'off']);
                }
            });
        }

        if (highlightLinksToggle) {
            highlightLinksToggle.addEventListener('click', function(e) {
                if (e.target.checked) {
                    ra_widget.hide_show_highlighted_links('true');
                    ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight links', 'on']);
                } else {
                    ra_widget.hide_show_highlighted_links('false');
                    ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight links', 'off']);
                }
            });
        }
    },

    hide_show_all_images: function(value) {
        if (value == 'true') {
            document.body.classList.add('readability-hide-images');
            ra_widget._paq.push(['trackEvent', 'Readability Widget', 'hide images', 'on']);
        } else {
            document.body.classList.remove('readability-hide-images');
            ra_widget._paq.push(['trackEvent', 'Readability Widget', 'hide images', 'off']);
        }
        localStorage.hide_all_images = value;
    },

    hide_show_highlighted_links: function(value) {
        if (value == 'true') {
            document.body.classList.add('readability-highlight-links-on');
            ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight links', 'on']);
        } else {
            document.body.classList.remove('readability-highlight-links-on');
            ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight links', 'off']);
        }
        localStorage.highlight_links = value;
    },

    add_link_analytics: function() {
        document.getElementById('widget-feedback-link').addEventListener('click', function(e) {
            ra_widget._paq.push(['trackEvent', 'Readability Widget', 'widget feedback link click']);
        });
    }
};

// once DOM is fully loaded, initialize widget
window.addEventListener('DOMContentLoaded', function(e) {
    ra_widget.init();
});



//CODE THAT WORKS

// // Loads widget on page
// // initiates widget functionality (toggle button, on|off switches)

// var ra_widget = {

// 	// load widget to page
// 	init: function(){
// 		ra_widget._paq = window._paq || [];
		
// 		// fetch('https://cdn.lib.ncsu.edu/readability-widget/widget.html').then(function (response) {
// 		fetch('widget.html').then(function (response) {
// 			// successful API call
// 			return response.text();
// 		}).then(function (html) {
// 			// HTML from response as text string
// 			// append to the end of the body element
// 			var b = document.body;
// 			b.insertAdjacentHTML("beforeend",html);

// 			// once widget has loaded enable event listener on button
// 			ra_widget.toggle_widget();

// 			// enable event listeners on toggles
// 			ra_widget.add_listeners_to_toggles();

// 			// close when clicking outside widget area
// 			ra_widget.close_on_click_outside_of_widget();

// 			// close when esc key pressed
// 			ra_widget.close_on_escape();

// 			// hide widget when hide button pressed
// 			ra_widget.set_hidden_event_listener();

// 			// check localstorage toggles
// 			ra_widget.check_localstorage_toggles();
			
// 			// add analytics to html links
// 			ra_widget.add_link_analytics();

// 			// finally show widget to users
// 			ra_widget.show_widget_to_users();

// 		}).catch(function (err) {
// 			// something went wrong
// 			console.warn("Failed to load widget.html", err);
// 		});

// 	},

// 	show_widget_to_users : function(){
// 		// bug where widget content padding was not computed right away. wait for padding to be computed before showing widget
// 		const padding_check = setInterval(function(){
// 			widget_content = document.getElementById("widget-content");
// 			widget_content_padding = window.getComputedStyle(widget_content, null).getPropertyValue('padding-left');
// 			if(widget_content_padding != '0px'){
// 				clearInterval(padding_check);
// 				ra_widget.close_widget();
// 				// show widget
// 				document.getElementById('readability-widget').style.opacity = 1;
// 			}
// 		},100);
// 	},

// 	toggle_widget : function(e){
// 		// add event listener to widget button (toggle on|off)
// 		document.querySelector("#widget-toggle-button").addEventListener("click", function(e){
// 			widget_element = document.getElementById('readability-widget');
// 			if(widget_element.classList.contains('closed')){
// 				ra_widget.reveal_widget();
// 			}else{
// 				ra_widget.close_widget();
// 			}
// 		});
// 	},
// 	// reveal widget to user
// 	reveal_widget : function(){
// 		widget_element = document.getElementById('readability-widget');
// 		widget_element.classList.remove('closed');
// 		widget_element.classList.remove('widget-hidden');
// 		widget_element.classList.add('open');
// 		// set bottom of article to 0px
// 		widget_element.style.bottom = "0px";

// 		ra_widget.set_widget_hidden_local_storage('false');

// 		ra_widget.enable_internal_tabbing();

// 		// add analytics
// 		ra_widget._paq.push(['trackEvent', 'Readability Widget', 'widget toggle', 'open']);
// 	},
	
// 	// hide widget (still revealing widget toggle button)
// 	close_widget : function(){

// 		widget_element = document.getElementById('readability-widget');
// 		widget_element.classList.remove('open');
// 		widget_element.classList.add('closed');

// 		// set bottom of article to - height of the widget content
// 		widget_content = document.getElementById("widget-content");

// 		widget_element.style.bottom = -(widget_content.offsetHeight) + "px";

// 		ra_widget.disable_internal_tabbing();
// 	},

// 	/**
// 	 * Allows tabbing past readability widget when not open
// 	 */
// 	disable_internal_tabbing: function() {
// 		all_internal_links = document.querySelectorAll('#widget-content a, #widget-content input, #widget-content button');
  
// 	  	all_internal_links.forEach(function (currentValue) {
// 		  currentValue.tabIndex = -1;
// 		});
// 	},
	
// 	/**
// 	 * Restores tabbing inside widget, when open
// 	 */
// 	enable_internal_tabbing: function() {
// 		all_internal_links = document.querySelectorAll('#widget-content a, #widget-content input, #widget-content button');

// 		all_internal_links.forEach(function (currentValue) {
// 			currentValue.tabIndex = 0;
// 		});
// 	},

// 	// if click happens outside popover, close it
// 	close_on_click_outside_of_widget : function() {
// 		widget_element = document.getElementById('readability-widget');
// 		const outside_click_listener = event => {
// 			if (!widget_element.contains(event.target) && !widget_element.classList.contains('closed')) {
// 				ra_widget.close_widget();
// 			}
// 		}
// 		// add event listener to body
// 		document.addEventListener('click', outside_click_listener);
// 	},

// 	close_on_escape : function() {
// 		const escape_key_listener = event => {

// 			if(event.keyCode == 27) {
// 				ra_widget.close_widget();
// 			}
// 		}
// 		document.addEventListener("keydown", escape_key_listener);
// 	},

// 	set_hidden_event_listener : function() {
// 		document.getElementById("hide-widget-button").addEventListener('click', function(e){
// 			ra_widget.hide_widget();
// 		})
// 	},

// 	hide_widget : function(){
// 		ra_widget.close_widget();
// 		// and hide it too
// 		widget_element = document.getElementById('readability-widget');
// 		widget_element.classList.add("widget-hidden");

// 		// set widget localStorge 
// 		ra_widget.set_widget_hidden_local_storage('true');

// 		// add analytics_exists
// 		ra_widget._paq.push(['trackEvent', 'Readability Widget', 'widget toggle', 'hidden']);
// 	},

// 	check_localstorage_toggles : function(){
// 		// check if we should hide widget
// 		if(localStorage.widget_hidden == 'true'){
// 			ra_widget.hide_widget();
// 		}

// 		// check for warm background
// 		if(localStorage.warm_background == 'true'){
// 			//document.body.style.backgroundColor = "#F5E4D1"; //peach
// 			const warm_overlay_el = document.createElement('div');
// 			warm_overlay_el.id = "readability-warm-overlay";
// 			document.body.appendChild(warm_overlay_el);
// 			document.getElementById("warm-background-toggle").checked = true;
// 		}

// 		// check for images
// 		if(localStorage.hide_all_images == 'true'){
// 			ra_widget.hide_show_all_images('true');
// 			document.getElementById("hide-images-toggle").checked = true;
// 		}

// 		// check for dyslexic font storage
// 		if(localStorage.open_dyslexic_font == 'true'){
// 			document.body.classList.add("open-dyslexic");
// 			document.getElementById("open-dyslexic-font-toggle").checked = true;
// 		}

// 		// check for highlight links storage
// 		if(localStorage.highlight_links == 'true'){
// 			ra_widget.hide_show_highlighted_links('true');
// 			document.getElementById("highlight-links-toggle").checked = true;
// 		}

// 	},

// 	set_widget_hidden_local_storage : function(value){
// 		localStorage.widget_hidden = value;
// 	},

// 	add_listeners_to_toggles : function(){
// 		// toggle background to a warm color and back to original color
// 		document.getElementById("warm-background-toggle").addEventListener('click', function(e){
// 			if(e.target.checked){
// 				//document.body.style.backgroundColor = "#F5E4D1"; //peach
// 				const warm_overlay_el = document.createElement('div');
// 				warm_overlay_el.id = "readability-warm-overlay";
// 				document.body.appendChild(warm_overlay_el);
// 				localStorage.warm_background = 'true';

// 				// add analytics
// 				ra_widget._paq.push(['trackEvent', 'Readability Widget', 'warm background', 'on']);
// 			}else{
// 				//document.body.style.backgroundColor = "";
// 				document.getElementById("readability-warm-overlay").remove();
// 				localStorage.warm_background = 'false';

// 				// add analytics
// 				ra_widget._paq.push(['trackEvent', 'Readability Widget', 'warm background', 'off']);
// 			}
// 		})

// 		document.getElementById("hide-images-toggle").addEventListener('click', function(e){
// 			if(e.target.checked){
// 				ra_widget.hide_show_all_images('true');
// 			}else{
// 				ra_widget.hide_show_all_images('false');
// 			}
// 		})

// 		document.getElementById("open-dyslexic-font-toggle").addEventListener('click', function(e){
// 			if(e.target.checked) {
// 				// make body font OpenDyslexic
// 				document.body.classList.add("open-dyslexic");

// 				// set local storage
// 				localStorage.open_dyslexic_font = 'true';

// 				// add analytics
// 				ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight dyslexic font', 'on']);

// 			} else {
// 				// make font regular again
// 				document.body.classList.remove("open-dyslexic");

// 				// set local storage
// 				localStorage.open_dyslexic_font = 'false';

// 				// add analytics
// 				ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight dyslexic font', 'off']);
// 			}
// 		})

// 		document.getElementById("highlight-links-toggle").addEventListener('click', function(e){
// 			if(e.target.checked){
// 				ra_widget.hide_show_highlighted_links('true');
// 				// add analytics
// 				ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight links', 'on']);
// 			}else{
// 				ra_widget.hide_show_highlighted_links('false');
// 				// add analytics
// 				ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight links', 'off']);
// 			}		
// 		})
// 	},

// 	hide_show_all_images : function(value){
// 		/** get all images
// 		all_images = document.querySelectorAll("img");
// 		if(value == 'true'){
// 			for(i=0;i<all_images.length;i++){
// 				all_images[i].style.display = 'none';
// 			}
// 		}else if(value == 'false'){
// 			for(i=0;i<all_images.length;i++){
// 				all_images[i].style.display = '';
// 			}
// 		}*/
// 		if(value == 'true') {
// 			document.body.classList.add('readability-hide-images');
// 			// add analytics
// 			ra_widget._paq.push(['trackEvent', 'Readability Widget', 'hide images', 'on']);
// 		} else {
// 			document.body.classList.remove('readability-hide-images');
// 			// add analytics
// 			ra_widget._paq.push(['trackEvent', 'Readability Widget', 'hide images', 'off']);
// 		}
// 		localStorage.hide_all_images = value;
// 	},

// 	hide_show_highlighted_links : function(value){
		
// 		if(value == 'true'){
// 			document.body.classList.add('readability-highlight-links-on');

// 			// add analytics
// 			ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight links', 'on']);
// 		}else if(value == 'false'){
// 			document.body.classList.remove('readability-highlight-links-on');

// 			// add analytics
// 			ra_widget._paq.push(['trackEvent', 'Readability Widget', 'highlight links', 'off']);
// 		}

// 		localStorage.highlight_links = value;
// 	},
// 	// add analytics to text links
// 	add_link_analytics : function(){
// 		document.getElementById('widget-feedback-link').addEventListener('click', function(e){
// 			// add analytics
// 			ra_widget._paq.push(['trackEvent', 'Readability Widget', 'widget feedback link click']);
// 		})
// 	}
// }

// // once DOM is fully loaded, initialize widget
// window.addEventListener('DOMContentLoaded', function(e) {
// 	ra_widget.init();
// });

