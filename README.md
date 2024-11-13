# Chorus Interview

## About this Interview


## Tech Stack

- React UI
- Emotion CSS
- Typescript
- Node/NestJS Backend
> I can't execute pm2!
2. `npm install pm2 -g`
> Note: The API and React server will automatically watch for changes.
Use `pm2 logs` to see the logs from all processes.
Use `pm2 stop all` to stop the servers.
Use `pm2 delete all` to delete the entry from the pm2 process list.

- NX Monorepo
- Github Actions CI
- PostgreSQL Database
Use whatever tool you'd like to connect to the database.
[We recommend DataGrip.](https://www.jetbrains.com/datagrip/)
psql 
- Docker / Docker Desktop
3. [Install Docker / Docker Desktop](https://www.docker.com/products/docker-desktop/)
-- colima



-
We want to create a way to select 6 Pokémon to be on our team.

The UI should allow the user to:

1. View a list of the first 150 Pokémon
-- pagination 
2. Select from the list of Pokémon
-- toggle the selection
3. Submit the Pokémon that we have selected to the backend.
-- in real time

**It does not have to be a beautiful UX experience. We're aiming for functional.**
-- UI

### Completion Criteria

Database Requirements

- There should be a Profile table
- There should be a Pokémon table
- There should be a relationship between Pokémon and Profiles.
-- entity represents a database table
-- in Entity Relationship rdb theory

UI Requirements

- Show a list of the first 150 Pokémon
-- load 150 images at one time?
 -- in batches?
 -- cache
- Show selectable Profiles
-- is this a admin ui? so that a super user can assign pokemons to a profile?
-- or, the UI is for a normal user, who can only select pokemon for herself?
- Select a profile, and choose up to 6 Pokémon.

API Requirements

- Return pokemon
- Create Profiles
- Handle receiving Pokémon related to Profiles
-- this is m:n multi to multi relationship in the relational database

## Submission Criteria

All of your work should be located in a Github Repo.

> The requirements are confusing. I'm stuck.

Contact the hiring manager, and inform them of the situation. Be specific and clear about your concerns or issues.

