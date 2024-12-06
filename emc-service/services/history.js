const axios = require('axios');

// investment history of user
const history = async (user) => {
    // fetch from sui network
    let resp = await axios.post("https://explorer-rpc.devnet.sui.io/", {
        "jsonrpc":"2.0",
        "id":"6",
        "method":"suix_queryTransactionBlocks",
        "params":[{"filter":{"ToAddress":"0x20cc2eb9d2559127da7c3eebd70169d5c95ff7eda490498951d32a3c53c50622"},"options":{"showEffects":true,"showInput":true}},null,100,true]
    })
    
    // return response
    return res.status(200).json({
        message: resp
    });
};

async function vault_generator(){
    return "PQD"
}

module.exports = vault_generator