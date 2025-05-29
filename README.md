# Dijkstra's Algorithm Visualizer

An interactive web application that demonstrates Dijkstra's algorithm for finding the shortest path in a grid-based maze. Built with Flask, D3.js, and Python.

## Features

- Interactive grid-based maze visualization
- Real-time path finding using Dijkstra's algorithm
- Configurable grid size (5x5 to 20x20)
- Visual feedback for shortest path
- Node tooltips showing coordinates
- Modern, kid-friendly UI

## Usage

1. **Generate a Maze**:
   - Adjust the grid size using the "Rows" and "Columns" inputs
   - Click "Generate Maze" to create a new grid

2. **Find Shortest Path**:
   - Enter valid node numbers for start and end points
   - Click "Find Shortest Path" to see the algorithm in action
   - The path will be highlighted in red

3. **Visual Feedback**:
   - Green nodes: Start point
   - Blue nodes: End point
   - Red nodes: Shortest path
   - Gray nodes: Grid paths
   - Black nodes: Walls

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
4. Open your browser and navigate to `http://localhost:5000`

## Technology Stack

- Backend: Python Flask
- Frontend: HTML5, CSS3, JavaScript
- Visualization: D3.js
- Algorithm: Dijkstra's shortest path algorithm

## License

This project is licensed under the MIT License - see the LICENSE file for details.
