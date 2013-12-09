(function() {
    var event = d3.dispatch("change"),
        elements = []

        function render(parent, properties) {
            var element = d3.select(parent).insert(properties.tag)
                .attr(properties.attr)
                .on(properties.on)
                .style(properties.style)

            if (properties.children) {
                properties.children.forEach(function(child) {
                    render(element[0][0], child)
                })
            }
        }

        // OX-IDE
    d3.oxide = function() {
        function oxide(selection) {
            selection.each(function(d, i) {
                var self = this

                elements.forEach(function(node) {
                    render(self, node)
                })
            })
        }

        oxide.elements = function oxideElements(x) {
            if (!arguments.length) return elements;
            elements = x;
            return oxide;
        }

        d3.oxide.bBox = function(selection) {
            var bBox = selection.getBBox()

                function bBoxMax() {
                    return (bBox.width > bBox.height) ? "width" : "height"
                }

                function bBoxMin() {
                    return (bBox.width < bBox.height) ? "width" : "height"
                }

                function bBoxMaxSize() {
                    return bBox[bBoxMax()]
                }

                function bBoxMinSize() {
                    return bBox[bBoxMin()]
                }

                function bBoxDiagonal() {
                    return Math.sqrt(Math.pow(bBox.width, 2) + Math.pow(bBox.height, 2))
                }


            bBox.max = bBoxMax
            bBox.maxSize = bBoxMaxSize
            bBox.min = bBoxMinSize
            bBox.minSize = bBoxMinSize
            bBox.maxSize = bBoxMaxSize
            bBox.diagonal = bBoxDiagonal

            return bBox
        }

        d3.oxide.imageDim = function(element, callback) {
            var src = element.getAttribute("href"),
                img = new Image()

                img.onload = function() {
                    callback.call(element, [img.width, img.height])
                    delete(img)
                }

            img.src = src
        }

        d3.oxide.imageAutoLoad = function(element) {
            d3.oxide.imageDim(element, function(a) {
                this.setAttribute("width", a[0])
                this.setAttribute("height", a[1])
            })
        }

        return oxide
    }
}())
