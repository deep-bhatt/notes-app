## README.md contains notes relevant to this assignment

Version Control:
  - VC is implemented using database triggers and functions
  - No separate endpoint is needed for this feature

Security:
  - Uses JWT token which expires in 1 day after being issued
  - To prevent SQL Injections, we use parameterized SQL queries
  - Every CRUD endpoint has authentication and authorization checks

Performance and Scalability:
  - JWT helps with scaling system horizontally since they're stateless
  - Backend uses NodeJS which is pretty good at handling I/O bound tasks due to its event driven nature
  - Additionally, we can make use of PM2 - process manager as well as load balancer - to scale NodeJS application vertically
  - Uses database connection Pool - prevents init of TCP connection to database on every user request
