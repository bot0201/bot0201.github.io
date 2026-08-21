// d:\tmpHTML\js.js
const canvas = document.getElementById('roadCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let scale = 1.0;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;
let hoveredNode = null;
let mouseX = 0, mouseY = 0;

let playerX = 0;
let playerZ = 0;

const nodes = [];
const edges = [];

const NODE_SPACING = 200;
const GRID_COLOR = 'rgba(30, 40, 80, 0.6)';
const GRID_MAJOR_COLOR = 'rgba(40, 60, 120, 0.8)';

function generateNetwork() {
    const S = 0.5;
    
    const nodeDefs = [
        { x: 0, y: 0, label: '出生点', status: 'completed' },

        // 第1层 (1000)
        { x: 0, y: -1000*S, label: '1k', status: 'completed' },
        { x: 1000*S, y: -1000*S, label: '1k', status: 'completed' },
        { x: 1000*S, y: 0, label: '1k', status: 'completed' },
        { x: 1000*S, y: 1000*S, label: '1k', status: 'completed' },
        { x: 0, y: 1000*S, label: '1k', status: 'completed' },
        { x: -1000*S, y: 1000*S, label: '1k', status: 'completed' },
        { x: -1000*S, y: 0, label: '1k', status: 'completed' },
        { x: -1000*S, y: -1000*S, label: '1k', status: 'completed' },

        // 第2层 (2000)
        { x: 0, y: -2000*S, label: '2k', status: 'completed' },
        { x: 2000*S, y: -2000*S, label: '2k', status: 'completed' },
        { x: 2000*S, y: 0, label: '2k', status: 'completed' },
        { x: 2000*S, y: 2000*S, label: '2k', status: 'completed' },
        { x: 0, y: 2000*S, label: '2k', status: 'completed' },
        { x: -2000*S, y: 2000*S, label: '2k', status: 'completed' },
        { x: -2000*S, y: 0, label: '2k', status: 'completed' },
        { x: -2000*S, y: -2000*S, label: '2k', status: 'completed' },

        // 第3层 (3000)
        { x: 0, y: -3000*S, label: '3k', status: 'completed' },
        { x: 3000*S, y: -3000*S, label: '3k', status: 'completed' },
        { x: 3000*S, y: 0, label: '3k', status: 'completed' },
        { x: 3000*S, y: 3000*S, label: '3k', status: 'completed' },
        { x: 0, y: 3000*S, label: '3k', status: 'completed' },
        { x: -3000*S, y: 3000*S, label: '3k', status: 'completed' },
        { x: -3000*S, y: 0, label: '3k', status: 'completed' },
        { x: -3000*S, y: -3000*S, label: '3k', status: 'completed' },

        // 第4层 (4000)
        { x: 0, y: -4000*S, label: '4k', status: 'completed' },
        { x: 4000*S, y: -4000*S, label: '4k', status: 'completed' },
        { x: 4000*S, y: 0, label: '4k', status: 'completed' },
        { x: 4000*S, y: 4000*S, label: '4k', status: 'completed' },
        { x: 0, y: 4000*S, label: '4k', status: 'completed' },
        { x: -4000*S, y: 4000*S, label: '4k', status: 'completed' },
        { x: -4000*S, y: 0, label: '4k', status: 'completed' },
        { x: -4000*S, y: -4000*S, label: '4k', status: 'completed' },

        // 第5层 (5000) - 有斜环
        { x: 0, y: -5000*S, label: '5k', status: 'completed' },
        { x: 5000*S, y: -5000*S, label: '5k', status: 'completed' },
        { x: 5000*S, y: 0, label: '5k', status: 'completed' },
        { x: 5000*S, y: 5000*S, label: '5k', status: 'completed' },
        { x: 0, y: 5000*S, label: '5k', status: 'completed' },
        { x: -5000*S, y: 5000*S, label: '5k', status: 'completed' },
        { x: -5000*S, y: 0, label: '5k', status: 'completed' },
        { x: -5000*S, y: -5000*S, label: '5k', status: 'completed' },

        // 第6层 (7500) - 7k，无斜环，已完成
        { x: 0, y: -7500*S, label: '7k', status: 'completed' },
        { x: 7500*S, y: -7500*S, label: '7k', status: 'completed' },
        { x: 7500*S, y: 0, label: '7k', status: 'completed' },
        { x: 7500*S, y: 7500*S, label: '7k', status: 'completed' },
        { x: 0, y: 7500*S, label: '7k', status: 'completed' },
        { x: -7500*S, y: 7500*S, label: '7k', status: 'completed' },
        { x: -7500*S, y: 0, label: '7k', status: 'completed' },
        { x: -7500*S, y: -7500*S, label: '7k', status: 'completed' },

        // 第7层 (10000) - 1w，无斜环，规划中
        { x: 0, y: -10000*S, label: '1w', status: 'planned' },
        { x: 10000*S, y: -10000*S, label: '1w', status: 'planned' },
        { x: 10000*S, y: 0, label: '1w', status: 'planned' },
        { x: 10000*S, y: 10000*S, label: '1w', status: 'planned' },
        { x: 0, y: 10000*S, label: '1w', status: 'planned' },
        { x: -10000*S, y: 10000*S, label: '1w', status: 'planned' },
        { x: -10000*S, y: 0, label: '1w', status: 'planned' },
        { x: -10000*S, y: -10000*S, label: '1w', status: 'planned' },

        // 第8层 (15000) - 1w5，无斜环，规划中
        { x: 0, y: -15000*S, label: '1w5', status: 'planned' },
        { x: 15000*S, y: -15000*S, label: '1w5', status: 'planned' },
        { x: 15000*S, y: 0, label: '1w5', status: 'planned' },
        { x: 15000*S, y: 15000*S, label: '1w5', status: 'planned' },
        { x: 0, y: 15000*S, label: '1w5', status: 'planned' },
        { x: -15000*S, y: 15000*S, label: '1w5', status: 'planned' },
        { x: -15000*S, y: 0, label: '1w5', status: 'planned' },
        { x: -15000*S, y: -15000*S, label: '1w5', status: 'planned' },

        // 第9层 (20000) - 2w，无斜环，规划中
        { x: 0, y: -20000*S, label: '2w', status: 'planned' },
        { x: 20000*S, y: -20000*S, label: '2w', status: 'planned' },
        { x: 20000*S, y: 0, label: '2w', status: 'planned' },
        { x: 20000*S, y: 20000*S, label: '2w', status: 'planned' },
        { x: 0, y: 20000*S, label: '2w', status: 'planned' },
        { x: -20000*S, y: 20000*S, label: '2w', status: 'planned' },
        { x: -20000*S, y: 0, label: '2w', status: 'planned' },
        { x: -20000*S, y: -20000*S, label: '2w', status: 'planned' },

        // 第10层 (25000) - 2w5，有斜环，规划中
        { x: 0, y: -25000*S, label: '2w5', status: 'planned' },
        { x: 25000*S, y: -25000*S, label: '2w5', status: 'planned' },
        { x: 25000*S, y: 0, label: '2w5', status: 'planned' },
        { x: 25000*S, y: 25000*S, label: '2w5', status: 'planned' },
        { x: 0, y: 25000*S, label: '2w5', status: 'planned' },
        { x: -25000*S, y: 25000*S, label: '2w5', status: 'planned' },
        { x: -25000*S, y: 0, label: '2w5', status: 'planned' },
        { x: -25000*S, y: -25000*S, label: '2w5', status: 'planned' },

        // 第11层 (30000) - 3w，无斜环，规划中
        { x: 0, y: -30000*S, label: '3w', status: 'planned' },
        { x: 30000*S, y: -30000*S, label: '3w', status: 'planned' },
        { x: 30000*S, y: 0, label: '3w', status: 'planned' },
        { x: 30000*S, y: 30000*S, label: '3w', status: 'planned' },
        { x: 0, y: 30000*S, label: '3w', status: 'planned' },
        { x: -30000*S, y: 30000*S, label: '3w', status: 'planned' },
        { x: -30000*S, y: 0, label: '3w', status: 'planned' },
        { x: -30000*S, y: -30000*S, label: '3w', status: 'planned' },

        // 5k-5w延长线交点（在5w方形边上，沿横竖方向）
        { x: 2500, y: -50000*S, label: '5k-5w交点', status: 'planned' },   // 89: NE→N
        { x: 50000*S, y: -2500, label: '5k-5w交点', status: 'planned' },   // 90: NE→E
        { x: 50000*S, y: 2500, label: '5k-5w交点', status: 'planned' },    // 91: SE→E
        { x: 2500, y: 50000*S, label: '5k-5w交点', status: 'planned' },    // 92: SE→S
        { x: -2500, y: 50000*S, label: '5k-5w交点', status: 'planned' },   // 93: SW→S
        { x: -50000*S, y: 2500, label: '5k-5w交点', status: 'planned' },   // 94: SW→W
        { x: -50000*S, y: -2500, label: '5k-5w交点', status: 'planned' },  // 95: NW→W
        { x: -2500, y: -50000*S, label: '5k-5w交点', status: 'planned' },  // 96: NW→N

        // 第12层 (3750000) - 3750k，有斜环，规划中
        { x: 0, y: -3750000, label: '3750k', status: 'planned' },
        { x: 3750000, y: -3750000, label: '3750k', status: 'planned' },
        { x: 3750000, y: 0, label: '3750k', status: 'planned' },
        { x: 3750000, y: 3750000, label: '3750k', status: 'planned' },
        { x: 0, y: 3750000, label: '3750k', status: 'planned' },
        { x: -3750000, y: 3750000, label: '3750k', status: 'planned' },
        { x: -3750000, y: 0, label: '3750k', status: 'planned' },
        { x: -3750000, y: -3750000, label: '3750k', status: 'planned' },
    ];

    nodeDefs.forEach((def, idx) => {
        nodes.push({
            id: idx,
            x: def.x,
            y: def.y,
            label: def.label,
            status: def.status,
            type: 'road'
        });
    });

    // 边连接定义
    const edgeDefs = [
        // 中心到第1层
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],

        // 第1层环线（横竖）
        [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 1],

        // 第1层到第2层
        [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 14], [7, 15], [8, 16],

        // 第2层环线（横竖）
        [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 9],

        // 第2层到第3层
        [9, 17], [10, 18], [11, 19], [12, 20], [13, 21], [14, 22], [15, 23], [16, 24],

        // 第3层环线（横竖）
        [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 24], [24, 17],

        // 第3层到第4层
        [17, 25], [18, 26], [19, 27], [20, 28], [21, 29], [22, 30], [23, 31], [24, 32],

        // 第4层环线（横竖）
        [25, 26], [26, 27], [27, 28], [28, 29], [29, 30], [30, 31], [31, 32], [32, 25],

        // 第4层到第5层
        [25, 33], [26, 34], [27, 35], [28, 36], [29, 37], [30, 38], [31, 39], [32, 40],

        // 第5层环线（横竖）
        [33, 34], [34, 35], [35, 36], [36, 37], [37, 38], [38, 39], [39, 40], [40, 33],

        // 第5层斜向环线（绿色）
        [33, 35], [35, 37], [37, 39], [39, 33],

        // 第5层到第6层 (7k)
        [33, 41], [34, 42], [35, 43], [36, 44], [37, 45], [38, 46], [39, 47], [40, 48],

        // 第6层环线（横竖）- 7k，无斜环
        [41, 42], [42, 43], [43, 44], [44, 45], [45, 46], [46, 47], [47, 48], [48, 41],

        // 第6层到第7层 (1w)
        [41, 49], [42, 50], [43, 51], [44, 52], [45, 53], [46, 54], [47, 55], [48, 56],

        // 第7层环线（横竖）- 1w，无斜环
        [49, 50], [50, 51], [51, 52], [52, 53], [53, 54], [54, 55], [55, 56], [56, 49],

        // 第7层到第8层 (1w5)
        [49, 57], [50, 58], [51, 59], [52, 60], [53, 61], [54, 62], [55, 63], [56, 64],

        // 第8层环线（横竖）- 1w5，无斜环
        [57, 58], [58, 59], [59, 60], [60, 61], [61, 62], [62, 63], [63, 64], [64, 57],

        // 第8层到第9层 (2w)
        [57, 65], [58, 66], [59, 67], [60, 68], [61, 69], [62, 70], [63, 71], [64, 72],

        // 第9层环线（横竖）- 2w，无斜环
        [65, 66], [66, 67], [67, 68], [68, 69], [69, 70], [70, 71], [71, 72], [72, 65],

        // 第9层到第10层 (2w5)
        [65, 73], [66, 74], [67, 75], [68, 76], [69, 77], [70, 78], [71, 79], [72, 80],

        // 第10层环线（横竖）- 2w5
        [73, 74], [74, 75], [75, 76], [76, 77], [77, 78], [78, 79], [79, 80], [80, 73],

        // 第10层斜向环线（绿色）- 2w5有斜环
        [73, 75], [75, 77], [77, 79], [79, 73],
        [74, 76], [76, 78], [78, 80], [80, 74],

                // 第10层到第11层 (3w)
        [73, 81], [74, 82], [75, 83], [76, 84], [77, 85], [78, 86], [79, 87], [80, 88],

        // 第11层环线（横竖）- 3w
        [81, 82], [82, 83], [83, 84], [84, 85], [85, 86], [86, 87], [87, 88], [88, 81],

        // 5k顶点延长线到5w交点（4个顶点×2方向=8条横竖线）
        [34, 89], [34, 90],  // 东北→北 + 东北→东
        [36, 91], [36, 92],  // 东南→东 + 东南→南
        [38, 93], [38, 94],  // 西南→南 + 西南→西
        [40, 95], [40, 96],  // 西北→西 + 西北→北

        // 第11层到第12层 (3750k)
        [81, 97], [82, 98], [83, 99], [84, 100], [85, 101], [86, 102], [87, 103], [88, 104],

        // 第12层环线（横竖）- 3750k
        [97, 98], [98, 99], [99, 100], [100, 101], [101, 102], [102, 103], [103, 104], [104, 97],

        // 第12层斜向环线（绿色）- 3750k
        [97, 99], [99, 101], [101, 103], [103, 97],
        [98, 100], [100, 102], [102, 104], [104, 98],
    ];

    edgeDefs.forEach(([fromIdx, toIdx]) => {
        if (nodes[fromIdx] && nodes[toIdx]) {
            const dx = Math.abs(nodes[fromIdx].x - nodes[toIdx].x);
            const dy = Math.abs(nodes[fromIdx].y - nodes[toIdx].y);
            const isDiagonal = Math.abs(dx - dy) < 20 && dx > 50;
            
            edges.push({
                from: nodes[fromIdx],
                to: nodes[toIdx],
                isDiagonal: isDiagonal
            });
        }
    });
}

// 硬编码统计常量
const TOTAL_PLACED = 0;
const TOTAL_DESTROYED = 0;

function updateStats() {
    document.getElementById('placedCount').textContent = TOTAL_PLACED.toLocaleString();
    document.getElementById('destroyedCount').textContent = TOTAL_DESTROYED.toLocaleString();
    document.getElementById('netCount').textContent = (TOTAL_PLACED - TOTAL_DESTROYED).toLocaleString();
    document.getElementById('zoomLevel').textContent = Math.round(scale * 100) + '%';
}

function updateCoords() {
    const worldPos = screenToWorld(mouseX, mouseY);
    document.getElementById('coordX').textContent = Math.round(worldPos.x);
    document.getElementById('coordZ').textContent = Math.round(worldPos.y);
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function worldToScreen(wx, wy) {
    return { x: wx * scale + offsetX, y: wy * scale + offsetY };
}

function screenToWorld(sx, sy) {
    return { x: (sx - offsetX) / scale, y: (sy - offsetY) / scale };
}

function drawGrid() {
    const gridSize = 100 * scale;
    const startX = offsetX % gridSize;
    const startY = offsetY % gridSize;

    ctx.lineWidth = 1;
    ctx.strokeStyle = GRID_COLOR;
    for (let x = startX; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = startY; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    const majorGridSize = gridSize * 5;
    const majorStartX = offsetX % majorGridSize;
    const majorStartY = offsetY % majorGridSize;
    ctx.strokeStyle = GRID_MAJOR_COLOR;
    ctx.lineWidth = 1.5;
    for (let x = majorStartX; x < width; x += majorGridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = majorStartY; y < height; y += majorGridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
}

function drawEdges() {
    edges.forEach(edge => {
        const from = worldToScreen(edge.from.x, edge.from.y);
        const to = worldToScreen(edge.to.x, edge.to.y);
        
        // 判断是否为5k延长线
        const is5kExtension = (edge.from.id >= 33 && edge.from.id <= 40) && 
                              (edge.to.id >= 89 && edge.to.id <= 96);
        
        ctx.beginPath(); 
        ctx.moveTo(from.x, from.y); 
        ctx.lineTo(to.x, to.y);
        
        if (is5kExtension) {
            ctx.strokeStyle = 'rgba(57, 208, 216, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6 * scale, 4 * scale]); // 虚线
        } else if (edge.isDiagonal) {
            ctx.strokeStyle = 'rgba(63, 185, 80, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([]); // 实线
        } else {
            ctx.strokeStyle = 'rgba(57, 208, 216, 0.4)';
            ctx.lineWidth = 1;
            ctx.setLineDash([]); // 实线
        }
        
        ctx.stroke();
        ctx.setLineDash([]); // 重置
    });
}

function drawNodes() {
    nodes.forEach(node => {
        const pos = worldToScreen(node.x, node.y);
        const radius = (hoveredNode === node ? 12 : 8) * scale;

        if (node.status === 'completed') ctx.shadowColor = 'rgba(63, 185, 80, 0.5)';
        else if (node.status === 'building') ctx.shadowColor = 'rgba(88, 166, 255, 0.5)';
        else ctx.shadowColor = 'rgba(139, 148, 158, 0.3)';
        ctx.shadowBlur = 15 * scale;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        if (node.status === 'completed') ctx.fillStyle = '#3fb950';
        else if (node.status === 'building') ctx.fillStyle = '#58a6ff';
        else ctx.fillStyle = '#8b949e';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = hoveredNode === node ? '#e6edf3' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = hoveredNode === node ? 2 : 1;
        ctx.stroke();

        if (scale > 0.3) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(10, 11 * scale)}px 'Microsoft YaHei', sans-serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; ctx.shadowBlur = 4;
            ctx.fillText(node.label, pos.x, pos.y);
            ctx.shadowBlur = 0;
        }

        if (node.status === 'building') {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius + 4 * scale, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.random());
            ctx.strokeStyle = '#d29922'; ctx.lineWidth = 2 * scale; ctx.stroke();
        }
    });
}

// 施工位置常量
const PlayerX = -1174;
const PlayerZ = -10000;
const PlayerDirection = 'W'; // 'N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'

function drawBuildingMark() {
    const pos = worldToScreen(PlayerX, PlayerZ);
    console.log('Mark screen pos:', pos.x, pos.y);
    ctx.save(); 
    ctx.translate(pos.x, pos.y);
    
    // 白色圆圈底
    ctx.beginPath(); 
    ctx.arc(0, 0, 12 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; 
    ctx.fill();
    ctx.strokeStyle = '#ffffff'; 
    ctx.lineWidth = 2; 
    ctx.stroke();
    
    // 方向指示箭头
    const dirAngles = {
        'N': 0, 'NE': Math.PI / 4, 'E': Math.PI / 2, 'SE': Math.PI * 3 / 4,
        'S': Math.PI, 'SW': Math.PI * 5 / 4, 'W': Math.PI * 3 / 2, 'NW': Math.PI * 7 / 4
    };
    const angle = dirAngles[PlayerDirection] || 0;
    
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -8 * scale);
    ctx.lineTo(-5 * scale, 5 * scale);
    ctx.lineTo(5 * scale, 5 * scale);
    ctx.closePath();
    ctx.fillStyle = '#ff4444';
    ctx.fill();
    ctx.restore();
    
    ctx.restore();
}

function drawCompass() {
    const cx = width - 60, cy = 60, r = 30;
    ctx.save(); ctx.translate(cx, cy);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#ff4444'; ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('N', 0, -r + 10);
    ctx.beginPath(); ctx.moveTo(0, -r + 16); ctx.lineTo(-5, -r + 26); ctx.lineTo(5, -r + 26); ctx.closePath();
    ctx.fillStyle = '#ff4444'; ctx.fill();
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000000'; 
    ctx.fillRect(0, 0, width, height);
    drawGrid(); 
    drawEdges(); 
    drawNodes(); 
    drawBuildingMark();
    drawCompass();
    updateCoords();
}

// ========== 滚轮缩放 ==========
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    const worldBefore = screenToWorld(e.clientX, e.clientY);
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.02, Math.min(10, scale * delta));

    scale = newScale;
    offsetX = e.clientX - worldBefore.x * scale;
    offsetY = e.clientY - worldBefore.y * scale;

    updateStats();
    draw();
}, { passive: false });

canvas.addEventListener('mousedown', (e) => {
    isDragging = true; lastMouseX = e.clientX; lastMouseY = e.clientY;
    canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    updateCoords();
    
    if (isDragging) {
        offsetX += e.clientX - lastMouseX;
        offsetY += e.clientY - lastMouseY;
        lastMouseX = e.clientX; lastMouseY = e.clientY;
        draw();
    } else {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        let found = null; const threshold = 20 / scale;
        for (const node of nodes) {
            if (Math.hypot(node.x - worldPos.x, node.y - worldPos.y) < threshold) {
                found = node; break;
            }
        }
        if (found !== hoveredNode) {
            hoveredNode = found;
            canvas.style.cursor = found ? 'pointer' : 'crosshair';
            draw();
        }
    }
});

canvas.addEventListener('mouseup', () => { isDragging = false; canvas.style.cursor = hoveredNode ? 'pointer' : 'crosshair'; });
canvas.addEventListener('mouseleave', () => { isDragging = false; hoveredNode = null; draw(); });

document.getElementById('btnZoomIn').addEventListener('click', () => {
    const centerX = width / 2, centerY = height / 2;
    const worldBefore = screenToWorld(centerX, centerY);
    scale = Math.min(10, scale * 1.25);
    offsetX = centerX - worldBefore.x * scale;
    offsetY = centerY - worldBefore.y * scale;
    updateStats(); draw();
});

document.getElementById('btnZoomOut').addEventListener('click', () => {
    const centerX = width / 2, centerY = height / 2;
    const worldBefore = screenToWorld(centerX, centerY);
    scale = Math.max(0.02, scale / 1.25);
    offsetX = centerX - worldBefore.x * scale;
    offsetY = centerY - worldBefore.y * scale;
    updateStats(); draw();
});

function toggleTray() { document.getElementById('statsTray').classList.toggle('collapsed'); }
function toggleTips() { const tips = document.getElementById('tipsPanel'); tips.style.display = tips.style.display === 'none' ? 'block' : 'none'; }

window.addEventListener('resize', () => { resize(); draw(); });

generateNetwork(); resize();
offsetX = width / 2; offsetY = height / 2;
updateStats(); draw();
