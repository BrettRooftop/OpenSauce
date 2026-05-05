import fs from 'fs';
const html = `<html><body>
<iframe 
    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FWeatherServic&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=false&hide_cover=true&show_facepile=false&appId" 
    width="500" 
    height="600" 
    style="border:none;overflow:hidden" 
    scrolling="no" 
    frameborder="0" 
    allowTransparency="true" 
    allow="encrypted-media"></iframe>
</body></html>`;
fs.writeFileSync('test-iframe.html', html);
