import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../utils/api';

function AdminLoginPage() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    const res = await adminLogin(usuario, senha);
    if (res?.token) {
      localStorage.setItem('sportvault_admin_token', res.token);
      navigate('/admin/painel');
      return;
    }
    setErro('Login inválido.');
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft">
      <h1 className="mb-4 text-2xl font-bold">Admin Login</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-lg border border-zinc-300 p-3" placeholder="Usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        <input className="w-full rounded-lg border border-zinc-300 p-3" placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <button className="w-full rounded-full bg-black py-3 text-sm font-semibold text-white" type="submit">
          Entrar
        </button>
      </form>
      {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}
      <p className="mt-3 text-xs text-zinc-500">Padrão local: admin / admin123</p>
    </section>
  );
}

export default AdminLoginPage;
