#xframe demo

##What's This All About?

[postal.xframe]() is cross frame messaging add-on for [postal.js](). This is a somewhat silly, completely overkill and mostly contrived sample app which demonstrates how postal.xframe can be used to 'federate' 3 iframes and a parent window.

### WARNING
Really, this is a sample app - so you *will* find bugs. Trust me. This demo is *just-enough-complete* that it allows you to run, but don't let that shiny exterior fool you, inside, it's rough. Also - I recognize that intentionally building a page of nothing but iframes, and having them communicate back and forth via message bus is not your everyday use-case. This is partly for fun, and partly for the time(s) you actually do need to dive deep into cross-frame messaging.

### How Does It Work?
* clone this project
* run `npm install` to install dependencies
* run `npm start` to run the app
* browse to [http://localhost:8080](http://localhost:8080)
* At the top right you'll see a button labelled "initialize" - click it. (You can optionally change the default search string from "JavaScript" to something else)
* the client will emit the search info to the node process, which will then kick off a search against Twitter's public API (so no creds are needed at this point).
* The server side search of twitter will then be acted on by a couple of "processors" that will generate messages that eventually get sent down to the client (roughly every 10 seconds).
* The client's "communication iframe" (explained below) receives the messages from the server and, via postal.xframe, publishes the messages to the parent and other iframes.

### The iframes
Each iframe "widget" can be found under public/js/widgets, and each has it's own "*main.js" which configures postal.xframe (and more) in order to receive messages and react to incoming data.

#### Comm
Acts as the communication pipeline for all the other assets in the page. Multiple iframe-based widgets that make their own http calls is one thing - but if they each open a socket connection to the same back end, it's recipe for scale-fail. This iframe demonstrates that it's possible to create multiple iframe-based widgets/components that share a common communication infrastructure.

#### Stream
A frakensteined-Backbone setup that populates a "CollectionView" of tweets returned from the search.

#### Language Stats
My first (and mostly horrid) attempt at using Raphael.js. One of the server side "processors" calculates the percentage of the languages represented in the tweets and publishes the results, which get sent to the client (via the Comm iframe). Each time results arrive, a new pie chart is rendered. (I'm sure there's a way to update the existing graph, rather than nuking it from orbit each time - if you know of a way, please let me know.)

#### Hashtag Stats
This uses a fun [canvas-based tag cloud](http://www.goat1000.com/tagcanvas.php) to create a spherical tag cloud of the hashtags represented in the search results. For fun, I used Knockout.js to update an unordered list (which the tag cloud plugin then uses to create the tags in the canvas).