# All of your work should be located in a Github Repo.
https://github.com/dapenglio/chorus
No new libraries are needed; the repo is expected to run with `pm2 start`.

**During my development, I avoided using postgre inside a docker. (Details will be talked later.)
Finally, I rolled back the behavior of startDatabase() inside a docer container, with the hope that everything still runs.
Everything should run. If not, please share with me the error details.

## What I did
I am working on a company laptop where I cannot easily setup a React development environment.
I tried to enable Docker inside a Docker, played ith Docker-in-Docker (DinD) and Docker out of Docker (DooD), 
Finally, I
- stopped the posgres Docker inside the code 
- used a postgre image,
- set up git inside it, 
- `docker run -p 4200:4200 -p 4300:4300 -p 4211:4211  -p  3000:3000 -it nativepg  /bin/bash`
- enabled CORS in project server
Ideally, there may be different configs for different environments:
- local/dev, we start pg inside a docker and filling test data into the database
- staging, we assume that there is a staging database that has already be filled with all artifacts, but we can afford to modify or lose the artifacts
- prod, database may contain data that belong to customers and we need strict permission to control what operations can be done by which code, we may need to keep audit logs
It seems that it needs additional libaries to support multi environments. For this project, we don't work on it.

# Discussion

## Tech Stack
- React UI
  A dominating popular standard.
- Emotion CSS
  this seems convenient
- Typescript
  ts enables "Code as Documentation"; one shortcoming of Javascript is its over flexibility. ts cures it.
- Node/NestJS Backend
  - in the original README, `npm install pm2 -g` is missing, maybe that is why someone reported that pm2 was not available?
  - This sentence shows in the original REAME, "Note: The API and React server will automatically watch for changes." However, I am seeing "NX Daemon is not running. Node process will not restart automatically after file changes."  Online searches showed that pm2 didn't use Nx cache mechanism so that pm2 could not intelligently monitor changes that deserve a rebuild. One solution is to let pm2 monitor file content changes in adirectory. However, if so, what if I modify static resource files? 
 Unfortunately, I found that sometimes I needed to pm2 stop/delete first and then start it to see the changes.
- NX Monorepo
  with Monorepo, a repo is comparable to a normal github account, and a project is comparable to a repo, in the traditional setup.
- Github Actions CI
  We are not using it in this project; I am using github actions in my current company.
  CI/CD costs money. Now we only compile commits on the main branch.
- PostgreSQL Database
  Online searches showed that "As of November 2024, there are 1,025 distinct Pokémon species officially recognized in the National Pokéde"  If there are ~1K pokemons and thousands of profiles, there are up to 6 x 1K x 5k = 30M rows in the database. It is not a big data volumn. More details on this later.
  ORM is used here.  I don't use ORM intensively. 
  - prepared statment is safe
  - I never needed to write too many sql statements in one project
  - i can fine tune each sql statement if i want to
  - create tables and keys, and fine tune db performance is needed on big databases
- Use whatever tool you'd like to connect to the database.
  - psql is what I am using
  - Personally I prefer command line tools, which enable Linux pipeline.
- Docker / Docker Desktop
  - Docker Desktop charges if you work for a company that is bigger than some predefined size.
  - I use Colima. For basic Docker operations, there is no difference between Docker Desktop and Colima.


## UI Requirements
- "We want to create a way to select 6 Pokémon to be on our team"
  - for a player/Profile who log in, or an admin UI to manage multi profiles?
  - if so, we don't need to be able to create new Profiles; instead, we need a registion webpage
The UI should allow the user to:
**It does not have to be a beautiful UX experience. We're aiming for functional.**
- Show a list of the first 150 Pokémon
  - even on a 15 inch laptop, 150 images is too many
  - load 150 images at one time?
  - in batches?
  - cache
  - personalization?
  - pagination? always the same 150 Pokemons?
  -  Organize pokemons in groups?  Provide a search page to find pokemons? ...
  - the UI cannot load all iamges; when we monitor the network traffic, we can find out that some requests were retruned empty responses quietly
 I didn't copy Pokemon icons to local disk; in a prod env, definitely we will hold the artifacts and own the copyright.

- Select a profile, and choose up to 6 Pokémon.Select from the list of Pokémon
  - toggle the selection
  - highlight visually the selected pokemons  --- what if a selected pokemon is shown at the end of page, how to show it to users?
- Show selectable Profiles
  - is this a admin ui? so that a super user can assign pokemons to a profile?
  - or, the UI is for a normal user, who can only select pokemon for herself?

-  Submit the Pokémon that we have selected to the backend.
  - in real time
  for interview, frequent or excessive toggling is not a concern; in prod environment, with millions of users, detecting and avoid excessive database operations is a concern.
  solution: rate limit,  count of changes to identify suspicious operations, etc

## Database and APIs

- Pokemon
   - Limited static data. With a little over a thousand Pokemons (maybe thousands of variants?), all of them can be cached in Postgres, especially when their info is static.
   - Save all images to the server.
   - Is copyright a concern?
- Profile
  - There may be thousands of Profiles. It is a small data volumn, and almost static. They can be easied caced by Postgres.
  - Read pressure on the Postgre is small, we even don't need a cache layer in front of the rdb.
  - create new ones
- Handle receiving Pokémon related to Profiles
  - this is m:n multi to multi relationship in the relational database
    this is the tricky part; 
  - in Entity Relationship modeling, the relational database theory, an entity is a concept and a relationship table depicts the relationships between entities
  -  does entity here represent a database table? I chose to name the class ProfilePokemon instead of ProfilePokemonEntity, to highlight that the table represents a Relationship.


## CORS and security
- loading 150 images from a 3rd website is not reliable, which may just quietly returns nothing
- in production, we may deploy apis to a separate server, we need to consider CORS 
- there may need request authentication, and rate limit
- caching, I don't expect Pokemons to change over time; if they can be deemed constants, we can set expiration to infinite

