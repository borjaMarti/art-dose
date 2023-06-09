# Art Dose

This web application allows the user to explore and draw inspiration from random pieces of art that are part of The Metropolitan Museum of New York's collection. The application is fully responsive to the device's viewport size.

**Link to project:** https://borjamarti.github.io/artDose/

<img src="assets/art-dose.gif" alt="Gif showing the web app functionality and design.">

## How It's Made:

**Tech used:** HTML, CSS, JavaScript

Through the interface, the user makes a request to the MET's public API which retrieves the information of a singular piece in the form of an object. If the piece has at least one picture, it is then processed. If it doesn't have any pictures, another request is made for a new piece.

The site then prepares the data, displaying the main image in a container and, if any additional images are available, a carousel is built so the user can switch between the pictures.

The title of the piece, its author (if known), and the date are shown captioning the picture. Also, a link is provided to the piece's site on the MET's collection website.

A new request will retrieve new pieces, restarting the display process.

## Optimizations

Some aspects can be improved from the current design:

First, the layout. Moving the gallery to one side and the piece's info to the other would make better use of the space and give clarity.

Second, the carousel. The implementation I used is a very simple slider using vanilla JavaScript. Using a framework or library, the functionality could be broadened. For example, the slider position could move as the image selection changes, always focusing on the section in which the current picture is present.

Finally, the gallery. Instead of opening the bigger image in a new tab, a picture-in-picture system could be used so the gallery occupies the full size of the screen and the image can be zoomed in.

## Lessons Learned:

This was my first big project using APIs, so I learned how to make a fetch request and work on the data provided.

I also had to implement a slider for the thumbnail carousel, leading to learning some new events for the event listeners method.

Finally, while solving a bug with the picture navigation buttons, I learned of the interaction between event listeners and anonymous functions. I was using an anonymous function to pass the direction of the switch to the function responsible for making the change. But, since the function called was anonymous and anonymous functions are never equal even with the same content, when a request for a new image was made, instead of substituting the event listener, a new one was added on top, resulting in buggy behavior. The solution was to use separate functions for each switch button.