# Data given to MM viz:
# {'participants': [<participantId, participantId, ...],
#  'names'?: [<participantName, participantName, ...],
#  'transitions': <Number Of transitions in interval>,
#  'turns': [{'participant': <participantId>,
#             'turns': <Percent of turns in interval by this participant>}, ...]
  d3 = require('./d3').default
  logger = require('./utils').logger
  getColorForOther = require('./utils').getColorForOther

  NETWORK_RADIUS = 115 * 2/3
  PARTICIPANT_NODE_RADIUS = 20 * 2/3
  ENERGY_NODE_RADIUS = 30 * 2/3

  PARTICIPANT_NODE_COLOR_LOCAL = '#4a4a4a'
  PARTICIPANT_NODE_COLOR_OTHER = '#3AC4C5'

  TOOLTIP_WIDTH = 125
  TOOLTIP_HEIGHT = 45

  # get array of participant nodes from data
  nodesFromData = (data) ->
    nodes = ({
      'participant': p,
      'name': (data.names?[p] ? 'Participant ' + i),
      'p': p
    } for p, i in data.participants)
    nodes.push({'participant': 'energy'}) # keep the energy ball in the list of nodes
    return nodes

  # create links, 1 link to the energy ball for each participant
  # give it a 0 default weight
  linksFromData = (data) ->
    links = ({'source': p, 'target': 'energy', 'weight': 0} for p in data.participants)
    return links

  # exported MeetingMediator class
  module.exports.MeetingMediator = class MM
    constructor: (@data, @localParticipants, width, height) ->

      logger.debug "constructing MM with data:", @data
      @fontFamily = "Futura,Helvetica Neue,Helvetica,Arial,sans-serif"
      @margin = {top: 0, right: 0, bottom: 0, left: 0}
      @width = width - @margin.right - @margin.left
      @height = height - @margin.bottom - @margin.top
      @namesById = @data.names

      @remoteParticipants = [...@data.participants.slice(0, @data.participants.indexOf(@localParticipants[0])),
                             ...@data.participants.slice(@data.participants.indexOf(@localParticipants[0]) + 1)]

      @nodeColorScale = (p) =>
        idx = @remoteParticipants.indexOf(p)
        getColorForOther(idx)

      # radius of network as a whole
      @radius = NETWORK_RADIUS

      # distributes positions for participant avatars evenly in a circle
      @angle = d3.scalePoint()
        .domain @data.participants
        .range [0, 360]
        .padding 0.5

      # determines thickness of edges
      @linkStrokeScale = d3.scaleLinear()
        .domain [0, 1]
        .range [3, 15]

      # color scale for sphere in the middle
      @sphereColorScale = d3.scaleLinear()
        .domain [-5, @data.participants.length * 3]
        .range ['#f5f5f5', '#9d7dae']
        .clamp true

      # create initial node data
      @nodes = nodesFromData @data
      @links = linksFromData @data
      @updateLinkWeight()

      @nodeTransitionTime = 500
      @linkTransitionTime = 500

    # d3func - node radius based on participant
    nodeRadius: (d) =>
      if (d.participant == "energy")
        ENERGY_NODE_RADIUS
      else
        PARTICIPANT_NODE_RADIUS


    render: (id="#meeting-mediator") ->
      @chart = d3.select id
        .append "svg"
        .attr "class", "meeting-mediator"
        .attr "width", @width + @margin.left + @margin.right
        .attr "height", @height + @margin.top + @margin.bottom
        .append "g"
        .attr "transform", "translate(#{ @width / 2 },#{ @height / 2 })"

      @chartBody = @chart.append "g"
        .attr "width", @width
        .attr "height", @height

      @graphG = @chart.append "g"
        .attr "width", @width
        .attr "height", @height

      # keeps user node at top
      @graphG.transition()#.duration(250)
        .attr "transform", @constantRotation()

      @outline = @chartBody.append "g"
        .attr "id", "outline"
        .append "circle"
        .style "stroke", "#AFAFAF"
        .attr "stroke-width", 3
        .style "stroke-dasharray", ("10, 5")
        .attr "fill", "transparent"
        .attr "r", @radius + PARTICIPANT_NODE_RADIUS + 2

      # put links / nodes in a separate group
      @linksG = @graphG.append "g"
        .attr "id", "links"
      @nodesG = @graphG.append "g"
        .attr "id", "nodes"

      # get existing tooltip div if it exists, otherwise create it
      @tooltip = d3.select "body > div.tooltip"
      if @tooltip.empty()
        @tooltip = d3.select "body"
          .append "div"
          .attr "class", "tooltip"
          .style "position", "absolute"
          .style "width", "#{ TOOLTIP_WIDTH }px"
          .style "height", "#{ TOOLTIP_HEIGHT }px"
          .style "padding", "5px"
          .style "background", "white"
          .style "border", "1px solid #dbdbdb"
          .style "color", "#4a4a4a"
          .style "pointer-events", "none"
          .style "border-radius", "4px"
          .style "font-size", "10px"
          .style "align-items", "center"
          .style "display", "none"

      @renderNodes()
      @renderLinks()

    # a little complicated, since we want to be able to put text
    # and prettier stuff on nodes in the future (maybe).
    # We create a group for each node, and do a selection for moving them around.
    renderNodes: () ->
      nodeGs = @nodesG.selectAll ".node"
        .data @nodes, (d) -> d.participant

      # remove node groups for nodes that have left
      nodeGs.exit().remove()

      # new node groups - add attributes and child elements
      nodeGsEnter = nodeGs.enter().append "g"
        .attr "class", "node"
        .attr "id", (d) -> d.participant

      nodeGsEnter.append "circle"
        .attr "class", "nodeCircle"
        .attr "id", (d) => "circle-" + d.participant
        .attr "fill", @nodeColor
        .attr "r", @nodeRadius

      nodeGsEnter.append "circle"
        .attr "class", "nodeFill"
        .attr "fill", "#FFFFFF"
        .attr "r", (d) =>
          if (d.participant == 'energy' or @localParticipants.includes(d.participant))
            0
          else
            @nodeRadius(d) - 3

      # add labels to the nodes
      nodeGsEnter.append "text"
        .attr "class", "node-label"
        .style "cursor", "default"
        .attr "text-anchor", "middle"
        .attr "font-size", "15px"
        .attr "dy", ".38em"
        .attr "fill", (d) =>
          if (@localParticipants.includes(d.participant))
            "#FFFFFF"
          else
            "#000000"

      # show tooltip on hover
      nodeGsEnter.on "mouseover", (d) =>
        tooltipText = ""
        position = document.getElementById('circle-' + d.participant).getBoundingClientRect()
        leftPosition = (position.x + (position.width / 2)) - (TOOLTIP_WIDTH / 2) + window.scrollX
        topPosition = position.y + window.scrollY - TOOLTIP_HEIGHT
        if leftPosition < 0
          leftPosition = 0
        if topPosition < 0
          topPosition = 0
        if d.participant == 'energy'
          tooltipText = "Turn Count: " + @data.transitions
        else
          speakingTime = @getSpeakingTime(d.participant)
          tooltipText = "Name: " + d.name + "<br/>Speaking Time: " + speakingTime
        @tooltip.html(tooltipText)
          .style "left", leftPosition + "px"
          .style "top", topPosition + "px"
          .style "display", "flex"

      # hide tooltip
      nodeGsEnter.on "mouseout", (d) =>
        @tooltip.html("")
        @tooltip.style "display", "none"

      # all node groups
      @nodesG.selectAll(".node").transition().duration(500)
        .attr "transform", @nodeTransform
        .select('circle') # change circle color
        .attr "fill", @nodeColor

      # the name isn't always supplied when the participant is added and its node created
      # so update the label on all nodes now,
      # and unrotate the node labels so they remain upright
      @nodesG.selectAll(".node-label")
        .text @nodeName
        .attr "transform", (d) =>
          if (d.participant == 'energy')
            ""
          else
            "rotate(#{ (-1 * (@constantRotationAngle() + @angle(d.participant))) })"

    # d3func - different colors for different types of nodes...
    nodeColor: (d) =>
      if (d.participant == 'energy')
        @sphereColorScale(@data.transitions)
      else if @localParticipants.includes(d.participant)
        PARTICIPANT_NODE_COLOR_LOCAL
      else
        @nodeColorScale(d.participant)
#        PARTICIPANT_NODE_COLOR_OTHER

    # d3func - we have different kinds of nodes, so this just abstracts
    # out the transform function.
    nodeTransform: (d) =>
      if (d.participant == "energy")
        @sphereTranslation()
      else
        "rotate(#{ @angle(d.participant) })translate(#{ @radius },0)"

    # get name if it exists
    nodeName: (d) =>
      if (@namesById[d.participant])
        @namesById[d.participant][0]
      else
        ""

    # d3func - a translation between the angle rotation for nodes
    # and the raw x/y positions. Used for computing link endpoints.
    getNodeCoords: (id) =>
      transformText = @nodeTransform({'participant': id})
      t = MM.getTransformation(transformText)
      return {'x': t.translate.x, 'y': t.translate.y}

    # convert participant speaking time to a percentage
    getSpeakingTime: (participant) =>
      pct = 0
      myTurn = @data.turns.find((t) => t.participant == participant)
      if (myTurn)
        pct = Math.round(myTurn.turns * 100)
      return pct + "%"

    renderLinks: () ->
      linkGs = @linksG.selectAll "line.link"
        .data @links, (d) -> d.source

      # remove links for participants who have left
      linkGs.exit().remove()

      # add links for new participants
      linkGs.enter().append "line"
        .attr "class", "link"
        .attr "stroke", "#646464"
        .attr "fill", "none"
        .attr "stroke-opacity", 0.8
        .attr "stroke-width", 7
        .attr "x1", (d) => @getNodeCoords(d.source)['x']
        .attr "y1", (d) => @getNodeCoords(d.source)['y']
        .attr "x2", (d) => @getNodeCoords(d.target)['x']
        .attr "y2", (d) => @getNodeCoords(d.target)['y']

      # update existing links
      linkGs
        .attr "x1", (d) => @getNodeCoords(d.source)['x']
        .attr "y1", (d) => @getNodeCoords(d.source)['y']
        .attr "x2", (d) => @getNodeCoords(d.target)['x']
        .attr "y2", (d) => @getNodeCoords(d.target)['y']

      # all links
      @linksG.selectAll("line.link").transition().duration(@linkTransitionTime)
        .attr "stroke-width", (d) => @linkStrokeScale d.weight


    # d3func - translation / position for "energy" ball.
    # Moves closer (just based on weighting) to nodes.
    sphereTranslation: () =>
      x = 0
      y = 0

      for turn in @data.turns
        coords = @getNodeCoords(turn.participant)
        # get coordinates of this node & distance from ball
        node_x = coords['x']
        node_y = coords['y']
        xDist = (node_x - x)
        yDist = (node_y - y)

        # transform x and y proportional to the percentage of turns
        # (and use dist/2 to prevent collision)
        x += turn.turns * (xDist / 2)
        y += turn.turns * (yDist / 2)
      return "translate(#{ x },#{ y })"


    # the angle to rotate the graph by to put the user's node at the top.
    constantRotationAngle: () ->
      # TODO unsure about this
      angle = @angle(@localParticipants[0]) || 0
      targetAngle = -90
      a = targetAngle - angle
      a = (a + 180) % 360 - 180
      if (angle != -90)
        return a
      else
        return 0

    # d3func - This returns a translation string to rotate the _entire_
    # "graph group" to keep the user's node at the top.
    constantRotation: () =>
      return "rotate(#{ @constantRotationAngle() })"

    # update the link weight from current turn data
    updateLinkWeight: () ->
      for link in @links
        link.weight = (@data.turns.find (turn) => turn.participant is link.source)?.turns ? 0
      return


    updateData: (data) ->
      logger.debug "MM: updating viz with data:", data
      @namesById = data.names
      data.participants = data.participants.sort()
      @remoteParticipants = [...data.participants.slice(0, data.participants.indexOf(@localParticipants[0])),
                             ...data.participants.slice(data.participants.indexOf(@localParticipants[0]) + 1)]
      # if we're not updating participants, don't redraw everything.
      logger.debug "MM: participant info:", {localParticipant: @localParticipants[0], \
                                             remoteParticipants: @remoteParticipants, \
                                             remoteColors: @remoteParticipants.map (p) => @nodeColorScale(p)}
      if (data.participants.length == @data.participants.length && Object.keys(data.names).length == Object.keys(@data.names).length)
        @data = data
        @updateLinkWeight()

        @renderLinks()
        @renderNodes()
      else
        # Create nodes again
        @data = data
        @nodes = nodesFromData @data
        @links = linksFromData @data
        @updateLinkWeight()

        # recompute the color scale for the sphere and angle domain
        @sphereColorScale.domain [0, data.participants.length * 5]
        @angle.domain @data.participants

        # recompute links
        @link = @linksG.selectAll "line.link"
        .data []
        .exit().remove()
        # Re-render. Do it on a delay to make sure links get rendered after nodes.
        # After links, rotate entire graph so user is at top.
        @renderNodes()
        setTimeout((() =>
          @graphG.transition().duration(0)
            .attr "transform", @constantRotation()
          )
          @renderLinks(), @nodeTransitionTime + 100)


    # Function copied pretty much verbatim from stackoverflow for replacing use of
    # the V3 d3.transform when moving to d3 V4
    # https://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4
    @getTransformation: (transform) ->
      # Create a dummy g for calculation purposes only. This will never
      # be appended to the DOM and will be discarded once this function
      # returns.
      g = document.createElementNS "http://www.w3.org/2000/svg", "g"

      # Set the transform attribute to the provided string value.
      g.setAttributeNS null, "transform", transform

      # consolidate the SVGTransformList containing all transformations
      # to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
      # its SVGMatrix.
      identityMatrix = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
      matrix = g.transform.baseVal.consolidate()?.matrix ? identityMatrix

      # Below calculations are taken and adapted from the private function
      # transform/decompose.js of D3's module d3-interpolate.
      {a, b, c, d, e, f} = matrix
      if scaleX = Math.sqrt(a * a + b * b) then a /= scaleX;    b /= scaleX
      if skewX = a * c + b * d             then c -= a * skewX; d -= b * skewX
      if scaleY = Math.sqrt(c * c + d * d) then c /= scaleY;    d /= scaleY; skewX /= scaleY
      if a * d < b * c                     then a = -a;         b = -b;      skewX = -skewX; scaleX = -scaleX

      return
        translate:
          x: e
          y: f
        rotate: Math.atan2(b, a) * 180 / Math.PI
        skewX: Math.atan(skewX) * 180 / Math.PI
        scale:
          x: scaleX
          y: scaleY
