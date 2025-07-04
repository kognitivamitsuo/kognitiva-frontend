
// mainPage.js – Integração Real com /proxy/token
document.addEventListener("DOMContentLoaded", async () => {
    const userAgent = navigator.userAgent;
    const ip = "127.0.0.1"; // pode ser obtido de backend se necessário
    const payload = {
        user_id: "demo_user",
        ip_origem: ip,
        user_agent: userAgent
    };

    try {
        const res = await fetch("https://sync.kognitiva.app/proxy/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.tokenConfirmado && data.token_sessao) {
            localStorage.setItem("token_sessao", data.token_sessao);
            console.log("Token obtido com sucesso:", data.token_sessao);
        } else {
            console.error("Erro ao obter token:", data);
        }
    } catch (err) {
        console.error("Falha na requisição /proxy/token:", err);
    }
});

