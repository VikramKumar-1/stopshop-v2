fetch('http://localhost:3000/api/products/recommendations?productId=1&category=Bronze&material=Bronze&limit=10').then(r=>r.json()).then(console.log);
