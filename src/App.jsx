import React, { useRef, useEffect, useState, useCallback } from 'react';

// Family data - Updated to use 'branchColor' for first-generation children
const familyData = [
    { id: 'central_ancestor', name: 'Central Ancestor', dateOfBirth: '1900-01-01', parent: null, color: '#FFDDC1' }, // Central ancestor's color

    // Children (Generation 1) - Assign a distinct branchColor for each child's subtree
    { id: 'child1', name: 'Child 1', dateOfBirth: '1925-05-10', parent: 'central_ancestor', branchColor: '#C1DFFD' }, // Blueish branch
    { id: 'child2', name: 'Child 2', dateOfBirth: '1928-11-20', parent: 'central_ancestor', branchColor: '#D1C1FD' }, // Purplish branch
    { id: 'child3', name: 'Child 3', dateOfBirth: '1932-03-15', parent: 'central_ancestor', branchColor: '#A1E8F0' }, // Cyanish branch
    { id: 'child4', name: 'Child 4', dateOfBirth: '1935-08-01', parent: 'central_ancestor', branchColor: '#B0E0E6' }, // Light Blueish branch
    { id: 'child5', name: 'Child 5', dateOfBirth: '1938-02-28', parent: 'central_ancestor', branchColor: '#FFC1D1' }, // Pinkish branch

    // Grandchildren (Generation 2) - these will inherit color from their parent's branch
    { id: 'grandchild1_1', name: 'Grandchild 1.1', dateOfBirth: '1950-07-22', parent: 'child1' },
    { id: 'grandchild1_2', name: 'Grandchild 1.2', dateOfBirth: '1953-09-01', parent: 'child1' },
    { id: 'grandchild1_3', name: 'Grandchild 1.3', dateOfBirth: '1956-04-18', parent: 'child1' },
    { id: 'grandchild2_1', name: 'Grandchild 2.1', dateOfBirth: '1955-02-14', parent: 'child2' },
    { id: 'grandchild2_2', name: 'Grandchild 2.2', dateOfBirth: '1958-06-25', parent: 'child2' },
    { id: 'grandchild3_1', name: 'Grandchild 3.1', dateOfBirth: '1960-01-05', parent: 'child3' },
    { id: 'grandchild3_2', name: 'Grandchild 3.2', dateOfBirth: '1963-08-11', parent: 'child3' },
    { id: 'grandchild3_3', name: 'Grandchild 3.3', dateOfBirth: '1965-12-01', parent: 'child3' },
    { id: 'grandchild4_1', name: 'Grandchild 4.1', dateOfBirth: '1962-04-20', parent: 'child4' },
    { id: 'grandchild5_1', name: 'Grandchild 5.1', dateOfBirth: '1968-09-10', parent: 'child5' },
    { id: 'grandchild5_2', name: 'Grandchild 5.2', dateOfBirth: '1970-11-05', parent: 'child5' },

    // Great-Grandchildren (Generation 3) - will inherit color from their parent's branch
    { id: 'greatgrandchild1_1_1', name: 'G-Grandchild 1.1.1', dateOfBirth: '1980-03-03', parent: 'grandchild1_1' },
    { id: 'greatgrandchild1_1_2', name: 'G-Grandchild 1.1.2', dateOfBirth: '1982-05-10', parent: 'grandchild1_1' },
    { id: 'greatgrandchild1_2_1', name: 'G-Grandchild 1.2.1', dateOfBirth: '1983-01-20', parent: 'grandchild1_2' },
    { id: 'greatgrandchild1_3_1', name: 'G-Grandchild 1.3.1', dateOfBirth: '1985-04-05', parent: 'grandchild1_3' },
    { id: 'greatgrandchild2_1_1', name: 'G-Grandchild 2.1.1', dateOfBirth: '1985-07-15', parent: 'grandchild2_1' },
    { id: 'greatgrandchild2_2_1', name: 'G-Grandchild 2.2.1', dateOfBirth: '1987-09-20', parent: 'grandchild2_2' },
    { id: 'greatgrandchild2_3_1', name: 'G-Grandchild 2.3.1', dateOfBirth: '1990-11-12', parent: 'grandchild2_3' },
    { id: 'greatgrandchild3_1_1', name: 'G-Grandchild 3.1.1', dateOfBirth: '1988-02-28', parent: 'grandchild3_1' },
    { id: 'greatgrandchild3_2_1', name: 'G-Grandchild 3.2.1', dateOfBirth: '1991-06-07', parent: 'grandchild3_2' },
    { id: 'greatgrandchild3_3_1', name: 'G-Grandchild 3.3.1', dateOfBirth: '1992-01-01', parent: 'grandchild3_3' },
    { id: 'greatgrandchild3_3_2', name: 'G-Grandchild 3.3.2', dateOfBirth: '1994-03-03', parent: 'grandchild3_3' },
    { id: 'greatgrandchild4_1_1', name: 'G-Grandchild 4.1.1', dateOfBirth: '1989-05-15', parent: 'grandchild4_1' },
    { id: 'greatgrandchild4_1_2', name: 'G-Grandchild 4.1.2', dateOfBirth: '1991-07-25', parent: 'grandchild4_1' },
    { id: 'greatgrandchild5_1_1', name: 'G-Grandchild 5.1.1', dateOfBirth: '1995-08-08', parent: 'grandchild5_1' },
    { id: 'greatgrandchild5_2_1', name: 'G-Grandchild 5.2.1', dateOfBirth: '1997-10-10', parent: 'grandchild5_2' },

    // Great-Great-Grandchildren (Generation 4) - will inherit color from their parent's branch
    { id: 'greatgreatgrandchild1_1_1_1', name: 'GG-Grandchild 1.1.1.1', dateOfBirth: '2005-01-01', parent: 'greatgrandchild1_1_1' },
    { id: 'greatgreatgrandchild1_1_1_2', name: 'GG-Grandchild 1.1.1.2', dateOfBirth: '2007-02-02', parent: 'greatgrandchild1_1_1' },
    { id: 'greatgreatgrandchild1_2_1_1', name: 'GG-Grandchild 1.2.1.1', dateOfBirth: '2008-04-04', parent: 'greatgrandchild1_2_1' },
    { id: 'greatgreatgrandchild2_1_1_1', name: 'GG-Grandchild 2.1.1.1', dateOfBirth: '2010-03-03', parent: 'greatgrandchild2_1_1' },
    { id: 'greatgreatgrandchild3_3_1_1', name: 'GG-Grandchild 3.3.1.1', dateOfBirth: '2012-05-05', parent: 'greatgrandchild3_3_1' },
    { id: 'greatgreatgrandchild4_1_1_1', name: 'GG-Grandchild 4.1.1.1', dateOfBirth: '2015-06-06', parent: 'greatgrandchild4_1_1' },
];

// Base dimensions for the tree layout calculation
const BASE_WIDTH = 1500;
const BASE_HEIGHT = 1200;
const radiusIncrement = 150; // Distance between generations
const nodeRadius = 30; // Base radius for each node circle

const App = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
    const [processedTreeData, setProcessedTreeData] = useState({ nodes: [], links: [] });

    // Function to process raw family data into nodes with generations and links
    const processFamilyData = useCallback((data) => {
        const nodesMap = new Map();
        const processedNodes = [];
        const processedLinks = [];

        const rootNode = data.find(member => member.parent === null);

        if (!rootNode) {
            console.error("No central ancestor found (node with parent: null).");
            return { nodes: [], links: [] };
        }

        // Initialize root node with its specific color
        const initialRootNode = {
            id: rootNode.id,
            text: rootNode.name,
            dateOfBirth: rootNode.dateOfBirth,
            parent_id: rootNode.parent,
            color: rootNode.color || '#999999', // Central ancestor keeps its own color
            generation: 0,
            x: 0, y: 0, r: 0,
            angle: 0,
            branchArcWidth: 0
        };
        nodesMap.set(rootNode.id, initialRootNode);
        processedNodes.push(initialRootNode);

        // Queue for Breadth-First Search (BFS) to calculate generations and propagate colors
        const queue = [{ id: rootNode.id, generation: 0, inheritedColor: initialRootNode.color }];
        const visited = new Set();

        while (queue.length > 0) {
            const { id, generation, inheritedColor } = queue.shift();
            if (visited.has(id)) continue;

            visited.add(id);
            const currentNode = nodesMap.get(id);
            if (currentNode) {
                currentNode.generation = generation;
                // If it's not the root node, its color is already set during initialization or inherited
                // The root node's color is set above.
            }

            // Find children of the current node
            data.filter(member => member.parent === id).forEach(child => {
                const childNode = {
                    id: child.id,
                    text: child.name,
                    dateOfBirth: child.dateOfBirth,
                    parent_id: child.parent,
                    generation: generation + 1,
                    x: 0, y: 0, r: 0,
                    angle: 0,
                    branchArcWidth: 0
                };

                let nextInheritedColor = inheritedColor; // Default to parent's inherited color

                // If this child is a direct child of the central ancestor and has a 'branchColor',
                // use that as the starting color for its subtree.
                if (id === rootNode.id && child.branchColor) {
                    childNode.color = child.branchColor;
                    nextInheritedColor = child.branchColor;
                } else {
                    // Otherwise, inherit the color from the current (parent) node
                    childNode.color = inheritedColor;
                }

                nodesMap.set(child.id, childNode);
                processedNodes.push(childNode);
                processedLinks.push({ source: id, target: child.id });

                if (!visited.has(child.id)) {
                    queue.push({ id: child.id, generation: generation + 1, inheritedColor: nextInheritedColor });
                }
            });
        }

        return { nodes: processedNodes, links: processedLinks };
    }, []);

    // Function to draw the family tree on the canvas
    const drawFamilyTree = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const { nodes, links } = processedTreeData;
        if (nodes.length === 0) return;

        // Calculate current scale based on canvas width
        const scaleX = canvas.width / BASE_WIDTH;
        const scaleY = canvas.height / BASE_HEIGHT;
        const scale = Math.min(scaleX, scaleY); // Use the smaller scale to fit content

        const centerX = BASE_WIDTH / 2;
        const centerY = BASE_HEIGHT / 2;

        // Helper function to find a node by its ID
        const findNode = (id) => nodes.find(node => node.id === id);

        // 1. Position Central Ancestor (Generation 0)
        const centralAncestor = nodes.find(node => node.generation === 0);
        if (centralAncestor) {
            centralAncestor.x = centerX;
            centralAncestor.y = centerY;
            centralAncestor.r = nodeRadius + 10; // Slightly larger for central
            centralAncestor.angle = 0; // Reference angle
            centralAncestor.branchArcWidth = Math.PI * 2; // Full circle for its children
        }

        // Iterate through generations starting from 1 to position all nodes
        const maxGeneration = Math.max(...nodes.map(node => node.generation));
        for (let gen = 1; gen <= maxGeneration; gen++) {
            const currentGenerationNodes = nodes.filter(node => node.generation === gen);

            // Group nodes by their parent for this generation
            const nodesGroupedByParent = {};
            currentGenerationNodes.forEach(node => {
                if (!nodesGroupedByParent[node.parent_id]) {
                    nodesGroupedByParent[node.parent_id] = [];
                }
                nodesGroupedByParent[node.parent_id].push(node);
            });

            for (const parentId in nodesGroupedByParent) {
                const parentNode = findNode(parentId);
                const childrenOfThisParent = nodesGroupedByParent[parentId];

                if (!parentNode) {
                    console.error(`Parent not found for children of: ${parentId}`);
                    continue;
                }

                const currentRadius = gen * radiusIncrement;
                const parentAngle = parentNode.angle;
                const parentBranchArcWidth = parentNode.branchArcWidth;

                // Calculate the start angle for this parent's arc on the current generation's circle
                // The arc is centered around the parent's angle
                const startAngleForArc = parentAngle - (parentBranchArcWidth / 2);

                // Distribute children evenly within this arc
                // +1 for spacing at the beginning and end of the arc
                const angleStepWithinArc = parentBranchArcWidth / (childrenOfThisParent.length + 1);

                childrenOfThisParent.forEach((node, index) => {
                    const nodeAngle = startAngleForArc + (index + 1) * angleStepWithinArc;
                    node.x = centerX + currentRadius * Math.cos(nodeAngle);
                    node.y = centerY + currentRadius * Math.sin(nodeAngle);
                    node.r = nodeRadius;
                    node.angle = nodeAngle; // Store angle for this node
                    node.branchArcWidth = angleStepWithinArc; // This node's slice for its own children
                });
            }
        }

        // --- Draw concentric dashed circles for each generation ---
        ctx.strokeStyle = '#aaa'; // Light grey for the circles
        ctx.lineWidth = 1 * scale; // Thin line
        ctx.setLineDash([5, 5]); // Dashed line pattern (5px dash, 5px gap)

        // Get unique generation numbers, excluding 0 (central ancestor)
        const uniqueGenerations = [...new Set(nodes.map(node => node.generation))].sort((a, b) => a - b);

        uniqueGenerations.forEach(gen => {
            if (gen > 0) { // Don't draw a circle for generation 0 (central ancestor)
                const circleRadius = gen * radiusIncrement;
                ctx.beginPath();
                ctx.arc(centerX * scale, centerY * scale, circleRadius * scale, 0, Math.PI * 2);
                ctx.stroke();
            }
        });

        ctx.setLineDash([]); // Reset line dash to solid for subsequent drawings (links, nodes)

        // --- Draw links ---
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2 * scale;
        links.forEach(link => {
            const sourceNode = findNode(link.source);
            const targetNode = findNode(link.target);

            if (sourceNode && targetNode && sourceNode.x !== undefined && targetNode.x !== undefined) {
                ctx.beginPath();
                ctx.moveTo(sourceNode.x * scale, sourceNode.y * scale);
                ctx.lineTo(targetNode.x * scale, targetNode.y * scale);
                ctx.stroke();
            }
        });

        // --- Draw nodes ---
        nodes.forEach(node => {
            // Draw circle
            ctx.beginPath();
            ctx.arc(node.x * scale, node.y * scale, node.r * scale, 0, Math.PI * 2);
            ctx.fillStyle = node.color; // Use the propagated color
            ctx.fill();
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 1 * scale;
            ctx.stroke();

            // Draw text
            ctx.fillStyle = '#333';
            ctx.font = `${Math.max(8, 12 * scale)}px Inter, sans-serif`; // Adjust font size based on scale
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textLines = node.text.split(' '); // Split text for multi-line display if needed
            const lineHeight = Math.max(8, 14 * scale);
            let yOffset = -(textLines.length - 1) * lineHeight / 2;

            textLines.forEach((line, index) => {
                ctx.fillText(line, node.x * scale, node.y * scale + yOffset + index * lineHeight);
            });
        });
    }, [processedTreeData]); // Redraw when processedTreeData changes

    // Effect to handle canvas resizing
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                // Set canvas width to fill its container, up to BASE_WIDTH
                const newWidth = Math.min(BASE_WIDTH, containerWidth - 40); // 40 for padding
                // Calculate height to maintain aspect ratio, or use BASE_HEIGHT if width is maxed
                let newHeight = (newWidth / BASE_WIDTH) * BASE_HEIGHT;
                // Ensure a minimum height for very small screens
                if (newHeight < 300) {
                    newHeight = 300;
                }
                setCanvasDimensions({ width: newWidth, height: newHeight });
            }
        };

        // Initial setup
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect to process family data whenever it potentially changes
    useEffect(() => {
        setProcessedTreeData(processFamilyData(familyData));
    }, [processFamilyData]); // Re-process if processFamilyData memoization changes (unlikely here)

    // Effect to draw the tree when dimensions or processed data changes
    useEffect(() => {
        drawFamilyTree();
    }, [canvasDimensions, drawFamilyTree]);

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5 box-border overflow-auto font-inter">
            <div ref={containerRef} className="bg-white rounded-xl shadow-lg p-5 max-w-6xl w-full flex flex-col items-center text-center">
                <h1 className="text-gray-800 mb-5 text-4xl font-bold md:text-3xl">Our Family Tree</h1>
                <p className="text-gray-600 mb-8 text-lg md:text-base">Explore the connections that bind us together through generations.</p>
                <canvas
                    ref={canvasRef}
                    width={canvasDimensions.width}
                    height={canvasDimensions.height}
                    className="border border-gray-300 bg-gray-50 rounded-lg shadow-md max-w-full h-auto"
                ></canvas>
                <p className="mt-8 text-sm text-gray-500">
                    This visual representation helps us understand our lineage and heritage.
                    <br />
                    You can modify the `familyData` array in the JavaScript to build your full family tree.
                </p>
            </div>
        </div>
    );
};

export default App;