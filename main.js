let mazeData = null;
let svg = null;
let nodes = null;
let tooltip = null;

// Initialize the maze visualization
function initMaze() {
    svg = d3.select("#maze");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    
    // Create grid lines
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    // Create tooltip
    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Draw grid lines
    svg.selectAll(".grid-line").remove();
    
    // Vertical lines
    for (let i = 0; i <= cols; i++) {
        svg.append("line")
            .attr("class", "grid-line")
            .attr("x1", i * cellWidth)
            .attr("y1", 0)
            .attr("x2", i * cellWidth)
            .attr("y2", height);
    }

    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
        svg.append("line")
            .attr("class", "grid-line")
            .attr("x1", 0)
            .attr("y1", i * cellHeight)
            .attr("x2", width)
            .attr("y2", i * cellHeight);
    }

    return { svg, width, height, rows, cols };
}

// Update the maze visualization
async function updateMaze() {
    const { svg, width, height, rows, cols } = initMaze();

    try {
        const response = await fetch('/generate_maze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rows, cols })
        });
        
        mazeData = await response.json();
        
        // Update nodes
        nodes = svg.selectAll(".node")
            .data(mazeData.world.flat(), (d, i) => i);
        
        nodes.exit().remove();
        
        const nodesEnter = nodes.enter()
            .append("rect")
            .attr("class", "node")
            .attr("width", width / cols - 2)
            .attr("height", height / rows - 2)
            .attr("fill", "#4a90e2")
            .on("mouseover", function(event, d) {
                const row = Math.floor((event.target.getAttribute("data-index") / cols));
                const col = event.target.getAttribute("data-index") % cols;
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Node: (${row}, ${col})`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        nodesEnter.merge(nodes)
            .attr("x", (d, i) => (i % cols) * (width / cols))
            .attr("y", (d, i) => Math.floor(i / cols) * (height / rows))
            .attr("data-index", (_, i) => i)
            .attr("fill", d => d === 0 ? "#000" : "#4a90e2");

    } catch (error) {
        console.error("Error generating maze:", error);
        alert("Failed to generate maze. Please try again.");
    }
}

// Find shortest path
async function findPath() {
    const start = parseInt(document.getElementById("start").value);
    const end = parseInt(document.getElementById("end").value);
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);

    if (isNaN(start) || isNaN(end) || isNaN(rows) || isNaN(cols)) {
        alert("Please enter valid node numbers and generate a maze first");
        return;
    }

    if (start === end) {
        alert("Start and end points must be different");
        return;
    }

    try {
        const response = await fetch('/find_path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                world: mazeData.world,
                start,
                end
            })
        });

        const result = await response.json();

        if (result.error) {
            alert(result.error);
            return;
        }

        // Update path information
        document.getElementById("pathDetails").textContent = 
            `Shortest path: ${result.path.join(' → ')}\n` +
            `Total distance: ${result.path.length - 1}`;

        // Update nodes with path visualization
        nodes.each(function(d, i) {
            const node = d3.select(this);
            
            // Reset all nodes to default color
            node.attr("fill", mazeData.world.flat()[i] === 0 ? "#000" : "#4a90e2");
            
            // Highlight start and end nodes
            if (i === start) {
                node.attr("fill", "#00ff00");
            }
            if (i === end) {
                node.attr("fill", "#0000ff");
            }
            
            // Highlight path nodes
            if (result.path.includes(i)) {
                node.attr("fill", "#ff4444");
            }
        });

    } catch (error) {
        console.error("Error finding path:", error);
        alert("Failed to find path. Please check your inputs and try again.");
    }
}

// Event listeners
document.getElementById("generateMaze").addEventListener("click", updateMaze);
document.getElementById("findPath").addEventListener("click", findPath);

// Initial maze generation
updateMaze();
