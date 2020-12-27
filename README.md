<h1>Blog App</h1>
It is a blog application where you can read posts and list them by categories.
The blog also has a login and registration system, where you can choose between two levels of access: user and administrator.
The user can only read the posts, but administrators can create, edit or delete posts and categories.
It also has an authentication system using passport.js middleware.

<h2>Technologies used:</h2>
<ul>
  <li><b>Express.js:</b> To structure the web application.</li>
  <li><b>Handlebars:</b> To create the html pages dynamically.</li>
  <li><b>MongoDB:</b> NoSQL Database.</li>
  <li><b>Mongoose:</b> To establish a connection with MongoDB.</li>
  <li><b>Bootsrap:</b> To create the front end of the application in a more simplified way.</li>
  <li><b>Passport.js:</b> To authenticate and protect user data.</li>
</ul>

<h2>How to install and run the project:</h2>
<h3>1. Install dependencies</h3>
<p>Run <code>yarn install</code> or <code>npm install</code> on application folder, this command will install the project's dependencies.</p>

<h3>2. Create a env file</h3>
<p>Create a file named <code>.env</code> and, inside of it, place this:</p>
  
    PORT=[PORT]
    SECRET=[SECRET]
  
<p>Where:</p>
  
<ul>
    <li>[PORT] is which port you want the server to run on.</li>
    <li>[SECRET] is the key to generate the session.</li>
</ul>
  
<h3>3. Running</h3>
<p>The command to run this project is <code>node app.js</code>.</p>
<p>You will find the project on <code>localhost:[PORT]</code>.</p>
