// Data given to MM viz:
// {'participants': [<participantId, participantId, ...],
//  'names'?: [<participantName, participantName, ...],
//  'transitions': <Number Of transitions in interval>,
//  'turns': [{'participant': <participantId>,
//             'turns': <Percent of turns in interval by this participant>}, ...]
var ENERGY_NODE_RADIUS, MM, NETWORK_RADIUS, PARTICIPANT_NODE_COLOR_LOCAL, PARTICIPANT_NODE_COLOR_OTHER, PARTICIPANT_NODE_RADIUS, TOOLTIP_HEIGHT, TOOLTIP_WIDTH, d3, getColorForOther, linksFromData, logger, nodesFromData;

d3 = require('./d3').default;

logger = require('./utils').logger;

getColorForOther = require('./utils').getColorForOther;

NETWORK_RADIUS = 115 * 2 / 3;

PARTICIPANT_NODE_RADIUS = 20 * 2 / 3;

ENERGY_NODE_RADIUS = 30 * 2 / 3;

PARTICIPANT_NODE_COLOR_LOCAL = '#4a4a4a';

PARTICIPANT_NODE_COLOR_OTHER = '#3AC4C5';

TOOLTIP_WIDTH = 125;

TOOLTIP_HEIGHT = 45;

// get array of participant nodes from data
nodesFromData = function(data) {
  var i, nodes, p;
  nodes = (function() {
    var j, len, ref, ref1, ref2, results;
    ref = data.participants;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      p = ref[i];
      results.push({
        'participant': p,
        'name': (ref1 = (ref2 = data.names) != null ? ref2[p] : void 0) != null ? ref1 : 'Participant ' + i,
        'p': p
      });
    }
    return results;
  })();
  nodes.push({
    'participant': 'energy' // keep the energy ball in the list of nodes
  });
  return nodes;
};

// create links, 1 link to the energy ball for each participant
// give it a 0 default weight
linksFromData = function(data) {
  var links, p;
  links = (function() {
    var j, len, ref, results;
    ref = data.participants;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      results.push({
        'source': p,
        'target': 'energy',
        'weight': 0
      });
    }
    return results;
  })();
  return links;
};

// exported MeetingMediator class
module.exports.MeetingMediator = MM = class MM {
  constructor(data1, localParticipants, width, height) {
    // d3func - node radius based on participant
    this.nodeRadius = this.nodeRadius.bind(this);
    // d3func - different colors for different types of nodes...
    this.nodeColor = this.nodeColor.bind(this);
    //        PARTICIPANT_NODE_COLOR_OTHER

    // d3func - we have different kinds of nodes, so this just abstracts
    // out the transform function.
    this.nodeTransform = this.nodeTransform.bind(this);
    // get name if it exists
    this.nodeName = this.nodeName.bind(this);
    // d3func - a translation between the angle rotation for nodes
    // and the raw x/y positions. Used for computing link endpoints.
    this.getNodeCoords = this.getNodeCoords.bind(this);
    // convert participant speaking time to a percentage
    this.getSpeakingTime = this.getSpeakingTime.bind(this);
    // d3func - translation / position for "energy" ball.
    // Moves closer (just based on weighting) to nodes.
    this.sphereTranslation = this.sphereTranslation.bind(this);
    // d3func - This returns a translation string to rotate the _entire_
    // "graph group" to keep the user's node at the top.
    this.constantRotation = this.constantRotation.bind(this);
    this.data = data1;
    this.localParticipants = localParticipants;
    logger.debug("constructing MM with data:", this.data);
    this.fontFamily = "Futura,Helvetica Neue,Helvetica,Arial,sans-serif";
    this.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    this.width = width - this.margin.right - this.margin.left;
    this.height = height - this.margin.bottom - this.margin.top;
    this.namesById = this.data.names;
    this.remoteParticipants = [...this.data.participants.slice(0, this.data.participants.indexOf(this.localParticipants[0])), ...this.data.participants.slice(this.data.participants.indexOf(this.localParticipants[0]) + 1)];
    this.nodeColorScale = (p) => {
      var idx;
      idx = this.remoteParticipants.indexOf(p);
      return getColorForOther(idx);
    };
    // radius of network as a whole
    this.radius = NETWORK_RADIUS;
    // distributes positions for participant avatars evenly in a circle
    this.angle = d3.scalePoint().domain(this.data.participants).range([0, 360]).padding(0.5);
    // determines thickness of edges
    this.linkStrokeScale = d3.scaleLinear().domain([0, 1]).range([3, 15]);
    // color scale for sphere in the middle
    this.sphereColorScale = d3.scaleLinear().domain([-5, this.data.participants.length * 3]).range(['#f5f5f5', '#9d7dae']).clamp(true);
    // create initial node data
    this.nodes = nodesFromData(this.data);
    this.links = linksFromData(this.data);
    this.updateLinkWeight();
    this.nodeTransitionTime = 500;
    this.linkTransitionTime = 500;
  }

  nodeRadius(d) {
    if (d.participant === "energy") {
      return ENERGY_NODE_RADIUS;
    } else {
      return PARTICIPANT_NODE_RADIUS;
    }
  }

  render(id = "#meeting-mediator") {
    this.chart = d3.select(id).append("svg").attr("class", "meeting-mediator").attr("width", this.width + this.margin.left + this.margin.right).attr("height", this.height + this.margin.top + this.margin.bottom).append("g").attr("transform", `translate(${this.width / 2},${this.height / 2})`);
    this.chartBody = this.chart.append("g").attr("width", this.width).attr("height", this.height);
    this.graphG = this.chart.append("g").attr("width", this.width).attr("height", this.height);
    // keeps user node at top
    this.graphG.transition().attr("transform", this.constantRotation()); //.duration(250)
    this.outline = this.chartBody.append("g").attr("id", "outline").append("circle").style("stroke", "#AFAFAF").attr("stroke-width", 3).style("stroke-dasharray", "10, 5").attr("fill", "transparent").attr("r", this.radius + PARTICIPANT_NODE_RADIUS + 2);
    // put links / nodes in a separate group
    this.linksG = this.graphG.append("g").attr("id", "links");
    this.nodesG = this.graphG.append("g").attr("id", "nodes");
    // get existing tooltip div if it exists, otherwise create it
    this.tooltip = d3.select("body > div.tooltip");
    if (this.tooltip.empty()) {
      this.tooltip = d3.select("body").append("div").attr("class", "tooltip").style("position", "absolute").style("width", `${TOOLTIP_WIDTH}px`).style("height", `${TOOLTIP_HEIGHT}px`).style("padding", "5px").style("background", "white").style("border", "1px solid #dbdbdb").style("color", "#4a4a4a").style("pointer-events", "none").style("border-radius", "4px").style("font-size", "10px").style("align-items", "center").style("display", "none");
    }
    this.renderNodes();
    return this.renderLinks();
  }

  // a little complicated, since we want to be able to put text
  // and prettier stuff on nodes in the future (maybe).
  // We create a group for each node, and do a selection for moving them around.
  renderNodes() {
    var nodeGs, nodeGsEnter;
    nodeGs = this.nodesG.selectAll(".node").data(this.nodes, function(d) {
      return d.participant;
    });
    // remove node groups for nodes that have left
    nodeGs.exit().remove();
    // new node groups - add attributes and child elements
    nodeGsEnter = nodeGs.enter().append("g").attr("class", "node").attr("id", function(d) {
      return d.participant;
    });
    nodeGsEnter.append("circle").attr("class", "nodeCircle").attr("id", (d) => {
      return "circle-" + d.participant;
    }).attr("fill", this.nodeColor).attr("r", this.nodeRadius);
    nodeGsEnter.append("circle").attr("class", "nodeFill").attr("fill", "#FFFFFF").attr("r", (d) => {
      if (d.participant === 'energy' || this.localParticipants.includes(d.participant)) {
        return 0;
      } else {
        return this.nodeRadius(d) - 3;
      }
    });
    // add labels to the nodes
    nodeGsEnter.append("text").attr("class", "node-label").style("cursor", "default").attr("text-anchor", "middle").attr("font-size", "15px").attr("dy", ".38em").attr("fill", (d) => {
      if (this.localParticipants.includes(d.participant)) {
        return "#FFFFFF";
      } else {
        return "#000000";
      }
    });
    // show tooltip on hover
    nodeGsEnter.on("mouseover", (d) => {
      var leftPosition, position, speakingTime, tooltipText, topPosition;
      tooltipText = "";
      position = document.getElementById('circle-' + d.participant).getBoundingClientRect();
      leftPosition = (position.x + (position.width / 2)) - (TOOLTIP_WIDTH / 2) + window.scrollX;
      topPosition = position.y + window.scrollY - TOOLTIP_HEIGHT;
      if (leftPosition < 0) {
        leftPosition = 0;
      }
      if (topPosition < 0) {
        topPosition = 0;
      }
      if (d.participant === 'energy') {
        tooltipText = "Turn Count: " + this.data.transitions;
      } else {
        speakingTime = this.getSpeakingTime(d.participant);
        tooltipText = "Name: " + d.name + "<br/>Speaking Time: " + speakingTime;
      }
      return this.tooltip.html(tooltipText).style("left", leftPosition + "px").style("top", topPosition + "px").style("display", "flex");
    });
    // hide tooltip
    nodeGsEnter.on("mouseout", (d) => {
      this.tooltip.html("");
      return this.tooltip.style("display", "none");
    });
    // all node groups
    this.nodesG.selectAll(".node").transition().duration(500).attr("transform", this.nodeTransform).select('circle').attr("fill", this.nodeColor); // change circle color
    // the name isn't always supplied when the participant is added and its node created
    // so update the label on all nodes now,
    // and unrotate the node labels so they remain upright
    return this.nodesG.selectAll(".node-label").text(this.nodeName).attr("transform", (d) => {
      if (d.participant === 'energy') {
        return "";
      } else {
        return `rotate(${-1 * (this.constantRotationAngle() + this.angle(d.participant))})`;
      }
    });
  }

  nodeColor(d) {
    if (d.participant === 'energy') {
      return this.sphereColorScale(this.data.transitions);
    } else if (this.localParticipants.includes(d.participant)) {
      return PARTICIPANT_NODE_COLOR_LOCAL;
    } else {
      return this.nodeColorScale(d.participant);
    }
  }

  nodeTransform(d) {
    if (d.participant === "energy") {
      return this.sphereTranslation();
    } else {
      return `rotate(${this.angle(d.participant)})translate(${this.radius},0)`;
    }
  }

  nodeName(d) {
    if (this.namesById[d.participant]) {
      return this.namesById[d.participant][0];
    } else {
      return "";
    }
  }

  getNodeCoords(id) {
    var t, transformText;
    transformText = this.nodeTransform({
      'participant': id
    });
    t = MM.getTransformation(transformText);
    return {
      'x': t.translate.x,
      'y': t.translate.y
    };
  }

  getSpeakingTime(participant) {
    var myTurn, pct;
    pct = 0;
    myTurn = this.data.turns.find((t) => {
      return t.participant === participant;
    });
    if (myTurn) {
      pct = Math.round(myTurn.turns * 100);
    }
    return pct + "%";
  }

  renderLinks() {
    var linkGs;
    linkGs = this.linksG.selectAll("line.link").data(this.links, function(d) {
      return d.source;
    });
    // remove links for participants who have left
    linkGs.exit().remove();
    // add links for new participants
    linkGs.enter().append("line").attr("class", "link").attr("stroke", "#646464").attr("fill", "none").attr("stroke-opacity", 0.8).attr("stroke-width", 7).attr("x1", (d) => {
      return this.getNodeCoords(d.source)['x'];
    }).attr("y1", (d) => {
      return this.getNodeCoords(d.source)['y'];
    }).attr("x2", (d) => {
      return this.getNodeCoords(d.target)['x'];
    }).attr("y2", (d) => {
      return this.getNodeCoords(d.target)['y'];
    });
    // update existing links
    linkGs.attr("x1", (d) => {
      return this.getNodeCoords(d.source)['x'];
    }).attr("y1", (d) => {
      return this.getNodeCoords(d.source)['y'];
    }).attr("x2", (d) => {
      return this.getNodeCoords(d.target)['x'];
    }).attr("y2", (d) => {
      return this.getNodeCoords(d.target)['y'];
    });
    // all links
    return this.linksG.selectAll("line.link").transition().duration(this.linkTransitionTime).attr("stroke-width", (d) => {
      return this.linkStrokeScale(d.weight);
    });
  }

  sphereTranslation() {
    var coords, j, len, node_x, node_y, ref, turn, x, xDist, y, yDist;
    x = 0;
    y = 0;
    ref = this.data.turns;
    for (j = 0, len = ref.length; j < len; j++) {
      turn = ref[j];
      coords = this.getNodeCoords(turn.participant);
      // get coordinates of this node & distance from ball
      node_x = coords['x'];
      node_y = coords['y'];
      xDist = node_x - x;
      yDist = node_y - y;
      // transform x and y proportional to the percentage of turns
      // (and use dist/2 to prevent collision)
      x += turn.turns * (xDist / 2);
      y += turn.turns * (yDist / 2);
    }
    return `translate(${x},${y})`;
  }

  // the angle to rotate the graph by to put the user's node at the top.
  constantRotationAngle() {
    var a, angle, targetAngle;
    // TODO unsure about this
    angle = this.angle(this.localParticipants[0]) || 0;
    targetAngle = -90;
    a = targetAngle - angle;
    a = (a + 180) % 360 - 180;
    if (angle !== -90) {
      return a;
    } else {
      return 0;
    }
  }

  constantRotation() {
    return `rotate(${this.constantRotationAngle()})`;
  }

  // update the link weight from current turn data
  updateLinkWeight() {
    var j, len, link, ref, ref1, ref2;
    ref = this.links;
    for (j = 0, len = ref.length; j < len; j++) {
      link = ref[j];
      link.weight = (ref1 = (ref2 = this.data.turns.find((turn) => {
        return turn.participant === link.source;
      })) != null ? ref2.turns : void 0) != null ? ref1 : 0;
    }
  }

  updateData(data) {
    logger.debug("MM: updating viz with data:", data);
    this.namesById = data.names;
    data.participants = data.participants.sort();
    this.remoteParticipants = [...data.participants.slice(0, data.participants.indexOf(this.localParticipants[0])), ...data.participants.slice(data.participants.indexOf(this.localParticipants[0]) + 1)];
    // if we're not updating participants, don't redraw everything.
    logger.debug("MM: participant info:", {
      localParticipant: this.localParticipants[0],
      remoteParticipants: this.remoteParticipants,
      remoteColors: this.remoteParticipants.map((p) => {
        return this.nodeColorScale(p);
      })
    });
    if (data.participants.length === this.data.participants.length && Object.keys(data.names).length === Object.keys(this.data.names).length) {
      this.data = data;
      this.updateLinkWeight();
      this.renderLinks();
      return this.renderNodes();
    } else {
      // Create nodes again
      this.data = data;
      this.nodes = nodesFromData(this.data);
      this.links = linksFromData(this.data);
      this.updateLinkWeight();
      // recompute the color scale for the sphere and angle domain
      this.sphereColorScale.domain([0, data.participants.length * 5]);
      this.angle.domain(this.data.participants);
      // recompute links
      this.link = this.linksG.selectAll("line.link").data([]).exit().remove();
      // Re-render. Do it on a delay to make sure links get rendered after nodes.
      // After links, rotate entire graph so user is at top.
      this.renderNodes();
      return setTimeout((() => {
        return this.graphG.transition().duration(0).attr("transform", this.constantRotation());
      }), this.renderLinks(), this.nodeTransitionTime + 100);
    }
  }

  // Function copied pretty much verbatim from stackoverflow for replacing use of
  // the V3 d3.transform when moving to d3 V4
  // https://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4
  static getTransformation(transform) {
    var a, b, c, d, e, f, g, identityMatrix, matrix, ref, ref1, scaleX, scaleY, skewX;
    // Create a dummy g for calculation purposes only. This will never
    // be appended to the DOM and will be discarded once this function
    // returns.
    g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // Set the transform attribute to the provided string value.
    g.setAttributeNS(null, "transform", transform);
    // consolidate the SVGTransformList containing all transformations
    // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
    // its SVGMatrix.
    identityMatrix = {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0
    };
    matrix = (ref = (ref1 = g.transform.baseVal.consolidate()) != null ? ref1.matrix : void 0) != null ? ref : identityMatrix;
    // Below calculations are taken and adapted from the private function
    // transform/decompose.js of D3's module d3-interpolate.
    ({a, b, c, d, e, f} = matrix);
    if (scaleX = Math.sqrt(a * a + b * b)) {
      a /= scaleX;
      b /= scaleX;
    }
    if (skewX = a * c + b * d) {
      c -= a * skewX;
      d -= b * skewX;
    }
    if (scaleY = Math.sqrt(c * c + d * d)) {
      c /= scaleY;
      d /= scaleY;
      skewX /= scaleY;
    }
    if (a * d < b * c) {
      a = -a;
      b = -b;
      skewX = -skewX;
      scaleX = -scaleX;
    }
    return {
      translate: {
        x: e,
        y: f
      },
      rotate: Math.atan2(b, a) * 180 / Math.PI,
      skewX: Math.atan(skewX) * 180 / Math.PI,
      scale: {
        x: scaleX,
        y: scaleY
      }
    };
  }

};
