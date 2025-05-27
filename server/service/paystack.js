
const initPaystackCheckout = async (s_key, data) => {
    const url = "https://api.paystack.co/transaction/initialize";
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Authorization": `Bearer ${s_key}`,
            "Content-type":"application/json",
        }
    });
    return await res.json();
}

const verifyPaystackCheckout = async (s_key, ref) => {
    const url = `https://api.paystack.co/transaction/verify/${ref}`;
    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${s_key}`,
        }
    });
    return await res.json();
}


module.exports = { initPaystackCheckout, verifyPaystackCheckout }