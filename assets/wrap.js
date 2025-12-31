    function wrap(text, width) {
        let words = text.split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        let lineHeight = 1.1;
        let y = 0;
        let dy = 0;
        let tspan = null;

        while (word = words.pop()) {
            line.push(word);
            let lineText = line.join(" ");
            
            if (lineText.length * 7 > width) {
                line.pop();
                if (line.length > 0) {
                    if (tspan) tspan.text(line.join(" "));
                    line = [word];
                    y += lineHeight;
                }
            }
        }
        
        if (line.length > 0 && tspan) {
            tspan.text(line.join(" "));
        }

        return text;
    }
