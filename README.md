[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/TZzxOLln)
# CineLocal

##  Overview

This repository represents the culminating project for CSCI 4300 – Web Programming at UGA.  
Our team collaboratively designed, developed, and deployed this full-stack web application using React + Next.js, Node.js and MongoDB. 

---

## Our Team - Group_Name_Here 

| Member Name      | GitHub Username      | Role          |
|------------------|----------------------|---------------|
| Pavan Gadiraju   |                      | Project Leader  |
| Dev Patel        | pateldev1804         | Project Manager   |
| Usman Khan       |                      | Communication Leader    |
|                  |                      | GitHub Captain |

---

## Project Features (Example)

- Authentication & Authorization** (login/sign-up, protected routes)  
- Middleware or Route Protection** for authenticated users  
- CRUD operations** using a database or API  
- Responsive UI** & dynamic navigation bar  

---

## Repository Structure

```
/src
/app → Next.js App Router pages (frontend & API routes)
/components → list components
/models → Mongoose schemas / MongoDB models
/public → Static assets (images etc.)
/design → mockups.md 
/status → WEEKLY_STATUS.md
```

---

## Tech Stack

| Layer             | Technology                                   |
|-------------------|----------------------------------------------|
| Frontend          | React + Next.js (App Router)                 |
| Backend           | Next.js API Routes / Node.js                 |
| Database          | MongoDB + Mongoose                           |
| Styling           | Tailwind CSS ?? / Custom CSS Modules ??      |
| Authentication    | NextAuth.js                                  |

---

## Run the development server

```
npm run dev
```

The project should now be running at:
    http://localhost:3000

## API Endpoints

| Method     | Endpoint                 | Description                                         |
| ---------- | ------------------------ | --------------------------------------------------- |
| **POST**   | /api/login        | Log in a user (email + password).                   |
| **POST**   | /api/signup       | Create a new user account.                          |
| **GET**    | /api/reviews           | Get reviews (by `movieId`, `userId`, or recent 20). |
| **POST**   | /api/reviews           | Create a new review.                                |
| **PUT**    | /api/reviews/[id]      | Update a review (only the owner).                   |
| **DELETE** | /api/reviews/[id]      | Delete a review (only the owner).                   |
| **GET**    | /api/rooms             | Fetch all available rooms.                          |
| **POST**   | /api/screenings/rsvp | Create a new screening (auth required).             |
| **GET**    | /api/screenings        | Get upcoming screenings (filter by movie or host).  |
| **POST**   | /api/screenings | Attend a screening (adds user to attendees).        |
| **GET**    | /api/watchlist         | Get the logged-in user’s watchlist.                 |
| **POST**   | /api/watchlist         | Add a movie to the user’s watchlist.                |
| **DELETE** | /api/watchlist         | Remove a movie from the watchlist.                  |


## Database Models (example)
User
|Field               | Type       | Description                                     |
|--------------------| ---------- | ----------------------------------------------- |
| _id                | ObjectId   | Primary key                                     |
| username           | String     | Unique username (trimmed)                       |
| email              | String     | Unique email, validated                         |
| password           | String     | Hashed password (not selected by default)       |
| watchlist          | ObjectId[] | References to `WatchlistMovie` documents        |
| screeningsHosted   | ObjectId[] | Screenings this user created (`Screening`)      |
| screeningsAttended | ObjectId[] | Screenings this user is attending (`Screening`) |
| createdAt          | Date       | Auto-generated timestamp                        |
| updatedAt          | Date       | Auto-generated timestamp                        |

Review
| Field      | Type     | Description                              |
|------------| -------- | ---------------------------------------- |
| _id        | ObjectId | Primary key                              |
| userId     | ObjectId | Reference to `User` who wrote the review |
| username   | String   | Username displayed with the review       |
| movieId    | String   | TMDB movie ID                            |
| movieTitle | String   | Movie title                              |
| rating     | Number   | Rating from 1–5                          |
| comment    | String   | Review text                              |
| createdAt  | Date     | Auto-generated timestamp                 |
| updatedAt  | Date     | Auto-generated timestamp                 |

Room
| Field        | Type     | Description                                                |
|--------------| -------- | ---------------------------------------------------------- |
| _id          | ObjectId | Primary key                                                |
| building     | String   | One of: MLC, Boyd, Main Library, Brumby, Russell, Creswell |
| roomNumber   | String   | Room identifier within the building                        |
| maxOccupancy | Number   | Maximum number of attendees                                |

Screening
| Field        | Type       | Description                                  |
|--------------| ---------- | -------------------------------------------- |
| _id          | ObjectId   | Primary key                                  |
| host         | ObjectId   | Reference to `User` hosting the screening    |
| movieId      | String     | TMDB movie ID                                |
| movieTitle   | String     | Movie title                                  |
| moviePoster  | String     | URL/path to poster image                     |
| room         | ObjectId   | Reference to `Room` where screening is held  |
| startTime    | Date       | Screening start time                         |
| endTime      | Date       | Screening end time                           |
| attendees    | ObjectId[] | List of `User` IDs attending                 |
| maxAttendees | Number     | Maximum allowed attendees for this screening |
| createdAt    | Date       | Auto-generated timestamp                     |
| updatedAt    | Date       | Auto-generated timestamp                     |

WatchListMovie
| Field        | Type     | Description                                 |
|--------------| -------- | ------------------------------------------- |
| _id          | ObjectId | Primary key                                 |
| userId       | String   | ID of the user who owns this watchlist item |
| id           | Number   | TMDB movie ID                               |
| title        | String   | Movie title                                 |
| poster_path  | String   | Poster image path/URL                       |
| release_date | String   | Movie release date                          |
| createdAt    | Date     | Auto-generated timestamp                    |
| updatedAt    | Date     | Auto-generated timestamp                    |


## Client Routes (example)
| Route                  | Description                  |
|------------------------| ---------------------------- |
| `/`                    | Homepage                     |
| `/login`               | User login                   |
| `/signup`              | User signup                  |
| `/browse`              | User main page               |
| `/movieDetailPage[id]` | Movie Detail page            |
| `/my-reviews`          | View all user reviews        |
| `/host`                | Host a screening for a movie |
| `/watchlist`           | User watchlist               | 
  
## Future Improvements
- User Profiles 2.0 – Add profile pictures, badges, and personalized movie stats.
- Real-Time Chat – Let users chat inside screening rooms or during public watch parties.
- Advanced Search & Filters – Search by rating, genre, room availability, or screening time.

## Acknowledgements
- A huge thanks to Professor Stephens & TA team for guidance throughout CSCI 4300.
