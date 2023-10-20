# trainproject

This project uses the Google Maps API to check how long it takes to travel between two trains stations in the UK, France, or Germany by train and by car. 
It's sort of like getting directions from Google Maps, only with far fewer features and utility.

I chose Google Maps as my first API because it was said to be relatively easy to use. I did not really find that to be the case, but it is well documented, and so
it was possible to research how to make it do everything I wanted it to do. At the very least, it was much, much easier than using National Rail's API.

If this project were to continue, I would ideally like to replace the dropdown menus (which are really there because it was easier and safer to make those than to add
another API to process user input) with input fields so the project could compare times between any two points on the map. 

Other future goals include adding cookies so the Dark Mode settings are saved; possibly adding more settings which could also be saved as cookies; and writing a 
script which will iterate through all the station lists, check them against Google Maps, and return the ones that result in errors so I can manually check and
correct them. The project currently finds the station location by adding "station" to the entry in the list, but this doesn't work for all stations; rural French
stations seem to be a particular problem. I also need different pictures of the train and car.

How to use the project:
Visit https://reticentspice.github.io/trainproject and use it there. The API key won't work anywhere else.
