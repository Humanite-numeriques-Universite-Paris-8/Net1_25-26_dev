// Objet pour créer un histogramme avec D3.js
const histogram = {
    /**
     * Crée un histogramme
     * @param {object} conteneur - conteneur = d3.select
     * @param {array} data - Données à visualiser
     * @param {object} options - Options de configuration
     */
    create(conteneur, data, options = {}) {
        const {
            xKey = 'x',
            yKey = 'value',
            width = 800,
            height = 400,
            marginTop = 20,
            marginRight = 20,
            marginBottom = 30,
            marginLeft = 60
        } = options;

        const innerWidth = width - marginLeft - marginRight;
        const innerHeight = height - marginTop - marginBottom;

        // Créer les échelles
        const xScale = d3.scaleBand()
            .domain(data.map(d => d[xKey]))
            .range([0, innerWidth])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[yKey])])
            .range([innerHeight, 0]);

        //purge le svg
        conteneur.select("svg").remove();

        // Créer le SVG
        const svg = conteneur
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${marginLeft},${marginTop})`);

        // Ajouter les barres
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d[xKey]))
            .attr('y', d => yScale(d[yKey]))
            .attr('width', xScale.bandwidth())
            .attr('height', d => innerHeight - yScale(d[yKey]))
            .attr('fill', '#4c8fd1');

        // Add the x-axis and label.
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .call((g) => g.append("text")
                .attr("x", innerWidth)
                .attr("y", marginBottom - 4)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text(wrap(xKey+" →"), xScale.bandwidth()-10));

        // Add the y-axis and label, and remove the domain line.
        g.append("g")
            //.attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(yScale))
            .call((g) => g.append("text")
                .attr("x", 0)
                .attr("y", -10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ "+yKey));


        return { svg, xScale, yScale };
    }
    };
