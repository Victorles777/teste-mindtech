import { useState } from "react";
import "./SubscribeForm.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3333";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus({ type: "err", msg: "Digite um e-mail válido" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/mindtechiot/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      let body = {};
      try {
        body = await res.json();
      } catch  {
        ;
      }
      if (res.status === 201) {
        setStatus({
          type: "ok",
          msg: body.message || "Inscrição realizada com sucesso!",
        });

        setShowSuccessModal(true); 
        setEmail("");
        setLoading(false);
        return;
      }
      if (res.status === 409) {
        setStatus({
          type: "err",
          msg: "Email já cadastrado",
        });
        setLoading(false);
        return;
      }
      setStatus({
        type: "err",
        msg: "Erro ao inscrever. Tente novamente.",
      });
    } catch {
      setStatus({
        type: "err",
        msg: "Erro de conexão. Verifique o backend.",
      });
    }

    setLoading(false);
  };
  const handleCancel = async () => {
    if (!email) {
      setStatus({ type: "err", msg: "Digite um e-mail para cancelar" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/mindtechiot/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json();

      if (res.ok) {
        setStatus({ type: "ok", msg: "Inscrição cancelada com sucesso" });
        setEmail("");

      } else {
        setStatus({ type: "err", msg: body.message || "Erro ao cancelar" });
      }
    } catch {
      setStatus({ type: "err", msg: "Erro ao conectar ao servidor" });
    }
    setLoading(false);
  };
  return (
    <div className="subscribe-wrapper">

      {showSuccessModal && (
        <div className="overlay" onClick={() => setShowSuccessModal(false)}>
          <img src="/confirm.png" className="modal-confirm-image" alt="Confirmado" />
        </div>
      )}

      <div className="subscribe-card glass">
        <h2 className="subscribe-title">Inscreva-se</h2>

        <div className="subscribe-sub">
          <p>Receba conteúdos exclusivos, novidades e benefícios especiais.</p>
          <p>Aprenda como implementar e otimizar soluções de IoT para sua empresa.</p>
          <p>Fique por dentro das últimas novidades e avanços no mundo do IoT.</p>
        </div>

        <form onSubmit={handleSubmit} className="subscribe-form">
          <label className="subscribe-label">Seu melhor e-mail:</label>
          <input
            type="email"
            className="subscribe-input neon-border"
            placeholder="seunome@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            className="subscribe-button glow-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar inscrição"}
          </button>
          <button
            className="subscribe-button cancel-button neon-border"
            type="button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar inscrição
          </button>
        </form>
        {status?.type === "err" && (
          <div className="error-message">{status.msg}</div>
        )}

        {status?.type === "ok" && !showSuccessModal && (
          <div className="success-message">{status.msg}</div>
        )}
      </div>
      <div className="image-side">
        <img src="/mindtech.png" alt="Tecnologia" />
      </div>
    </div>
  );
}
