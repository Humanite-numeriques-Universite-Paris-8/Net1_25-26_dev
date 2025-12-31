/**
 * StackedBarChart - Objet pour créer des graphiques en barres empilées avec D3
 * Utilisation: voir exemple en bas du fichier
 */
const stackedBarChart = {
    /**
     * Crée un stacked bar chart
     * @param {Object} config - Configuration du graphique
     * @param {string} config.conteneur  - conteneur = d3.select
     * @param {Array} config.data - Données au format [{category: 'A', value1: 10, value2: 20}, ...]
     * @param {Array} config.keys - Clés des séries à empiler (ex: ['value1', 'value2'])
     * @param {number} config.width - Largeur (défaut: 800)
     * @param {number} config.height - Hauteur (défaut: 500)
     * @param {string} config.xKey - Clé pour l'axe X (défaut: 'category')
     * @param {Object} config.colors - Palette de couleurs (défaut: d3.schemeSet2)
     * @param {Object} config.scaleColor - Palette de couleurs déja calculée
     */
    render(config) {
        const {
            conteneur,
            data,
            keys,
            width = 800,
            height = 500,
            xKey = 'category',
            colors = d3.schemeSet2,
            scaleColor
        } = config;

        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Nettoyer le conteneur
        conteneur.selectAll('*').remove();

        // Créer SVG
        const svg = conteneur
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d[xKey]))
            .range([0, innerWidth])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.sum(keys, k => d[k]))])
            .range([innerHeight, 0]);

        const colorScale = d3.scaleOrdinal()
            .domain(keys)
            .range(colors);

        // Stacker
        const stackGenerator = d3.stack().keys(keys);
        const stackedData = stackGenerator(data);

        //création du tooltip
        const tooltip = d3.select("#stackedBarChartTooltip").size() ? d3.select("#stackedBarChartTooltip") 
            : d3.select("body").append("div")
                .attr("id","stackedBarChartTooltip")
                .style("position", "absolute")
                .style("padding", "8px")
                .style("background", "rgba(0, 0, 0, 0.8)")
                .style("color", "white")
                .style("border-radius", "4px")
                .style("pointer-events", "none")
                .style("display", "none");

        // Barres
        svg.selectAll('g.serie')
            .data(stackedData)
            .enter()
            .append('g')
            .attr('class', 'serie')
            .attr('fill', (d,i) => scaleColor ? scaleColor(i) : colorScale(d.key))
            .selectAll('rect')
            .data(d => {
                let idx = d.index;
                d.forEach(v=>v.idx=idx);
                return d;
            })
            .enter()
            .append('rect')
            .attr('id', (d,i) => {
                return 'stack'+i
            })
            .attr('x', d => xScale(d.data[xKey]))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('width', xScale.bandwidth())
            .on("mouseover",(e,d)=>{
                tooltip.style("display", "block")
                .style("left", (e.pageX) + "px")
                .style("top", (e.pageY - 10) + "px");
                tooltip.html(`<strong>${keys[d.idx]} : ${d.data[xKey]}</strong> = ${d[1]-d[0]}`);
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
            });

        // Axes
        svg.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        svg.append('g')
            .call(d3.axisLeft(yScale));

        /* Légende
        svg.append('g')
            .attr('class', 'legend')
            .selectAll('g')
            .data(keys)
            .enter()
            .append('g')
            .attr('transform', (d, i) => `translate(${width-margin.right},${i * 20})`)
            .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', (d,i) => scaleColor ? scaleColor(i) : colorScale(d.key));

        svg.selectAll('.legend g')
            .append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(d => margin.right)
            .style('font-size', '12px');
        */


    }
};


// EXEMPLE D'UTILISATION
/*
const données = [
    { category: 'Q1', ventes: 100, profits: 50 },
    { category: 'Q2', ventes: 150, profits: 70 },
    { category: 'Q3', ventes: 120, profits: 60 }
];

StackedBarChart.render({
    selector: '#chart',
    data: données,
    keys: ['ventes', 'profits'],
    width: 800,
    height: 500,
    xKey: 'category',
    colors: d3.schemeSet2
});
*/