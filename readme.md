## Table of Contents
- [Project Title](#on-the-house)
- [Project Description](#project-description)
- [Technologies Used](#technologies-used)
- [Listing of File Contents of folder](#file-contents-of-folder)
- [How to install or run the project](#how-to-run-project)
- [How to use the product](#how-to-use-product)
- [Credits, References, and Licenses](#credits-and-references)
- [Contact Information](#contact-information)


<br>


# On The House


## <a id="project-description">Project Description (One Sentence Pitch)</a>
> Our project, BBY 22 is developing an app that connects those in need of items to those who can give away items, to help reduce our carbon footprint one transaction at a time by reducing waste through reusing used items.


<br>


## Technologies Used
* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express
* Database: MySQL
* Hosting: Heroku


<br>


## File Contents of Folder

```
├─   .gitignore 
├─   database.js 
├─   database.sql 
├─   package-lock.json 
├─   package.json 
├─   README.txt 
├─   readme.md 
│ 
├─── app              #HTML folder
    / account.html 
    / dashboard.html 
    / editpost.html 
    / game.html 
    / listings.html 
    / login.html 
    / main.html 
    / message.html 
    / myBookmarks.html 
    / mylistings.html 
    / newPost.html 
    / newPostPhoto.html 
    / postMessage.html 
    / profile.html 
    / updateProfile.html 
    / viewPost.html 
│
├─── node_modules 
└─── public 
        ├───css                 #Styles folder
            / account.css 
            / dashboard.css 
            / editpost.css 
            / game.css 
            / login.css 
            / main.css 
            / message.css 
            / newPost.css 
            / newPostPhoto.css 
            / postMessage.css 
            / profile.css 
            / viewPost.css 
        │
        ├───imgs                #Images folder
            / background2.jpg 
            / background3.jpg 
            / background4.jpg 
            / On the House Logo.jpg 
            / OTH-favicon.ico 
            / stickman1.png 
            / stickmangame.png 
           │
           └─── uploads         #Folder for images uploaded on the app
                / userPic-user-pic-none.jpg
        │
        └─── js                 #JavaScript folder
            / clientDashboard.js 
            / clientEditPost.js 
            / clientGame.js 
            / clientListings.js 
            / clientLogin.js 
            / clientMain.js 
            / clientMessage.js 
            / clientMyBookmarks.js 
            / clientMyListings.js 
            / clientPostMessage.js 
            / clientProfile.js 
            / clientSignUp.js 
            / clientUpdateProfile.js 
            / clientViewPost.js 
            / newPost.js 
            / newPostPhoto.js 
```


<br>


## <a id="how-to-run-project">How to install or run the project</a>
Prerequisites:
- Have a Git and GitHub account

You will need to install:
- [Node package manager](https://nodejs.org/en/download/) (npm)
- [Xampp](https://www.apachefriends.org/download.html) (comes with MySQL)
- [Visual Studio Code](https://code.visualstudio.com/download)
  - Good to have the following extensions: HTML CSS Support, HTML Hint, Beautify 
- [Heroku](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli)

Cloning the repository:
- Open Command Prompt 
- `cd` into the folder you want the repository stored in
- Type:  `git clone https://github.com/MonB003/2800-202210-BBY22.git`

In your folder, you will need to install the following node packages:
- npm install express 
- npm install express-session 
- npm install jsdom 
- npm install mysql2
- npm install multer
- npm install socket.io
- npm install sanitize-html

Running the project:
1. Open the Xampp control panel and click ‘Run as administrator’.
2. Click the ‘Start’ button to the right of MySQL. This will connect to the database.
3. Open Command Prompt
4. `cd` into your project folder
5. Type `node database`
6. Go to localhost:8000 on any browser
7. This will direct you to the login page, where you can either login or signup (if you don’t have an account).
8. Once successfully logged in, you will be directed to the main page, where you can try out various features listed in the section below.


<br>


## <a id="how-to-use-product">How to use the product (Features)</a>
### To create a post for an item to give away:
- After logging in, click on the button on the main page that says “New Post”
- Fill in the details of the item, which include a title, city, description, and click the “Next: Add a Photo” button
- The user can upload an image of the item and click the “Upload Photo” button
- The new post will be displayed on the main page on a most-recent basis for all users of the application to view. 

### To view the details of a post:
- Click on the title of the post to view the description, item status, post owner, and a message button for sending that user a private message.
- Users can view and sort posts based on date and availability, and even search for posts based on title or city. 
- If users want to save a specific post, they can bookmark it from the main page by selecting the “Add to bookmarks” dropdown option. They can view all their bookmarked posts by clicking on the Bookmarks button in the navbar
- To unsave a bookmark, go to the Bookmarks page and select the “Remove Bookmark” dropdown option. It will immediately be removed from the page

### Messaging a post owner to potentially reserve their item:
- Users can send a private message to any user that is not themself. 
- To do this, they can click on the message icon on another person’s post. 
- They will be directed to a private message page where they can send that user a message. If they’ve sent them a message before, all past messages will automatically be displayed on the page.
- Once a user has sent or received a message from another user, that user will appear under their contacts. 
- To view all contacts to message, click on the “Message” button on the main page navbar. This will redirect to a message page with a list of all the user’s contacts on the left side of the page. 
- To message a user, select one of the users listed, and the message input field will be enabled.

### Editing a post:
- Post owners can make edits to their posts.
- Click on the my listings button in the navbar. 
- Click the “Edit” button for a specific post
- Users can edit the post title, city, and description. 
- They can update the status of their item by selecting one of the dropdown options. 
  - When selecting the “reserved” option, the user must type in the username of another user and click the “Reserve” button. They will not be able to save their post until a valid username has been entered
  - Note: in order to change the status of an item to “collected”, it has to be “reserved” first.  

### Profile page:
- All users have their own profile page:
- They can make edits to their information, including their first and last name, username, city, email, password
- They can change their profile picture by uploading another image. 

### Rating another user:
- When an exchange is complete, users can rate their experience by navigating to the other’s profile page. 
- To rate another user:
  - Go to their profile page by clicking on the title of their post, then clicking the “View Profile” button
  - There are 2 rows of stars. The first one is that user’s current rating. The second is for you to rate.
  - Click one of the 5 stars on the second row to give a rating. After clicking one of the stars, press the “Save” button
  - The rating you submitted will appear next to the first row of stars


<br>


##  <a id="credits-and-references">Credits, References, and Licenses</a>

### Credits:
- Monica Bacatan, Set 2B
- Colleen Vu, Set 2B
- Alan Fung, Set 1C
- Taswinder Singh Dhaliwal, Set 1C

### References:
Images:
- [Logo - House roof icon](https://thenounproject.com/icon/house-roof-945733/)
- [Logo - Handshake icon](https://www.vecteezy.com/vector-art/4999401-handshake-icon-like-good-deal-simple-flat-style-trend-modern-logotype-graphic-design-isolated-on-white-background) 

YouTube Tutorials:
- [Messaging feature](https://www.youtube.com/watch?v=Ozrm_xftcjQ) 
- [Fetch API tutorial (basic syntax for post requests)](https://www.youtube.com/watch?v=Kw5tC5nQMRY)
- [Popup confirmation messages](https://www.w3schools.com/howto/howto_css_delete_modal.asp)
- [Easter Egg game](https://www.youtube.com/watch?v=Sz7ugHHlvX4&list=PL1ATIExhr18A9eWbGdwOady_sfE5VkHur&index=4)


<br>


## Contact Information
- Monica Bacatan - mbacatan1@my.bcit.ca
- Colleen Vu - colleen_vu97@hotmail.com
- Alan Fung - afung63@my.bcit.ca
- Taswinder Singh Dhaliwal - taswindersinghdhaliw@my.bcit.ca
