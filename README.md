# NV Stats - PDF Maker
Hi! Welcome to the automatic statistic maker specifically designed
for Nerd Varsity!

This README will guide you through how to setup the program so that
creating a statistics document is super easy :)

---
## Prerequisites
For this project, I would recommend having nodejs & npm installed. npm is a package manager that is easy to use and relatively 
lightweight. 

In the project folder, there is the file 'package.json'. This specifies all the external libraries I am making use of
(among other things). To setup your environment, open a terminal window in the same directory package.json is, and run:

    npm i

This will automatically install everything you need as specified in package.json. If there are any issues that arise
with dependencies, run this:

    npm i --legacy-peer-deps

If this file does not exist, that's unfortunate.
After the command is executed, a package-lock.json file will be created - this is read only so do not edit it (it's 
for the program, not for you)

---
## Using the program - Configuration (JSON)
The first things to customise in the JSON is everything that is not in the "pages" array

### "name" 
represents the title of the document. it will be in the format:

    Nerd Varsity 2024
replacing 2024 with the current year of the event

"details" - should contain "society-information-list", "completed-events", "total-events", "start-page", "end-page" and "pages"


### "society-information-list" 
is an array of arrays where each array is in the format:

    [Team name, Abbreviation, Colour, Filename, Bonus]
    ["CRITS", "CRI", "#de1f41", "CRITS", 1]

where:
> Team name: is used to identify the society; it should be the full name of the competing society although exceptions do occur (see Sci-Fan)

> Abbreviation: is the shorthand for the society name; it should be a multiple of 3 and be clear which society it is referencing (CHLNGR = Challengers)

> Colour: is the full hex-code of the society's primary colour

> Filename: is the name of the icon jpg for the society; each icon must be in the same location (public/assets/images) and societies with spaces should have '-' in place of them (Doctor Who = Doctor-Who). Do not change already present dashes

> Bonus: an integer that represents the total number of points that a society will gain when bonus points can be won. E.G., best team name. If a society is to lose points (deductions), change this number to be negative instead 

### "completed-events"
is an integer, and should be equivalent to how many events have been completed and have the scores released

### "total-events"
is an integer, and should be equivalent to the total events that are planned. When all the vents have been run 
(completed-events = total-events), the bonus points will be added to the scores

### "start-page"
is an integer value which corresponds to the first page show in the pdf
4 = "page-4"

### "end-page"
is an integer value which corresponds to the last page show in the pdf
11 = "page-11"

---
Next, we'll look at configuring the pages; the "pages" array. This is a little more complicated, but is modular 
so is easy to copy-paste previous pages and adapt the new page to what it needs to be. Each page follows this format:

    "page-11": {
        "title": "Round 8: MarioKart 8 Deluxe Tournament",
        "type": "table",
        "data": {
            "societies": "#/#/#/#/#/#/#/#",
            "places": "1/2/3/4/5/6/7/8"
        }
      },

Each page has 3 parts: "title", "type", and "data"

> Title: The name of the event with what round it is; each title should follow the above format

> Type: declares how the page should render the data; as of this release, there are 4 types: chart, image, leaderboard, 
> and table

> Data: an object with 2 fields: "societies" and "places"
> 
> "societies" holds a string of all the societies abbreviations, each separated by a '/'
> 
> "places" holds a string of the places that each society achieved, each separated by a '/'

The places should be in descending order of points (first to last) and the societies should match their place so, 
(for example) if Film & Creative Writing came 4th in the above event, the JSON would look like this:

    "page-11": {
        "title": "Round 8: MarioKart 8 Deluxe Tournament",
        "type": "table",
        "data": {
            "societies": "#/#/#/FLMCRW/#/#/#/#",
            "places": "1/2/3/4/5/6/7/8"
        }
    },

In the event that a society does not show to an event, change the corresponding place to 0 to signify that they get 
no points

Each page follows this strict format, change the format of one and you must change all of them. If the page does not 
pass in any configuration data (like the one shown above), switch the value to 'null': 
    
    "data": null

Page-1 is used to show the winner of NV, in the "data" section, add in the abbreviation
of the society only, the code will do the rest for you

In the event that a round is left uncompleted or there appears to be shenanigans (polite term) afoot, then set the soc
abbreviations to '#', and the scores to 0. The program will detect this and show a message saying:
'Scores Unavailable'. Everyone will score 0 points

---
## Using the program - Configuration (Code)
Throughout the code, there are a some comments which explain what is being done.
Order of sections should be: [Imports, Variables, Functions], for ease of organisation

A particular rubric I follow with functions is that they all Call Up Return Down (lemon CURD).
Any function that is called must be above all the functions that call it, and in addition to this, if there
are multiple called functions in the order 1234 within another function, these functions should be in
the order 4321 above the function, top-down

When a new page type is added, there are 4 currently, create a new JS file for it in the format:

    render-new-component.js
with 'new-component' being changed to what the new component is named (with '-' instead of spaces)

In render-chart.js and render-leaderboard.js, there is the variable 'pageIncrementModifier', ensure 
to change this as the page number of the first event changes

When a society is added/removed/changed, go to:
- the function 'teamAbbreviationToName' to update accordingly
- the file 'render-chart.js' to update the <Line> components
- 'render-chart.js' & 'render-leaderboard.js' to the function formatData

---
## Running the program
In the package.json file, there are 4 scripts that can be run. The one you'll need is 'start', this will build the
program in a separate read-only folder (you can edit it but don't), and will then run it locally on port 3000. It should
automatically open in your preferred browser, but in the case that it doesn't, go to 'localhost:3000'.

---
## Final notes
I do so apologise in advance if anything has been neglected, I hope that the code comments and format is sufficient.
To the next beings who are to use this program, good luck lol I tried

---
ThoughtCrab5209 <3
