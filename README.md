# Getting Started
Run the app on your local server(localhost:5500).

**API used from the following link.** https://tcgdex.dev/

# Description

When clicking the "Series" button, a list of all Pokémon Card series will be displayed.

![]()

Clicking on one of these series will then display all the Pokémon Card sets that belong to that series.

Clicking on a set will then display the Pokémon Cards of the chosen set.

When Clicking the "Sets" button, the list of all Pokémon Card sets will be displayed.

Clicking on a set will then display the Pokémon Cards of that set. 

Hovering over a card triggers a short animation then the option of holding down a click to enlarge the card for better viewing.

Users will have the option to search by Pokémon name with the search bar, displaying all cards of that name.

Clicking on the "Account" button will display a "Sign In" button.

Users will be able to sign in to their account if they have an existing account and if not they can create an account by clicking on the provided link.

When signed in users can add cards of their choosing to their "Favorites" list.

The "Favorites" list becomes accessible after signing in by clicking the "Account" button, then selecting "[Username]'s Favorites".

The "Favorites" list will then display all previously added cards with the option of deleting any card the users desires.


# Files

* index.html : This file contains the HTML code for the app.
* style.css : This file contains the CSS code for the app.
* script.js : This file contains the JavaScript code for the apps functionality. 
* server.js : This file contains the code for caching responses and all the API GET's and POST's. 
* db.js : This file contains the code for the MongoDB database connection.
* user.js : This file contains the code for the Schema named User for the database.
* images Folder : This folder contains the images which are used in the README, icon and homepage.