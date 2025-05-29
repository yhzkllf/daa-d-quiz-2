from flask import Flask, render_template, jsonify
from maze import Maze

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate_maze/<int:rows>/<int:cols>')
def generate_maze(rows, cols):
    # Create a grid with all paths open (1)
    WORLD = [[1 for _ in range(cols)] for _ in range(rows)]
    
    # Convert to graph data format
    graph_data = {
        'nodes': [],
        'edges': [],
        'world': WORLD
    }
    
    # Add nodes
    for i in range(rows):
        for j in range(cols):
            node_id = i * cols + j
            graph_data['nodes'].append({
                'id': node_id,
                'x': j,
                'y': i,
                'status': 'path'  # path, wall, start, end, visited, path
            })
    
    # Add edges between adjacent nodes
    for i in range(rows):
        for j in range(cols):
            node_id = i * cols + j
            
            # Add right neighbor
            if j < cols - 1:
                graph_data['edges'].append({
                    'source': node_id,
                    'target': node_id + 1,
                    'weight': 1
                })
            
            # Add bottom neighbor
            if i < rows - 1:
                graph_data['edges'].append({
                    'source': node_id,
                    'target': node_id + cols,
                    'weight': 1
                })
    
    return jsonify(graph_data)

@app.route('/find_path/<int:rows>/<int:cols>/<int:start>/<int:end>/<string:world>')
def find_path(rows, cols, start, end, world):
    try:
        # Convert string representation of world back to matrix
        world_matrix = [[int(cell) for cell in row.split(',')] for row in world.split(';')]
        
        # Create maze and find path
        maze = Maze(world_matrix)
        path = maze.dijkstra(start, end)
        
        # Get the updated world with path marked
        updated_world = maze.shortest_path(start, end)
        
        return jsonify({
            'path': path,
            'updated_world': updated_world
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True)
