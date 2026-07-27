const crypto = require('crypto');

const hashString = "gtKFFx|txnid_1785129499025|6499.00|StopShops Order|Sam|vendor@stopshop.com|||||||||||4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW";
const hash = crypto.createHash("sha512").update(hashString).digest("hex");
console.log("Calculated hash:", hash);
