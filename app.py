from flask import Flask, render_template, request, jsonify
import json
from maze import Maze

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_maze', methods=['POST'])
def generate_maze():
    data = request.json
    rows = data.get('rows', 20)
    cols = data.get('cols', 20)
    
    # Create a grid with all paths open
    world = [[1 for _ in range(cols)] for _ in range(rows)]
    
    return jsonify({
        'world': world,
        'rows': rows,
        'cols': cols
    })

@app.route('/find_path', methods=['POST'])
def find_path():
    try:
        data = request.json
        world = data.get('world')
        start = data.get('start')
        end = data.get('end')
        
        if not world or not start or not end:
            return jsonify({'error': 'Missing required parameters'}), 400
            
        maze = Maze(world)
        path = maze.dijkstra(start, end)
        
        return jsonify({
            'path': path,
            'world': maze.shortest_path(start, end)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
