exports.getDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'};
    const date = new Date();
    return date.toLocaleString('en-US', options); 
    } 
exports.getDay = () => {
        const options = { weekday: 'long'};
        const date = new Date();
       return date.toLocaleString('en-US', options);  
        }

