const conf =  {
  style: [
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        label: 'data(id)',
        width: '10px',
        height: '10px',
        shape: 'hexagon'
      }
    },
    {
      selector: 'edge',
      style: {
        width: 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'control-point-step-size': 40
      }
    }
  ],
  layout: {
    name: 'circle',
    transform: (node, position) => {
      switch (node.data().id) {
        case 'btc':
          return { x: 230, y: 150 };
        case 'eth':
          return { x: 370, y: 150 };
        case 'usd':
          return { x: 300, y: 270 };
        default:
          return position;
      }
    },
  }
};

export default conf;
