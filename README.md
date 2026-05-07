
# Cosmic Coffee Catalog

The Coffee Bean Web App is an interactive platform designed to help users explore various coffee bean varieties. It provides detailed insights into each bean's origin, flavor profile, genetic lineage, and growth altitude. Additionally, the app offers personalized recommendations for similar coffee bean products, akin to how Spotify suggests music tracks.

## Demo Video
[https://youtu.be/au9oAL0jE3k](https://youtu.be/au9oAL0jE3k)

## Features

- **Visual Exploration**: Navigate through a rich database of coffee bean varieties with intuitive visual tools.
- **Personalized Recommendations**: Input a coffee bean product to receive suggestions for similar beans based on shared characteristics.
- **Comprehensive Bean Profiles**: Access detailed information on each bean, including its origin, flavor notes, genetic background, and cultivation altitude.

## Technologies Used

- **Frontend**: TypeScript
- **Backend**: Java
- **Database**: MySQL
- **Scripting & Data Processing**: Python
- **Containerization**: Docker

## Docker Images

Pre-built Docker images for the application are available at:  
[Docker Hub](https://hub.docker.com/repositories/michaelvanvuuren)

## Repository Structure

```
big-data-group-3/
│
├── backend/                     # Java backend source code
├── frontend/                    # TypeScript frontend application
├── TempData/                    # Sample and temporary data files
├── CoffeeApplication.ipynb      # Data processing with AI Powered Recommendation system Jupyter Notebook 
├── backend.zip                  # Archived backend code
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## Getting Started

### Prerequisites

- Docker
- (Optional) Docker Compose

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/michael-van-vuuren/big-data-group-3.git
   cd big-data-group-3
   ```

2. **Build and Run with Docker**
   ```bash
   docker build -t coffee-bean-app .
   docker run -p 3000:3000 coffee-bean-app
   ```

   Or with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. **Access the App**
   Open your browser and go to:  
   [http://localhost:3000](http://localhost:3000)

## Development & Testing

### Backend

```bash
cd backend
# compile and run with your preferred Java toolchain
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Data Analysis

Open the `CoffeeApplication.ipynb` in Jupyter Notebook to explore or run the data processing steps.

## Recommendation System

The web app includes a built-in recommendation engine that analyzes user input (such as a selected coffee bean product) and suggests similar coffee beans. The similarity is calculated based on shared characteristics like:

- Flavor profile  
- Altitude of growth  
- Genetic lineage  
- Origin country  

## Project Presentation Slides

Want the full story? Check out our presentation slides for a comprehensive overview of the project’s goals, architecture, and implementation details:

[Project Slides (Google Drive)](https://o365coloradoedu-my.sharepoint.com/:p:/r/personal/meko4807_colorado_edu/Documents/Big%20Data%20Presentation.pptx?d=w27a08705fa834a74828745ef4b151a30&csf=1&web=1&e=JlapEE)
