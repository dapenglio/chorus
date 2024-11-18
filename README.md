# Project Summary

## Repository Location
You are already here, https://github.com/dapenglio/chorus .

No new libraries are required; the repository is expected to run with `pm2 start` following the original instructions from the previous README.

Open http://localhost:4200/ in a browser.

## Development Environment

During my development, I avoided using PostgreSQL inside Docker. Details are explained below. After completing the development phase, I reverted the `startDatabase()` behavior to run database inside a Docker container, hoping everything would still work smoothly. Please let me know if any issues arise.

### What I Did

I am working on a company laptop where it is hard to set up the needed development environment. Although I could use a personal laptop, that would further fragment my time. Therefore, I decided to develop within Docker. After experimenting with both Docker-in-Docker (DinD) and Docker-out-of-Docker (DooD), here are the main changes I made:
1. **Stopped Using PostgreSQL Docker Inside the Code**: Instead, I used a PostgreSQL image and manually set up the database.
2. **Set Up Git Inside the Container**.
3. **Enable The Environment**: Ran the container with the following command for debugging purposes:
   ```
   docker run -p 4200:4200 -p 4300:4300 -p 4211:4211 -p 3000:3000 -it nativepg /bin/bash
   ```
4. **Network Configuration**: Listened on `0.0.0.0` instead of `localhost` to make services accessible from my laptop.
5. **Enabled CORS**: Made changes in the project server to allow CORS.
These modifications do not prevent you from running the project directly on your computers.

## Discussions

There are a few aspects I would like to discuss before the implementation. However, due to limited time, I made one implementation first; now list my concerns here.

### UI Requirements

- **Assigning Pok_mons to Profiles**: We want to create a way for users to select up to six Pokémon for a profile
  - Should we create a UI for one player/profile that logs in as the current user?
  - Do we need a registration webpage so that we can create new profiles, or is this an admin UI where we can manage multiple profiles?
  - My current implementation targets an admin UI for managing multiple profiles.

- **Displaying Pokémon**: Displaying the first 150 Pokémon at once is overwhelming, even on a 15-inch laptop screen. How much information should we display for each Pokémon?
  - Do we need a grid view, pagination, or another form of summarization?
  - Pagination on the UI or always show all 150 Pokemons?
  - load 150 images at one time? in batches? show we allow caching of them in browsers?  In the project, I load the 150 Pokemons in batches. In the future when images are cached in browsers, we don't need batch loading.
  - Any personalization, different sets of the first 150 Pokemons for different Profiles? If we always show the same set of Pokemons, when will other Pokemons be presented to users?
  - the UI cannot load all iamges; when we monitor the network traffic, we can find out that some requests were retruned empty responses quietly; in other words, the hehavior of the 3rd party servers or quality of service is beyond our control.
  - ...
- **Handle receiving Pok_mon related to Profiles**: 
  - Update database in real time?  This may be a security weakness. What if multi users add and remove Pokemons frequently?


## Database and APIs

- **Pokemon**
  - The data is relatively static, with just over a thousand Pokémon and potentially thousands of variants. All of them can be efficiently cached in PostgreSQL. There is no concern of database performance.
  - Store all images on our own server.
  - Is copyright a concern? This may need to be addressed.

- **Profile**
  - There may be thousands of Profiles, which is a manageable data volume. The data is mostly static and can be easily cached in PostgreSQL.
  - The read pressure on PostgreSQL is minimal, making an explicit caching layer unnecessary.

- **Handling Pokémon Related to Profiles**
  - Profile-to-Pokmeon represents a many-to-many (m:n) relationship in the relational database.
  - In Entity-Relationship modeling, entities represent concepts, and relationship tables depict how these entities are connected.  Does the term "entity" here represent a database table? I chose to name the class `ProfilePokemon` instead of `ProfilePokemonEntity` to emphasize that it represents a relationship, rather than a standalone entity.
  - If there are 1K Pok_mons and 1K Profiles, there are up to 6M rows in this table. With this data volume, we start to concern about database performance. Still, this is not a big issue.

### Data Preparation in Database

In the project server, there are two configurations: development and production.  There may be three different environments:

- **Local/Development**: We start PostgreSQL inside a Docker container and fill it with test data during bootstrap, as it is a completely new instance each time.
- **Staging**: We assume there is an existing staging database filled with all required artifacts. This environment allows for modifications or data loss, it may be maintained by infrastructure engineers and filled by product designers.
- **Production**: The production database contains customer data, requiring strict permissions and control over what operations can be executed. We also need to maintain audit logs of actions: who did what, and when.

Additional libraries are required to support multiple environments effectively. I haven't implemented multi-configuration support yet, but this could be crucial in real life development.

## CORS and Security

- Loading 150 images from a third-party website is unreliable, as the server may stop responding as expected, which is happening in this project.
- In production, APIs may be deployed on a separate server, and artifacts distributed to others, requiring consideration of CORS policies.
- Request authentication and rate-limiting of API calls should be considered to secure the system.
- **Caching**: Since Pokémon data is static, caching it indefinitely could be an effective approac, even though its data volume is small.

## Testing

- I conducted manual testing during development.
- There is currently no automated test code in the repository.
- Defining specifications is a valuable way to communicate requirements and expectations. It is worth the effort to formalize these as part of the development process.


## Tech Stack

- **React UI**
  React is the go-to choice for building user interfaces

- **Emotion CSS**
  Emotion is pretty handy when it comes to styling. It keeps code clean and easy to read.

- **TypeScript**
  TypeScript is great for making code more readable and maintainable, enables "Code as Documentation." It helps with JavaScript's over-flexibility.

- **Node/NestJS Backend**
  - The original README missed mentioning `npm install pm2 -g`. That might explain why someone had issues with `pm2` not being available.
  - The original README says, "The API and React server will automatically watch for changes." But I saw a message "NX Daemon is not running. Node process will not restart automatically after file changes." Online articles explains that `pm2` doesn't use the NX caching mechanism, so it can't smartly monitor changes that need rebuilding. One workaround is to let `pm2` monitor changes in a directory, but then what happens if I change static resource files? I run `pm2 stop all && pm2 delete all` and then restart to get everything updated.

- **NX Monorepo**
  A monorepo is like a traditional GitHub account, and each project in the monorepo is like a traiditional Github repository. It keeps everything organized in one place.

- **GitHub Actions CI**
  We're not using GitHub Actions in this project. I use it at my current company. CI/CD add costs, so right now, we only compile commits on the main branch.

- **PostgreSQL Database**
  Based on what I found online, as of November 2024, there are around 1,025 officially recognized Pokémon species. If we have ~1K Pokémon and thousands of profiles, that comes out to something like 6 x 1K x 5K = 30 million rows in the database. Not huge, totally manageable.
  - We're using an ORM here, but I am not a big user of ORMs in general.
    - Prepared statements are a safe way to handle data.
    - I haven't needed to write many SQL statements in one project, also it is nice to fine-tune individual queries when needed.
    - Creating tables, setting up indices and keys, and optimizing performance are important, especially for large databases.

- **Database Connection Tools**
  - I use `psql` to connect to the database
  - I prefer command line tools as they work great with Linux pipelines and keep things efficient.

- **Docker / Docker Desktop**
  - Docker Desktop starts charging if you work for a company of a certain size. I use **Colima** here; for basic Docker operations, there is no difference between Docker Desktop and Colima.


